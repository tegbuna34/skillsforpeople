import type { MetadataRoute } from "next";
import { getPublishedSkills } from "@/lib/skills";
import { getPublishedTools } from "@/lib/tools";
import { getAllContributors } from "@/lib/contributors";

const BASE_URL = "https://www.skillsforpeople.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [skills, tools, contributors] = await Promise.all([
    getPublishedSkills(),
    getPublishedTools(),
    getAllContributors(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/work-with-us`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/skills`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tools`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contribute`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const skillRoutes: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `${BASE_URL}/skills/${s.slug}`,
    lastModified: s.datePublished ?? undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Coming-soon tools aren't linked from anywhere yet — leave them out of
  // the sitemap until they actually launch, so Google doesn't index a page
  // whose "Try it live" link points at a placeholder.
  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => !t.comingSoon)
    .map((t) => ({
      url: `${BASE_URL}/tools/${t.slug}`,
      lastModified: t.datePublished ?? undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const contributorRoutes: MetadataRoute.Sitemap = contributors.map((c) => ({
    url: `${BASE_URL}/contributors/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...skillRoutes, ...toolRoutes, ...contributorRoutes];
}
