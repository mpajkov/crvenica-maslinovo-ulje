/* ==========================================================================
   script.js · CRVENICA
   Sve ponašanje stranice. Datoteka je podijeljena u dijelove (PART):

   PART 1   SETTINGS: email, telefon, ključ za formu, godina berbe, dostava  <- OVDJE MIJENJAŠ PODATKE
   PART 2   TEXTS: poruke koje piše JavaScript (na hrvatskom i engleskom)
   PART 3   Pomoćne funkcije
   PART 4   Jezik (prebacivanje HR / EN)
   PART 5   Upisivanje podataka iz SETTINGS u stranicu
   PART 6   Zaglavlje i izbornik na mobitelu
   PART 7   Označavanje aktivne sekcije u izborniku
   PART 8   Cijenik (cijena po litri, ušteda, dostava, gumbi Naruči)
   PART 9   Forma za narudžbu (izbor paketa, količina, sažetak)
   PART 10  Slanje forme (provjera polja, Web3Forms ili email program)
   PART 11  Animacije traka i kalendar berbe
   PART 12  Podaci za Google (cijene u rezultatima pretrage)
   PART 13  START: popis funkcija koje se pokreću

   KAKO DODATI NOVO PONAŠANJE (npr. za novu sekciju)
   1. Napiši novu funkciju, npr. function setupGalerija() { ... }, kao novi PART prije PART 13.
   2. Dodaj njeno ime u listu SETUP u PART 13.
   Svaka funkcija se pokreće zasebno: ako jedna ima grešku, ostale i dalje rade.
   ========================================================================== */

"use strict"; // stroži način rada: preglednik javlja greške koje bi inače prešutio


/* ==========================================================================
   PART 1 · SETTINGS
   Podaci koji se ponavljaju na više mjesta na stranici. Promijeni ih SAMO ovdje.
   ========================================================================== */

const SETTINGS = {
  brandName: "Crvenica",                 // PROMIJENI: ime brenda (koristi se u emailovima i za Google)
  email: "info@crvenica.hr",             // PROMIJENI: email na koji stižu narudžbe i poruke
  phone: "+385 91 234 5678",             // PROMIJENI: broj telefona, točno kako se prikazuje na stranici
  whatsapp: "385912345678",              // PROMIJENI: isti broj za WhatsApp, samo znamenke (bez +, razmaka i nule ispred 91)

  // Ključ za slanje forme. Besplatno ga napraviš na https://web3forms.com (upišeš svoj email i dobiješ ključ).
  // Dok ovdje piše "UPISI_KLJUC", forma posjetitelju otvara email program s pripremljenom porukom.
  web3formsKey: "UPISI_KLJUC",

  harvestYear: 2026,                     // godina berbe ulja koje trenutno prodajete (piše se na više mjesta)
  deliveryPrice: 5,                      // cijena dostave u eurima
  freeDeliveryFrom: 85,                  // od ovog iznosa narudžbe dostava je besplatna (0 = dostava se uvijek plaća)
  maxQuantity: 20,                       // najveća količina jednog paketa koja se može upisati u formi

  // PROMIJENI: koordinate imanja. Na Google kartama desni klik na mjesto -> klik na brojeve -> zalijepi ovdje.
  farmLocation: { lat: 44.9597, lon: 13.8517 },

  defaultLanguage: "hr",                 // jezik kad netko prvi put otvori stranicu ("hr" ili "en")
  autoDetectLanguage: false,             // true = posjetitelj čiji preglednik nije na hrvatskom odmah vidi engleski
  siteUrl: "https://mpajkov.github.io/crvenica-maslinovo-ulje/", // PROMIJENI: adresa stranice kad dobije vlastitu domenu
};


/* ==========================================================================
   PART 2 · TEXTS
   Tekstovi koje stvara JavaScript (poruke forme, cijena po litri...).
   Ostali tekstovi su u index.html (hrvatski u tagu, engleski u data-en).
   {nešto} u vitičastim zagradama zamijeni se pravom vrijednošću, to ne mijenjaj.
   ========================================================================== */

