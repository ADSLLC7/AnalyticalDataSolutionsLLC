export interface Consultant {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  available: boolean;
}

export interface RoutingRule {
  role: string;
  keywords: string[];
  consultantId: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  type: "send" | "extract" | "copy" | "info";
}

export const CONSULTANTS: Consultant[] = [
  {
    id: "c1",
    name: "Arun Sharma",
    email: "arun.sharma@adsdatasolutions.com",
    role: "Data Engineer",
    skills: ["Spark", "Python", "AWS", "Databricks"],
    available: true,
  },
  {
    id: "c2",
    name: "Priya Nair",
    email: "priya.nair@adsdatasolutions.com",
    role: "Data Analyst",
    skills: ["SQL", "Tableau", "Power BI", "Python"],
    available: true,
  },
  {
    id: "c3",
    name: "Rahul Mehta",
    email: "rahul.mehta@adsdatasolutions.com",
    role: "ML Engineer",
    skills: ["TensorFlow", "PyTorch", "MLflow", "AWS SageMaker"],
    available: false,
  },
  {
    id: "c4",
    name: "Sneha Patel",
    email: "sneha.patel@adsdatasolutions.com",
    role: "BI Developer",
    skills: ["Power BI", "SSRS", "SQL Server", "DAX"],
    available: true,
  },
  {
    id: "c5",
    name: "Kiran Reddy",
    email: "kiran.reddy@adsdatasolutions.com",
    role: "Cloud Architect",
    skills: ["AWS", "Azure", "Terraform", "Kubernetes"],
    available: true,
  },
  {
    id: "c6",
    name: "Deepa Krishnan",
    email: "deepa.krishnan@adsdatasolutions.com",
    role: "Data Scientist",
    skills: ["Python", "R", "Statistical Modeling", "NLP"],
    available: false,
  },
];

export const ROUTING_RULES: RoutingRule[] = [
  { role: "Data Engineer", keywords: ["data engineer", "spark", "databricks", "etl", "pipeline"], consultantId: "c1" },
  { role: "Data Analyst", keywords: ["data analyst", "tableau", "power bi", "reporting", "sql"], consultantId: "c2" },
  { role: "ML Engineer", keywords: ["machine learning", "ml engineer", "deep learning", "nlp", "ai"], consultantId: "c3" },
  { role: "BI Developer", keywords: ["bi developer", "business intelligence", "ssrs", "dax", "power bi"], consultantId: "c4" },
  { role: "Cloud Architect", keywords: ["cloud architect", "aws architect", "azure architect", "devops", "kubernetes"], consultantId: "c5" },
  { role: "Data Scientist", keywords: ["data scientist", "statistical", "modeling", "research scientist"], consultantId: "c6" },
];

export const SUBMIT_TEMPLATE = `Dear {recruiterName},

I hope this message finds you well. My name is {senderName}, and I am reaching out on behalf of Analytical Data Solutions LLC (ADS) regarding the {role} opportunity at {company}.

We have an exceptional candidate who aligns closely with the requirements outlined in your job description. Our consultant brings {experience} of hands-on experience and has a proven track record in delivering results within fast-paced environments.

I have attached the candidate's resume for your review. Please let me know if you would like to schedule a call to discuss this further.

Best regards,
{senderName}
{senderTitle}
Analytical Data Solutions LLC
{senderPhone} | {senderEmail}`;

export const INQUIRY_TEMPLATE = `Dear {recruiterName},

My name is {senderName} from Analytical Data Solutions LLC (ADS). I came across your posting for a {role} and wanted to reach out to better understand the requirements.

Could you share additional details regarding:
• Required technical skills and years of experience
• Work authorization preferences
• Remote/hybrid/onsite expectations
• Target compensation range
• Interview process and timeline

We specialize in placing top-tier data and analytics professionals and would love the opportunity to present qualified candidates for this role.

Looking forward to your response.

Best regards,
{senderName}
{senderTitle}
Analytical Data Solutions LLC
{senderPhone} | {senderEmail}`;

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log1",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: "Session started",
    detail: "Portal loaded successfully",
    type: "info",
  },
];
