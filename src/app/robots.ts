// src/app/robots.txt
export default function robots(): Response {
  return new Response(
    `# *
# For a full table of contents of this application
# please see: https://matthew-journal.vercel.app

User-agent: *
Allow: /

Sitemap: https://matthew-journal.vercel.app/sitemap.xml
`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