const TEXTS = {
  hr: {
    locale: "hr-HR",                                         // oblik brojeva i datuma (85 €, 17,00 €)
    languageName: "hrvatski",
    menuOpen: "Otvori izbornik",
    menuClose: "Zatvori izbornik",
    perLiter: "{price} po litri",
    saving: "{amount} manje nego {count} × {size}",
    deliveryFree: "Besplatna dostava po Hrvatskoj",
    deliveryPaid: "Dostava {price}, preuzimanje kod nas besplatno",
    questionOption: "Samo pitanje",
    questionNote: "bez narudžbe",
    optional: "(nije obavezno)",
    forCourier: "(za dostavljača)",
    summaryDelivery: "Dostava",
    summaryPickup: "Preuzimanje kod nas",
    free: "besplatno",
    total: "Ukupno",
    sendOrder: "Pošalji narudžbu",
    sendMessage: "Pošalji poruku",
    sending: "Šaljem…",
    successOrder: "Hvala! Narudžba je stigla do nas. Javit ćemo se s potvrdom najkasnije sutra.",
    successMessage: "Hvala! Poruka je stigla do nas. Odgovorit ćemo najkasnije sutra.",
    errorSend: "Poruka nije otišla. Pokušajte ponovno ili nas nazovite na {phone}.",
    wait: "Pričekajte trenutak prije slanja nove poruke.",
    mailtoOpened: "Otvorili smo vaš program za email s pripremljenom porukom. Samo je pošaljite.",
    errName: "Upišite ime i prezime.",
    errEmail: "Upišite ispravnu email adresu.",
    errPhone: "Upišite broj telefona, treba ga dostavljač.",
    errPhoneFormat: "Broj telefona nije ispravan.",
    errAddress: "Upišite adresu za dostavu.",
    errMessage: "Napišite nam pitanje.",
    now: "sada",
    // Tekstovi u emailu koji stiže vama
    mail: {
      subjectOrder: "Narudžba: {qty} × {package}",
      subjectQuestion: "Pitanje s web stranice",
      package: "Paket",
      quantity: "Količina",
      total: "Iznos",
      delivery: "Preuzimanje",
      address: "Adresa",
      name: "Ime",
      email: "Email",
      phone: "Telefon",
      message: "Poruka",
      language: "Jezik posjetitelja",
    },
  },

  en: {
    locale: "en-IE",                                         // engleski s eurom (€85, €17.00)
    languageName: "English",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    perLiter: "{price} per litre",
    saving: "{amount} less than {count} × {size}",
    deliveryFree: "Free delivery within Croatia",
    deliveryPaid: "Delivery {price}, free if you collect",
    questionOption: "Just a question",
    questionNote: "no order",
    optional: "(optional)",
    forCourier: "(for the courier)",
    summaryDelivery: "Delivery",
    summaryPickup: "Collect from us",
    free: "free",
    total: "Total",
    sendOrder: "Send order",
    sendMessage: "Send message",
    sending: "Sending…",
    successOrder: "Thank you! Your order has reached us. We'll confirm by tomorrow at the latest.",
    successMessage: "Thank you! Your message has reached us. We'll reply by tomorrow at the latest.",
    errorSend: "The message didn't go through. Please try again or call us on {phone}.",
    wait: "Please wait a moment before sending another message.",
    mailtoOpened: "We've opened your email app with the message ready. Just press send.",
    errName: "Please enter your full name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please add a phone number for the courier.",
    errPhoneFormat: "That phone number doesn't look right.",
    errAddress: "Please enter the delivery address.",
    errMessage: "Please write your question.",
    now: "now",
    mail: {
      subjectOrder: "Order: {qty} × {package}",
      subjectQuestion: "Question from the website",
      package: "Package",
      quantity: "Quantity",
      total: "Total",
      delivery: "Delivery",
      address: "Address",
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      language: "Visitor language",
    },
  },
};


/* ==========================================================================
   PART 3 · POMOĆNE FUNKCIJE
   Male funkcije koje koriste svi ostali dijelovi.
   ========================================================================== */

// $ vraća prvi element koji odgovara selektoru, $$ vraća sve (kao niz)
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// Trenutni jezik stranice ("hr" ili "en")
let currentLang = SETTINGS.defaultLanguage;

// Postoji li taj jezik u TEXTS? (hasOwn: da adresa poput ?lang=constructor ne pokvari stranicu)
function hasLanguage(lang) {
  return typeof lang === "string" && Object.prototype.hasOwnProperty.call(TEXTS, lang);
}

// Ime događaja koji javlja da je promijenjen jezik (ostali dijelovi ga slušaju)
const LANGUAGE_EVENT = "site:language";

// Vraća tekst iz TEXTS za trenutni jezik i u njega upisuje vrijednosti, npr. t("perLiter", { price: "17 €" })
function t(key, values = {}) {
  const text = TEXTS[currentLang][key] ?? TEXTS.hr[key] ?? key;   // ako nema prijevoda, uzmi hrvatski
  return fillTemplate(text, values);
}

// Zamjenjuje {ime} u tekstu vrijednošću iz values
function fillTemplate(text, values) {
  return String(text).replace(/\{(\w+)\}/g, (match, name) => (name in values ? values[name] : match));
}

// Treba li cijena decimale? 85 -> ne, 17.5 -> da
function decimalsFor(amount) {
  return Number.isInteger(amount) ? 0 : 2;
}

// Formateri brojeva i datuma su skupi za stvaranje (na sporijem mobitelu nekoliko milisekundi svaki),
// pa se svaki složi samo jednom i dalje koristi iz ove spremnice.
const formatters = new Map();

function numberFormatter(locale, options) {
  const key = `n|${locale}|${JSON.stringify(options)}`;
  if (!formatters.has(key)) formatters.set(key, new Intl.NumberFormat(locale, options));
  return formatters.get(key);
}

function dateFormatter(locale, options) {
  const key = `d|${locale}|${JSON.stringify(options)}`;
  if (!formatters.has(key)) formatters.set(key, new Intl.DateTimeFormat(locale, options));
  return formatters.get(key);
}

// Postavke za iznos u eurima s ovoliko decimala
function currencyOptions(decimals) {
  return { style: "currency", currency: "EUR", minimumFractionDigits: decimals, maximumFractionDigits: decimals };
}

// Cijena u eurima prema jeziku: "85 €" na hrvatskom, "€85" na engleskom
function formatPrice(amount, decimals = decimalsFor(amount), lang = currentLang) {
  return numberFormatter(TEXTS[lang].locale, currencyOptions(decimals)).format(amount);
}

// Broj prema jeziku: 0,5 na hrvatskom, 0.5 na engleskom
function formatNumber(value, lang = currentLang) {
  return numberFormatter(TEXTS[lang].locale, { maximumFractionDigits: 4 }).format(value);
}

// Veličina pakiranja: "5 L"
function formatLiters(liters, lang = currentLang) {
  return `${formatNumber(liters, lang)} L`;
}

// Je li korisnik u sustavu isključio animacije?
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Spremanje u preglednik (u privatnom načinu rada ne radi, zato try/catch)
function storageGet(key) {
  try { return window.localStorage.getItem(key); } catch (error) { return null; }
}

function storageSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch (error) { /* ništa, nije bitno */ }
}


/* ==========================================================================
   PART 4 · JEZIK (HR / EN)
   Hrvatski tekst je u HTML-u, engleski u atributima data-en.
   Kod prebacivanja na engleski pamtimo hrvatski tekst da ga možemo vratiti.
   ========================================================================== */

// Atributi koji se prevode: u HTML-u se pišu kao data-en-placeholder, data-en-alt, ...
const TRANSLATABLE_ATTRIBUTES = ["placeholder", "aria-label", "alt", "title", "content"];

// Ključ pod kojim preglednik pamti izabrani jezik. Ima prefiks stranice jer sve stranice
// na istoj domeni (npr. mpajkov.github.io) dijele isti localStorage.
const LANGUAGE_STORAGE_KEY = "crvenica-lang";

// Ovdje se pamti originalni (hrvatski) tekst svakog elementa
const originals = new WeakMap();

// Zapamti hrvatski tekst svih elemenata koji imaju prijevod
function rememberOriginals() {
  const elements = $$("[data-en], [data-en-html], " + TRANSLATABLE_ATTRIBUTES.map((attr) => `[data-en-${attr}]`).join(", "));
  elements.forEach((el) => {
    const saved = {
      text: el.textContent,                                                  // obični tekst
      nodes: el.hasAttribute("data-en-html") ? Array.from(el.childNodes, (node) => node.cloneNode(true)) : null, // tekst s oznakama
      attrs: {},                                                             // atributi
    };
    TRANSLATABLE_ATTRIBUTES.forEach((attr) => {
      if (el.hasAttribute(`data-en-${attr}`)) saved.attrs[attr] = el.getAttribute(attr) ?? "";
    });
    originals.set(el, saved);
  });
}

// Oznake koje smiju biti u prijevodu s HTML-om (data-en-html). Sve ostalo se izbacuje, ostaje samo tekst.
// Zato greška u prijevodu nikad ne može ubaciti tuđi kod u stranicu.
const SAFE_TAGS = new Set(["EM", "STRONG", "B", "I", "SUB", "SUP", "SPAN", "BR"]);

// Oznake čiji se sadržaj izbacuje u cijelosti (ni njihov tekst se ne prikazuje)
const DROPPED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "IFRAME", "OBJECT", "EMBED"]);

// Pretvori tekst s oznakama u DOM elemente bez innerHTML
function parseTranslation(html) {
  const source = new DOMParser().parseFromString(html, "text/html").body;
  const copy = (from, into) => {
    from.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        into.append(node.textContent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (SAFE_TAGS.has(node.tagName)) {
          const el = document.createElement(node.tagName.toLowerCase());
          if (node.hasAttribute("class")) el.className = node.getAttribute("class");   // samo class, nijedan drugi atribut
          copy(node, el);
          into.append(el);
        } else if (!DROPPED_TAGS.has(node.tagName)) {
          copy(node, into);                                                  // nepoznata oznaka: zadrži samo tekst
        }
      }
    });
    return into;
  };
  return copy(source, document.createDocumentFragment());
}

// Hrvatski naziv elementa (npr. naziv paketa za email koji stiže vama)
function originalText(el) {
  return (originals.get(el)?.text ?? el.textContent).trim();
}

// Na kojem jeziku su tekstovi u HTML-u upravo sada. Stranica se isporučuje na hrvatskom, pa
// posjetitelju na hrvatskom nije potrebno prepisivati ni jedan od dvjestotinjak tekstova.
let shownLang = "hr";

// Prepiši sve tekstove i atribute na engleski (english = true) ili vrati hrvatski original
function translateTexts(english) {
  // Obični tekst
  $$("[data-en]").forEach((el) => {
    const saved = originals.get(el);
    if (saved) el.textContent = english ? el.dataset.en : saved.text;
  });

  // Tekst s HTML oznakama (<em>, <sub>...)
  $$("[data-en-html]").forEach((el) => {
    const saved = originals.get(el);
    if (!saved) return;
    el.replaceChildren(...(english ? [parseTranslation(el.dataset.enHtml)] : saved.nodes.map((node) => node.cloneNode(true))));
  });

  // Atributi (opis slike, placeholder, aria-label, meta opis)
  TRANSLATABLE_ATTRIBUTES.forEach((attr) => {
    $$(`[data-en-${attr}]`).forEach((el) => {
      const saved = originals.get(el);
      if (saved) el.setAttribute(attr, english ? el.getAttribute(`data-en-${attr}`) : saved.attrs[attr]);
    });
  });
}

// Prebaci cijelu stranicu na zadani jezik
function applyLanguage(lang) {
  currentLang = hasLanguage(lang) ? lang : "hr";            // nepoznat jezik -> hrvatski

  if (currentLang !== shownLang) {                          // ako je već taj jezik, nema što prepisivati
    translateTexts(currentLang === "en");
    shownLang = currentLang;
  }

  document.documentElement.lang = currentLang;              // preglednik i Google znaju koji je jezik

  // Označi odabrani gumb jezika
  $$("[data-lang-btn]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.langBtn === currentLang));
  });

  storageSet(LANGUAGE_STORAGE_KEY, currentLang);            // zapamti izbor za idući posjet

  // Ako je u adresi ?lang=..., uskladi je s odabranim jezikom
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", currentLang);
      window.history.replaceState(null, "", url);
    }
  } catch (error) { /* lokalna datoteka (file://) ne dopušta promjenu adrese */ }

  fillSettings();                                            // brojevi i cijene u obliku tog jezika
  document.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: { lang: currentLang } })); // javi ostalima
}

