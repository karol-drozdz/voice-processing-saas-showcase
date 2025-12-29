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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { facebook_id, customer_email } = req.body;
    if (!facebook_id) {
      return res.status(400).json({ error: "facebook_id required" });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email")
      .eq("facebook_id", facebook_id)
      .maybeSingle();

    if (userError) {
      console.error("Error Supabase:", userError);
      return res.status(500).json({ error: "Database error" });
    }

    if (!user) {
      console.log("User not found for facebook_id:", facebook_id);
      return res.status(404).json({ error: "User not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      customer_email: customer_email || user.email,
      line_items: [
        {
          price_data: {
            currency: "pln",
            unit_amount: 999,
            product_data: {
              name: "Voice Clip Premium – 30 dni",
              description: "Nieograniczone wiadomości przez 30 dni",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "https://voiceclip.eu/",
      metadata: {
        facebook_id,
        subscription: "premium-30d",
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (e) {
    console.error("stripe session error:", e);
    res.status(500).json({ error: "stripe error" });
  }
}
