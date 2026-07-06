// Job-description field extraction: role title and contact name.
// Ported from the working n8n-hosted recruiter tool, with two bugs fixed:
//   1. "hiring for a X" kept a stray "for a" prefix in the role.
//   2. Generic mailbox addresses (recruiter@, careers@, hr@...) or lead-in
//      phrases like "contact recruiter John" were extracted as if the role
//      noun itself ("Recruiter") were the person's name.

function cleanRole(r: string): string {
  return r
    .replace(/^(?:urgent\s+)?(?:hiring|we are hiring|we're hiring|immediate hiring)[:\s]+/i, "")
    .replace(/\s*\(.*?\)\s*$/i, "")
    .replace(/\s*[:(]\s*\d+[+\s\w]*[):]?\s*$/i, "")
    .replace(/\s+(?:with|using|and|in)\s+.*$/i, "")
    .replace(/\s+E[1-5]$/i, "")
    .trim();
}

const ROLE_KEYWORD = /\b(?:developer|engineer|analyst|architect|lead|manager|consultant|specialist|admin|dba|devops|tester|qa|designer|administrator)\b/i;

const FALLBACK_ROLES: [string[], string][] = [
  [["dynamics 365", ".net full stack"], "Microsoft Dynamics 365 & .NET Developer"],
  [[".net", "dotnet", "asp.net"], ".NET Developer"],
  [["automation engineer", "automation architect"], "Automation Engineer"],
  [["data engineer"], "Data Engineer"],
  [["data analyst"], "Data Analyst"],
  [["business analyst"], "Business Analyst"],
  [["salesforce"], "Salesforce Developer"],
  [["sap"], "SAP Consultant"],
  [["workday"], "Workday Consultant"],
  [["servicenow"], "ServiceNow Developer"],
  [["network engineer", "cisco", "ccna"], "Network Engineer"],
  [["devops"], "DevOps Engineer"],
  [["kubernetes", "terraform", "aws", "azure", "gcp"], "Cloud / DevOps Engineer"],
  [["qa engineer", "quality assurance"], "QA Engineer"],
  [["react", "angular"], "Frontend Developer"],
  [["oracle dba"], "Oracle DBA"],
  [["ios developer", "android"], "Mobile Developer"],
  [["java developer", "springboot"], "Java Developer"],
  [["python"], "Python Developer"],
  [["java"], "Java Developer"],
];

export function extractRole(text: string): string {
  const lines = text.split("\n").slice(0, 12).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const m = line.match(/^(?:job\s+title|title|position|role)\s*[-:–—]\s*(.{4,80}?)(?:\s*[|,]|$)/i);
    if (m) return cleanRole(m[1].trim());
  }
  for (const line of lines) {
    const m = line.match(/(?:hiring|looking for|seeking)\s+(?:for\s+)?(?:a\s+|an\s+)?(.{4,60}?)(?:\s+for\s+|\s*[|\-–—,]|$)/i);
    if (m && ROLE_KEYWORD.test(m[1])) return cleanRole(m[1].replace(/\s+for.*$/i, "").trim());
  }
  for (const line of lines) {
    const m = line.match(/^(.{4,60}?)\s+E[1-5]\s*[-–]/i);
    if (m && ROLE_KEYWORD.test(m[1])) return m[1].trim();
  }
  for (const line of lines) {
    const cleaned = line.replace(/\s*[:(]\s*\d+[+\s\w]*[):]?\s*$/, "").trim();
    if (
      cleaned.length < 100 &&
      ROLE_KEYWORD.test(cleaned) &&
      !/(?:experience|years|skills|required|location|rate|contract|duration|responsibilities|salary|we are|our team|candidates|must|only|share|please|locals)/i.test(cleaned)
    ) {
      return cleanRole(cleaned.replace(/^[-–—•*]\s*/, "").replace(/\s*[|,].*$/, "").trim());
    }
  }

  const lower = text.toLowerCase();
  for (const [kws, label] of FALLBACK_ROLES) {
    if (kws.some((kw) => lower.includes(kw))) return label;
  }
  return "";
}

// Mailbox/role words that are never a real person's first name.
const GENERIC_NAME_WORDS = new Set([
  "recruiter", "recruiting", "recruitment", "hr", "jobs", "careers", "talent",
  "hiring", "staffing", "admin", "info", "contact", "support", "sales",
  "team", "noreply", "no-reply", "service", "services", "apply", "resumes",
  "submissions", "bench", "notifications",
]);

function titleCase(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

export function extractName(jd: string): string {
  // "Contact recruiter John at ..." must yield "John", not the role noun
  // ("recruiter") that introduced it.
  const cM = jd.match(
    /(?:contact|recruiter|reach out to|send (?:cv|resume) to|mail (?:cv|resume) to)[:\s]+([A-Za-z]{2,20})(?:\s+[A-Za-z]+)?\s+(?:at\s+)?[a-zA-Z0-9._%+\-]+@/i
  );
  if (cM && !GENERIC_NAME_WORDS.has(cM[1].toLowerCase())) {
    return titleCase(cM[1]);
  }

  // Fall back to the email's local part, skipping generic mailbox names
  // (recruiter@, careers@, hr@ carry no real name).
  const emailM = jd.match(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[a-z]{2,}\b/);
  if (emailM) {
    const local = emailM[0].split("@")[0];
    const fn = local.split(/[._\-]/)[0].replace(/\d+$/, "");
    if (/^[a-zA-Z]{2,20}$/.test(fn) && !GENERIC_NAME_WORDS.has(fn.toLowerCase())) {
      return titleCase(fn);
    }
  }
  return "";
}

export function extractEmail(jd: string): string {
  const m = jd.match(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[a-z]{2,}\b/);
  return m ? m[0] : "";
}
