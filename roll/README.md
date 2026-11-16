# 233 Squadron Wednesday Roll — setup required

This is a **prototype**, not yet approved for real cadet records.

- Cadet page: `/roll/` — rank, name, flight, sign-in only.
- Staff page: `/roll/staff/` — Supabase Auth sign-in, counters, roll, staff absence entry and CSV export.
- Central storage: Supabase Postgres with row-level security. The public cannot query attendance records.
- Configuration: fill in `roll/config.js` with the Supabase **project URL** and **publishable/anon** key only. Never use a service-role key in client files.
- Database: run `roll/schema.sql` in Supabase SQL Editor.
- Staff: create individual staff accounts in Supabase Authentication and insert approved auth user UUIDs into `public.staff_users`. Disable public account signups.
- Hosting: configure GitHub Pages for this repository (Settings → Pages → Deploy from branch → main/root). A GitHub repository link is not itself a hosted web form.

**Security and operational limitations:** Public submissions are not identity verified, can be spoofed/spammed and can contain duplicate names. A successful submission does not prove physical attendance. Do not put real cadet data into the prototype until the Squadron approves the platform, privacy/retention, data region, controls, and official reconciliation process. Before production, implement abuse prevention (e.g. a server-side endpoint with CAPTCHA and rate limiting), verified nominal-roll matching, and a staff review process. Staff pages are publicly reachable URLs but the underlying data is restricted by database row-level security. Supabase Auth password sessions are used; consider organisational SSO/MFA where available. Staff entries and exports are personal information and must be handled accordingly. Do not use Netlify Forms.
