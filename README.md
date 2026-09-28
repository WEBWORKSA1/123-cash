# 123.Cash — Money made as simple as 1-2-3

Static, GitHub Pages–ready personal-finance toolkit and lead-generation website for the domain **123.Cash**.

- 29 pages · 8 live calculators · 4-step lead funnel · 6 guides · video library
- Monetisation: Google AdSense slots (consent-gated), lead gen, sponsorships, affiliates, donations, YouTube
- Community: monthly contests with referral links, careers/talent pool, partner program
- Legal: privacy, terms, disclaimers, cookies, trademark & copyright notice
- No frameworks, no server — GitHub Pages builds the shared layout (Jekyll) automatically on every push

## Structure
```
_layouts/default.html  shared <head>, top interest bar, header, footer, disclosures, popup, cookie bar
*.html                 pages = front matter (title, description, canonical, schema) + page body
assets/css/            style.css (light/dark design system)
assets/js/config.js    ← edit this: AdSense ID, GA4, YouTube IDs, donation links, contest date
assets/js/main.js      forms, lead funnel, calculators, ads, consent, video, countdown
docs/                  STRATEGY.md (concept + 35-site benchmark), BUILD-PROMPT.md (phase-wise prompt)
```

## Add a page
Copy any page (e.g. `guide-debt-payoff.html`), change the front matter and body, link it from `guides.html`, add it to `sitemap.xml`, push. GitHub Pages rebuilds in ~1 minute.

## Publishing
GitHub Pages serves the **`gh-pages`** branch (root). Work on `main`, then merge `main` → `gh-pages` (pull request) to publish.
Live URL: https://webworksa1.github.io/123-cash/

## Forms
All forms send to one private inbox through [FormSubmit](https://formsubmit.co) (free). The address is never written in the HTML; it is assembled in JS at send time.
**First submission** triggers a one-time activation email from FormSubmit to the inbox — click "Activate" once and all forms go live.

## Go-live checklist
1. **AdSense** — after approval put `ca-pub-…` in `assets/js/config.js` (`adsenseClient`, `adSlots`) and in `ads.txt`.
2. **Donations** — paste Stripe Payment Link / PayPal / Buy Me a Coffee / Ko-fi URLs into `config.js → donate`.
3. **YouTube** — add video IDs to `config.js → videos` and your channel URL to `youtubeChannel`.
4. **Custom domain** — add a `CNAME` file containing `123.cash`, point DNS A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, then enable *Enforce HTTPS* in Settings → Pages.
5. Have the legal pages and contest rules reviewed by a lawyer for your jurisdictions.

## Trademark notice
"123.Cash" is used solely as the name of this website/domain. It is not affiliated with any company, lender, app or product using "123Cash", "123 Cash", "Cash App" or similar names. Interested in this domain/website, sponsorship, advertising or partnership? → https://web.works/contact
