export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/premium/", "/context/", "/success/"],
    },
    sitemap: "https://voiceclip.eu/sitemap.xml",
  };
}
