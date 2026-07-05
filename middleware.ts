import { NextRequest, NextResponse } from "next/server";

// Basic-auth guard for the admin surface. Active only when ADMIN_USER and
// ADMIN_PASS are set (i.e. in production); local dev stays open.
//
// Protected: /dashboard pages, job/post mutations, applicant data reads.
// Public:    POST /api/applications (candidates), POST /api/contact,
//            GET /api/jobs and GET /api/posts (public site data).

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="ADS Admin"' },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) return NextResponse.next(); // dev mode: open

  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  const isDashboard = pathname.startsWith("/dashboard");
  const isApplicantData =
    pathname.startsWith("/api/applications") && method === "GET";
  const isJobMutation =
    pathname.startsWith("/api/jobs") && method !== "GET";
  const isPostMutation =
    pathname.startsWith("/api/posts") && method !== "GET";

  if (!isDashboard && !isApplicantData && !isJobMutation && !isPostMutation) {
    return NextResponse.next();
  }

  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return unauthorized();
  try {
    const [u, p] = atob(header.slice(6)).split(":");
    if (u === user && p === pass) return NextResponse.next();
  } catch {
    /* fall through */
  }
  return unauthorized();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/jobs/:path*", "/api/jobs", "/api/posts/:path*", "/api/posts", "/api/applications/:path*", "/api/applications"],
};
