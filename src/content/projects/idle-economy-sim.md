---
projectSlug: idle-economy-sim
status: live
category: tool
featured: true
year: 2025
title_cs: Game System Simulator (GSS)
title_en: Game System Simulator (GSS)
summary_cs: Webový nástroj pro indie game devs — vizuálně navrhni, simuluj a vybalancuj
  herní ekonomiku (idle/incremental). Definuj resources, producery, upgrady a sleduj
  grafy produkce v čase. Export do JSON/CSV.
summary_en: Web-based tool for indie game devs — visually design, simulate, and balance
  game economies (idle/incremental). Define resources, producers, upgrades and watch
  production graphs over time. Export to JSON/CSV.
stack:
  - TypeScript
  - Chart.js
  - Webpack
  - Godot SDK
links_website: https://neopryus.itch.io/idle-economy-simulator
links_demo: ""
links_github: ""
links_other: ""
images:
  - /uploads/idle-economy-sim-screenshot-1.png
body_cs: |
  ## O projektu

  Game System Simulator (GSS) je webový nástroj pro indie herní vývojáře, kteří potřebují navrhnout a vybalancovat ekonomické a progression systémy pro idle/tycoon/incremental hry — bez toho, aby museli psát kód.

  ### Problém

  Idle hry často trpí špatně vyváženou ekonomikou: hráč buď uvízne na jednom místě, nebo naopak dokončí hru příliš rychle. Balancování ekonomiky je iterativní proces, který vyžaduje opakované testování — a bez dedikovaného nástroje to znamená hodiny úprav přímo v kódu hry.

  ### Řešení

  GSS poskytuje vizuální rozhraní, kde si nadefinujete celou herní ekonomiku a v reálném čase sledujete, jak se chová v simulaci. Žádný kód, jen konfigurujte a testujte.

  ### Jak to funguje

  1. **Definujte resources** — základní měny a materiály (coins, gems, wood...)
  2. **Vytvořte producery** — budovy/generátory s produkční sazbou, cenou a scaling formulí (lineární/exponenciální)
  3. **Přidejte upgrady** — multiplikátory produkce, odemykací podmínky (úroveň produceru, množství resources, čas)
  4. **Nastavte počáteční stav** — výchozí množství resources
  5. **Spusťte simulaci** — testujte ekonomiku na různých časových úsecích (1 hodina, 24 hodin, 7 dní)
  6. **Analyzujte grafy** — Money vs Time a Production Rate vizualizace pro balancovací rozhodnutí
  7. **Exportujte** — konfigurace jako JSON pro import do hry, simulační výsledky jako CSV

  ### Tech stack

  TypeScript pro typově bezpečný vývoj, Chart.js pro vizualizaci dat, Webpack pro bundling. Obsahuje i Godot SDK a Unity SDK pro přímou integraci do herních enginů.

  Nástroj je dostupný na itch.io a aktivně vyvíjen.
body_en: |
  ## About the Project

  Game System Simulator (GSS) is a web-based tool for indie game developers who need to design and balance economic and progression systems for idle/tycoon/incremental games — without writing code.

  ### Problem

  Idle games often suffer from poorly balanced economies: players either get stuck or finish the game too quickly. Balancing an economy is an iterative process requiring repeated testing — and without a dedicated tool, this means hours of tweaking directly in game code.

  ### Solution

  GSS provides a visual interface where you define your entire game economy and watch it behave in real-time simulation. No code, just configure and test.

  ### How It Works

  1. **Define resources** — basic currencies and materials (coins, gems, wood...)
  2. **Create producers** — buildings/generators with production rate, cost, and scaling formula (linear/exponential)
  3. **Add upgrades** — production multipliers, unlock conditions (producer level, resource amount, time)
  4. **Set starting state** — initial resource amounts
  5. **Run simulation** — test your economy over different time periods (1 hour, 24 hours, 7 days)
  6. **Analyze graphs** — Money vs Time and Production Rate visualizations for balancing decisions
  7. **Export** — configurations as JSON for game import, simulation results as CSV

  ### Tech Stack

  TypeScript for type-safe development, Chart.js for data visualization, Webpack for bundling. Includes Godot SDK and Unity SDK for direct game engine integration.

  The tool is available on itch.io and actively developed.
---
