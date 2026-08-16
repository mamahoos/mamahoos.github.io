import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resume } from "../data/resume";

function quote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function text(value: string): string {
  return `#text(${quote(value)})`;
}

function link(href: string, label: string): string {
  return `#link(${quote(href)})[${text(label)}]`;
}

export function toTypst(): string {
  const contact = [
    link(`mailto:${resume.email}`, resume.email),
    link(`tel:${resume.phone}`, resume.phoneDisplay),
    link(resume.githubHref, resume.githubDisplay),
    link(resume.linkedinHref, resume.linkedinDisplay),
    link(resume.portfolioHref, resume.portfolioDisplay),
  ].join(" | ");

  const skills = resume.skills
    .map(
      (group) =>
        `#block(spacing: 2pt)[#text(weight: "bold", ${quote(`${group.label}:`)}) ${text(group.items.join(", "))}]`,
    )
    .join("\n");

  const jobs = resume.experience
    .map((job) => {
      const bullets = job.bullets
        .map((bullet) => `[${text(bullet)}]`)
        .join(",\n    ");
      return `#block(above: 7pt, below: 1pt)[
  #text(weight: "bold", ${quote(`${job.title},`)}) ${text(job.company)} #h(1fr) ${text(`${job.start} – ${job.end}`)}
  #v(2pt)
  #text(fill: rgb("#505050"), ${quote(job.domain)})
  #v(2pt)
  #list(
    ${bullets},
  )
  #v(1pt)
  #text(9.5pt, style: "italic", fill: rgb("#505050"))[#text(weight: "bold", style: "italic", ${quote("Technologies:")}) ${text(job.technologies.join(", "))}]
]`;
    })
    .join("\n");

  const projects = resume.projects
    .map(
      (project) => `#block(above: 6pt, below: 0pt)[
  #text(weight: "bold", ${quote(project.name)}) — ${link(project.href, project.displayUrl)}
  #block(spacing: 1pt)[${text(project.summary)}]
]`,
    )
    .join("\n");

  const education = resume.education
    .map(
      (item) => `[#text(weight: "bold", ${quote(item.degree)}) #h(1fr) ${text(item.end)}
#v(2pt)
${text(item.school)}]`,
    )
    .join("\n");

  return `#set page(paper: "us-letter", margin: 0.75in)
#set text(font: ("Carlito", "Liberation Sans"), size: 10.5pt, fill: black, lang: "en")
#set par(leading: 2.5pt, spacing: 0.5em)
#show link: set text(fill: black)

#let section(name) = {
  v(9pt, weak: true)
  text(11.5pt, weight: "bold", name)
  v(1pt)
  line(length: 100%, stroke: 0.75pt + black)
  v(4pt)
}

#align(center)[
  #text(16pt, weight: "bold", ${quote(resume.name)})
  #v(2pt)
  ${text(resume.role)}
  #v(4pt)
  ${contact}
]

#section[Skills]
${skills}

#section[Experience]
${jobs}

#section[Projects]
${text(`${resume.projectsNoteLead} ${resume.githubDisplay}`)}
${projects}

#section[Education]
${education}
`;
}

export function compileResumePdf(outPath: string): Buffer {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-resume-"));
  const typPath = join(dir, "resume.typ");
  writeFileSync(typPath, toTypst());

  const compiled = spawnSync("typst", ["compile", typPath, outPath], {
    encoding: "utf8",
  });
  if (compiled.status !== 0) {
    throw new Error(compiled.stderr || compiled.stdout || "typst compile failed");
  }

  const info = spawnSync("pdfinfo", [outPath], { encoding: "utf8" });
  if (info.status !== 0) {
    throw new Error(info.stderr || "pdfinfo failed");
  }
  const pages = info.stdout.match(/Pages:\s+(\d+)/)?.[1];
  if (pages !== "1") {
    throw new Error(`resume.pdf must be 1 page, got ${pages ?? "unknown"}`);
  }

  return readFileSync(outPath);
}
