export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tag: string;
  readMinutes: number;
  body: string[]; // paragraphs
};

export const POSTS: Post[] = [
  {
    slug: "agentic-ai-enterprise-workflows",
    title: "Agentic AI is moving from demos to production workflows",
    excerpt:
      "The gap between an impressive agent demo and a dependable one comes down to three unglamorous things: permissions, evaluation, and rollback.",
    date: "2026-06-24",
    author: "ADS Engineering",
    tag: "AI in Practice",
    readMinutes: 6,
    body: [
      "For two years, agentic AI lived in demo videos: an assistant books travel, files an expense report, opens a pull request. In 2026 the conversation inside engineering organizations has shifted from whether agents can do these things to whether they can be trusted to do them unattended. The difference is not model capability. It is the scaffolding around the model.",
      "The teams shipping agents into production share three habits. First, they treat permissions as the product. An agent that can read a ticketing system but must request approval before writing to it survives its first bad day; an agent with blanket API keys does not. Scoped credentials, per-action audit logs, and human approval gates on irreversible operations are the pattern we now recommend on every engagement.",
      "Second, they evaluate continuously, not once. A prompt that behaves well in April can regress in June after a model update. Production agent teams maintain golden datasets of real tasks and score every model or prompt change against them before rollout, the same way a platform team treats a database migration.",
      "Third, they design for rollback. When an agent takes a wrong action, the question is not who to blame but how fast the system returns to a known state. Idempotent actions, soft deletes, and reversible workflows turn agent mistakes from incidents into log entries.",
      "For mid-market companies, the practical takeaway is to start with read-heavy, low-blast-radius workflows: triage, summarization, classification, drafting. The ROI is real and the failure modes are survivable. Write access comes after the audit trail exists, not before.",
    ],
  },
  {
    slug: "llm-cost-engineering-2026",
    title: "LLM cost engineering: what actually moves the bill",
    excerpt:
      "Model choice gets the attention, but caching, batching, and prompt hygiene routinely cut inference spend 40 to 70 percent before anyone downgrades a model.",
    date: "2026-06-10",
    author: "ADS Engineering",
    tag: "AI Infrastructure",
    readMinutes: 5,
    body: [
      "When an AI feature's cloud bill spikes, the first instinct is to swap in a cheaper model. It is usually the wrong first move. Across the cost reviews we have run this year, the biggest savings came from four changes that do not touch model selection at all.",
      "Prompt caching is the largest lever. Most production prompts carry a long, static preamble: system instructions, schemas, few-shot examples. Providers now discount cached prefix tokens heavily, but only if the static content is actually stable and ordered before the dynamic content. Restructuring prompts to be cache-friendly is often an afternoon of work worth 30 to 50 percent of the bill.",
      "Second is output discipline. Teams pay for tokens they immediately throw away: verbose JSON with unused fields, chain-of-thought a parser discards, apologetic boilerplate. Tight output schemas and maximum token limits are free money.",
      "Third, batch what is not interactive. Overnight classification, embedding refreshes, and report generation do not need real-time endpoints. Batch APIs typically price at half the interactive rate.",
      "Only after these three do we look at model tiering: routing easy requests to a small model and hard ones to a frontier model behind a router. It works, but it adds evaluation burden, so it should be earned by traffic volume, not adopted by default.",
      "The pattern to notice: LLM spend behaves like any other cloud spend. The discipline that tamed your AWS bill (visibility, unit economics, and removing waste before renegotiating rates) applies unchanged.",
    ],
  },
  {
    slug: "rag-is-a-data-engineering-problem",
    title: "RAG quality is a data engineering problem, not a model problem",
    excerpt:
      "Retrieval-augmented generation fails in production for the same reason dashboards fail: nobody owns the pipeline that feeds it.",
    date: "2026-05-28",
    author: "ADS Engineering",
    tag: "Data Engineering",
    readMinutes: 6,
    body: [
      "The most common AI engagement we see in the mid-market right now is a struggling internal knowledge assistant. The symptom is always the same: it answers confidently from stale or wrong documents. The diagnosis is almost never the model. It is the corpus.",
      "Retrieval-augmented generation has a supply chain: documents are collected, cleaned, chunked, embedded, indexed, and retrieved. Every stage can silently degrade. SharePoint exports duplicate content. Chunking splits tables from their headers. Embeddings go stale when documents update but the index does not. None of this is visible in a demo built on twelve hand-picked PDFs.",
      "The fix looks exactly like data engineering because it is data engineering. Treat the document corpus as a dataset with owners, freshness SLAs, and lineage. Deduplicate at ingestion. Chunk with structure awareness (headings, tables, code blocks) rather than fixed character counts. Re-embed on document change events, not on a quarterly cron.",
      "Measurement closes the loop. A retrieval evaluation set (a few hundred real questions with known correct sources) turns arguments about quality into a metric. When retrieval precision is measured weekly, corpus rot gets caught the way schema drift gets caught in a warehouse: automatically, before users notice.",
      "If your organization already runs dbt with tests and documentation, you have the muscle RAG needs. Point that muscle at your documents and the model suddenly looks a lot smarter.",
    ],
  },
  {
    slug: "small-models-edge-inference",
    title: "Small models are quietly winning the boring workloads",
    excerpt:
      "Classification, extraction, and routing tasks are migrating from frontier APIs to sub-10B models that run on a single GPU, and the economics are hard to argue with.",
    date: "2026-05-14",
    author: "ADS Engineering",
    tag: "AI Infrastructure",
    readMinutes: 5,
    body: [
      "Frontier models get the headlines, but the workhorse deployments we set up this year tell a different story. Ticket routing, PII detection, invoice field extraction, sentiment tagging, log summarization: these tasks are increasingly served by small open-weight models running on infrastructure the client already owns.",
      "The economics drive it. A fine-tuned 7B model on a single L4 GPU handles millions of classification requests per month at a fixed, predictable cost, with no per-token meter and no data leaving the VPC. For regulated industries, the data-residency argument alone closes the decision.",
      "The catch is operational. Self-hosting a model means owning GPU provisioning, model updates, quantization choices, and latency SLOs. It is a platform-engineering commitment, not an API key. Teams that treat it casually end up with an unmonitored pet server that one engineer understands.",
      "Our rule of thumb for clients: stay on hosted APIs while iterating on product-market fit for the feature. Move a workload in-house when three things are true: the task is stable, the volume is high enough that the meter hurts, and a platform team exists to own the runtime.",
      "The likely end state for most mid-market stacks is hybrid: small local models for high-volume structured tasks, frontier APIs for open-ended reasoning, and a router that knows the difference.",
    ],
  },
  {
    slug: "ai-hiring-market-2026",
    title: "What the 2026 tech hiring market actually rewards",
    excerpt:
      "AI has not shrunk engineering teams; it has repriced skills. Systems thinking, data fluency, and operational judgment are up. Boilerplate fluency is down.",
    date: "2026-04-30",
    author: "ADS Talent",
    tag: "Talent",
    readMinutes: 5,
    body: [
      "Two years of AI-assisted development have reshaped what our clients ask for when they hire, and the pattern is consistent enough to name. Demand has not fallen. It has moved up the stack.",
      "What is repriced downward: producing routine code quickly. Scaffolding a CRUD service, writing a standard React form, translating a spec into boilerplate. Assistants do this well, so the market no longer pays a premium for it.",
      "What is repriced upward: everything the assistant cannot be accountable for. Deciding what to build. Reviewing generated code with enough depth to catch the subtle bug. Designing systems whose failure modes are understood. Debugging production incidents where the answer is not in the training data. Data modeling, because AI features are only as good as the data underneath them.",
      "For candidates, the practical advice is to build a portfolio of judgment, not output: architecture decisions you can defend, incidents you diagnosed, migrations you led. Interview loops at our clients increasingly probe for exactly this.",
      "For hiring managers: stop screening for syntax trivia. The engineers who thrive with AI tooling are the ones who read code critically and ask what could go wrong. Interview for that directly, and your AI-era velocity follows.",
    ],
  },
  {
    slug: "postgres-vector-search-consolidation",
    title: "The vector database wars are ending where they started: in Postgres",
    excerpt:
      "For most teams, pgvector on managed Postgres has become the default answer, and the specialized vector stores are retreating to genuinely large-scale niches.",
    date: "2026-04-16",
    author: "ADS Engineering",
    tag: "Data Engineering",
    readMinutes: 4,
    body: [
      "In 2023, every AI architecture diagram included a dedicated vector database. In 2026, most of the ones we review include Postgres with pgvector, and the dedicated store appears only when the workload genuinely demands it.",
      "The consolidation happened for unromantic reasons. Embeddings want to live next to the rows they describe. Joining vector similarity results against permissions, tenants, and metadata is a SQL problem, and doing it inside one database eliminates a synchronization pipeline that otherwise has to be built, monitored, and debugged.",
      "Performance stopped being the differentiator. HNSW indexing in pgvector handles the single-digit millions of vectors that describe almost every mid-market corpus, with latencies indistinguishable from specialized stores at that scale.",
      "The specialized engines still earn their place above roughly a hundred million vectors, or when filtered search at high recall is the core product. That describes a small fraction of the deployments we see.",
      "The takeaway is a familiar one: infrastructure sprawl is a tax, and the boring consolidation move usually wins. Before adding a database to your stack for an AI feature, check whether the database you already run does the job. Increasingly, it does.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
