import axios from "axios";

export async function sendMessage(recipientId: string, message: string) {
  const url = `https://graph.facebook.com/v16.0/me/messages?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`;
  const body = {
    recipient: { id: recipientId },
    message: { text: message },
  };
  await axios.post(url, body);
}

export async function sendPremiumButton(
  recipientId: string,
  type: "warning" | "limit" | "always"
) {
  const url = `https://graph.facebook.com/v16.0/me/messages?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`;

  let text = "";
  if (type === "warning") {
    text =
      "Zbliżasz się do limitu bezpłatnych wiadomości! Przejdź na premium aby cieszyć się nieograniczonymi podsumowaniami.";
  } else if (type === "limit") {
    text =
      "Osiągnięto limit 10 wiadomości na ten miesiąc. Przejdź na konto premium aby kontynuować!";
  } else if (type === "always") {
    text = "Chcesz nieograniczone podsumowania? Kliknij i uzyskaj premium!";
  }

  const body = {
    recipient: { id: recipientId },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: text,
          buttons: [
            {
              type: "web_url",
              url: `https://voiceclip.eu/premium?psid=${recipientId}`,
              title: "Uzyskaj Premium",
            },
          ],
        },
      },
    },
  };

  await axios.post(url, body);
}