// Kojim jezikom stranica počinje: ?lang= u adresi, zapamćeni izbor, jezik preglednika ili zadani
function getStartLanguage() {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (hasLanguage(fromUrl)) return fromUrl;

  const saved = storageGet(LANGUAGE_STORAGE_KEY);
  if (hasLanguage(saved)) return saved;

  if (SETTINGS.autoDetectLanguage) {
    const browser = (navigator.language || "").toLowerCase();
    return /^(hr|bs|sr|sh)/.test(browser) ? "hr" : "en";      // hrvatski, bosanski i srpski -> HR
  }
  return SETTINGS.defaultLanguage;
}

function setupLanguage() {
  rememberOriginals();                                       // prvo zapamti hrvatski
  applyLanguage(getStartLanguage());                         // pa prikaži početni jezik

  // Klik na HR ili EN
  $$("[data-lang-btn]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.langBtn));
  });
}


/* ==========================================================================
   PART 5 · PODACI IZ SETTINGS U STRANICU
   data-fill="email"  -> tekst elementa postaje SETTINGS.email
   data-href="phone"  -> link postaje tel:+385...
   ========================================================================== */

function fillSettings() {
  const { lat, lon } = SETTINGS.farmLocation;

  // Tekstovi
  const values = {
    email: SETTINGS.email,
    phone: SETTINGS.phone,
    harvestYear: String(SETTINGS.harvestYear),
    deliveryPrice: formatPrice(SETTINGS.deliveryPrice),
    freeDeliveryFrom: formatPrice(SETTINGS.freeDeliveryFrom),
    currentYear: String(new Date().getFullYear()),           // godina u podnožju (©)
    coords: `${formatNumber(Math.abs(lat))}° ${lat >= 0 ? "N" : "S"} · ${formatNumber(Math.abs(lon))}° ${lon >= 0 ? "E" : "W"}`,
  };

  $$("[data-fill]").forEach((el) => {
    const key = el.dataset.fill;
    if (key in values) el.textContent = values[key];
  });

  // Linkovi
  const links = {
    email: `mailto:${SETTINGS.email}`,
    phone: `tel:${SETTINGS.phone.replace(/[^\d+]/g, "")}`,   // bez razmaka: tel:+385912345678
    whatsapp: `https://wa.me/${SETTINGS.whatsapp}`,
    map: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
  };

  $$("[data-href]").forEach((el) => {
    const key = el.dataset.href;
    if (key in links) el.setAttribute("href", links[key]);
  });
}


/* ==========================================================================
   PART 6 · ZAGLAVLJE I IZBORNIK NA MOBITELU
   ========================================================================== */

function setupHeader() {
  const header = $("[data-header]");
  if (!header) return;                                       // nema zaglavlja -> ništa

  // Sjena ispod zaglavlja kad se stranica pomakne. Prvo čitanje položaja (koje prisiljava preglednik na
  // slaganje stranice) ide u idući okvir, da ne produljuje učitavanje; dalje ga pokreće događaj pomicanja.
  const updateScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.requestAnimationFrame(updateScrolled);
  window.addEventListener("scroll", updateScrolled, { passive: true });

  const toggle = $("[data-nav-toggle]");                     // gumb s tri crte
  const nav = $("[data-nav]");                               // izbornik
  if (!toggle || !nav) return;

  const isOpen = () => header.classList.contains("is-open");

  // Otvori ili zatvori izbornik
  const setMenu = (open) => {
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);       // stranica ispod se ne pomiče
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", t(open ? "menuClose" : "menuOpen"));
    $$("main, footer").forEach((el) => { el.inert = open; }); // tipkovnica ostaje u izborniku
    if (open) $(".site-nav__link", nav)?.focus();           // fokus na prvi link
  };

  toggle.addEventListener("click", () => setMenu(!isOpen()));

  // Klik na bilo koji link u izborniku ga zatvara
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  // Tipka Esc zatvara izbornik
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Ako se prozor proširi na laptop veličinu, izbornik se zatvara
  window.matchMedia("(min-width: 1080px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  // Opis gumba na novom jeziku
  toggle.setAttribute("aria-label", t("menuOpen"));
  document.addEventListener(LANGUAGE_EVENT, () => {
    toggle.setAttribute("aria-label", t(isOpen() ? "menuClose" : "menuOpen"));
  });
}


/* ==========================================================================
   PART 7 · AKTIVNA SEKCIJA U IZBORNIKU
   Link sekcije koja je na sredini ekrana dobiva klasu is-active.
   Radi samo od sebe za svaku novu sekciju koja ima link u izborniku.
   ========================================================================== */

function setupActiveLinks() {
  const links = $$(".site-nav__link");
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))   // "#about" -> element s id="about"
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const hero = document.getElementById("top");               // na vrhu nijedan link nije aktivan

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });                   // "crta" na sredini ekrana

  sections.forEach((section) => observer.observe(section));
  if (hero) observer.observe(hero);
}


/* ==========================================================================
   PART 8 · CIJENIK
   Čita data-price i data-liters s kartica i iz njih računa sve ostalo.
   ========================================================================== */

// Popis paketa iz HTML-a: [{ id, price, liters, card }, ...]
function getPackages() {
  return $$("[data-package]")
    .map((card) => ({
      id: card.dataset.package,                              // npr. "5l"
      price: Number(card.dataset.price),                     // npr. 85
      liters: Number(card.dataset.liters),                   // npr. 5
      card,                                                  // sam HTML element kartice
    }))
    .filter((pkg) => pkg.id && pkg.price > 0 && pkg.liters > 0);   // preskoči neispravne
}

