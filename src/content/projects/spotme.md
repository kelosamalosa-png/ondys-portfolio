---
projectSlug: spotme
status: prototype
category: app
featured: false
year: 2026
title_cs: SpotMe
title_en: SpotMe
summary_cs: Android appka pro rychlé nalezení parťáka na trénink ve stejné posilovně
  a čase. Žádný feed, žádné profily — čistě utilita na domluvu společného cvičení.
summary_en: Android app for quickly finding a gym partner at the same gym and time.
  No feed, no profiles — purely a utility for arranging joint workouts.
stack:
  - Kotlin
  - Jetpack Compose
  - Firebase
  - Hilt
links_website: ""
links_demo: ""
links_github: ""
links_other: ""
images: []
body_cs: |
  ## O projektu

  SpotMe je Android aplikace pro lidi, kteří cvičí sami a chtějí občas parťáka na trénink — ať už začátečníky nebo pokročilé. Žádný sociální feed, žádné zbytečné profily. Čistě utilita na domluvu.

  ### Problém

  Hodně lidí by cvičilo pravidelněji, kdyby měli parťáka. Přes sociální sítě je domlouvání pomalé a nekomfortní. Hlavní problém je najít někoho ve stejném čase a místě.

  ### Řešení

  SpotMe funguje jednoduše:

  1. Vyberete si město a posilovnu
  2. Nastavíte časové okno (např. dnes 18–20)
  3. Vytvoříte příspěvek „jdu cvičit" s typem tréninku (nohy, záda, kardio...)
  4. Systém vás automaticky propojí s lidmi ve stejné posilovně a překrývajícím se čase
  5. Po matchi se otevře jednoduchý chat

  ### Klíčové funkce

  - **Výběr posilovny** — město, gym, adresa s mapou
  - **Časové okno** — nastavení kdy plánujete cvičit
  - **Příspěvek „jdu cvičit"** — typ tréninku, úroveň, poznámka (vytvoření za 60 sekund)
  - **Automatický match** — stejné místo + překryv času
  - **Chat** — jednoduchá komunikace pouze po oboustranném matchi
  - **Bezpečnost** — žádné pravé jméno, minimální osobní údaje, blokování a reporting uživatelů
  - **Automatické mazání** — zprávy se smažou 24h po tréninku, data po 30 dnech neaktivity

  ### Premium (99 Kč/měsíc)

  - Neomezené příspěvky (free = 1/den)
  - Pokročilé filtry
  - Zvýraznění příspěvku
  - Verified badge

  ### Tech stack

  Kotlin + Jetpack Compose (UI), Firebase Auth + Firestore + Cloud Messaging (backend), Hilt (dependency injection), MVVM architektura. Lokalizace CZ/EN.

  Aplikace je ve fázi prototypu.
body_en: |
  ## About the Project

  SpotMe is an Android app for people who work out alone and want an occasional training partner — whether beginners or advanced. No social feed, no unnecessary profiles. Purely a utility for arranging workouts.

  ### Problem

  Many people would exercise more regularly if they had a partner. Arranging through social media is slow and uncomfortable. The main challenge is finding someone at the same time and place.

  ### Solution

  SpotMe works simply:

  1. Select your city and gym
  2. Set a time window (e.g., today 6–8 PM)
  3. Create a "going to work out" post with workout type (legs, back, cardio...)
  4. The system automatically matches you with people at the same gym with overlapping time
  5. After matching, a simple chat opens

  ### Key Features

  - **Gym selection** — city, gym, address with map
  - **Time window** — set when you plan to work out
  - **"Going to work out" post** — workout type, level, note (creation in 60 seconds)
  - **Automatic matching** — same location + time overlap
  - **Chat** — simple communication only after mutual match
  - **Safety** — no real name required, minimal personal data, user blocking and reporting
  - **Auto-deletion** — messages deleted 24h after workout, data after 30 days of inactivity

  ### Premium (99 CZK/month)

  - Unlimited posts (free = 1/day)
  - Advanced filters
  - Highlighted posts
  - Verified badge

  ### Tech Stack

  Kotlin + Jetpack Compose (UI), Firebase Auth + Firestore + Cloud Messaging (backend), Hilt (dependency injection), MVVM architecture. Localization CZ/EN.

  The app is in prototype stage.
---
