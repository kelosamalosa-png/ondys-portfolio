---
projectSlug: web-firewall
status: prototype
category: tool
featured: true
year: 2026
title_cs: Web Firewall
title_en: Web Firewall
summary_cs: Chrome extension pro bezpečnější prohlížení — skrývá low-quality obsah,
  detekuje scam/dark pattern UI a varuje před prompt injection útoky cílícími na AI agenty.
  Vše běží lokálně v prohlížeči.
summary_en: Privacy-first Chrome extension for safer browsing — hides low-quality
  content, detects scam/dark pattern UI, and warns about prompt injection attacks
  targeting AI agents. Runs entirely locally.
stack:
  - Chrome Extension
  - Manifest V3
  - JavaScript
  - Content Scripts
links_website: ""
links_demo: ""
links_github: ""
links_other: ""
images:
  - /uploads/web-firewall-screenshot-1.png
body_cs: |
  ## O projektu

  Web Firewall je Chrome extension (Manifest V3), která poskytuje tři vrstvy ochrany při prohlížení webu. Vše běží lokálně — žádná data stránek se neodesílají na servery.

  ### Problém

  Moderní webové stránky jsou plné skrytých manipulativních prvků: falešná tlačítka ke stažení, agresivní overlay reklamy, dark patterns a dokonce prompt injection útoky cílící na AI agenty a scrapery. Běžný uživatel tyto hrozby nevidí.

  ### 3 ochranné vrstvy

  - **Quality Shield (Noise Canceling)** — automaticky identifikuje a skrývá low-value bloky: „related articles", agresivní CTA, boilerplate. Zachovává hlavní obsah a navigaci.
  - **Scam Shield** — detekuje falešná download tlačítka, dark pattern overlaye, interstitialy a clickfix patterny (PowerShell/terminal bait). Volitelná click-guard ochrana rizikových elementů.
  - **Injection Shield** — odhaluje skrytý text cílící na AI agenty/scrapery, prompt injection fráze, „agent bait" (požadavky na tokeny, klíče, clipboard) a podezřelý obsah v aria-label/alt/title/meta atributech.

  ### Režimy

  - **Off** — extension vypnuta pro daný web
  - **Clean** — lehké filtrování, zachovává většinu obsahu
  - **Focus** — střední filtrování, skrývá sidebary a rušivé prvky
  - **Strict** — agresivní filtrování, click-guard na rizikových elementech

  ### Principy návrhu

  - **Local-first** — veškerá analýza probíhá v content scriptech, žádné serverové volání (Free mode)
  - **Bezpečný** — minimální oprávnění, žádný eval, žádný remote kód
  - **Rychlý** — neblokující, inkrementální analýza s debounced observery (< 150ms CPU)
  - **Reverzibilní** — uživatel může kdykoli obnovit skrytý obsah
  - **Vysvětlitelný** — každé rozhodnutí obsahuje důvod a skóre

  Extension je ve fázi prototypu, připravuje se vydání na Chrome Web Store.
body_en: |
  ## About the Project

  Web Firewall is a Chrome extension (Manifest V3) that provides three layers of protection while browsing. Everything runs locally — no page content is ever sent to external servers.

  ### Problem

  Modern websites are full of hidden manipulative elements: fake download buttons, aggressive overlay ads, dark patterns, and even prompt injection attacks targeting AI agents and scrapers. Regular users can't see these threats.

  ### 3 Protection Layers

  - **Quality Shield (Noise Canceling)** — automatically identifies and hides low-value content blocks: "related articles", aggressive CTAs, boilerplate. Preserves main content and navigation.
  - **Scam Shield** — detects fake download buttons, dark pattern overlays, interstitials, and clickfix patterns (PowerShell/terminal bait). Optional click-guard for high-risk elements.
  - **Injection Shield** — detects hidden text targeting AI agents/scrapers, prompt injection phrases, "agent bait" (requests for tokens, keys, clipboard access), and suspicious content in aria-label/alt/title/meta attributes.

  ### Modes

  - **Off** — extension disabled for this site
  - **Clean** — light filtering, preserves most content
  - **Focus** — moderate filtering, hides sidebars and distractions
  - **Strict** — aggressive filtering, click-guards on risky elements

  ### Design Principles

  - **Local-first** — all analysis runs in content scripts, no server calls (Free mode)
  - **Safe by design** — minimal permissions, no eval, no remote code
  - **Fast** — non-blocking, incremental analysis with debounced observers (< 150ms CPU)
  - **Reversible** — user can restore any hidden content
  - **Explainable** — all decisions include reasons and scores

  The extension is in prototype stage, preparing for Chrome Web Store release.
---