// Naziv paketa: na trenutnom jeziku ili na hrvatskom (za email koji stiže vama)
function packageName(pkg, inCroatian = false) {
  const el = $("[data-package-name]", pkg.card);
  if (!el) return pkg.id;
  return inCroatian ? originalText(el) : el.textContent.trim();
}

// Koliko košta dostava za zadani iznos narudžbe
function deliveryCost(orderTotal) {
  const free = SETTINGS.freeDeliveryFrom > 0 && orderTotal >= SETTINGS.freeDeliveryFrom;
  return free ? 0 : SETTINGS.deliveryPrice;
}

// Ispis cijene s manjim znakom €: <span class="price__number">85</span><span class="price__currency">€</span>
function renderPrice(el, amount) {
  const parts = numberFormatter(TEXTS[currentLang].locale, currencyOptions(decimalsFor(amount))).formatToParts(amount);

  const number = parts.filter((p) => p.type !== "currency" && p.type !== "literal").map((p) => p.value).join("");
  const currency = parts.find((p) => p.type === "currency")?.value ?? "€";
  const currencyFirst = parts.findIndex((p) => p.type === "currency") < parts.findIndex((p) => p.type === "integer");

  const numberSpan = document.createElement("span");
  numberSpan.className = "price__number";
  numberSpan.textContent = number;

  const currencySpan = document.createElement("span");
  currencySpan.className = "price__currency";
  currencySpan.textContent = currency;

  el.replaceChildren(...(currencyFirst ? [currencySpan, numberSpan] : [numberSpan, currencySpan]));
}

// Upiše cijenu, cijenu po litri, uštedu i dostavu na svaku karticu
function renderPricing() {
  const packages = getPackages();
  if (!packages.length) return;

  // Paket s najskupljom litrom (obično 1 L) služi za usporedbu uštede
  const base = packages.reduce((a, b) => (b.price / b.liters > a.price / a.liters ? b : a));
  const basePerLiter = base.price / base.liters;

  packages.forEach((pkg) => {
    const priceEl = $("[data-package-price]", pkg.card);
    if (priceEl) renderPrice(priceEl, pkg.price);

    const perLiterEl = $("[data-package-per-liter]", pkg.card);
    if (perLiterEl) perLiterEl.textContent = t("perLiter", { price: formatPrice(pkg.price / pkg.liters, 2) });

    // Ušteda u odnosu na kupnju istih litara u najmanjem pakiranju
    const savingEl = $("[data-package-saving]", pkg.card);
    if (savingEl) {
      const saving = Math.round((basePerLiter * pkg.liters - pkg.price) * 100) / 100;
      savingEl.hidden = saving <= 0;                         // 1 L nema uštedu -> skriveno
      if (saving > 0) {
        savingEl.textContent = t("saving", {
          amount: formatPrice(saving),
          count: formatNumber(pkg.liters / base.liters),
          size: formatLiters(base.liters),
        });
      }
    }

    const deliveryEl = $("[data-package-delivery]", pkg.card);
    if (deliveryEl) {
      deliveryEl.textContent = deliveryCost(pkg.price) === 0
        ? t("deliveryFree")
        : t("deliveryPaid", { price: formatPrice(SETTINGS.deliveryPrice) });
    }
  });
}

function setupPricing() {
  renderPricing();
  document.addEventListener(LANGUAGE_EVENT, renderPricing); // ponovno ispiši na novom jeziku

  // Gumbi "Naruči" (data-order="5l") odaberu paket u formi i odvedu do nje
  $$("[data-order]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const form = $("[data-order-form]");
      if (!form) return;                                     // nema forme -> običan link
      event.preventDefault();

      selectPackage(button.dataset.order);                   // PART 9

      const target = document.getElementById("contact") || form;
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

      // Nakon pomicanja stavi kursor u prvo polje koje treba ispuniti
      const field = button.dataset.order === "question" ? $("#f-name") : $("#f-quantity");
      window.setTimeout(() => field?.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 650);
    });
  });
}


/* ==========================================================================
   PART 9 · FORMA ZA NARUDŽBU
   Izbor paketa (kartice), količina, dostava ili preuzimanje i sažetak.
   ========================================================================== */

const QUESTION = "question";                                 // vrijednost izbora "Samo pitanje"

// Trenutno stanje forme: što je odabrano i kako
function getFormState(form) {
  const choice = form.elements.package?.value || QUESTION;   // odabrani paket ili pitanje
  const pkg = getPackages().find((p) => p.id === choice) || null;
  const isOrder = Boolean(pkg);
  const isDelivery = isOrder && form.elements.delivery?.value !== "pickup";
  const quantity = clampQuantity(form.elements.quantity?.value);
  const subtotal = pkg ? pkg.price * quantity : 0;
  const shipping = isDelivery ? deliveryCost(subtotal) : 0;
  return { choice, pkg, isOrder, isDelivery, quantity, subtotal, shipping, total: subtotal + shipping };
}

// Količina je uvijek cijeli broj od 1 do maxQuantity
function clampQuantity(value) {
  const number = Math.round(Number(value) || 1);
  return Math.min(Math.max(number, 1), SETTINGS.maxQuantity);
}

