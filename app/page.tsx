import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import HeroVisual from '@/components/site/HeroVisual';
import Reveal from '@/components/site/Reveal';
import { getOpenJobs, getPosts } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytical Data Solutions | IT Consulting & Technical Staffing',
  description:
    'IT consulting for mid-market companies and growth-stage startups: cloud infrastructure, data engineering, DevOps, system integration, and technical staffing.',
};

const SERVICES = [
  {
    name: 'Enterprise Platforms',
    desc: 'Salesforce and Workday implementation, integration, and administration by consultants who live in those ecosystems.',
  },
  {
    name: 'Cloud Infrastructure',
    desc: 'Architecture, migration, and operations across AWS, Azure, and GCP. Reliability and cost, not just provisioning.',
  },
  {
    name: 'Data Engineering',
    desc: 'Warehouses, pipelines, and analytics infrastructure sized for the volume your product actually generates.',
  },
  {
    name: 'DevOps & Platform',
    desc: 'CI/CD, Kubernetes, and deployment automation built to hand off to your team, documented and tested.',
  },
  {
    name: 'System Integration',
    desc: 'API design, legacy modernization, and service architecture that connects the systems you already run.',
  },
  {
    name: 'AI & Machine Learning',
    desc: 'RAG pipelines, LLM integration, and model deployment with the evaluation and guardrails production demands.',
  },
  {
    name: 'Application Development',
    desc: 'Web applications and internal tools in TypeScript, React, .NET, and Python, built on the infrastructure we stand up.',
  },
  {
    name: 'Technical Staffing',
    desc: 'Cloud, data, and DevOps specialists who embed inside your team, screened by engineers who do the work.',
  },
];

