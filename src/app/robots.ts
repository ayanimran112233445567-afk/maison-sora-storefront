import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/products";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart"],
      },
      // Explicit AI Search Engine / GEO / AEO crawlers welcome for product catalog indexing
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "Google-Extended",
          "ClaudeBot",
          "PerplexityBot",
        ],
        allow: ["/", "/shop", "/product/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
