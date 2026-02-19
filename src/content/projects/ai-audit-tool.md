---
projectSlug: ai-audit-tool
status: beta
category: tool
featured: true
year: 2026
title_cs: AI Audit Tool
title_en: AI Audit Tool
summary_cs: Desktopový nástroj pro audit AI-připravenosti webů. Skenuje stránky,
  hodnotí 6 pilířů (indexability, schema, DOM sémantika, obsah, média, provozní signály)
  a generuje PDF report s konkrétními doporučeními.
summary_en: Desktop tool for auditing website AI-readiness. Scans pages, evaluates
  6 pillars (indexability, schema, DOM semantics, content, media, operational signals)
  and generates PDF reports with actionable recommendations.
stack:
  - Python
  - Streamlit
  - Playwright
  - Gemini AI
  - PDF
links_website: ""
links_demo: ""
links_github: ""
links_other: ""
images: []
body_cs: |
  ## O projektu

  AI Audit Tool (GEO Auditor) je desktopová aplikace pro SEO/GEO konzultanty a webmastery, která analyzuje, jak dobře jsou webové stránky připraveny na éru AI vyhledávačů — ChatGPT, Perplexity, Google SGE a další AI asistenty.

  ### Problém

  AI asistenti a vyhledávače potřebují strukturovaná, sémanticky čistá data, aby dokázali správně extrahovat informace o produktech, službách a firmách. Většina webů nemá správné Schema.org značky, chybí jim strukturovaný obsah a AI systémy z nich nedokáží spolehlivě vytáhnout klíčová fakta.

  ### Řešení

  AI Audit Tool provede hloubkovou analýzu celého webu a vyhodnotí jeho AI-připravenost na základě 6 pilířů:

  1. **Indexability & Access** — robots.txt, meta direktivy, canonical URL, HTTP status
  2. **Structured Data Coverage** — Schema.org typy a jejich kompletnost
  3. **Extractability & DOM Semantics** — H1/H2 struktura, sémantický obsah, DOM kvalita
  4. **Content Completeness** — poměr faktů vs. fluff, přítomnost kritických polí
  5. **Media & Alt Context** — ALT texty obrázků, kvalita a velikost médií
  6. **Operational Signals** — sitemap, breadcrumbs, interní prolinkování

  ### Klíčové funkce

  - **Dva režimy** — ⚡ Quick Snapshot (bez AI, rychlý přehled) a 🤖 AI Enhanced (s Gemini, hloubková analýza)
  - **Template clustering** — dvou-fázová pipeline, která seskupí podobné stránky a analyzuje jen reprezentanty (šetří čas a API volání)
  - **Agent Extraction Test** — deterministický test, zda AI dokáže z webu extrahovat klíčová fakta
  - **Checkpoint systém** — audit lze kdykoli zastavit a pokračovat později
  - **PDF reporty** — profesionální PDF s vizualizacemi, skóre a konkrétními doporučeními
  - **Implementation Checklist** — Excel export s prioritizovanými úkoly (P0/P1/P2) pro vývojáře
  - **Email outreach** — integrovaný modul pro oslovení potenciálních klientů
  - **ARES integrace** — ověření firem z českého obchodního rejstříku
  - **Licenční systém** — Lemon Squeezy integrace (Standard/Recommended/PRO plány)

  ### Tech stack

  Python + Streamlit (UI), Playwright (JS rendering), BeautifulSoup + lxml (parsing), Google Gemini (AI analýza), FPDF2 (PDF generování), Plotly (vizualizace), SQLite (historie auditů).
body_en: |
  ## About the Project

  AI Audit Tool (GEO Auditor) is a desktop application for SEO/GEO consultants and webmasters that analyzes how well websites are prepared for the era of AI search engines — ChatGPT, Perplexity, Google SGE, and other AI assistants.

  ### Problem

  AI assistants and search engines need structured, semantically clean data to reliably extract information about products, services, and companies. Most websites lack proper Schema.org markup, have unstructured content, and AI systems cannot reliably extract key facts from them.

  ### Solution

  AI Audit Tool performs a deep analysis of entire websites and evaluates their AI-readiness based on 6 pillars:

  1. **Indexability & Access** — robots.txt, meta directives, canonical URLs, HTTP status
  2. **Structured Data Coverage** — Schema.org types and their completeness
  3. **Extractability & DOM Semantics** — H1/H2 structure, semantic content, DOM quality
  4. **Content Completeness** — facts vs. fluff ratio, presence of critical fields
  5. **Media & Alt Context** — image ALT texts, media quality and size
  6. **Operational Signals** — sitemap, breadcrumbs, internal linking

  ### Key Features

  - **Two modes** — ⚡ Quick Snapshot (no AI, fast overview) and 🤖 AI Enhanced (with Gemini, deep analysis)
  - **Template clustering** — two-phase pipeline that groups similar pages and analyzes only representatives (saves time and API calls)
  - **Agent Extraction Test** — deterministic test of whether AI can extract key facts from the site
  - **Checkpoint system** — audit can be stopped and resumed at any time
  - **PDF reports** — professional PDFs with visualizations, scores, and actionable recommendations
  - **Implementation Checklist** — Excel export with prioritized tasks (P0/P1/P2) for developers
  - **Email outreach** — integrated module for cold outreach to potential clients
  - **ARES integration** — company verification from Czech business registry
  - **Licensing system** — Lemon Squeezy integration (Standard/Recommended/PRO plans)

  ### Tech Stack

  Python + Streamlit (UI), Playwright (JS rendering), BeautifulSoup + lxml (parsing), Google Gemini (AI analysis), FPDF2 (PDF generation), Plotly (visualization), SQLite (audit history).
---
