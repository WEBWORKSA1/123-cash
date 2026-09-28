# 123.Cash — Phase-wise Build Prompt

Use these prompts in order with any capable AI coding assistant (this repo is the output of Phases 1–8). Each phase is self-contained; paste the **Global rules** block with every phase.

---

## Global rules (paste with every phase)

```
Project: 123.Cash — "Money made as simple as 1-2-3". Personal-finance toolkit + lead-generation hub.
Hosting: GitHub Pages free plan → static only (HTML/CSS/vanilla JS). No server code, no build step required to deploy.
Use relative links only (site must work at https://<user>.github.io/123-cash/ and at https://123.cash/).
Top of EVERY page: a bar reading "Contact, if you are interested in this website / domain name / Sponsorship /
Advertisement / Partnership" linking to https://web.works/contact (new tab).
Contact email: one private inbox only. It must NEVER appear in page text or HTML. Assemble it in JS at send time
(obfuscated), post forms via FormSubmit AJAX, and use JS-built mailto on click for "Email us" links.
Brand: "123.Cash" only. Never style or use "123Cash", "Cash App" or any third-party mark. Include a non-affiliation
trademark & copyright notice in the footer and on a dedicated legal page.
Design: modern fintech — green→gold gradient, Inter font, cards, rounded 16px, dark mode, mobile-first,
WCAG AA contrast, skip link, labelled inputs, aria-live form messages, reduced-motion support.
Performance: no frameworks, lazy/click-to-load video, ads loaded only after consent.
```

---

## Phase 1 — Strategy & information architecture
```
Define the site map and page purposes for 123.Cash:
Home, Tools (8 calculators), Earn, Save, Borrow (+debt), Invest, Guides hub + articles, Videos,
Get Started (lead funnel), Contests, Support/Donate, Careers, Advertise, Partners, About, Contact, FAQ,
Privacy, Terms, Disclaimers, Trademark & Copyright, Cookies, 404.
For each page list: primary user intent, primary CTA, secondary CTA, ad slots, schema type.
Output a flat file structure (no sub-folders for pages) plus /assets/{css,js,img}.
```

## Phase 2 — Design system & layout shell
```
Create assets/css/style.css with CSS variables (light + dark via prefers-color-scheme and data-theme),
container, grid utilities (g2/g3/g4), cards, buttons (primary/accent/ghost), forms, badges, tables,
hero with gradient glow, CTA band, footer, cookie bar, modal, toast, sticky mobile CTA, ad-slot placeholder.
Create a shared layout (_layouts/default.html, rendered free by GitHub Pages/Jekyll) that wraps each page body:
<head> SEO (title, description, canonical, OG/Twitter, JSON-LD WebSite+Organization), top interest bar,
sticky header with nav + "Free Cash Plan" button + theme toggle, footer with 4 link columns, newsletter
form, disclosures, trademark notice, lead popup, cookie consent, scripts. Pages carry front matter (full_title, description, canonical, robots, ld). Also create sitemap.xml.
```

## Phase 3 — Money tools (traffic engine)
```
Build tools.html with tabbed calculators (tabs deep-linkable via #hash):
loan payment (amortised), compound interest (monthly deposits), savings goal (with APY),
debt payoff (months + total interest, guard when payment ≤ interest), 50/30/20 budget,
side-hustle net income (costs + tax set-aside), inflation (real value), FIRE number (withdrawal rate).
All compute live on input, run 100% client-side, and each links to the lead funnel with a pre-selected goal.
```

## Phase 4 — Lead generation (primary revenue)
```
Build a 4-step lead funnel (one per page) with progress bar and auto-advance on choice:
1 goal (6 options), 2 amount band, 3 timeline + self-rated credit + country, 4 name/email/phone + explicit
consent checkbox (partners may contact; consent not a condition of purchase; links to Privacy/Terms).
Support ?goal= pre-selection. Place it in the home hero and on get-started.html with trust copy
("no credit check", "never sold", 60 seconds). Add: inline lead block on content pages, exit-intent +
45-second popup (once per 7 days), sticky mobile CTA, footer newsletter. Honeypot on every form.
All forms POST JSON to FormSubmit AJAX using the obfuscated inbox; fallback opens a JS-built mailto.
Fire a GA4 "generate_lead" event on success.
```

## Phase 5 — Content hubs, guides & video
```
Write hub pages (Earn, Save, Borrow, Invest) with 6–9 idea cards, a comparison table or checklist,
two ad slots and an inline lead block. Write 6+ original, numbers-first guides (emergency fund,
side hustles ranked, personal loans APR, avalanche vs snowball, 50/30/20, investing basics) with
Article schema, breadcrumbs, in-content ad after the intro, related guides and a plan CTA.
Guides hub with client-side search (?q= supported). Video library rendered from config.js:
click-to-load youtube-nocookie embeds when an ID exists, otherwise open a YouTube search for the topic.
Creator video-submission form.
```

## Phase 6 — Monetisation & community
```
AdSense: config-driven publisher ID + slot IDs; load script only after cookie consent; placeholders otherwise;
ads.txt template. GA4 optional. Donations page: tier buttons, custom amount, frequency, allocation
(operations / marketing / hiring / prizes), progress meter, perks, pledge form, and config-driven hosted
payment buttons (Stripe Payment Link, PayPal, Buy Me a Coffee, Ko-fi, GitHub Sponsors) — none expose email.
Contests: countdown, prizes, entry form, 18+ checkbox, referral link (+1 entry) with copy button,
judging criteria, official-rules summary (no purchase necessary, skill-testing question for Canada,
Québec Régie clause, void where prohibited). Careers: role cards + application form. Advertise: media kit
cards + sponsorship inquiry. Partners: program types + application form.
```

## Phase 7 — Trust, legal & compliance
```
Pages: About (principles, editorial standards, how we make money), FAQ (FAQPage schema), Privacy
(GDPR/CCPA/PIPEDA/Québec Law 25/India DPDP rights, Google advertising cookie disclosure and opt-out links),
Terms, Disclaimers (financial, advertiser/affiliate, earnings, lead-gen), Trademark & Copyright
(non-affiliation with any "123Cash"/"Cash App" marks, copyright, user submissions, takedown process),
Cookies (table + reset button). Footer disclosure + trademark notice on every page.
```

## Phase 8 — QA, deploy & publish
```
Automated checks: every internal link resolves; top bar present on every page; the private inbox string
does not appear in any HTML/JS source; no JS errors; no horizontal overflow at 375px and 1280px;
calculators return correct values (e.g. $10,000 @ 11.5% / 3 yrs = $329.76/mo).
Deploy: push to GitHub repo; shared layout lives in _layouts/default.html (GitHub Pages runs Jekyll for free); publish from the gh-pages branch (root).
Custom domain: add CNAME file "123.cash" and DNS (A records 185.199.108-111.153, or ALIAS/ANAME) — then
enable "Enforce HTTPS".
```

## Phase 9 — Growth roadmap (post-launch)
```
- Apply for AdSense after ~20–30 quality pages; then paste publisher ID into config.js + ads.txt.
- Add 2 guides/week; convert each into a YouTube long-form + 3 Shorts.
- Plug in lead buyers (webhook via Zapier/Make from the FormSubmit inbox) and affiliate comparison tables.
- Localised hubs (/ca, /in, /uk) for country-specific loan & savings content.
- Embeddable calculator widgets for backlinks.
- A/B test funnel headline and step order; target ≥ 8% visitor-to-lead on get-started.html.
```
