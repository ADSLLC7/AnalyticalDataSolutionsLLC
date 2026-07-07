export interface UserSession {
  email: string;
  name: string;
  role: string;
  phone: string;
  whatsapp?: string;
  loggedIn: boolean;
  recruiterId: string;
  webhookUrl: string;
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("ads_session");
    if (!raw) return null;
    const s = JSON.parse(raw) as UserSession;
    return s.loggedIn ? s : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ads_session");
  }
}
