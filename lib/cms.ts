import { promises as fs } from "fs";
import path from "path";
import { POSTS as SEED_POSTS, type Post } from "./posts";

const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

// Vercel Blob mode is enabled when the token env var is present (set
// automatically when a Blob store is connected to the Vercel project).
// Locally, without the token, everything falls back to the data/ folder.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
// Secret path prefix so JSON stores are not at guessable blob URLs.
const STORE_PREFIX = `cms-${process.env.CMS_SECRET || "dev"}`;

export type Job = {
  id: string;
  title: string;
  location: string;
  type: "Full-time" | "Contract" | "Contract-to-hire";
  practice: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  status: "open" | "closed";
  postedAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  note?: string;
  resumeFile: string;
  resumeOriginalName: string;
  submittedAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  submittedAt: string;
};

const SEED_JOBS: Job[] = [
  {
    id: "senior-cloud-engineer",
    title: "Senior Cloud Engineer",
    location: "Remote (US)",
    type: "Full-time",
    practice: "Cloud Infrastructure",
    summary:
      "Design and operate AWS and Azure environments for mid-market clients: landing zones, migration waves, and the cost and reliability work that follows.",
    responsibilities: [
      "Architect and build client cloud environments with Terraform and native tooling",
      "Lead migration projects from on-prem and colo into AWS or Azure",
      "Set up monitoring, alerting, and cost controls that client teams can run themselves",
      "Mentor client engineers through the handoff period",
    ],
    qualifications: [
      "6+ years in infrastructure or platform roles, 3+ on a major cloud",
      "Production Terraform or equivalent IaC experience",
      "Comfortable presenting architecture decisions to client leadership",
      "AWS or Azure professional-level certification preferred",
    ],
    status: "open",
    postedAt: "2026-06-12",
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    location: "Plano, TX (Hybrid)",
    type: "Full-time",
    practice: "Data Engineering",
    summary:
      "Build warehouses and pipelines for clients moving off spreadsheet-and-export reporting: dbt, Snowflake or BigQuery, and the orchestration around them.",
    responsibilities: [
      "Design dimensional models and ELT pipelines for client analytics workloads",
      "Implement dbt projects with tests, documentation, and CI",
      "Tune warehouse cost and performance as data volume grows",
      "Work directly with client analysts to shape usable data marts",
    ],
    qualifications: [
      "4+ years building production data pipelines",
      "Strong SQL plus Python; dbt experience strongly preferred",
      "Experience with at least one of Snowflake, BigQuery, Redshift, or Databricks",
    ],
    status: "open",
    postedAt: "2026-06-18",
  },
  {
    id: "devops-consultant",
    title: "DevOps Consultant",
    location: "Remote (US)",
    type: "Contract-to-hire",
    practice: "DevOps & Platform",
    summary:
      "Embed with client engineering teams to build CI/CD, Kubernetes platforms, and deployment automation they keep after we leave.",
    responsibilities: [
      "Stand up CI/CD pipelines in GitHub Actions, GitLab, or Azure DevOps",
      "Operate and harden Kubernetes clusters (EKS, AKS, or on-prem)",
      "Introduce progressive delivery, secrets management, and environment parity",
      "Document and train so the client team owns the platform at handoff",
    ],
    qualifications: [
      "5+ years across software delivery and infrastructure",
      "Production Kubernetes experience",
      "A consultant's temperament: you explain trade-offs without ego",
    ],
    status: "open",
    postedAt: "2026-06-25",
  },
  {
    id: "integration-architect",
    title: "Integration Architect",
    location: "Plano, TX (Hybrid)",
    type: "Full-time",
    practice: "System Integration",
    summary:
      "Own API strategy and legacy-modernization design for clients connecting ERPs, CRMs, and homegrown systems that were never meant to talk.",
    responsibilities: [
      "Assess client system landscapes and design integration architectures",
      "Define API standards, event contracts, and data-sync patterns",
      "Lead modernization of legacy interfaces (file drops, direct DB links) to services",
      "Guide implementation teams through delivery",
    ],
    qualifications: [
      "8+ years in software architecture or senior integration roles",
      "Depth in REST/event-driven design; iPaaS experience a plus",
      "Comfortable across .NET, Java, or Node ecosystems",
    ],
    status: "open",
    postedAt: "2026-05-30",
  },
  {
    id: "technical-recruiter",
    title: "Technical Recruiter",
    location: "Plano, TX (On-site)",
    type: "Full-time",
    practice: "Talent & Staffing",
    summary:
      "Source and close engineers for our staffing practice: cloud, data, and DevOps roles where you can actually evaluate the skills you recruit for.",
    responsibilities: [
      "Own full-cycle recruiting for client and internal technical roles",
      "Build sourcing pipelines beyond job-board postings",
      "Screen for real technical signal in partnership with our engineers",
      "Manage candidate experience from first call through onboarding",
    ],
    qualifications: [
      "3+ years recruiting for software or infrastructure roles",
      "You can explain what a CI pipeline is without reading a script",
      "Track record of placements that stayed",
    ],
    status: "open",
    postedAt: "2026-06-28",
  },
];

