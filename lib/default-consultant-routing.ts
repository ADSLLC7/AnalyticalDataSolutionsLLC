// Fallback role -> consultant email routing for "Submit Consultant" mode.
//
// Each recruiter can configure their own tech-stack -> consultant CC rules
// in Panel 2 (CC Routing), stored per-recruiter via the CMS. This file is
// only consulted when a recruiter has no rule of their own that matches the
// extracted role/JD text — it exists so a role can have a default consultant
// even before any recruiter has configured one.
//
// Add more entries here as they're provided; each is checked in order and
// the first match wins.
export type DefaultRoute = {
  label: string; // for display/debugging only
  keywords: RegExp;
  email: string;
};

export const DEFAULT_CONSULTANT_ROUTES: DefaultRoute[] = [
  {
    label: "Business Analyst",
    keywords: /business analyst|systems analyst|product owner|product manager|scrum master|\bba\b/i,
    email: "pavan92.info@gmail.com",
  },
];

export function matchDefaultConsultant(text: string): string | null {
  for (const route of DEFAULT_CONSULTANT_ROUTES) {
    if (route.keywords.test(text)) return route.email;
  }
  return null;
}
