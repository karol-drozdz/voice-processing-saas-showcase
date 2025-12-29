"use client";

import { useState, useEffect } from "react";
import { useFacebook } from "../context/FacebookContext";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PremiumPage() {
  const { isFBReady, login } = useFacebook();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [messengerPsid, setMessengerPsid] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const psidFromUrl = urlParams.get("psid");
    if (psidFromUrl) {
      setMessengerPsid(psidFromUrl);
    } else {
      setError(
        "Brak identyfikatora konta Messenger. Spróbuj ponownie wejść w przycisk na messengerze."
      );
    }
  }, []);

  const beginFlow = async (id: string, name: string, email?: string | null) => {
    setSuccess("Łączenie kont...");

    const resProfile = await fetch("/api/auth/facebook-connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facebook_id: id,
        name,
        email,
        messenger_psid: messengerPsid,
      }),
    });

    if (!resProfile.ok) {
      const { error } = await resProfile.json();
      throw new Error(error ?? "Błąd łączenia kont");
    }

    setSuccess("Konta połączone! Przekierowuję do płatności...");

    const checkout = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facebook_id: messengerPsid || id,
        customer_email: email,
      }),
    }).then((r) => r.json());

    if (!checkout.sessionId) {
      throw new Error("Brak sessionId z backendu");
    }

    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: checkout.sessionId });
  };

  const handleFacebookLogin = () => {
    if (!messengerPsid) {
      setError("Brak identyfikatora konta Messenger.");
      return;
    }

    if (!isFBReady) {
      setError("Facebook SDK nie jest gotowe, spróbuj za chwilę");
      return;
    }

    setError(null);
    setSuccess(null);
    setProcessing(true);

    login(
      async ({ id, name, email }) => {
        try {
          await beginFlow(id, name, email);
        } catch (e: any) {
          setError(e.message ?? "Wystąpił błąd");
          setProcessing(false);
          setSuccess(null);
        }
      },
      (err) => {
        setError(err);
        setProcessing(false);
        setSuccess(null);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-200 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Voice Clip Premium
          </h1>
          <p className="text-gray-600">
            Nieograniczone podsumowania wiadomości głosowych przez 30 dni
          </p>
        </div>

        {messengerPsid && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2 justify-self-center">
              <span className="font-medium text-blue-900">
                Łączenie z kontem Messenger
              </span>
            </div>
            <p className="text-sm text-blue-700 text-center">
              Uwaga! Wybierz "Otwórz w zewnętrznej przeglądarce" z menu w rogu
              [...]
            </p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">9,99 zł</div>
            <div className="text-sm text-gray-600">za 30 dni premium</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Co otrzymasz:</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                Nieograniczone wiadomości audio
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Szybkie podsumowania AI</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Wsparcie wielojęzyczne</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleFacebookLogin}
          disabled={!isFBReady || processing || !messengerPsid}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Przetwarzam...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Zaloguj się przez Facebook
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Bezpieczna płatność przez Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
