// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/invite/"],
    },
    sitemap: "https://matthew-journal.vercel.app/sitemap.xml",
  };
}
