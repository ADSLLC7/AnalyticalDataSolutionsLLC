import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2, Cloud, Database, GitBranch,
  Workflow, Sparkles, Code2, Users,
} from 'lucide-react';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import HeroVisual from '@/components/site/HeroVisual';
import Reveal from '@/components/site/Reveal';
import { getOpenJobs, getPosts } from '@/lib/cms';
import { tagColor } from '@/lib/tag-colors';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytical Data Solutions | Empowering the Leaders of Tomorrow',
  description:
    'IT consulting for mid-market companies and growth-stage startups: cloud infrastructure, data engineering, DevOps, system integration, and technical staffing.',
};

const SERVICES = [
  { name: 'Enterprise Platforms', icon: Building2, desc: 'Salesforce and Workday, implemented and integrated by specialists.' },
  { name: 'Cloud Infrastructure', icon: Cloud, desc: 'Architecture, migration, and operations across AWS, Azure, and GCP.' },
  { name: 'Data Engineering', icon: Database, desc: 'Warehouses and pipelines sized for the volume you actually generate.' },
  { name: 'DevOps & Platform', icon: GitBranch, desc: 'CI/CD, Kubernetes, and automation built to hand off to your team.' },
  { name: 'System Integration', icon: Workflow, desc: 'API design and legacy modernization across the systems you run.' },
  { name: 'AI & Machine Learning', icon: Sparkles, desc: 'RAG, LLM integration, and deployment with production guardrails.' },
  { name: 'Application Development', icon: Code2, desc: 'Web apps and internal tools in TypeScript, .NET, and Python.' },
  { name: 'Technical Staffing', icon: Users, desc: 'Specialists who embed in your team, screened by engineers.' },
];