// Stvori kartice za izbor paketa iz cijenika (+ "Samo pitanje")
function renderPackageOptions(form) {
  const container = $("[data-package-options]", form);
  if (!container) return;
  const selected = form.elements.package?.value || QUESTION; // zadrži odabrano kod promjene jezika

  const options = getPackages().map((pkg) => ({
    value: pkg.id,
    size: formatLiters(pkg.liters),
    name: packageName(pkg),
    note: formatPrice(pkg.price),
  }));
  options.push({ value: QUESTION, size: "?", name: t("questionOption"), note: t("questionNote") });

  container.replaceChildren(...options.map((option) => {
    const label = document.createElement("label");
    label.className = "choice-card";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "package";
    input.value = option.value;
    input.checked = option.value === selected;
    input.defaultChecked = option.value === QUESTION;       // nakon slanja forma se vraća na "Samo pitanje"

    const body = document.createElement("span");
    body.className = "choice-card__body";
    [["choice-card__size", option.size], ["choice-card__name", option.name], ["choice-card__price", option.note]]
      .forEach(([className, text]) => {
        const span = document.createElement("span");
        span.className = className;
        span.textContent = text;
        body.appendChild(span);
      });

    label.append(input, body);
    return label;
  }));
}

// Odaberi paket iz koda (koriste ga gumbi "Naruči" u cijeniku)
function selectPackage(value) {
  const form = $("[data-order-form]");
  if (!form) return;
  const input = $$('input[name="package"]', form).find((el) => el.value === value);
  if (input) input.checked = true;
  updateFormState(form);
}

// Prikaži ili sakrij dijelove forme i osvježi sažetak
function updateFormState(form) {
  const state = getFormState(form);

  $$("[data-order-only]", form).forEach((el) => { el.hidden = !state.isOrder; });       // samo za narudžbu
  $$("[data-delivery-only]", form).forEach((el) => { el.hidden = !state.isDelivery; }); // samo za dostavu

  // Napomene uz nazive polja
  const phoneHint = $('[data-hint="phone"]', form);
  if (phoneHint) phoneHint.textContent = state.isDelivery ? t("forCourier") : t("optional");
  const messageHint = $('[data-hint="message"]', form);
  if (messageHint) messageHint.textContent = state.isOrder ? t("optional") : "";

  // Tekst gumba
  const submitLabel = $("[data-submit-label]", form);
  if (submitLabel && !form.classList.contains("is-sending")) {
    submitLabel.textContent = state.isOrder ? t("sendOrder") : t("sendMessage");
  }

  renderSummary(form, state);
  revalidateInvalidFields(form);                             // PART 10: makni greške koje više ne vrijede
}

// Sažetak narudžbe (kao račun)
function renderSummary(form, state = getFormState(form)) {
  const list = $("[data-summary]", form);
  if (!list) return;
  if (!state.pkg) { list.replaceChildren(); return; }

  const rows = [
    [`${state.quantity} × ${packageName(state.pkg)} (${formatLiters(state.pkg.liters)})`, formatPrice(state.subtotal, 2)],
    [state.isDelivery ? t("summaryDelivery") : t("summaryPickup"), state.shipping === 0 ? t("free") : formatPrice(state.shipping, 2)],
    [t("total"), formatPrice(state.total, 2), true],
  ];

  list.replaceChildren(...rows.map(([label, value, isTotal]) => {
    const row = document.createElement("div");
    row.className = isTotal ? "summary__row summary__row--total" : "summary__row";
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    row.append(dt, dd);
    return row;
  }));
}

function setupOrderForm() {
  const form = $("[data-order-form]");
  if (!form) return;

  renderPackageOptions(form);
  updateFormState(form);

  // Promjena paketa ili načina preuzimanja
  form.addEventListener("change", (event) => {
    if (["package", "delivery"].includes(event.target.name)) updateFormState(form);
  });

  // Količina: gumbi - i +
  const quantity = form.elements.quantity;
  if (quantity) quantity.max = SETTINGS.maxQuantity;
  $$("[data-step]", form).forEach((button) => {
    button.addEventListener("click", () => {
      quantity.value = clampQuantity(Number(quantity.value) + Number(button.dataset.step));
      renderSummary(form);
    });
  });

  // Količina upisana rukom
  quantity?.addEventListener("input", () => renderSummary(form));
  quantity?.addEventListener("change", () => {
    quantity.value = clampQuantity(quantity.value);
    renderSummary(form);
  });

  // Nakon slanja (reset) forma se vraća na početno stanje
  form.addEventListener("reset", () => window.setTimeout(() => updateFormState(form)));

  // Novi jezik: novi nazivi paketa i tekstovi
  document.addEventListener(LANGUAGE_EVENT, () => {
    renderPackageOptions(form);
    updateFormState(form);
  });
}


/* ==========================================================================
   PART 10 · SLANJE FORME
   1. Provjera polja (poruke ispod polja na odabranom jeziku)
   2. Slanje preko Web3Forms, ili otvaranje email programa ako ključ nije upisan
   ========================================================================== */

// Pravila za polja: vraćaju true (u redu) ili ključ poruke o grešci iz TEXTS
const RULES = {
  name: (value) => value.trim().length >= 2 || "errName",
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) || "errEmail",
  phone: (value, state) => {
    const digits = value.replace(/\D/g, "");                // samo znamenke
    if (!digits) return state.isDelivery ? "errPhone" : true; // obavezan samo za dostavu
    return digits.length >= 6 || "errPhoneFormat";
  },
  address: (value, state) => !state.isDelivery || value.trim().length >= 8 || "errAddress",
  message: (value, state) => state.isOrder || value.trim().length >= 3 || "errMessage",
};

// Provjeri jedno polje i prikaži ili makni grešku
function validateField(form, name, state = getFormState(form)) {
  const field = form.elements[name];
  if (!field || !RULES[name]) return true;
  const result = RULES[name](field.value, state);
  const error = document.getElementById(`${field.id}-error`);

  if (result === true) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    delete field.dataset.error;
    if (error) error.hidden = true;
    return true;
  }

  field.setAttribute("aria-invalid", "true");                // crveni rub (CSS)
  field.dataset.error = result;                              // zapamti grešku (za promjenu jezika)
  if (error) {
    field.setAttribute("aria-describedby", error.id);        // čitač ekrana pročita grešku
    error.textContent = t(result);
    error.hidden = false;
  }
  return false;
}

