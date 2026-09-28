/* 123.Cash site configuration — edit these values, no build step needed. */
window.SITE_CONFIG = {
  siteName: "123.Cash",
  interestUrl: "https://web.works/contact",

  /* Google AdSense: replace with your publisher ID (ca-pub-XXXXXXXXXXXXXXXX).
     While empty, ad slots render as labelled placeholders. Also update /ads.txt. */
  adsenseClient: "",
  adSlots: { top: "", inContent: "", sidebar: "", footer: "" },

  /* Google Analytics 4 measurement ID (G-XXXXXXX). Optional. */
  ga4: "",

  /* YouTube: channel URL + video IDs to feature. Leave ids empty to show topic cards
     that open YouTube search results (always valid links). */
  youtubeChannel: "https://www.youtube.com/results?search_query=personal+finance+for+beginners",
  videos: [
    { id: "", title: "Budgeting in 3 steps: the 50/30/20 method", q: "50 30 20 budget explained" },
    { id: "", title: "How compound interest really works", q: "compound interest explained" },
    { id: "", title: "10 legit side hustles you can start this week", q: "legit side hustles beginners" },
    { id: "", title: "Debt avalanche vs snowball — which wins?", q: "debt avalanche vs snowball" },
    { id: "", title: "How to build an emergency fund fast", q: "how to build an emergency fund" },
    { id: "", title: "Credit scores explained in 5 minutes", q: "credit score explained" }
  ],

  /* Donations: paste hosted payment links (all free to create, no email exposed).
     Stripe Payment Link, PayPal hosted button URL, Buy Me a Coffee, Ko-fi, GitHub Sponsors. */
  donate: {
    stripe: "",
    paypal: "",
    buymeacoffee: "",
    kofi: "",
    githubSponsors: "",
    goal: 5000, raised: 0
  },

  /* Next contest close date (ISO). */
  contestEnds: "2026-12-31T23:59:59"
};
