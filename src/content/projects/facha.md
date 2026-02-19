---
projectSlug: facha
status: beta
category: app
featured: true
year: 2025
title_cs: FACHA
title_en: FACHA
summary_cs: Offline fakturační a evidenční aplikace pro řemeslníky a OSVČ.
  Generuje PDF faktury s QR platbami, funguje bez internetu.
summary_en: Offline invoice and job tracking app for tradespeople and
  freelancers. Generates PDF invoices with QR payments, works without internet.
stack:
  - Flutter
  - Riverpod
  - Drift/SQLite
  - PDF
  - QR
  - ARES API
links_website: ""
links_demo: https://www.dropbox.com/scl/fi/q4oqquu4rtfrrbd2loret/FACHA-v0.3.0.apk?rlkey=wsyz50qzmvcr7aoagfe6zjhvx&st=s1496trc&dl=0
links_github: ""
links_other: https://docs.google.com/forms/d/13UHdx3Sa2nBoMW9gzbulC2n7O-hdm-yDt5XSC1cY__k/edit?usp=forms_home&ouid=101289173675479405977
links_other_label: Feedback formulář
images:
  - /uploads/screenshot_20260205-014402.jpg
  - /uploads/screenshot_20260205-014357.jpg
  - /uploads/screenshot_20260205-014221.jpg
  - /uploads/screenshot_20260205-014345.jpg
  - /uploads/screenshot_20260205-014144.jpg
  - /uploads/screenshot_20260205-014051.jpg
  - /uploads/screenshot_20260205-014302.jpg
  - /uploads/screenshot_20260205-014136.jpg
  - /uploads/screenshot_20260205-014031.jpg
  - /uploads/screenshot_20260204-151230.jpg
  - /uploads/screenshot_20260205-014028.jpg
  - /uploads/screenshot_20260205-014307.jpg
  - /uploads/screenshot_20260205-014154.jpg
  - /uploads/screenshot_20260205-014042.jpg
  - /uploads/screenshot_20260205-014108.jpg
  - /uploads/screenshot_20260205-014037.jpg
body_cs: |
  ## O projektu

  FACHA je mobilní aplikace pro české řemeslníky a OSVČ — digitální parťák pro správu zakázek, fotodokumentaci a fakturaci. Celá aplikace funguje offline-first, takže ji můžete používat i na stavbě bez signálu.

  ### Problém

  Řemeslníci a OSVČ tráví hodiny papírováním. Ztrácejí přehled o zakázkách, zapomínají detaily, fakturují pozdě nebo vůbec. Většina fakturačních aplikací vyžaduje internet, je složitá a není navržená pro práci v terénu.

  ### Řešení

  FACHA je jednoduchá offline aplikace, ve které za pár kliknutí:

  - Založíte zakázku a přiřadíte klienta
  - Vyfotíte stav „před" a „po"
  - Zapíšete si poznámky přímo na místě
  - Vygenerujete PDF fakturu s QR kódem pro platbu
  - Sdílíte fakturu přes WhatsApp, email nebo jinak

  ### Klíčové funkce

  - **Kompletní offline funkcionalita** — lokální SQLite databáze (Drift), žádný cloud
  - **Správa zakázek** — stavy: návrh → naplánováno → probíhá → hotovo → fakturováno
  - **Evidence klientů** — ruční zadání nebo automatické načtení z ARES (stačí zadat IČO)
  - **Fotodokumentace** — foto před/po přímo z aplikace
  - **PDF fakturace** — generování faktur s vlastním brandingem a kontaktními údaji
  - **QR platby** — český SPD standard pro okamžité bankovní platby
  - **Navigace a volání** — navigace na adresu zakázky, rychlé volání klientovi
  - **Sdílení** — export PDF přes systémové sdílení (WhatsApp, email, Messenger...)

  ### Tech stack

  Flutter + Riverpod (state management), go_router (navigace), Drift/SQLite (offline databáze), Dio (HTTP/ARES), pdf + printing (PDF generování), qr (QR kódy).

  Aplikace je v beta verzi a aktivně vyvíjena na základě zpětné vazby uživatelů.
body_en: |
  ## About the Project

  FACHA is a mobile app for Czech tradespeople and freelancers — a digital sidekick for job management, photo documentation, and invoicing. The entire app works offline-first, so you can use it on a construction site with no signal.

  ### Problem

  Tradespeople and freelancers spend hours on paperwork. They lose track of jobs, forget details, and invoice late or not at all. Most invoicing apps require internet, are complex, and aren't designed for fieldwork.

  ### Solution

  FACHA is a simple offline app where in just a few taps you can:

  - Create a job and assign a client
  - Take "before" and "after" photos
  - Write notes directly on site
  - Generate a PDF invoice with QR code for payment
  - Share the invoice via WhatsApp, email, or other apps

  ### Key Features

  - **Complete offline functionality** — local SQLite database (Drift), no cloud required
  - **Job management** — states: draft → scheduled → in progress → done → invoiced
  - **Client records** — manual entry or automatic lookup from ARES (Czech business registry, just enter company ID)
  - **Photo documentation** — before/after photos directly from the app
  - **PDF invoicing** — invoice generation with custom branding and contact details
  - **QR payments** — Czech SPD standard for instant bank transfers
  - **Navigation & calling** — navigate to job address, quick-call the client
  - **Sharing** — export PDF via system share sheet (WhatsApp, email, Messenger...)

  ### Tech Stack

  Flutter + Riverpod (state management), go_router (navigation), Drift/SQLite (offline database), Dio (HTTP/ARES), pdf + printing (PDF generation), qr (QR codes).

  The app is in beta and actively developed based on user feedback.
---
