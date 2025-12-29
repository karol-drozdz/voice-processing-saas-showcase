import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import { transcribeAudio } from "../../utils/whisperApi";
import { summarizeText } from "../../utils/openAi";
import { sendMessage, sendPremiumButton } from "../../utils/facebookApi";
import dotenv from "dotenv";
import { parseBuffer } from "music-metadata";

dotenv.config();

const MAX_AUDIO_DURATION = 240;
const MESSAGE_LIMIT = 10;
const WORD_THRESHOLD = 40;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { "hub.verify_token": token, "hub.challenge": challenge } = req.query;
    if (token === process.env.FB_VERIFY_TOKEN)
      return res.status(200).send(challenge);
    return res.status(403).send("Verification failed");
  }

  if (req.method === "POST") {
    const body = req.body;
    if (body.object !== "page") return res.status(404).send("Not Found");

    try {
      for (const entry of body.entry) {
        for (const event of entry.messaging) {
          const senderId = event.sender.id;
          if (!senderId || senderId === process.env.PAGE_ID) continue;

          const now = new Date();
          const firstDayOfMonth = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            1
          );

          const { data: userExists } = await supabase
            .from("users")
            .select("facebook_id")
            .eq("facebook_id", senderId)
            .single();

          if (!userExists) {
            await supabase.from("users").insert({
              facebook_id: senderId,
              messages_sent: 0,
              is_premium: false,
              last_reset: now.toISOString(),
            });
          }

          const { data: user } = await supabase
            .from("users")
            .select("messages_sent,is_premium,last_reset")
            .eq("facebook_id", senderId)
            .single();

          let messagesSent = user?.messages_sent ?? 0;
          const isPremium = user?.is_premium ?? false;

          if (user && new Date(user.last_reset) < firstDayOfMonth) {
            messagesSent = 0;
            await supabase
              .from("users")
              .update({ messages_sent: 0, last_reset: now.toISOString() })
              .eq("facebook_id", senderId);
          }

          if (!isPremium && messagesSent >= MESSAGE_LIMIT) {
            await sendPremiumButton(senderId, "limit");
            continue;
          }

          if (event.message?.attachments?.[0]?.type === "audio") {
            const audioUrl = event.message.attachments[0].payload.url;
            const audioBuffer = await downloadAudio(audioUrl);
            const metadata = await parseBuffer(audioBuffer);
            if ((metadata.format?.duration ?? 0) > MAX_AUDIO_DURATION) {
              await sendMessage(
                senderId,
                "Plik audio przekracza limit 4 minut. Skróć nagranie i spróbuj ponownie."
              );
              continue;
            }
            const { text: transcription, language } = await transcribeAudio(
              audioUrl
            );
            const wordCount = transcription
              .trim()
              .split(/\s+/)
              .filter(Boolean).length;
            let summary: string;
            if (wordCount < WORD_THRESHOLD) {
              summary = transcription;
            } else {
              summary = await summarizeText(transcription, language);
            }

            messagesSent++;
            await supabase
              .from("users")
              .update({ messages_sent: messagesSent })
              .eq("facebook_id", senderId);

            if (!isPremium) {
              await sendMessage(senderId, summary);

              if (messagesSent > MESSAGE_LIMIT) {
                await sendPremiumButton(senderId, "limit");
              }
            } else {
              await sendMessage(senderId, summary);
            }
          }
        }
      }
      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("Critical error during processing:", error);
      return res.status(500).send("Critical error occurred.");
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function downloadAudio(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
