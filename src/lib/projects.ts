import { getCollection } from "astro:content";

export async function getFeaturedProjects() {
  const projects = await getCollection("projects");
  return projects
    .filter((project) => project.data.featured)
    .sort((a, b) => a.data.order - b.data.order);
}
