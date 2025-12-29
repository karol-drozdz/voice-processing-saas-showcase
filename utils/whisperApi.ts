import axios from "axios";
import FormData from "form-data";

export async function transcribeAudio(
  audioUrl: string
): Promise<{ text: string; language: string; country?: string }> {
  try {
    console.log("Downloading audio...");
    const audioBuffer = await downloadAudio(audioUrl);
    console.log("Audio downloaded. Sending to Fireworks Whisper V3 API...");

    const transcription = await sendToFireworksWhisperV3(audioBuffer);

    if (!transcription.language || transcription.language === "unknown") {
      transcription.language = detectLanguage(transcription.text);
    }

    const country = getCountryFromLanguage(transcription.language);

    return { ...transcription, country };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio.");
  }
}

async function downloadAudio(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

async function sendToFireworksWhisperV3(
  audioBuffer: Buffer
): Promise<{ text: string; language: string }> {
  const apiKey = process.env.FIREWORKS_API_KEY;
  if (!apiKey) throw new Error("Missing Fireworks API key.");

  const url =
    "https://audio-prod.us-virginia-1.direct.fireworks.ai/v1/audio/transcriptions";

  const formData = new FormData();
  formData.append("file", audioBuffer, {
    filename: `audio-${Date.now()}.mp3`,
    contentType: "audio/mp3",
  });
  formData.append("model", "whisper-v3");
  formData.append("temperature", "0");

  const response = await axios.post(url, formData, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...formData.getHeaders(),
    },
  });

  if (response.status !== 200 || !response.data.text) {
    throw new Error(
      `Failed to transcribe: ${response.status} - ${response.statusText}`
    );
  }

  return {
    text: response.data.text,
    language: response.data.language || "unknown",
  };
}

function detectLanguage(text: string): string {
  const polishChars = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
  return polishChars.test(text) ? "pl" : "en";
}

function getCountryFromLanguage(language: string): string {
  const languageToCountry: Record<string, string> = {
    pl: "Polish",
    en: "English",
  };

  return languageToCountry[language] || "Unknown";
}
