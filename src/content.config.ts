import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    repo: z.string().url(),
    relatedRepos: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .default([]),
    stack: z.array(z.string()),
    featured: z.boolean().default(true),
    order: z.number(),
  }),
});

export const collections = { projects };
