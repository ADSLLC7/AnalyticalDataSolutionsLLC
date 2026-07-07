// Builds the HTML body sent through n8n's Outlook nodes now that their
// "Message Type" is set to HTML. Plain \n line breaks are invisible in
// HTML, so plain-text templates need converting to real <p>/<br> markup,
// and any user-pasted text (JD, names) needs escaping so it can't break
// the markup or inject anything unexpected.

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Splits on blank lines into paragraphs; single line breaks within a
// paragraph become <br>. Assumes the input is already HTML-safe (escaped)
// except for the literal {{signature}} token, which survives as its own
// paragraph and is swapped for real markup afterward.
export function paragraphize(input: string): string {
  return input
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p style="margin:0 0 14px;line-height:1.6;">${block.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

export interface SignatureData {
  name: string;
  title: string;
  phone: string;
  whatsapp?: string;
  email: string;
}

// No "www" CNAME is configured in DNS — only the bare domain resolves.
const LOGO_URL = "https://analyticaldatasolution.com/email/ads-logo-static.png";
const SITE_URL = "https://analyticaldatasolution.com";
const ACCENT = "#c65138";

export function buildSignatureHtml(data: SignatureData): string {
  const whatsappLine = data.whatsapp
    ? `💬 WhatsApp: ${escapeHtml(data.whatsapp)}<br>`
    : "";
  return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;">
  <tr>
    <td style="padding-right:14px;vertical-align:top;">
      <img src="${LOGO_URL}" width="44" height="44" alt="ADS" style="display:block;border-radius:10px;">
    </td>
    <td style="border-left:2px solid ${ACCENT};padding-left:14px;">
      <div style="font-weight:700;font-size:14px;color:#1a1a1a;">${escapeHtml(data.name)}</div>
      <div style="color:${ACCENT};font-weight:600;font-size:12px;margin-bottom:6px;">${escapeHtml(data.title)}</div>
      <div style="line-height:1.6;">
        📞 ${escapeHtml(data.phone)}<br>
        ${whatsappLine}
        ✉️ <a href="mailto:${escapeHtml(data.email)}" style="color:#1a1a1a;text-decoration:none;">${escapeHtml(data.email)}</a><br>
        🌐 <a href="${SITE_URL}" style="color:${ACCENT};text-decoration:none;">www.analyticaldatasolution.com</a>
      </div>
      <div style="margin-top:8px;font-size:11px;color:#666;font-style:italic;">
        Building better teams through innovation and integrity.
      </div>
    </td>
  </tr>
</table>
<div style="margin-top:10px;font-size:10px;color:#999;line-height:1.4;">
  Disclaimer: This email and any attachments are confidential and intended solely for the recipient. If you are not the intended recipient, please delete it immediately.
</div>`;
}

// Compiles a {{recruiterName}}/{{role}}/{{signature}}/{{jd}} template into a
// full HTML email body. Order matters: recruiterName/role/jd are escaped
// and substituted first (still plain text with \n), then the whole thing is
// paragraphized, and only then is the {{signature}} paragraph swapped for
// the real signature markup (which contains its own block-level HTML and
// must not end up nested inside a <p>).
export function composeHtmlMessage(
  template: string,
  vars: { recruiterName: string; role: string; jd: string },
  signature: SignatureData
): string {
  const compiled = template
    .replace(/\{\{recruiterName\}\}/g, escapeHtml(vars.recruiterName || "Hiring Manager"))
    .replace(/\{\{role\}\}/g, escapeHtml(vars.role || "the open position"))
    .replace(/\{\{jd\}\}/g, escapeHtml(vars.jd || ""));

  let html = paragraphize(compiled);

  const sigHtml = buildSignatureHtml(signature);
  html = html.replace(
    /<p[^>]*>\{\{signature\}\}<\/p>/,
    sigHtml
  );
  // Fallback in case the token ended up elsewhere (e.g. template edited
  // without the double-newline spacing the paragraphizer expects).
  html = html.replace(/\{\{signature\}\}/g, sigHtml);

  return html;
}
