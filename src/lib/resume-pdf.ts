import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resume } from "../data/resume";

const INK = "#141414";
const MUTED = "#4a4a4a";
const FAINT = "#6d6d6d";
const RULE = "#c9c9c9";

/**
 * Continuation lines of a wrapped skill row hang under the items, not the
 * label. The label is kept inline rather than in a fixed column because a
 * column gap makes `pdftotext` emit every label before every value list,
 * which breaks category/skill association for ATS parsers.
 */
const SKILL_HANGING_INDENT = "1.1em";

function quote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function text(value: string): string {
  return `#text(${quote(value)})`;
}

/**
 * Body copy where hyphenated terms must survive line breaks intact, so
 * "Cloud-Init" never renders as "Cloud-" / "Init". A box only constrains
 * layout, so the extracted text stays byte-identical for ATS parsers.
 */
function body(value: string): string {
  return value
    .split(" ")
    .map((word) => (word.includes("-") ? `#box[${text(word)}]` : text(word)))
    .join(" ");
}

function link(href: string, label: string): string {
  return `#link(${quote(href)})[${text(label)}]`;
}

function header(): string {
  const contact = [
    link(`mailto:${resume.email}`, resume.email),
    link(`tel:${resume.phone}`, resume.phoneDisplay),
    link(resume.githubHref, resume.githubDisplay),
    link(resume.linkedinHref, resume.linkedinDisplay),
    link(resume.portfolioHref, resume.portfolioDisplay),
  ].join(` #sep `);

  return `#align(center)[
  #set par(spacing: 0pt)
  #text(19pt, weight: "bold", tracking: 0.2pt, ${quote(resume.name)})
  #v(8pt)
  #text(11pt, fill: rgb("${MUTED}"), tracking: 0.3pt, ${quote(resume.role)})
  #v(10pt)
  #text(9.5pt, fill: rgb("${MUTED}"))[${contact}]
]
#v(6pt)`;
}

function skills(): string {
  return resume.skills
    .map(
      (group) => `#block(spacing: 3.5pt)[
  #set par(hanging-indent: ${SKILL_HANGING_INDENT})
  #text(weight: "bold", ${quote(`${group.label}:`)}) ${body(group.items.join(", "))}
]`,
    )
    .join("\n");
}

function experience(): string {
  return resume.experience
    .map((job) => {
      const bullets = job.bullets
        .map((bullet) => `[${body(bullet)}]`)
        .join(",\n      ");
      return `#block(above: 9pt, below: 0pt, breakable: false)[
  #set par(spacing: 0pt)
  #text(weight: "bold", ${quote(job.title)}) #h(1fr) #text(9pt, fill: rgb("${MUTED}"), ${quote(`${job.start} – ${job.end}`)})
  #v(3.5pt)
  #text(fill: rgb("${MUTED}"), ${quote(job.company)}) #text(9pt, style: "italic", fill: rgb("${FAINT}"), ${quote(`— ${job.domain}`)})
  #v(5pt)
  #list(
      ${bullets},
  )
  #v(5pt)
  #text(8.7pt, fill: rgb("${FAINT}"))[#text(style: "italic", ${quote("Technologies: ")})${body(job.technologies.join(", "))}]
]`;
    })
    .join("\n");
}

function projects(): string {
  return resume.projects
    .map(
      (project) => `#block(above: 7pt, below: 0pt, breakable: false)[
  #set par(spacing: 0pt)
  #text(weight: "bold", ${quote(project.name)}) #text(9pt, fill: rgb("${FAINT}"))[— ${link(project.href, project.displayUrl)}]
  #v(2.5pt)
  #text(9.4pt)[${body(project.summary)}]
]`,
    )
    .join("\n");
}

function education(): string {
  return resume.education
    .map(
      (item) => `#block(above: 0pt, below: 0pt, breakable: false)[
  #set par(spacing: 0pt)
  #text(weight: "bold", ${quote(item.degree)}) #h(1fr) #text(9pt, fill: rgb("${MUTED}"), ${quote(item.end)})
  #v(3pt)
  #text(fill: rgb("${MUTED}"), ${quote(item.school)})
]`,
    )
    .join("\n");
}

export function toTypst(): string {
  return `#set document(
  title: ${quote(`${resume.name} — ${resume.role}`)},
  author: ${quote(resume.name)},
  keywords: (${resume.skills.flatMap((group) => group.items).map(quote).join(", ")}),
)
#set page(paper: "us-letter", margin: (x: 0.7in, y: 0.55in))
#set text(
  font: ("Lato", "Carlito", "Liberation Sans"),
  size: 10pt,
  fill: rgb("${INK}"),
  lang: "en",
  hyphenate: false,
)
#set par(leading: 0.64em, spacing: 0.64em, justify: false)
#set list(marker: text(fill: rgb("${FAINT}"))[•], indent: 0pt, body-indent: 0.6em, spacing: 3.5pt)
#show link: set text(fill: rgb("${INK}"))

#let sep = text(fill: rgb("${RULE}"))[ | ]

#let section(name) = {
  v(10pt, weak: true)
  text(9pt, weight: "bold", tracking: 1.2pt, upper(name))
  v(3pt)
  line(length: 100%, stroke: 0.6pt + rgb("${RULE}"))
  v(6pt)
}

${header()}

#section[Skills]
${skills()}

#section[Experience]
${experience()}

#section[Projects]
#text(9pt, style: "italic", fill: rgb("${FAINT}"))[${text(`${resume.projectsNoteLead} `)}${link(resume.githubHref, resume.githubDisplay)}]
${projects()}

#section[Education]
${education()}
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
