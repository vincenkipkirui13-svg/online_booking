import type { MetadataRoute } from "next";

const siteUrl = "https://www.prestigeshuttle.online";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/booking`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
