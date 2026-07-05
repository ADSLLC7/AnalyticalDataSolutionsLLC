import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import Reveal from '@/components/site/Reveal';

export const metadata: Metadata = {
  title: 'Services | Analytical Data Solutions',
  description:
    'Cloud infrastructure, data engineering, DevOps and platform engineering, system integration, and technical staffing for mid-market companies.',
};

const PRACTICES = [
  {
    id: 'platforms',
    name: 'Enterprise Platforms',
    tagline: 'Salesforce and Workday, implemented and integrated properly.',
    body: 'Certified consultants for the platforms that run your business: Salesforce orgs that sales teams actually use, Workday tenants that HR and finance can rely on, and the integrations that keep both honest.',
    items: [
      'Salesforce implementation, customization, and admin',
      'Workday HCM and Financials configuration and support',
      'Platform integration with ERPs, data warehouses, and custom apps',
      'ServiceNow and SAP consulting through our staffing practice',
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud Infrastructure',
    tagline: 'Architecture, migration, and operations on AWS, Azure, and GCP.',
    body: 'We design landing zones, run migration waves, and stay through the part most consultancies skip: making the environment cheap, observable, and boring to operate.',
    items: [
      'Cloud architecture and landing-zone design',
      'On-prem and colo migration planning and execution',
      'Cost review and rightsizing (FinOps)',
      'Reliability engineering: monitoring, alerting, incident readiness',
    ],
  },
  {
    id: 'data',
    name: 'Data Engineering',
    tagline: 'Warehouses and pipelines that replace exports and goodwill.',
    body: 'From a first warehouse to a mature dbt project with tests and lineage, we build analytics infrastructure sized for the data you actually have, and the AI features you want on top of it.',
    items: [
      'Warehouse design on Snowflake, BigQuery, Redshift, or Databricks',
      'ELT pipelines with dbt, Airflow, or Dagster',
      'Data quality, testing, and documentation',
      'RAG and AI-readiness: corpus pipelines, embeddings, evaluation',
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Platform Engineering',
    tagline: 'Delivery pipelines and platforms your team keeps after we leave.',
    body: 'We build CI/CD, Kubernetes platforms, and infrastructure as code with the explicit goal of handing them off: documented, tested, and understood by your engineers.',
    items: [
      'CI/CD in GitHub Actions, GitLab, or Azure DevOps',
      'Kubernetes design and operations (EKS, AKS, GKE)',
      'Infrastructure as code with Terraform',
      'Secrets management, environment parity, progressive delivery',
    ],
  },
  {
    id: 'integration',
    name: 'System Integration',
    tagline: 'Connecting the systems you already run.',
    body: 'ERPs, CRMs, and homegrown tools that were never meant to talk. We design the APIs, events, and sync patterns that replace file drops and direct database links.',
    items: [
      'Integration architecture and API strategy',
      'Legacy interface modernization',
      'Event-driven design and messaging',
      'iPaaS evaluation and implementation',
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    tagline: 'LLM features with the guardrails production demands.',
    body: 'From a first RAG pilot to production agent workflows, we build AI features with evaluation, cost controls, and rollback designed in, on top of data infrastructure that can actually feed them.',
    items: [
      'RAG systems: corpus pipelines, embeddings, retrieval evaluation',
      'LLM integration with OpenAI, Claude, and open-weight models',
      'Agent workflows with permissions, audit logs, and human approval gates',
      'Model cost engineering: caching, batching, routing',
    ],
  },
  {
    id: 'appdev',
    name: 'Application Development',
    tagline: 'Web apps and internal tools that ship and keep shipping.',
    body: 'Customer-facing applications and internal tools in modern stacks, with CI/CD, tests, and observability from the first commit, built on infrastructure we can also stand up and run.',
    items: [
      'Web applications in TypeScript, React, and Next.js',
      'Back-end services in Python, .NET, and Node.js',
      'Internal tools, admin panels, and workflow automation',
      'Legacy application modernization and replatforming',
    ],
  },
  {
    id: 'staffing',
    name: 'Technical Staffing',
    tagline: 'Engineers screened by engineers.',
    body: 'Contract, contract-to-hire, and direct placement across Java, .NET, Salesforce, Workday, cloud, data, and DevOps roles. Every candidate is evaluated by consultants who do the same work, so the technical signal is real.',
    items: [
      'Contract and contract-to-hire placement',
      'Direct-hire recruiting for technical roles',
      'Team augmentation on active ADS engagements',
      'Technical screening as a service',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mk">
      <SiteNav />

      <main>
        <section style={{ paddingBlock: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <div className="mk-container mk-split" style={{ alignItems: 'center' }}>
            <div>
              <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
                Services
              </h1>
              <p className="mk-lead hero-line" style={{ marginTop: '1.25rem' }}>
                Eight practices at Analytical Data Solutions LLC, one standard:
                when the engagement ends, your team owns what we built.
              </p>
            </div>
            <img
              className="hero-line"
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80"
              alt="Rows of server racks in a data center, lit by status LEDs"
              style={{ width: '100%', aspectRatio: '3 / 2', maxHeight: '340px', objectFit: 'cover', borderRadius: '14px', display: 'block' }}
            />
          </div>
        </section>

        {PRACTICES.map((p, i) => (
          <section
            key={p.id}
            id={p.id}
            className="mk-section"
            style={{
              borderTop: '1px solid var(--mk-border)',
              background: i % 2 ? 'var(--mk-surface)' : undefined,
              paddingBlock: 'clamp(2.75rem, 5vw, 4.5rem)',
            }}
          >
            <div className="mk-container mk-split-narrow">
              <Reveal>
                <div>
                  <h2 className="mk-h2" style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)' }}>{p.name}</h2>
                  <p style={{ color: 'var(--mk-accent)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.7rem', textWrap: 'pretty' }}>
                    {p.tagline}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div>
                  <p className="mk-body" style={{ marginTop: 0 }}>{p.body}</p>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: '1.4rem 0 0',
                      padding: 0,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '0.7rem 2rem',
                    }}
                  >
                    {p.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          display: 'flex',
                          gap: '0.6rem',
                          alignItems: 'baseline',
                          fontSize: '0.9rem',
                          lineHeight: 1.55,
                          color: 'var(--mk-ink)',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden style={{ flexShrink: 0, transform: 'translateY(1px)' }}>
                          <path d="M2 6.5l2.5 2.5L10 3.5" stroke="var(--mk-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </section>
        ))}

        <section className="mk-section mk-deep-band">
          <div className="mk-container" style={{ textAlign: 'center' }}>
            <Reveal>
              <h2 className="mk-h2" style={{ marginBottom: '1rem' }}>Not sure which practice fits?</h2>
              <p style={{ color: 'var(--mk-on-deep-muted)', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '52ch', margin: '0 auto 2rem' }}>
                Describe the problem, not the solution. We&apos;ll tell you what
                it needs, even when the answer is not us.
              </p>
              <Link href="/contact" className="mk-btn">Describe your project</Link>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