const TECH_GROUPS = [
  {
    group: 'Enterprise Platforms',
    techs: ['Salesforce', 'Workday', 'ServiceNow', 'SAP'],
  },
  {
    group: 'Application Engineering',
    techs: ['Java', '.NET', 'Python', 'TypeScript', 'React', 'Node.js'],
  },
  {
    group: 'Cloud & DevOps',
    techs: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
  {
    group: 'Data & AI',
    techs: ['Snowflake', 'BigQuery', 'dbt', 'Databricks', 'OpenAI', 'Claude'],
  },
];

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function Home() {
  const openJobs = await getOpenJobs();
  const latestPosts = (await getPosts()).slice(0, 3);

  return (
    <div className="mk">
      <SiteNav />

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="mk-section" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div className="mk-container mk-split">
            <div>
              <h1 className="mk-h1 hero-line">
                The IT partner that{' '}
                <span style={{ color: 'var(--mk-accent)' }}>builds it</span>{' '}
                with you.
              </h1>
              <p className="mk-lead hero-line" style={{ marginTop: '1.4rem' }}>
                Analytical Data Solutions LLC places highly qualified
                consultants and delivery teams across the enterprise stack:
                Salesforce, Workday, Java, .NET, cloud, and data.
              </p>
              <div
                className="hero-line"
                style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                <Link href="/contact" className="mk-btn">
                  Start a project <ArrowIcon />
                </Link>
                <Link href="/careers" className="mk-btn-ghost">
                  Explore open roles
                </Link>
              </div>
            </div>
            <div className="hero-line">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* ── Credibility band ─────────────────────────── */}
        <section className="mk-deep-band">
          <div
            className="mk-container"
            style={{
              paddingBlock: 'clamp(2rem, 4vw, 2.75rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {[
              ['Based in Plano, Texas', 'serving clients across the US'],
              ['Platforms, apps, cloud, and data', 'one partner, not four vendors'],
              ['Consultants who hand off', 'your team owns it when we leave'],
            ].map(([lead, rest]) => (
              <p key={lead} style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.55 }}>
                <strong style={{ fontWeight: 700 }}>{lead}</strong>
                <br />
                <span style={{ color: 'var(--mk-on-deep-muted)' }}>{rest}</span>
              </p>
            ))}
          </div>
        </section>

        {/* ── Tech stack ───────────────────────────────── */}
        <section style={{ borderBottom: '1px solid var(--mk-border)' }}>
          <div className="mk-container" style={{ paddingBlock: 'clamp(2rem, 4vw, 3rem)' }}>
            <Reveal>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 1.25rem', color: 'var(--mk-ink)' }}>
                Consultants across the stack, not one corner of it
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem 2rem' }}>
                {TECH_GROUPS.map((g) => (
                  <div key={g.group}>
                    <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--mk-accent)', margin: '0 0 0.6rem' }}>
                      {g.group}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {g.techs.map((t) => (
                        <span
                          key={t}
                          style={{
                            display: 'inline-block',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '999px',
                            border: '1px solid var(--mk-border)',
                            background: 'oklch(1 0 0)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--mk-ink)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Services overview ────────────────────────── */}
        <section className="mk-section">
          <div className="mk-container">
            <Reveal>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                <h2 className="mk-h2">What we do</h2>
                <Link href="/services" className="mk-link">
                  All services <ArrowIcon />
                </Link>
              </div>
            </Reveal>
            <div>
              {SERVICES.map((s, i) => (
                <Reveal key={s.name} delay={i * 50}>
                  <div className="mk-row">
                    <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>{s.name}</span>
                    <span className="mk-body">{s.desc}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dual audience ────────────────────────────── */}
        <section className="mk-section" style={{ paddingTop: 0 }}>
          <div className="mk-container mk-grid-cards">
            <Reveal>
              <div
                className="mk-lift"
                style={{
                  background: 'var(--mk-deep)',
                  color: 'var(--mk-on-deep)',
                  borderRadius: '12px',
                  padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h3 className="mk-h3" style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)' }}>
                  Need a team that ships?
                </h3>
                <p style={{ color: 'var(--mk-on-deep-muted)', lineHeight: 1.7, fontSize: '0.95rem', margin: '0.9rem 0 1.6rem', maxWidth: '46ch' }}>
                  Scoped consulting engagements or embedded engineers. Tell us
                  where the project stands and we&apos;ll tell you honestly
                  whether we&apos;re the right fit.
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/contact" className="mk-btn">
                    Talk to us <ArrowIcon />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div
                className="mk-lift"
                style={{
                  background: 'var(--mk-surface)',
                  borderRadius: '12px',
                  padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h3 className="mk-h3" style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)' }}>
                  Looking for your next role?
                </h3>
                <p className="mk-body" style={{ margin: '0.9rem 0 1.6rem', maxWidth: '46ch' }}>
                  {openJobs.length} open position{openJobs.length === 1 ? '' : 's'} across
                  cloud, data, DevOps, and recruiting. Real projects, direct
                  mentorship, and clients who build things.
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/careers" className="mk-btn-ghost" style={{ background: 'oklch(1 0 0)' }}>
                    View open roles <ArrowIcon />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Latest from the blog ─────────────────────── */}
        <section className="mk-section" style={{ borderTop: '1px solid var(--mk-border)' }}>
          <div className="mk-container">
            <Reveal>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                <h2 className="mk-h2">Latest thinking</h2>
                <Link href="/blog" className="mk-link">
                  All posts <ArrowIcon />
                </Link>
              </div>
            </Reveal>
            <div className="mk-grid-cards">
              {latestPosts.map((p, i) => (
                <Reveal key={p.slug} delay={i * 70}>
                  <Link
                    href={`/blog/${p.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                  >
                    <article
                      className="mk-lift"
                      style={{
                        border: '1px solid var(--mk-border)',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        background: 'oklch(1 0 0)',
                      }}
                    >
                      <span className="mk-tag">{p.tag}</span>
                      <h3 className="mk-h3" style={{ textWrap: 'balance' }}>{p.title}</h3>
                      <p className="mk-body" style={{ fontSize: '0.9rem', margin: 0 }}>{p.excerpt}</p>
                      <p style={{ marginTop: 'auto', marginBottom: 0, fontSize: '0.8rem', color: 'var(--mk-ink-muted)', fontWeight: 500 }}>
                        {new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        {' · '}{p.readMinutes} min read
                      </p>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────── */}
        <section className="mk-section" style={{ background: 'var(--mk-surface)' }}>
          <div className="mk-container" style={{ textAlign: 'center' }}>
            <Reveal>
              <h2 className="mk-h2" style={{ marginBottom: '1rem' }}>
                Tell us what you&apos;re building.
              </h2>
              <p className="mk-lead" style={{ margin: '0 auto 2rem' }}>
                A 30-minute call is enough to tell you whether we can help, what
                it would take, and what it would cost.
              </p>
              <Link href="/contact" className="mk-btn">
                Contact us <ArrowIcon />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
