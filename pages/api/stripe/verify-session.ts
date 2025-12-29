import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const sessionId = req.query.session_id as string | undefined;
  if (!sessionId) {
    return res.status(400).json({ error: "session_id is required" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    const isPaid =
      session.payment_status === "paid" ||
      (session.payment_intent as Stripe.PaymentIntent)?.status === "succeeded";

    return res.status(200).json({
      status: isPaid ? "complete" : "pending",
    });
  } catch (err: any) {
    console.error("Failed to verify Stripe session:", err);
    return res.status(500).json({ status: "error", error: err.message });
  }
}
