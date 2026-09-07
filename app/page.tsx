import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import StickyServices from '@/components/site/StickyServices';
import Reveal from '@/components/site/Reveal';
import { getOpenJobs, getPosts } from '@/lib/cms';
import { tagColor } from '@/lib/tag-colors';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytical Data Solutions | Empowering the Leaders of Tomorrow',
  description:
    'IT consulting for mid-market companies and growth-stage startups: cloud infrastructure, data engineering, DevOps, system integration, and technical staffing.',
};

const MARQUEE = [
  'Cloud Architecture', 'Data Engineering', 'Salesforce', 'Workday',
  'DevOps & Platform', 'AI & Machine Learning', 'System Integration',
  'Technical Staffing', 'Application Development',
];

const STEPS = [
  {
    n: '01',
    title: 'Scope the real problem',
    body: 'A working session with your team, not a sales deck. We leave with a written scope — or we tell you we are not the right fit and point you somewhere better.',
  },
  {
    n: '02',
    title: 'Build with your people',
    body: 'Consultants embed in your standups, your repos, your tools. You see progress weekly, not at a big reveal three months in.',
  },
  {
    n: '03',
    title: 'Hand off and step back',
    body: 'Documentation, tests, and training close every engagement. Your team runs it; we stay reachable when something changes.',
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
        <section className="mk-hero">
          <div className="mk-hero-aurora" aria-hidden />
          <div className="mk-hero-grid" aria-hidden />
          <Image
            className="mk-hero-mark"
            src="/brand/ads-icon-ondark.png"
            alt=""
            aria-hidden
            width={760}
            height={760}
            priority
          />

          <div className="mk-container" style={{ paddingBlock: 'clamp(4rem, 9vw, 7rem)' }}>
            <div style={{ maxWidth: '58rem' }}>
              <p className="mk-eyebrow hero-line">Plano, Texas · Delivering nationwide</p>

              <h1 className="mk-h1 hero-line">
                The IT partner
                <br />
                that <span className="mk-grad">builds it</span>
                <br />
                with you.
              </h1>

              <p className="mk-lead hero-line" style={{ marginTop: '1.75rem' }}>
                Consultants and delivery teams across the enterprise stack —
                Salesforce, Workday, cloud, and data. One engagement, one
                accountable team.
              </p>

              <div
                className="hero-line"
                style={{ marginTop: '2.5rem', display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}
              >
                <Link href="/contact" className="mk-btn">
                  Start a project <ArrowIcon />
                </Link>
                <Link href="/careers" className="mk-btn-ghost">
                  Explore open roles
                </Link>
              </div>
            </div>
          </div>

          <div className="mk-scroll-cue" aria-hidden>
            <span>Scroll</span>
            <span className="bar" />
          </div>
        </section>

        {/* ── Capability marquee ───────────────────────── */}
        <section className="mk-marquee" aria-label="Capabilities">
          <div className="mk-marquee-track">
            {[0, 1].map((dup) => (
              <div className="mk-marquee-item" key={dup} aria-hidden={dup === 1}>
                {MARQUEE.map((m) => (
                  <span key={`${dup}-${m}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '3.25rem' }}>
                    {m}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Sticky pinned services ───────────────────── */}
        <section className="mk-section">
          <div className="mk-container">
            <StickyServices />
          </div>
        </section>

        {/* ── Why us ───────────────────────────────────── */}
        <section className="mk-section" style={{ background: 'var(--mk-surface)', borderBlock: '1px solid var(--mk-border)' }}>
          <div className="mk-container">
            <Reveal>
              <p className="mk-eyebrow">Why teams pick us</p>
              <h2 className="mk-h2" style={{ maxWidth: '20ch', marginBottom: 'clamp(2.25rem, 4vw, 3.25rem)' }}>
                Consultants who <span className="mk-grad">hand it back.</span>
              </h2>
            </Reveal>
            <div className="mk-grid-cards">
              {[
                ['One partner, not four vendors', 'Platforms, applications, cloud, and data under a single engagement, with one team accountable for the outcome.'],
                ['Screened by engineers', 'Every consultant is vetted by people who do the work. No keyword matching, no resume roulette.'],
                ['Built to hand off', 'Documentation, tests, and training close every engagement. Your team owns it when we step back.'],
              ].map(([lead, rest], i) => (
                <Reveal key={lead} delay={i * 90}>
                  <div className="mk-card">
                    <div style={{ width: 30, height: 2, background: 'var(--mk-accent)', marginBottom: '1rem' }} />
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', margin: 0 }}>
                      {lead}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--mk-ink-muted)' }}>
                      {rest}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process timeline ─────────────────────────── */}
        <section className="mk-section">
          <div className="mk-container mk-split-narrow">
            <Reveal>
              <div>
                <p className="mk-eyebrow">How an engagement runs</p>
                <h2 className="mk-h2" style={{ maxWidth: '14ch' }}>
                  Scoped honestly. Handed back.
                </h2>
              </div>
            </Reveal>

            <div className="mk-timeline">
              <div className="mk-timeline-fill" aria-hidden />
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="mk-timeline-step">
                    <span className="mk-timeline-dot">{s.n}</span>
                    <h3 style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', margin: '0 0 0.6rem' }}>
                      {s.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--mk-ink-muted)', maxWidth: '52ch' }}>
                      {s.body}
                    </p>
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
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 18,
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background:
                    'radial-gradient(28rem 20rem at 85% 0%, rgba(240,180,41,0.20), transparent 66%), var(--mk-surface-2)',
                  border: '1px solid rgba(240,180,41,0.28)',
                }}
              >
                <div style={{ width: 30, height: 2, background: 'var(--mk-accent)', marginBottom: '1.2rem' }} />
                <h3 className="mk-h3" style={{ fontSize: 'clamp(1.45rem, 2.4vw, 1.9rem)' }}>
                  Need a team that ships?
                </h3>
                <p style={{ color: 'var(--mk-ink-muted)', lineHeight: 1.7, fontSize: '0.975rem', margin: '1rem 0 2rem', maxWidth: '40ch' }}>
                  Scoped engagements or embedded engineers. Tell us where the
                  project stands and we&apos;ll tell you honestly whether
                  we&apos;re the right fit.
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/contact" className="mk-btn">
                    Talk to us <ArrowIcon />
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div
                className="mk-lift"
                style={{
                  borderRadius: 18,
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--mk-surface)',
                  border: '1px solid var(--mk-border)',
                }}
              >
                <div style={{ width: 30, height: 2, background: 'var(--mk-border-strong)', marginBottom: '1.2rem' }} />
                <h3 className="mk-h3" style={{ fontSize: 'clamp(1.45rem, 2.4vw, 1.9rem)' }}>
                  Looking for your next role?
                </h3>
                <p style={{ color: 'var(--mk-ink-muted)', lineHeight: 1.7, fontSize: '0.975rem', margin: '1rem 0 2rem', maxWidth: '40ch' }}>
                  {openJobs.length} open position{openJobs.length === 1 ? '' : 's'} across
                  cloud, data, DevOps, and recruiting. Real projects and direct
                  mentorship.
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <Link href="/careers" className="mk-btn-ghost">
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: 'clamp(2rem, 4vw, 2.75rem)' }}>
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
                <Reveal key={p.slug} delay={i * 90}>
                  <Link
                    href={`/blog/${p.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                  >
                    <article className="mk-card">
                      <span className="mk-tag" style={{ background: tagColor(p.tag).bg, color: tagColor(p.tag).fg, alignSelf: 'flex-start', border: 'none' }}>
                        {p.tag}
                      </span>
                      <h3 className="mk-h3" style={{ textWrap: 'balance' }}>{p.title}</h3>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--mk-ink-muted)', margin: 0 }}>
                        {p.excerpt}
                      </p>
                      <p style={{ marginTop: 'auto', marginBottom: 0, paddingTop: '0.6rem', fontSize: '0.78rem', color: 'var(--mk-ink-faint)', fontWeight: 500 }}>
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
        <section style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--mk-border)' }}>
          <div className="mk-hero-aurora" aria-hidden style={{ opacity: 0.75 }} />
          <div className="mk-container" style={{ paddingBlock: 'clamp(4.5rem, 9vw, 7.5rem)', textAlign: 'center', position: 'relative' }}>
            <Reveal>
              <h2 className="mk-h2" style={{ maxWidth: '16ch', marginInline: 'auto', fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)' }}>
                Tell us what <span className="mk-grad">you&apos;re building.</span>
              </h2>
              <p className="mk-lead" style={{ margin: '1.5rem auto 2.5rem', maxWidth: '48ch' }}>
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
