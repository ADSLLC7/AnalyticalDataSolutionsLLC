import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';
import Reveal from '@/components/site/Reveal';

export const metadata: Metadata = {
  title: 'About us | Analytical Data Solutions',
  description:
    'Analytical Data Solutions is an IT consulting and technical staffing firm in Plano, Texas, serving mid-market companies and growth-stage startups.',
};

const VALUES = [
  {
    name: 'Scoped to what we know',
    body: 'Infrastructure, data, and the engineering between them. We turn down work outside that range rather than learn on your budget.',
  },
  {
    name: 'Own the outcome',
    body: 'A deployment that works in staging and fails in production is not done. Engagements end when the thing works and your team can run it.',
  },
  {
    name: 'Hand off, always',
    body: 'Documentation, tests, and training are deliverables on every project. Dependency on your consultant is a design flaw, not a business model.',
  },
  {
    name: 'Hire to a standard',
    body: 'Every consultant we place is screened by engineers who do the work. If we would not put them on our own infrastructure, they do not go on yours.',
  },
];

const LEADERSHIP = [
  {
    name: 'Engineering practice',
    role: 'Cloud, data, and platform consultants',
    body: 'Senior engineers who spend most of their week embedded with clients, and the rest reviewing each other’s architecture decisions.',
  },
  {
    name: 'Talent practice',
    role: 'Technical recruiters and account managers',
    body: 'Recruiters who can read a job description critically and tell a client when the role, as written, will not hire.',
  },
  {
    name: 'Delivery leadership',
    role: 'Engagement and project management',
    body: 'The people who keep scope honest, flag risk early, and make sure the handoff plan exists from week one.',
  },
];

export default function AboutPage() {
  return (
    <div className="mk">
      <SiteNav />

      <main>
        {/* Intro */}
        <section style={{ paddingBlock: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <div className="mk-container mk-split" style={{ alignItems: 'center' }}>
            <div>
              <h1 className="mk-h1 hero-line" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
                About us
              </h1>
              <p className="mk-lead hero-line" style={{ marginTop: '1.25rem' }}>
                Analytical Data Solutions LLC is an IT consulting and technical
                staffing firm based in Plano, Texas. We work with
                mid-market companies and growth-stage startups whose technology
                has outgrown the way it was built.
              </p>
              <p className="mk-body hero-line" style={{ marginTop: '1.25rem' }}>
                Our clients usually come to us at an inflection point: a cloud
                bill that stopped making sense, a data stack held together by
                exports and goodwill, a platform that one engineer understands,
                or a team that needs three more people who actually know what
                they are doing. We handle both sides of that problem, the
                engineering and the people.
              </p>
            </div>
            <img
              className="hero-line"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
              alt="Engineers collaborating around laptops during a working session"
              style={{ width: '100%', aspectRatio: '3 / 2', maxHeight: '360px', objectFit: 'cover', borderRadius: '14px', display: 'block' }}
            />
          </div>
        </section>

        {/* Values */}
        <section className="mk-section mk-deep-band">
          <div className="mk-container">
            <Reveal>
              <h2 className="mk-h2" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                How we work
              </h2>
            </Reveal>
            <div className="mk-grid-cards">
              {VALUES.map((v, i) => (
                <Reveal key={v.name} delay={i * 60}>
                  <div
                    className="mk-lift"
                    style={{
                      border: '1px solid var(--mk-border-deep)',
                      borderRadius: '10px',
                      padding: '1.6rem',
                      height: '100%',
                    }}
                  >
                    <h3 className="mk-h3" style={{ marginBottom: '0.7rem' }}>{v.name}</h3>
                    <p style={{ color: 'var(--mk-on-deep-muted)', fontSize: '0.925rem', lineHeight: 1.7, margin: 0 }}>
                      {v.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mk-section">
          <div className="mk-container">
            <Reveal>
              <h2 className="mk-h2" style={{ marginBottom: '0.9rem' }}>Who you&apos;ll work with</h2>
              <p className="mk-lead" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                We are deliberately small. Every engagement gets people who do
                the work, not a bench.
              </p>
            </Reveal>
            <div>
              {LEADERSHIP.map((l, i) => (
                <Reveal key={l.name} delay={i * 50}>
                  <div className="mk-row">
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{l.name}</p>
                      <p style={{ fontSize: '0.825rem', color: 'var(--mk-accent)', fontWeight: 600, margin: '0.25rem 0 0' }}>
                        {l.role}
                      </p>
                    </div>
                    <p className="mk-body" style={{ margin: 0 }}>{l.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mk-section" style={{ background: 'var(--mk-surface)' }}>
          <div className="mk-container" style={{ textAlign: 'center' }}>
            <Reveal>
              <h2 className="mk-h2" style={{ marginBottom: '1rem' }}>Work with us, or for us.</h2>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.75rem' }}>
                <Link href="/contact" className="mk-btn">Start a conversation</Link>
                <Link href="/careers" className="mk-btn-ghost" style={{ background: 'oklch(1 0 0)' }}>
                  See open roles
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