// Provjeri sva polja, vrati popis neispravnih
function validateForm(form) {
  const state = getFormState(form);
  return Object.keys(RULES)
    .filter((name) => !validateField(form, name, state))
    .map((name) => form.elements[name]);
}

// Polja koja već imaju grešku provjeri ponovno (npr. nakon promjene dostave)
function revalidateInvalidFields(form) {
  $$("[aria-invalid='true']", form).forEach((field) => validateField(form, field.name));
}

// Očisti tekst iz forme: makni nevidljive kontrolne znakove, razmake s krajeva i ograniči duljinu
// (novi red je dopušten, ali samo u poljima za adresu i poruku)
function clean(value, max, multiline = false) {
  const controls = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return String(value ?? "").replace(controls, multiline ? "" : " ").trim().slice(0, max);
}

// Svi podaci iz forme na jednom mjestu
function collectData(form) {
  const state = getFormState(form);
  const value = (name, max, multiline) => clean(form.elements[name]?.value, max, multiline);
  return {
    ...state,
    lang: currentLang,
    name: value("name", 80),
    email: value("email", 120),
    phone: value("phone", 30),
    address: state.isDelivery ? value("address", 200, true) : "",
    message: value("message", 2000, true),
  };
}

// Naslov i tekst emaila na zadanom jeziku
function buildEmail(data, lang) {
  const L = TEXTS[lang].mail;
  const lines = [];
  let subject = L.subjectQuestion;

  if (data.isOrder) {
    const name = lang === "hr" ? packageName(data.pkg, true) : packageName(data.pkg);
    const size = formatLiters(data.pkg.liters, lang);
    const shipping = data.shipping === 0 ? TEXTS[lang].free : formatPrice(data.shipping, 2, lang);
    subject = fillTemplate(L.subjectOrder, { qty: data.quantity, package: `${name} (${size})` });
    lines.push(
      `${L.package}: ${name} (${size}), ${formatPrice(data.pkg.price, undefined, lang)}`,
      `${L.quantity}: ${data.quantity}`,
      `${L.delivery}: ${data.isDelivery ? `${TEXTS[lang].summaryDelivery} (${shipping})` : TEXTS[lang].summaryPickup}`,
      `${L.total}: ${formatPrice(data.total, 2, lang)}`,
    );
    if (data.isDelivery) lines.push(`${L.address}: ${data.address}`);
    lines.push("");
  }

  lines.push(`${L.name}: ${data.name}`, `${L.email}: ${data.email}`);
  if (data.phone) lines.push(`${L.phone}: ${data.phone}`);
  if (data.message) lines.push("", `${L.message}:`, data.message);
  if (lang === "hr" && data.lang !== "hr") lines.push("", `${L.language}: ${TEXTS[data.lang].languageName}`);

  return { subject, body: lines.join("\n") };
}

// Prikaži poruku ispod forme (type: success, error ili info)
function showStatus(form, type, message) {
  const status = $("[data-form-status]", form);
  if (!status) return;
  status.className = `form-status is-${type}`;
  status.textContent = message;
  status.hidden = false;
  status.focus({ preventScroll: true });
  status.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
}

// Gumb dok se šalje: isključen, s tekstom "Šaljem…"
function setSending(form, sending) {
  const button = $("[data-submit]", form);
  form.classList.toggle("is-sending", sending);
  if (button) button.disabled = sending;
  const label = $("[data-submit-label]", form);
  if (sending && label) label.textContent = t("sending");
  if (!sending) updateFormState(form);                       // vrati pravi tekst gumba
}

