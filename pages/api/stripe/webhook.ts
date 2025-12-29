import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  api: {
    bodyParser: false,
  },
};

const getRawBody = (req: NextApiRequest): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Błąd weryfikacji webhook:", err);
    return res.status(400).json({ error: "Błąd weryfikacji webhook" });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case "payment_intent.succeeded":
      console.log("Płatność zakończona sukcesem:", event.data.object.id);
      break;
    default:
      console.log("Nieobsługiwany typ zdarzenia:", event.type);
  }

  res.status(200).json({ received: true });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const facebook_id = session.metadata?.facebook_id;

    if (!facebook_id) {
      console.error("Brak Facebook ID w metadata sesji");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .or(
        `facebook_id.eq.${facebook_id},app_scoped_facebook_id.eq.${facebook_id}`
      )
      .maybeSingle();

    if (user) {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          is_premium: true,
          premium_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("facebook_id", user.facebook_id);

      if (updateError) {
        console.error("Błąd podczas aktywacji premium:", updateError);
        return;
      }

      console.log(
        `Subskrypcja premium aktywowana dla użytkownika ${
          user.facebook_id
        } do ${expiresAt.toISOString()}`
      );
    }
  } catch (error) {
    console.error("Błąd podczas przetwarzania webhook:", error);
  }
}