async function ensureDataDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function readStore<T>(file: string, fallback: T): Promise<T> {
  if (useBlob) {
    const { head } = await import("@vercel/blob");
    try {
      const meta = await head(`${STORE_PREFIX}/${file}`);
      const res = await fetch(meta.url, { cache: "no-store" });
      if (!res.ok) return fallback;
      return (await res.json()) as T;
    } catch {
      return fallback;
    }
  }
  await ensureDataDir();
  const fp = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(fp, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeStore<T>(file: string, data: T): Promise<void> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(`${STORE_PREFIX}/${file}`, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  await ensureDataDir();
  const fp = path.join(DATA_DIR, file);
  await fs.writeFile(fp, JSON.stringify(data, null, 2), "utf-8");
}

/* ── Resume file storage ──────────────────────────────────── */

// Returns the stored reference: a blob URL on Vercel, a bare filename locally.
export async function saveResumeFile(
  safeName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`resumes/${safeName}`, buffer, {
      access: "public",
      contentType,
    });
    return blob.url;
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, safeName), buffer);
  return safeName;
}

export async function readResumeFile(ref: string): Promise<Buffer | null> {
  try {
    if (ref.startsWith("http")) {
      const res = await fetch(ref, { cache: "no-store" });
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    }
    return await fs.readFile(path.join(UPLOADS_DIR, path.basename(ref)));
  } catch {
    return null;
  }
}

/* ── Jobs ─────────────────────────────────────────────────── */

export async function getJobs(): Promise<Job[]> {
  const jobs = await readStore<Job[] | null>("jobs.json", null);
  if (jobs === null) {
    await writeStore("jobs.json", SEED_JOBS);
    return SEED_JOBS;
  }
  return jobs;
}

export async function getOpenJobs(): Promise<Job[]> {
  return (await getJobs()).filter((j) => j.status === "open");
}

export async function getJob(id: string): Promise<Job | undefined> {
  return (await getJobs()).find((j) => j.id === id);
}

export async function saveJob(job: Job): Promise<void> {
  const jobs = await getJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.unshift(job);
  await writeStore("jobs.json", jobs);
}

export async function deleteJob(id: string): Promise<void> {
  const jobs = (await getJobs()).filter((j) => j.id !== id);
  await writeStore("jobs.json", jobs);
}

/* ── Applications ─────────────────────────────────────────── */

export async function getApplications(): Promise<Application[]> {
  return readStore<Application[]>("applications.json", []);
}

export async function saveApplication(app: Application): Promise<void> {
  const apps = await getApplications();
  apps.unshift(app);
  await writeStore("applications.json", apps);
}

/* ── Blog posts ───────────────────────────────────────────── */

export type { Post };

export async function getPosts(): Promise<Post[]> {
  const posts = await readStore<Post[] | null>("posts.json", null);
  if (posts === null) {
    await writeStore("posts.json", SEED_POSTS);
    return SEED_POSTS;
  }
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

export async function savePost(post: Post): Promise<void> {
  const posts = await getPosts();
  const idx = posts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) posts[idx] = post;
  else posts.unshift(post);
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  await writeStore("posts.json", posts);
}

export async function deletePost(slug: string): Promise<void> {
  const posts = (await getPosts()).filter((p) => p.slug !== slug);
  await writeStore("posts.json", posts);
}

/* ── Contact messages ─────────────────────────────────────── */

export async function getMessages(): Promise<ContactMessage[]> {
  return readStore<ContactMessage[]>("messages.json", []);
}

export async function saveMessage(msg: ContactMessage): Promise<void> {
  const msgs = await getMessages();
  msgs.unshift(msg);
  await writeStore("messages.json", msgs);
}
