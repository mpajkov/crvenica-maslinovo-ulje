# Crvenica

**A fast, bilingual (Croatian / English) one-page shop for a family olive-oil farm in Istria**, with an order form that adds up the invoice as you type, automatic price-per-litre and savings, a harvest calendar and lab results shown as bars.

[**Demo (concept)**](https://mpajkov.github.io/crvenica-maslinovo-ulje/) · [Hrvatski opis](README.hr.md) · Built by [mpajkov](https://github.com/mpajkov)

![Crvenica on desktop and phone](docs/screenshots/overview.jpg)

> **Concept project.** The brand, the family, the contact details, the OPG/OIB numbers and the lab values are made up, so the page is a complete example of what a small producer's site can look like. No framework, no build step, no tracking, no cookies: plain HTML, CSS and JavaScript that the owner can edit in any text editor and host anywhere for free.

---

## What the visitor gets

- **One calm page** that explains the oil the way a producer would: who makes it, how it tastes, what the lab report says, how the year in the grove goes, what it costs and how to get it.
- **Croatian or English in one click.** The choice is remembered, and links like `?lang=en` work for sharing with customers abroad.
- **Clear prices.** Three packages with the price per litre, the saving against buying small bottles and the delivery rule worked out automatically.
- **An order form that feels like an invoice.** Pick a package (or just ask a question), set the quantity, choose delivery or pickup and watch the total, including free delivery over the threshold, update live.
- A site that is **comfortable on every screen**: phone, tablet, laptop and wide monitors.

![Pricing and lab results](docs/screenshots/pricing-desktop.jpg)

## What the owner gets

- **One settings block** (`script.js`, PART 1) for email, phone, WhatsApp number, form key, harvest year, delivery price, free-delivery threshold, farm coordinates and site address. Every value is written to all the places on the page that show it.
- **Prices in one place.** A package is defined by `data-price` and `data-liters` on its card. Price per litre, savings, delivery text, the choices in the form, the order summary and the Google product data are all calculated from those two numbers.
- Orders arrive **by email**, always in Croatian for the owner, with a note when the customer wrote in English, and "Reply" goes straight to the customer. Free for roughly 250 messages a month via [Web3Forms](https://web3forms.com). Until a key is entered, the customer's own email app opens with the message ready, so no order is ever lost.
- **Spam protection without CAPTCHAs**: a hidden trap field, a timing check and a short cool-down, so customers are never asked to click traffic lights.
- **Careful product wording** that avoids claims a small producer may not make without certification (see "Before going live").
- **Zero running costs**: static files on GitHub Pages, Netlify, Cloudflare Pages or any ordinary web host.

| Lab results, taste and varieties | The order form |
|---|---|
| ![Oil section](docs/screenshots/oil-desktop.jpg) | ![Order form](docs/screenshots/order-desktop.jpg) |

---

## Quality checks

Every claim below was measured on this code with an automated Playwright/Chromium test harness, except the Lighthouse and Speed rows, which were measured on the demo site.

| Area | Result |
|---|---|
| **Lighthouse** (Lighthouse 12.8.2, default mobile simulation, demo site, median of 3 runs, 23 Oct 2026) | Performance 98, Accessibility 100, Best practices 100, SEO 66. SEO is lower only because this demo copy deliberately carries `noindex` |
| **Speed** (Lighthouse 12.8.2 default mobile simulation: 4x CPU slowdown, 1.6 Mbit/s, 150 ms latency; median of 3, 23 Oct 2026) | First paint about 1.6 s, largest paint about 1.9 s, layout shift about 0.02, blocking time about 6 ms |
| **Weight** | 179 KB in 11 requests (HTML 19, CSS 16, JS 15, images 43, fonts 86 KB) |
| **Responsive** | No sideways scrolling and nothing outside the screen at 320, 375, 414, 768, 1024, 1440 and 1920 px, in both languages; layouts reviewed on phone, tablet and desktop |
| **Accessibility** | Skip link, visible focus, full keyboard use of the menu and the form (Esc closes the phone menu, focus is managed), screen-reader labels, errors linked to their fields, live announcement of the order total, text contrast 4.5:1 or better (also measured on textured backgrounds), tap targets at least 24 px, reduced-motion support |
| **Security** | Strict Content-Security-Policy (scripts, styles, fonts and images only from the site itself, forms may only post to Web3Forms, no `eval`), no third-party scripts or fonts, no `innerHTML` anywhere in the script, translations parsed through an allow-list, input trimming and control-character stripping, extra response headers in `_headers` |
| **Privacy** | No analytics, no cookies, no Google Fonts. The only thing stored in the browser is the language choice |
| **Behaviour** | 155 automated checks pass: language switching, menu, price and summary maths, validation, sending with success, server error and network error, spam guards, FAQ, harvest calendar, structured data, CSP enforcement, 404 page |
| **Errors** | No console errors and no CSP violations on any viewport or language |

---

## Project structure

```
index.html                 the whole page (Croatian text + English translation in data-en)
style.css                  all styling, split into PART 1-16 (table of contents at the top)
script.js                  all behaviour, PART 1-13 (PART 1 = SETTINGS, the part you edit)
404.html                   friendly "page not found" (also translated)
assets/
  fonts/                   Young Serif, Instrument Sans, Instrument Serif (WOFF2, self-hosted) + licences
  img/                     illustrations: landscape, 1 L bottle, 5 L tin, four tins, olive branch (SVG)
  favicon.svg, apple-touch-icon.png, og-image.jpg
docs/screenshots/          pictures used in this README
tools/make-grain.mjs       optional helper that regenerates the paper-grain texture (the site needs no build)
_headers                   security and caching headers for Netlify / Cloudflare Pages
sitemap.xml, robots.txt    search engine files
```

Open `index.html` by double-clicking it: everything works offline too, apart from sending the form.

## Everyday edits

**Settings.** Open `script.js` and change the values in `SETTINGS` (PART 1). Every line has a comment, and `PROMIJENI` ("change this") marks every example text in `index.html`.

**Prices and packages.** Change `data-price` and `data-liters` on the package card in `index.html`:

```html
<article class="package" data-package="5l" data-price="90" data-liters="5">
```

To add a package, copy a whole `<article class="package">` and change its data and texts.

**Receiving orders by email.** Create a free access key at [web3forms.com](https://web3forms.com) (enter the owner's email, the key arrives by mail) and paste it into `web3formsKey`. The key is meant to be public.

**Texts and translation.** Croatian is written normally in the HTML, the English version sits in a `data-en` attribute on the same element:

```html
<p data-en="Hello">Bok</p>
```

Use `data-en-html` when the text contains tags such as `<em>` or `<sub>`, and `data-en-alt`, `data-en-placeholder`, `data-en-aria-label`, `data-en-content` for attributes. Texts written by JavaScript (form messages, "per litre") are in `TEXTS` (PART 2 of `script.js`). A missing translation simply stays in Croatian.

**Lab values.** The acidity, peroxide value, polyphenols, taste scores and variety shares are examples. Enter the numbers from your own lab report; the bars draw themselves from `style="--value: ..."`.

**Colours and fonts.** Everything is a variable in `style.css`, PART 2.

**New section.** Copy the template at the bottom of `<main>` (search for `PREDLOŽAK ZA NOVU SEKCIJU`), add a link to the menu, a new PART in the stylesheet before PART 16 and, only if it needs behaviour, a function in `script.js`.

## Publishing

The simplest route is GitHub Pages: *Settings, Pages, Deploy from a branch, `main` / root*. Dragging the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) works too, as does any other host: upload everything and keep the folder structure.

When the site moves to its own domain, replace `https://mpajkov.github.io/crvenica-maslinovo-ulje/` in `index.html` (canonical, `og:url`, `og:image`), `404.html`, `sitemap.xml`, `robots.txt` and `siteUrl` in `script.js` (a search for that text finds every place).

**This public copy is a demo**, so it carries `<meta name="robots" content="noindex">` and a demo line in the footer. For a real launch, delete both (they are marked in the HTML), then fill in the real farm details in the footer: OPG, OIB and MIBPG are required when selling online.

**Headers.** GitHub Pages cannot set HTTP headers, so each page carries its Content-Security-Policy as a `<meta>` tag. On Netlify or Cloudflare Pages the included `_headers` file additionally adds clickjacking protection, HSTS and cache rules. `style-src-attr 'unsafe-inline'` is there only for the small `style="--value: 7"` values that draw the bars; stylesheets themselves can only come from the site.

## Before going live (EU rules for olive-oil sellers)

- **"Organic", "bio"** may only appear with a certificate (EU Regulation 2018/848). The page says "no spraying" and explains in the FAQ that there is no certificate.
- **"First cold pressing"** may only be used for oil obtained below 27 °C by a first mechanical pressing on a traditional hydraulic press, and **"cold extraction"** only for oil obtained below 27 °C by percolation or centrifugation (Delegated Regulation (EU) 2022/2104, Article 10(a) and (b)). Most modern mills use a centrifuge, in which case the page should say "cold extraction", not "cold pressed".
- **Health claims** about polyphenols need the lab result that proves them (EU Regulation 432/2012), so the page makes none.
- The "10 times best olive-growing region" line refers to Istria as a region (Flos Olei guide) and links to its source. Update the number when a new edition comes out.

---

## Credits and rights

- Fonts: Young Serif, Instrument Sans and Instrument Serif, SIL Open Font License 1.1, bundled in `assets/fonts` together with their licences.
- Illustrations were made for this project.
- The brand "Crvenica", the family, the contact details and all figures are fictional.
- Source code: &copy; 2026 mpajkov, all rights reserved. It is published so that prospective clients can review the quality of the work; please ask before reusing it.

Would you like a site like this for your farm, shop or business? Get in touch via [github.com/mpajkov](https://github.com/mpajkov).
