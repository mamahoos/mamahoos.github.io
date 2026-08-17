import { site } from "./site";

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export type SkillGroup = {
  label: string;
  items: string[];
};

export type Experience = {
  title: string;
  company: string;
  domain: string;
  start: string;
  end: string;
  bullets: string[];
  technologies: string[];
};

export type ResumeProject = {
  name: string;
  summary: string;
  href: string;
  displayUrl: string;
};

export type Education = {
  degree: string;
  school: string;
  end: string;
};

/**
 * Master resume. The e-estekhdam PDF is an artifact, not source of truth.
 * Birth date, gender, marital status, military status, salary, city, and
 * photo are omitted on purpose for the English ATS/public page.
 */
export const resume = {
  name: site.name,
  role: site.role,
  tagline: site.tagline,
  /**
   * Short positioning for /resume and the PDF. Not years of employment:
   * years of designing and building systems. Freelance and independent
   * roles stay folded into Experience until they are ready to split.
   */
  summary:
    "Five years of learning to design and build systems from scratch — software, Linux, and infrastructure — across independent work, public projects, and professional roles.",
  /**
   * HTML /resume only. A path so a human sees backend roots without a
   * second Experience block. Do not render this in the PDF: arrows and a
   * year range look like employment to an ATS. The HTML wraps after
   * freelance — the turn from software into systems — so the line does
   * not break mid-step.
   */
  practicePath: [
    "2021 programming",
    "backend / asyncio",
    "freelance",
    "Linux",
    "infrastructure",
    "CI/CD",
    "platform",
  ],
  practicePathBreakAfter: 3,
  email: site.email,
  phone: "+989906502794",
  phoneDisplay: "+98 990 650 2794",
  githubHref: site.github,
  githubDisplay: displayUrl(site.github),
  linkedinHref: site.linkedin,
  linkedinDisplay: displayUrl(site.linkedin),
  portfolioHref: "https://portfolio.mamahoos.ir",
  portfolioDisplay: "portfolio.mamahoos.ir",
  skills: [
    {
      label: "Languages",
      items: ["Python", "Bash", "Go"],
    },
    {
      label: "Infrastructure",
      items: [
        "Linux",
        "Docker",
        "Kubernetes",
        "Docker Swarm",
        "Nginx",
        "Traefik",
      ],
    },
    {
      label: "Network",
      items: ["Network+", "MikroTik", "VPN architectures"],
    },
    {
      label: "CI/CD & GitOps",
      items: ["Git", "GitLab CI", "GitHub Actions", "Jenkins", "Argo CD", "Nexus"],
    },
    {
      label: "Observability",
      items: ["Prometheus", "Grafana", "Loki", "Graylog", "k6"],
    },
    {
      label: "Storage & data",
      items: ["PostgreSQL", "Redis", "MinIO", "kafka", "Elasticsearch", "MongoDB"],
    },
    {
      label: "IaC & provisioning",
      items: ["Terraform", "Ansible", "Cloud-Init"],
    },
    {
      label: "Virtualization",
      items: ["VMware vSphere", "ESXi", "Veeam"],
    },
  ] satisfies SkillGroup[],
  experience: [
    {
      title: "DevOps / Platform Engineer",
      company: "Amard",
      domain: "analytics software",
      start: "Jul 2026",
      end: "Present",
      bullets: [
        "Operate Linux, container, and CI/CD platform infrastructure for production software delivery in an analytics company",
        "Expand GitOps, object storage, and log pipelines with Argo CD, MinIO, and Loki alongside Prometheus and Grafana",
      ],
      technologies: [
        "Linux",
        "Docker",
        "Kubernetes",
        "Argo CD",
        "MinIO",
        "Loki",
        "Prometheus",
        "Grafana",
        "Graylog",
        "Network+",
      ],
    },
    {
      title: "Backend Developer / Junior DevOps",
      company: "Daraei",
      domain: "fintech asset platform",
      start: "Oct 2025",
      end: "Apr 2026",
      bullets: [
        "Contributed to backend system design, microservices architecture, and PostgreSQL modeling for a fintech asset platform",
        "Designed CI/CD pipelines for backend, frontend, and Flutter services, including automated APK artifacts on every push",
        "Ran self-hosted GitLab, GitLab Runner, and Jenkins so build and release did not depend on external SaaS",
        "Built internal package mirrors via Nexus and Nginx and organizational VPNs so software delivery continued during nationwide internet disruption",
        "Deployed Docker, Docker Swarm on VMware vSphere; automated Linux provisioning with Cloud-Init and ran k6 load tests",
        "Implemented Prometheus, Grafana, and Graylog for metrics and centralized logs; configured Nginx as reverse proxy and load balancer",
      ],
      technologies: [
        "PostgreSQL",
        "Linux",
        "Docker",
        "Kubernetes",
        "Docker Swarm",
        "GitLab",
        "Jenkins",
        "Nginx",
        "Prometheus",
        "Grafana",
        "Graylog",
        "VMware vSphere",
        "Cloud-Init",
        "k6",
        "Bash",
        "Python",
      ],
    },
  ] satisfies Experience[],
  projectsNoteLead: "Selected public repositories. Additional work at",
  projects: [
    {
      name: "airbar-finance",
      summary:
        "Go finance service for ledger, escrow, wallet, and payment-provider callbacks, with idempotency and a real promotion path",
      href: "https://github.com/mamahoos/airbar-finance",
      displayUrl: "github.com/mamahoos/airbar-finance",
    },
    {
      name: "dot-files",
      summary:
        "Reproducible Linux environment: the repo mirrors the filesystem, install converges with symlinks, and CI guards the installer",
      href: "https://github.com/mamahoos/dot-files",
      displayUrl: "github.com/mamahoos/dot-files",
    },
    {
      name: "Composable Docker infrastructure",
      summary:
        "Independent Traefik and PostgreSQL stacks that applications join, so TLS and database lifecycle stay out of every service repo",
      href: "https://github.com/mamahoos/infra-traefik",
      displayUrl: "github.com/mamahoos/infra-traefik",
    },
    {
      name: "pacman-vpn",
      summary:
        "Containerized edge stack that joins existing Traefik and Postgres networks instead of bundling another proxy or database",
      href: "https://github.com/mamahoos/pacman-vpn",
      displayUrl: "github.com/mamahoos/pacman-vpn",
    },
    {
      name: "pgsync",
      summary:
        "Small wrapper around pg_dump piped to psql with rsync-shaped flags and safer defaults",
      href: "https://github.com/mamahoos/pgsync",
      displayUrl: "github.com/mamahoos/pgsync",
    },
  ] satisfies ResumeProject[],
  education: [
    {
      degree: "B.Sc. Computer Engineering",
      school: "University of Mazandaran",
      end: "Expected 2027",
    },
  ] satisfies Education[],
} as const;