// Bez ključa: otvori email program posjetitelja s pripremljenom porukom
function openEmailProgram(data) {
  const email = buildEmail(data, currentLang);
  window.location.href = `mailto:${SETTINGS.email}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
}

// S ključem: pošalji preko Web3Forms (stiže vam na email koji ste upisali na web3forms.com)
async function sendWithWeb3Forms(data) {
  const email = buildEmail(data, "hr");                      // email koji stiže vama je na hrvatskom
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: SETTINGS.web3formsKey,
      subject: `${email.subject} · ${data.name}`,
      from_name: `${SETTINGS.brandName} · web stranica`,
      name: data.name,
      email: data.email,                                     // na "Odgovori" odgovarate kupcu
      phone: data.phone,
      message: email.body,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) throw new Error(result.message || `HTTP ${response.status}`);
}

// Zaštita od spama bez CAPTCHA-e (posjetitelj ne mora klikati semafore):
// 1. skriveno polje "website" koje ispunjavaju samo roboti
// 2. forma poslana unutar 2,5 sekunde od otvaranja stranice (čovjek to ne stigne)
// 3. kratka stanka između dva slanja
const OPENED_AT = Date.now();
const MIN_OPEN_MS = 2500;
const COOLDOWN_MS = 20000;
let lastSentAt = 0;

function looksLikeBot(form) {
  return Boolean(form.elements.website?.value) || Date.now() - OPENED_AT < MIN_OPEN_MS;
}

function setupFormSending() {
  const form = $("[data-order-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();                                  // ne šalji formu na stari način

    const invalid = validateForm(form);
    if (invalid.length) {
      invalid[0].focus();                                    // kursor na prvo krivo polje
      return;
    }

    const data = collectData(form);
    const successText = data.isOrder ? t("successOrder") : t("successMessage");

    // Robot: pretvaraj se da je poslano i ne šalji ništa
    if (looksLikeBot(form)) {
      form.reset();
      showStatus(form, "success", successText);
      return;
    }

    // Prebrzo slanje jedne poruke za drugom
    if (Date.now() - lastSentAt < COOLDOWN_MS) {
      showStatus(form, "error", t("wait"));
      return;
    }

    // Ključ još nije upisan: otvori email program
    if (!SETTINGS.web3formsKey || SETTINGS.web3formsKey === "UPISI_KLJUC") {
      openEmailProgram(data);
      showStatus(form, "info", t("mailtoOpened"));
      return;
    }

    setSending(form, true);
    try {
      await sendWithWeb3Forms(data);
      lastSentAt = Date.now();
      form.reset();
      showStatus(form, "success", successText);
    } catch (error) {
      console.warn("Slanje forme nije uspjelo:", error);
      showStatus(form, "error", t("errorSend", { phone: SETTINGS.phone }));
    } finally {
      setSending(form, false);
    }
  });

  // Dok korisnik ispravlja polje s greškom, greška nestane čim je u redu
  form.addEventListener("input", (event) => {
    if (event.target.getAttribute("aria-invalid") === "true") validateField(form, event.target.name);
  });

  // Novi jezik: greške na novom jeziku
  document.addEventListener(LANGUAGE_EVENT, () => {
    $$("[data-error]", form).forEach((field) => {
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.textContent = t(field.dataset.error);
    });
  });
}


/* ==========================================================================
   PART 11 · ANIMACIJE I KALENDAR BERBE
   Trake (okus, analiza, sorte, kalendar) se napune kad dođu na ekran.
   Kalendar dobiva nazive mjeseci na odabranom jeziku i crtu "sada".
   ========================================================================== */

function setupAnimations() {
  const items = $$("[data-animate]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));  // stari preglednik: odmah prikaži
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");              // CSS pokreće animaciju (style.css, PART 16)
      observer.unobserve(entry.target);                      // samo jednom
    });
  }, { threshold: 0.25 });                                   // kad se vidi četvrtina elementa

  items.forEach((el) => observer.observe(el));
}

function renderCalendar() {
  const calendar = $("[data-calendar]");
  if (!calendar) return;

  const locale = TEXTS[currentLang].locale;
  const today = new Date();
  const month = today.getMonth();                            // 0 = siječanj, 11 = prosinac

  // Nazivi mjeseci na odabranom jeziku (kratki i jedno slovo za mobitel)
  const longMonth = dateFormatter(locale, { month: "long" });
  const shortMonth = dateFormatter(locale, { month: "short" });
  $$(".calendar__month", calendar).forEach((el, index) => {
    const date = new Date(2026, index, 15);
    el.textContent = shortMonth.format(date).replace(".", "");
    el.dataset.short = longMonth.format(date).charAt(0).toLocaleUpperCase(locale);
    el.classList.toggle("is-now", index === month);          // istakni ovaj mjesec
  });

  // Položaj crte "sada": mjesec + dio mjeseca koji je prošao (npr. 18. listopada = 9,56)
  const daysInMonth = new Date(today.getFullYear(), month + 1, 0).getDate();
  calendar.style.setProperty("--now-pos", (month + (today.getDate() - 0.5) / daysInMonth).toFixed(3));

  const label = $(".calendar__now-label", calendar);
  if (label) label.textContent = t("now");
}

function setupCalendar() {
  renderCalendar();
  document.addEventListener(LANGUAGE_EVENT, renderCalendar);
}


/* ==========================================================================
   PART 12 · PODACI ZA GOOGLE
   Opis proizvoda i cijena u obliku koji Google razumije (schema.org).
   Stvara se sam iz kartica u cijeniku, ne treba ga mijenjati.
   ========================================================================== */

function setupStructuredData() {
  const packages = getPackages();
  if (!packages.length) return;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SETTINGS.brandName}, ekstra djevičansko maslinovo ulje`,
    description: originals.get($('meta[name="description"]'))?.attrs.content || $('meta[name="description"]')?.content || "",
    url: SETTINGS.siteUrl,
    image: `${SETTINGS.siteUrl}assets/og-image.jpg`,
    brand: { "@type": "Brand", name: SETTINGS.brandName },
    countryOfOrigin: "HR",
    offers: packages.map((pkg) => ({
      "@type": "Offer",
      name: `${packageName(pkg, true)} (${formatLiters(pkg.liters, "hr")})`,
      price: pkg.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SETTINGS.siteUrl}#pricing`,
    })),
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}


/* ==========================================================================
   PART 13 · START
   Popis funkcija koje se pokreću kad se stranica učita (redom).
   Novu funkciju dodaj na kraj liste.
   ========================================================================== */

const SETUP = [
  setupLanguage,          // PART 4: jezik (mora biti prvi)
  setupHeader,            // PART 6: zaglavlje i izbornik
  setupActiveLinks,       // PART 7: aktivna sekcija u izborniku
  setupPricing,           // PART 8: cijenik
  setupOrderForm,         // PART 9: forma za narudžbu
  setupFormSending,       // PART 10: slanje forme
  setupAnimations,        // PART 11: animacije traka
  setupCalendar,          // PART 11: kalendar berbe
  setupStructuredData,    // PART 12: podaci za Google
];

// Klasa "js" na <html> govori CSS-u da JavaScript radi (potrebno za animacije)
document.documentElement.classList.replace("no-js", "js");

// Pokreni svaku funkciju zasebno: greška u jednoj ne zaustavlja ostale
SETUP.forEach((setup) => {
  try {
    setup();
  } catch (error) {
    console.error(`Greška u funkciji ${setup.name}:`, error);
  }
});
