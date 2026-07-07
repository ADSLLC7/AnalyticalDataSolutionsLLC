# ADS Recruiter Portal — User Guide

A quick reference for using the JD Routing dashboard at
`https://analyticaldatasolution.com/dashboard`. No installation needed —
it runs in your browser.

---

## 1. Signing in

You don't need a password. Sign-in is a one-time code sent to your inbox:

1. Go to `analyticaldatasolution.com/dashboard` (it redirects you to `/login`
   if you're not signed in yet).
2. Enter your **ADS work email** and click **Email me a sign-in code**.
3. Check your inbox for a 6-digit code — it's valid for **10 minutes**.
4. Enter the code and click **Verify and sign in**.

You're now on the dashboard, which has three panels side by side:
**Job Description & Outreach** (left), **CC Routing** (middle), and
**Configuration** (right).

Only six ADS email addresses are allowlisted for the portal. If your email
isn't recognized, contact your admin — new recruiters are added on the
backend, not self-service.

---

## 2. One-time setup: your identity and signature

Before sending anything, check the **Configuration** panel on the right:

1. Under **Recruiter Identity**, confirm your **Full Name**, **Title/Role**,
   **Phone**, and **Email** are correct, then click **Save Identity**.
2. The **Email Signature Preview** below it updates live — this is exactly
   what gets appended to every email you send, including the ADS logo,
   your contact details, and the confidentiality disclaimer.
3. If anything is wrong (wrong title, missing WhatsApp number, etc.), fix
   it here rather than editing it per-email — it's used automatically on
   every send.

You only need to do this once, unless your title or contact info changes.

---

## 3. Setting up your CC routing rules (also one-time, then occasional)

The middle **CC Routing** panel is how the portal knows which consultant's
email to CC when a job description matches their tech stack. You manage
your own rules — there's no shared table to keep in sync with anyone else.

**To add a rule:**

1. Scroll to the bottom of the CC Routing panel.
2. Fill in:
   - **Consultant name** (optional, but makes the rule easier to recognize later)
   - **Tech stack** — comma-separated keywords that should trigger this rule,
     e.g. `.net, c#, blazor` or `salesforce, apex`
   - **CC email** — the consultant's email address
   - **Resume: Drive link or file ID** (optional) — paste the consultant's
     resume **file** share link from Google Drive (not a folder link —
     folder links are rejected, since the automation needs a single file).
3. Click **Save**.

**To edit or remove a rule**, use the pencil or trash icon on the rule's
card. Each saved rule also has a small "add person" icon — click it any
time to add that consultant's email to CC immediately, independent of
whatever JD is loaded.

---

## 4. Sending an outreach email (the day-to-day flow)

This is the core loop you'll repeat for every job description:

1. **Paste the job description** into the **Job Description** box in the
   left panel.
2. Choose **Submit Consultant** or **Inquiry Only** at the top of the panel,
   depending on what you're sending.
3. Click **Extract Fields**. The portal will:
   - Detect the role/title from the JD text
   - Try to pull the hiring contact's **name** and **email** out of the JD
     text (you can always fill these in yourself if it misses)
   - Match your CC Routing rules against the JD and auto-fill the first
     match into **Auto-detected CC**
   - Build the full outreach message using your saved template and your
     signature
4. **Check the Recruiter Details** section — Name, Email, Role/Company, and
   Subject Line. Fill in anything that wasn't auto-detected.
5. Add any extra CC recipients manually if needed, using **Add CC Recipient**.
6. Click **Preview** to see exactly what the recipient will receive
   (rendered HTML, including your signature and logo) before it goes out.
   You can send directly from the preview with **Send Now**, or close it
   and use the **Send** button in the main panel.
7. Click **Send**.

**What happens after you click Send:** the form clears immediately so you
can paste the next job description right away — you do **not** need to
wait for the email to actually go out. Sending happens in the background
(the automation downloads the consultant's resume, personalizes it, and
sends the email, which can take 10–20 seconds). While a send is still in
progress, you'll see a small **"N sends in progress…"** indicator near the
bottom of the panel — this is just informational and never blocks you from
sending the next one.

If a send fails (bad webhook, network issue, etc.), you'll see a red error
message with the recipient's address — nothing else is affected, and you
can retry.

---

## 5. Message templates

Click **Message Templates** in the Configuration panel to view or edit the
**Submit Consultant** and **Inquiry Only** templates. These support
placeholders that get filled in automatically:

| Placeholder | Filled with |
|---|---|
| `{{recruiterName}}` | The hiring contact's name (or "Hiring Manager" if not detected) |
| `{{role}}` | The detected job title |
| `{{jd}}` | The full job description text |
| `{{signature}}` | Your saved signature block (name, title, contact info, logo) |

Edit the template text around these placeholders to change tone or wording
— the placeholders themselves should stay as-is.

---

## 6. Checking what you've sent

Click **History** (top of the Job Description panel) to see your last 20
sent emails — subject, role, recipient, and how long ago. This is stored
on the server against your account, so it's the same list no matter which
computer or browser you sign in from.

The **Session Stats** card in the CC Routing panel shows a running count
of emails sent and the last recipient for your current session.

---

## Quick troubleshooting

- **"No webhook URL configured for this recruiter"** — contact your admin;
  this is set up per recruiter on the backend.
- **CC email didn't auto-fill** — the JD text probably didn't match any of
  your saved keywords. Use **Populate CC from JD** to re-run the match on
  demand, or check your rule's keywords for typos.
- **Drive link rejected** — you pasted a folder link. Open the resume file
  itself in Drive, click Share, and use that file's link instead.
- **Signature looks wrong** — check **Recruiter Identity** in Configuration
  and click **Save Identity** again.
