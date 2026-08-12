# Resend setup — email delivery for feedback

Walk-through for wiring up [Resend](https://resend.com) as the destination for unknown-question feedback (the `[[UNKNOWN]]` sentinel path). Written so a new user can go from zero to receiving real emails without touching the code.

Assumes `STORAGE_BACKEND=static-webhook` and `FEEDBACK_MODE=email` in your env. If those aren't set, see [reboot.md](reboot.md) and the env docs.

---

## 0. Two tiers of setup

You'll pick one:

- **Quick test tier** — use Resend's shared sender (`onboarding@resend.dev`). No DNS, no verification. Emails arrive but from a shared address; some inboxes may flag them. Fine for confirming the wiring works. Skip straight to [§2](#2-generate-an-api-key), then [§4](#4-configure-env-vars), then [§5](#5-send-a-test).
- **Real tier** — verify one of your own domains as a sender. Requires 3-4 DNS records. Emails arrive from your address (e.g. `tutor@teaching.andrewatkinson.net`), land cleanly in inboxes, and look professional. Do §1 through §5 in order.

You can always upgrade later — the quick tier keeps working after you add your domain.

---

## 1. Sign up

[resend.com](https://resend.com) → **Sign up**. GitHub OAuth is fastest; email works too.

Free tier at time of writing: **3,000 emails per month, 100 per day**. For unknown-question capture that's effectively unlimited.

Once signed in, you land on the **Overview** page.

---

## 2. Generate an API key

Dashboard → **API Keys** (left sidebar) → **Create API Key**.

- **Name**: `tutorgen-hosted` (or whatever helps you remember which project uses it).
- **Permission**: **Sending access** (write-only) — the app never needs to read past sends.
- **Domain**: `All domains` is fine; scoping only matters if you have multiple.

Click **Add**. Resend shows the key **once** — starts with `re_...`. Copy it now; you can't retrieve it later, only rotate.

You'll paste this into `RESEND_API_KEY` in [§4](#4-configure-env-vars).

---

## 3. Verify a sending domain (real tier only)

Dashboard → **Domains** → **Add Domain**.

### Which domain to add

Two approaches:

- **Subdomain (recommended)**: `send.andrewatkinson.net`, `mail.andrewatkinson.net`, or similar. Keeps app mail isolated from your personal email, and DNS changes don't affect the root domain.
- **Root domain**: `andrewatkinson.net`. Simpler naming. But if you already have an SPF record on the root for your personal email, you'll need to merge them (only one SPF record per domain is valid).

For TutorGen, use a subdomain. Enter `send.andrewatkinson.net` (or your equivalent) and pick a region (US is default; pick the one closer to your users).

### Add the DNS records

Resend shows you 3 records to add at your DNS provider. Shape is roughly:

| Type | Name (host) | Value |
| --- | --- | --- |
| `MX` | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority `10`) |
| `TXT` | `send` | `v=spf1 include:amazonses.com ~all` |
| `TXT` | `resend._domainkey.send` | *long DKIM key Resend generates for you* |

**Exact values come from Resend's dashboard** — copy what it shows you, not what's above (region and DKIM key differ per account).

**Where to add them**: whichever DNS provider hosts `andrewatkinson.net`. Same UI you used earlier for the `teaching.andrewatkinson.net` CNAME. If your host uses the `send` label convention (most do), you enter just `send`, `resend._domainkey.send`, etc. — the UI auto-appends the zone.

### Wait for propagation

Records typically go live in 2-10 min. Check from your terminal:

```bash
dig TXT send.andrewatkinson.net +short
dig TXT resend._domainkey.send.andrewatkinson.net +short
dig MX  send.andrewatkinson.net +short
```

All three should return the values you entered. If any come back empty, wait longer — DNS TTLs can push propagation to 30 min occasionally.

Once they resolve, back in Resend → your domain row → **Verify DNS Records**. Status should flip to **Verified** within a few seconds. If it stalls, hit the button again in 5 min.

### Optional: DMARC

Not required for sending, but recommended for deliverability. Add a TXT record at `_dmarc.send.andrewatkinson.net`:

```
v=DMARC1; p=none; rua=mailto:you@example.com
```

`p=none` means "monitor only; don't reject anything." Upgrade to `p=quarantine` later if you want stricter enforcement.

---

## 4. Configure env vars

Three vars matter for email delivery. Paste them wherever they need to go:

**Local development (`.env` in project root):**

```
STORAGE_BACKEND=static-webhook
FEEDBACK_MODE=email
RESEND_API_KEY=re_...       # from §2
FEEDBACK_EMAIL_TO=you@yourdomain.com
FEEDBACK_EMAIL_FROM=tutor@send.andrewatkinson.net    # or onboarding@resend.dev for quick tier
```

Restart `pnpm dev` after editing (the storage adapter caches at module load).

**Hosted (Netlify):**

Netlify site settings → **Environment variables** → add each of the five above. Trigger a redeploy for them to take effect.

`FEEDBACK_EMAIL_FROM` rules:
- Quick tier: use `onboarding@resend.dev` verbatim. No local-part changes.
- Real tier: any address at your verified domain, e.g. `tutor@send.andrewatkinson.net`. Local-part is arbitrary — Resend accepts anything at a verified domain.

---

## 5. Send a test

**Direct curl** (skips the app, isolates whether Resend itself is working):

```bash
curl -sS -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "you@yourdomain.com",
    "subject": "Resend test",
    "text": "Hello from the terminal."
  }'
```

Response should be a JSON object with an `id` field (email queued). Check your inbox in <30 s.

If that works, **through the app**:

1. `pnpm dev` (or visit the hosted URL).
2. Ask an out-of-scope question — the classic is `What's the capital of France?`.
3. The chat should show the refusal answer *and* your inbox should get an email within a few seconds with subject `[TutorGen] unknown — creative-coding-101`.

If the chat works but no email arrives, see the troubleshooting section.

---

## 6. Troubleshooting

**Email never arrives.**

Check in order:
1. Is `FEEDBACK_MODE=email` actually set? `env | grep FEEDBACK_MODE` locally; check Netlify env vars for hosted. Case matters.
2. Did you restart `pnpm dev` after the env change? The adapter caches at module load.
3. Are all three of `RESEND_API_KEY`, `FEEDBACK_EMAIL_TO`, `FEEDBACK_EMAIL_FROM` set? Missing any one → silent drop.
4. Does the direct curl in §5 work? If no, the Resend API key is bad or the account is throttled.
5. On the real tier, is your domain **Verified** in the Resend dashboard? Sending from an unverified domain fails silently on our end (the adapter swallows errors so chat never breaks).

**Email arrives from `onboarding@resend.dev` even after adding my domain.**

`FEEDBACK_EMAIL_FROM` in your env is still `onboarding@resend.dev`. Update it to your verified-domain address and restart / redeploy.

**Email lands in spam.**

Real tier only:
- Confirm DKIM DNS record propagated — `dig TXT resend._domainkey.send.andrewatkinson.net +short` should show the long key.
- Add a DMARC record (see §3 optional).
- Warm the domain slowly at first (don't send 100 emails in one hour to fresh inboxes).

**"Domain not found" or similar in Resend's dashboard.**

DNS propagation isn't done. Wait 10 more min and retry the **Verify DNS Records** button. If still failing after an hour, one of the records is off by a character — recheck against what Resend showed you.

**I need to rotate the API key.**

Resend dashboard → API Keys → your key → **Revoke**. Create a new one. Update `RESEND_API_KEY` locally and on Netlify. Redeploy.

---

## What this doc doesn't cover

- **Multiple recipients.** `FEEDBACK_EMAIL_TO` currently takes one address. Cc/Bcc would need an adapter change.
- **HTML formatting.** Adapter sends `text` only; upgrade to `html` in `src/lib/server/storage/static-webhook.ts` if you want links/formatting.
- **Reply-to.** Add `reply_to` to the Resend payload if you want replies to go somewhere other than the from address.

Small changes to make; not scoped here.
