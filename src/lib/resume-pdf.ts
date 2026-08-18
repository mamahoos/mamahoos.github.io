import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resume } from "../data/resume";

const INK = "#141414";
const MUTED = "#4a4a4a";
const FAINT = "#6d6d6d";
/** Cool hairline. Slightly bluer than a neutral gray so the page temperature matches NAVY. */
const RULE = "#b8c0cc";
/**
 * Ink navy for the name and section headings only. Body, bullets, skills, and
 * links stay INK so the page still reads as a black document from a metre away.
 */
const NAVY = "#1e3a5f";

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
 * Space above an entry. The first entry of a section contributes nothing,
 * because the gap under the heading rule belongs to `section()`. Otherwise a
 * heading ends up closer to the section it terminates than the one it opens.
 */
function entryGap(index: number, gap: string): string {
  return index === 0 ? "0pt" : gap;
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
  #text(19pt, weight: "bold", tracking: 0.2pt, fill: rgb("${NAVY}"), ${quote(resume.name)})
  #v(8pt)
  #text(11pt, fill: rgb("${MUTED}"), tracking: 0.3pt, ${quote(resume.role)})
  #v(8pt)
  #text(9.5pt, fill: rgb("${MUTED}"))[${contact}]
]
#v(6pt)`;
}

function skills(): string {
  return resume.skills
    .map(
      (group, index) => `#block(above: ${entryGap(index, "3.5pt")}, below: 0pt)[
  #set par(hanging-indent: ${SKILL_HANGING_INDENT})
  #text(weight: "bold", ${quote(`${group.label}:`)}) ${text(group.items.join(", "))}
]`,
    )
    .join("\n");
}

function experience(): string {
  return resume.experience
    .map((job, index) => {
      const bullets = job.bullets.length
        ? `#list(
      ${job.bullets.map((bullet) => `[${text(bullet)}]`).join(",\n      ")},
  )
  #v(5pt)`
        : "";
      return `#block(above: ${entryGap(index, "9pt")}, below: 0pt, breakable: false)[
  #set par(spacing: 0pt)
  #text(weight: "bold", ${quote(job.title)}) #h(1fr) #text(9pt, fill: rgb("${MUTED}"), ${quote(`${job.start} – ${job.end}`)})
  #v(3.5pt)
  #text(fill: rgb("${MUTED}"), ${quote(job.company)}) #text(9pt, style: "italic", fill: rgb("${FAINT}"), ${quote(`— ${job.domain}`)})
  #v(5pt)
  ${bullets}
  #text(8.7pt, fill: rgb("${FAINT}"))[#text(style: "italic", ${quote("Technologies: ")})${text(job.technologies.join(", "))}]
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
  #text(9.4pt, ${quote(project.summary)})
]`,
    )
    .join("\n");
}

function education(): string {
  return resume.education
    .map(
      (item, index) => `#block(above: ${entryGap(index, "7pt")}, below: 0pt, breakable: false)[
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
#set page(
  paper: "us-letter",
  margin: (x: 0.7in, top: 0.55in, bottom: 0.95in),
  // Left-aligned footer, not the title: the lede crowded the name.
  footer: [
    #set align(left)
    #set par(leading: 0.62em, justify: false)
    #text(8.5pt, fill: rgb("${MUTED}"), ${quote(resume.summary)})
  ],
)
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

// "hyphenate: false" still lets a line break at an existing hyphen, which
// renders "Cloud-Init" as "Cloud-" / "Init" and makes pdftotext extract it as
// "CloudInit". A box constrains layout only, so extracted text is unchanged.
#show regex("[[:alnum:]]+(-[[:alnum:]]+)+"): it => box(it)

#let sep = text(fill: rgb("${RULE}"))[ | ]

// Tracking must stay low: past roughly 1pt at this size, poppler reads the
// glyph advance as a word gap and extracts "EDUCATION" as "E D U C AT I O N",
// which hides the section from an ATS.
#let section(name) = {
  v(11pt, weak: true)
  text(9pt, weight: "bold", tracking: 0.8pt, fill: rgb("${NAVY}"), upper(name))
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
#block(above: 0pt, below: 0pt)[#text(9pt, style: "italic", fill: rgb("${FAINT}"))[${text(`${resume.projectsNoteLead} `)}${link(resume.githubHref, resume.githubDisplay)}]]
${projects()}

#section[Education]
${education()}
`;
}

/**
 * Runs a build tool, distinguishing a tool that failed from one that is not
 * installed. On ENOENT `spawnSync` reports the cause in `error` and leaves
 * `status`, `stdout`, and `stderr` null.
 */
function run(command: string, args: string[]): string {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `${command} failed`);
  }
  return result.stdout;
}

export function compileResumePdf(outPath: string): Buffer {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-resume-"));
  const typPath = join(dir, "resume.typ");
  writeFileSync(typPath, toTypst());

  run("typst", ["compile", typPath, outPath]);

  const pages = run("pdfinfo", [outPath]).match(/Pages:\s+(\d+)/)?.[1];
  if (pages !== "1") {
    throw new Error(`resume.pdf must be 1 page, got ${pages ?? "unknown"}`);
  }

  // Kept on failure so the generated Typst is available for debugging.
  rmSync(dir, { recursive: true, force: true });

  return readFileSync(outPath);
}