const STEPS = [
  { n: '01', title: 'Scope the real problem', body: 'A working session with your team, not a sales deck. We leave with a written scope — or we tell you we are not the right fit.' },
  { n: '02', title: 'Build with your people', body: 'Consultants embed in your standups, your repos, your tools. You see progress weekly, not at a big reveal.' },
  { n: '03', title: 'Hand off and step back', body: 'Documentation, tests, and training close every engagement. Your team runs it; we stay reachable.' },
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
        <section
          className="mk-section mk-hero-dark"
          style={{
            paddingBottom: 'clamp(3rem, 5.5vw, 4.5rem)',
            minHeight: 'calc(80dvh - 70px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="mk-container mk-split">
            <div>
              <p className="mk-eyebrow hero-line">Plano, Texas · Nationwide delivery</p>
              <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5rem)' }}>
                The IT partner that{' '}
                <span className="mk-gold-mark">builds it</span>{' '}
                with you.
              </h1>
              <p className="mk-lead hero-line" style={{ marginTop: '1.4rem', maxWidth: '48ch' }}>
                Consultants and delivery teams across the enterprise stack —
                Salesforce, Workday, cloud, and data.
              </p>
              <div
                className="hero-line"
                style={{ marginTop: '2.25rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}
              >
                <Link href="/contact" className="mk-btn mk-btn-gold">
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
        <section style={{ background: 'var(--mk-surface)', borderBottom: '1px solid var(--mk-border)' }}>
          <div
            className="mk-container"
            style={{
              paddingBlock: 'clamp(2.5rem, 5vw, 3.5rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 'clamp(1.75rem, 3.5vw, 3rem)',
            }}
          >
            {[
              ['One partner, not four vendors', 'Platforms, applications, cloud, and data under a single engagement.'],
              ['Screened by engineers', 'Every consultant is vetted by people who do the work, not by keyword match.'],
              ['Built to hand off', 'Documentation, tests, and training close every engagement. Your team owns it.'],
            ].map(([lead, rest]) => (
              <div key={lead}>
                <div style={{ width: 28, height: 2, background: 'var(--mk-gold)', marginBottom: '0.9rem' }} />
                <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700, lineHeight: 1.35, color: 'var(--mk-ink)' }}>
                  {lead}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--mk-ink-muted)' }}>
                  {rest}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Services ─────────────────────────────────── */}
        <section className="mk-section">
          <div className="mk-container">
            <Reveal>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                <div>
                  <p className="mk-eyebrow">What we do</p>
                  <h2 className="mk-h2" style={{ maxWidth: '20ch' }}>
                    Eight practices, one delivery team.
                  </h2>
                </div>
                <Link href="/services" className="mk-link">
                  All services <ArrowIcon />
                </Link>
              </div>
            </Reveal>
            <div className="mk-grid-cards">
              {SERVICES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal key={s.name} delay={i * 45}>
                    <div className="mk-card">
                      <span className="mk-card-icon">
                        <Icon size={19} strokeWidth={2} aria-hidden />
                      </span>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.015em', margin: 0 }}>
                        {s.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--mk-ink-muted)' }}>
                        {s.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How we engage ────────────────────────────── */}
        <section className="mk-section" style={{ background: 'var(--mk-surface)' }}>
          <div className="mk-container">
            <Reveal>
              <p className="mk-eyebrow">How an engagement runs</p>
              <h2 className="mk-h2" style={{ maxWidth: '24ch', marginBottom: 'clamp(2rem, 4vw, 2.75rem)' }}>
                Scoped honestly. Built together. Handed back.
              </h2>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 70}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <span className="mk-step-num">{s.n}</span>
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0, letterSpacing: '-0.015em' }}>
                      {s.title}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--mk-ink-muted)' }}>
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dual audience ────────────────────────────── */}
        <section className="mk-section">
          <div className="mk-container mk-grid-cards">
            <Reveal>
              <div
                className="mk-lift"
                style={{
                  background: 'var(--mk-deep)',
                  color: 'var(--mk-on-deep)',
                  borderRadius: '14px',
                  padding: 'clamp(1.85rem, 3.5vw, 2.85rem)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ width: 28, height: 2, background: 'var(--mk-gold)', marginBottom: '1.1rem' }} />
                <h3 className="mk-h3" style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)' }}>
                  Need a team that ships?
                </h3>
                <p style={{ color: 'var(--mk-on-deep-muted)', lineHeight: 1.7, fontSize: '0.95rem', margin: '0.9rem 0 1.75rem', maxWidth: '42ch' }}>
                  Scoped engagements or embedded engineers. Tell us where the
                  project stands and we&apos;ll tell you honestly whether
                  we&apos;re the right fit.
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/contact" className="mk-btn mk-btn-gold">
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
                  border: '1px solid var(--mk-border)',
                  borderRadius: '14px',
                  padding: 'clamp(1.85rem, 3.5vw, 2.85rem)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ width: 28, height: 2, background: 'var(--mk-accent)', marginBottom: '1.1rem' }} />
                <h3 className="mk-h3" style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)' }}>
                  Looking for your next role?
                </h3>
                <p className="mk-body" style={{ margin: '0.9rem 0 1.75rem', maxWidth: '42ch' }}>
                  {openJobs.length} open position{openJobs.length === 1 ? '' : 's'} across
                  cloud, data, DevOps, and recruiting. Real projects and direct
                  mentorship.
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/careers" className="mk-btn-ghost" style={{ background: '#ffffff' }}>
                    View open roles <ArrowIcon />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Latest thinking ──────────────────────────── */}
        <section className="mk-section" style={{ paddingTop: 0 }}>
          <div className="mk-container">
            <Reveal>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                <div>
                  <p className="mk-eyebrow">From the team</p>
                  <h2 className="mk-h2">Latest thinking</h2>
                </div>
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
                    <article className="mk-card">
                      <span className="mk-tag" style={{ background: tagColor(p.tag).bg, color: tagColor(p.tag).fg, alignSelf: 'flex-start' }}>
                        {p.tag}
                      </span>
                      <h3 className="mk-h3" style={{ textWrap: 'balance' }}>{p.title}</h3>
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--mk-ink-muted)', margin: 0 }}>
                        {p.excerpt}
                      </p>
                      <p style={{ marginTop: 'auto', marginBottom: 0, paddingTop: '0.5rem', fontSize: '0.78rem', color: 'var(--mk-ink-muted)', fontWeight: 500 }}>
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
        <section className="mk-deep-band">
          <div className="mk-container" style={{ paddingBlock: 'clamp(3.5rem, 7vw, 5.5rem)', textAlign: 'center' }}>
            <Reveal>
              <div style={{ width: 32, height: 2, background: 'var(--mk-gold)', margin: '0 auto 1.5rem' }} />
              <h2 className="mk-h2" style={{ marginBottom: '1rem', maxWidth: '18ch', marginInline: 'auto' }}>
                Tell us what you&apos;re building.
              </h2>
              <p style={{ color: 'var(--mk-on-deep-muted)', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '52ch', margin: '0 auto 2.25rem' }}>
                A 30-minute call is enough to tell you whether we can help, what
                it would take, and what it would cost.
              </p>
              <Link href="/contact" className="mk-btn mk-btn-gold">
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
