// Per-recruiter profile data extracted from individual HTML portals

export interface RecruiterProfile {
  name: string;
  email: string;         // canonical email, lowercase
  phone: string;
  title: string;
  recruiterId: string;
  webhookUrl: string;
  getCCForRole: (role: string) => string;
  submitTemplate: string;
  inquiryTemplate: string;
}

const NGROK_WEBHOOK =
  "https://6cc8-2600-1700-1041-33e0-2471-329d-b9d2-6b9f.ngrok-free.app/webhook/recruiter-outreach";

// ─── Ethan Hunt — recruiter_3 ─────────────────────────────────────────────────
const ethan: RecruiterProfile = {
  name: "Ethan Hunt",
  email: "ethan@analyticaldatasolution.com",
  phone: "+1(469)626-6060 Ext: 807",
  title: "Sr Bench Sales",
  recruiterId: "recruiter_3",
  webhookUrl: NGROK_WEBHOOK,
  getCCForRole(role) {
    const r = role.toLowerCase();
    if (/\.net|dotnet|asp\.net|c#|blazor|wpf|winforms|mvc|web api|entity framework|xamarin|maui/.test(r) && !/dynamics|d365|crm/.test(r))
      return "laxmikanth.p22@gmail.com,chintagumpulavardhan@gmail.com";
    if (/dynamics|d365|crm|power platform|power apps|power automate|dataverse/.test(r))
      return "laxmikanth.p19@gmail.com";
    if (/network|cisco|ccna|ccnp|ccie|\blan\b|\bwan\b|firewall|f5|palo alto|meraki|juniper|routing|switching|sdn|noc|telecom|voip|mpls|bgp|ospf/.test(r))
      return "viplavreddych@gmail.com";
    if (/data engineer|data analyst|etl|power bi|tableau|databricks|snowflake|dbt|\bspark\b|hadoop|data pipeline|data warehouse|data lake|data architect|big data|kafka|airflow|looker|qlik|ssis|informatica|talend|glue|redshift|bigquery/.test(r))
      return "saikiranp2345@gmail.com";
    return "Ethan@analyticaldatasolution.com";
  },
  submitTemplate:
    "Hi {{recruiterName}},\n\nHope you're doing well. I came across your post regarding {{role}} opportunity and wanted to reach out.\n\nI have a strong consultant available on a C2C basis who closely matches your requirements. They are ready to start immediately and open to the right opportunity.\n\nMy consultant cc'd here will be sharing their profile and resume with you shortly.\n\nPlease feel free to reach me at your earliest convenience.\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}",
  inquiryTemplate:
    "Hi {{recruiterName}},\n\nHope you're doing well. I came across your post regarding {{role}} role and wanted to check if this position is still open.\n\nCould you also share the pay rate (C2C) and any visa or work authorization restrictions?\n\nI have qualified consultants available and would love to discuss further.\n\nThank you for your time — looking forward to hearing from you.\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}",
};

// ─── Siva — recruiter_1 ───────────────────────────────────────────────────────
const siva: RecruiterProfile = {
  name: "Siva",
  email: "siva@analyticaldatasolution.com",
  phone: "+1(469)885-7854",
  title: "Sr Bench Sales",
  recruiterId: "recruiter_1",
  webhookUrl: "http://localhost:5678/webhook/recruiter-outreach",
  getCCForRole(role) {
    const r = role.toLowerCase();
    if (/\.net|dotnet|asp\.net|c#|blazor|wpf/.test(r) && !/dynamics/.test(r))
      return "laxmikanth.p22@gmail.com";
    if (/dynamics|d365|crm/.test(r))
      return "laxmikanth.p19@gmail.com";
    if (/business analyst|\bba\b|scrum|product manager/.test(r))
      return "ruthvik785@gmail.com";
    if (/network|cisco|ccna|ccnp|\blan\b|\bwan\b|firewall|f5|palo alto/.test(r))
      return "viplavreddych@gmail.com";
    if (/devops|aws|azure devops|gcp|kubernetes|docker|terraform/.test(r))
      return "kalyanim4144@gmail.com";
    if (/\bsql\b|oracle|\bpl\/sql\b|database developer/.test(r))
      return "pky92co@gmail.com";
    if (/data engineer|data analyst|etl|power bi|tableau|snowflake|dbt|\bspark\b/.test(r))
      return "saikiranp2345@gmail.com";
    return "siva@analyticaldatasolution.com";
  },
  submitTemplate:
    "Hi {{recruiterName}},\n\nHope you're doing well. I came across the {{role}} opportunity and wanted to reach out.\n\nI have a strong consultant available on a C2C basis who closely matches your requirements. They are ready to start immediately and open to the right opportunity.\n\nMy consultant cc'd here will be sharing their profile and resume with you shortly.\n\nPlease feel free to reach me at your earliest convenience.\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}",
  inquiryTemplate:
    "Hi {{recruiterName}},\n\nHope you're doing well. I came across the {{role}} posting and wanted to check if this position is still open.\n\nCould you also share the pay rate (C2C) and any visa or work authorization restrictions?\n\nI have qualified consultants available and would love to discuss further.\n\nThank you for your time — looking forward to hearing from you.\n\n{{signature}}\n\n---\nJob Description:\n\n{{jd}}",
};

// ─── Ashok — recruiter_4 ─────────────────────────────────────────────────────
const ashok: RecruiterProfile = {
  name: "Ashok",
  email: "ashok@analyticaldatasolution.com",
  phone: "+1(469)885-7854",
  title: "Sr Bench Sales",
  recruiterId: "recruiter_4",
  webhookUrl: NGROK_WEBHOOK,
  getCCForRole: siva.getCCForRole, // same routing as Siva
  submitTemplate: siva.submitTemplate,
  inquiryTemplate: siva.inquiryTemplate,
};

// ─── James — recruiter_5 ─────────────────────────────────────────────────────
const james: RecruiterProfile = {
  name: "James",
  email: "james@analyticaldatasolution.com",
  phone: "+1(970)-343-8208 / EXT no: 800",
  title: "Sr Bench Sales",
  recruiterId: "recruiter_5",
  webhookUrl: NGROK_WEBHOOK,
  getCCForRole(role) {
    const r = role.toLowerCase();
    if (/\.net|dotnet|asp\.net|c#|blazor|wpf|winforms|mvc|web api|entity framework|xamarin|maui/.test(r) && !/dynamics|d365|crm/.test(r))
      return "laxmikanth.p22@gmail.com";
    if (/dynamics|d365|crm|power platform|power apps|power automate|dataverse/.test(r))
      return "laxmikanth.p19@gmail.com";
    if (/golang|go developer|go lang|go engineer/.test(r))
      return "reddy.vinay7656@gmail.com";
    if (/business analyst|systems analyst|product manager|product owner|scrum master|agile coach|project manager|process analyst|functional analyst|requirements analyst|program analyst|\bba\b/.test(r))
      return "ruthvik785@gmail.com,pavan92.info@gmail.com";
    return "James@analyticaldatasolution.com";
  },
  submitTemplate: ethan.submitTemplate,
  inquiryTemplate: ethan.inquiryTemplate,
};

// ─── Sandeep — recruiter_2 ────────────────────────────────────────────────────
const sandeep: RecruiterProfile = {
  name: "Sandeep",
  email: "sandeep@analyticaldatasolution.com",
  phone: "+1(469)777-8937 Ext:808",
  title: "Sr Bench Sales",
  recruiterId: "recruiter_2",
  webhookUrl: NGROK_WEBHOOK,
  getCCForRole(role) {
    const r = role.toLowerCase();
    if (/\.net|dotnet|asp\.net|c#|blazor|wpf|winforms|mvc|web api|entity framework|xamarin|maui/.test(r) && !/dynamics|d365|crm/.test(r))
      return "chintagumpulavardhan@gmail.com";
    if (/cyber|security engineer|security analyst|infosec|information security|soc analyst|penetration test|pentest|ethical hack|vulnerability|siem|cissp|cism|ceh|comptia security|network security|cloud security|zero trust/.test(r))
      return "akshay.upadhyay009@gmail.com";
    if (/business analyst|systems analyst|product manager|product owner|scrum master|agile coach|project manager|process analyst|functional analyst|requirements analyst|program analyst|\bba\b/.test(r))
      return "pavan92.info@gmail.com";
    if (/network|cisco|ccna|ccnp|ccie|\blan\b|\bwan\b|firewall|f5|palo alto|meraki|juniper|routing|switching|sdn|noc|telecom|voip|mpls|bgp|ospf/.test(r))
      return "viplavreddych@gmail.com";
    return "Sandeep@analyticaldatasolution.com";
  },
  submitTemplate: siva.submitTemplate,
  inquiryTemplate: siva.inquiryTemplate,
};

// ─── Lookup map (keyed by lowercase email) ────────────────────────────────────
const RECRUITERS: Record<string, RecruiterProfile> = {
  [ethan.email]: ethan,
  [siva.email]: siva,
  [ashok.email]: ashok,
  [james.email]: james,
  [sandeep.email]: sandeep,
};

export function getRecruiterByEmail(email: string): RecruiterProfile | null {
  return RECRUITERS[email.toLowerCase()] ?? null;
}

export { RECRUITERS };
