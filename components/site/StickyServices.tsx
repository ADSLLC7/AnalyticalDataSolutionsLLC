'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Building2, Cloud, Database, GitBranch,
  Workflow, Sparkles, Code2, Users,
} from 'lucide-react';

const SERVICES = [
  {
    name: 'Enterprise Platforms',
    icon: Building2,
    desc: 'Salesforce and Workday, implemented and integrated by consultants who live in those ecosystems rather than reading the docs alongside you.',
    tags: ['Salesforce', 'Workday', 'ServiceNow', 'SAP'],
  },
  {
    name: 'Cloud Infrastructure',
    icon: Cloud,
    desc: 'Architecture, migration, and operations across AWS, Azure, and GCP — tuned for reliability and cost, not just provisioned and handed over.',
    tags: ['AWS', 'Azure', 'GCP', 'Terraform'],
  },
  {
    name: 'Data Engineering',
    icon: Database,
    desc: 'Warehouses and pipelines sized for the volume your product actually generates, replacing the exports and goodwill holding it together today.',
    tags: ['Snowflake', 'Databricks', 'dbt', 'Kafka'],
  },
  {
    name: 'DevOps & Platform',
    icon: GitBranch,
    desc: 'CI/CD, Kubernetes, and deployment automation built to be handed off — documented and tested so your team owns it after we leave.',
    tags: ['Kubernetes', 'GitHub Actions', 'Docker', 'ArgoCD'],
  },
  {
    name: 'System Integration',
    icon: Workflow,
    desc: 'API design, legacy modernization, and service architecture that connects the systems you already run instead of replacing them wholesale.',
    tags: ['REST', 'GraphQL', 'Event-driven', 'iPaaS'],
  },
  {
    name: 'AI & Machine Learning',
    icon: Sparkles,
    desc: 'RAG pipelines, LLM integration, and model deployment with the evaluation and guardrails production actually demands.',
    tags: ['RAG', 'LLM Ops', 'Evaluation', 'Vector DB'],
  },
  {
    name: 'Application Development',
    icon: Code2,
    desc: 'Web applications and internal tools in TypeScript, React, .NET, and Python, built on the infrastructure we stand up.',
    tags: ['TypeScript', 'React', '.NET', 'Python'],
  },
  {
    name: 'Technical Staffing',
    icon: Users,
    desc: 'Cloud, data, and DevOps specialists who embed inside your team — screened by engineers who do the work, not by keyword match.',
    tags: ['C2C', 'Contract', 'Contract-to-hire', 'Direct'],
  },
];

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function StickyServices() {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Pick whichever panel's centre sits closest to the viewport centre.
    // IntersectionObserver was unreliable here: with a thin rootMargin band,
    // a panel taller than the band reports a tiny intersectionRatio, so
    // ratio-sorting picked the wrong panel and then stopped updating.
    // Measuring distance-to-centre on scroll is deterministic instead.
    let frame = 0;

    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;

      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      setActive((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="mk-pin">
      {/* sticky rail */}
      <div className="mk-pin-rail">
        <p className="mk-eyebrow">What we do</p>
        <h2 className="mk-h2">
          Eight practices,
          <br />
          <span className="mk-grad">one delivery team.</span>
        </h2>
        <p className="mk-body" style={{ marginTop: '1.1rem', maxWidth: '34ch' }}>
          You get one engagement and one accountable team — not four vendors
          pointing at each other.
        </p>

        <div className="mk-pin-index" role="list">
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              role="listitem"
              className="mk-pin-index-item"
              data-active={i === active}
            >
              {s.name}
            </div>
          ))}
        </div>

        <Link href="/services" className="mk-link" style={{ marginTop: '2rem' }}>
          All services <ArrowIcon />
        </Link>
      </div>

      {/* scrolling panels */}
      <div className="mk-pin-panels">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="mk-pin-panel"
              data-active={i === active}
            >
              <p className="mk-pin-num">{String(i + 1).padStart(2, '0')} / 08</p>
              <span className="mk-card-icon" style={{ marginBottom: '1rem' }}>
                <Icon size={21} strokeWidth={2} aria-hidden />
              </span>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.75rem)',
                  letterSpacing: '-0.025em',
                  margin: '0 0 0.7rem',
                }}
              >
                {s.name}
              </h3>
              <p
                style={{
                  margin: '0 0 1.35rem',
                  fontSize: '0.975rem',
                  lineHeight: 1.7,
                  color: 'var(--mk-ink-muted)',
                  maxWidth: '52ch',
                }}
              >
                {s.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {s.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.28rem 0.7rem',
                      borderRadius: 999,
                      border: '1px solid var(--mk-border)',
                      color: 'var(--mk-ink-faint)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
