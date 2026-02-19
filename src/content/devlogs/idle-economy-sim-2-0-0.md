---
projectSlug: idle-economy-sim
version: 2.0.0
versionStatus: stable
releaseDate: 2026-02-13
summary_cs: |-
  -Přepsal jsem text do čitelnější struktury s jasnými nadpisy a sekcemi.
  -Zkrátil a zpřesnil úvod: co GSS je a co není (design-time vs runtime).
  -Vylepšil odrážky (méně “omáčky”, více konkrétních benefitů).
  -Sjednotil styl a terminologii (progression, balance issues, exporty).
  -Zjednodušil “Platform & Requirements” do krátkých bodů
summary_en: >-
  -Restructured the text into a clearer, more scannable layout with headings.

  -Tightened the intro to clearly state what GSS is and isn’t (design-time vs runtime).

  -Improved bullet points to be more specific and benefit-focused.

  -Standardized tone and terminology (progression, balance issues, exports).

  -Simplified “Platform & Requirements” into concise bullets.
new_features:
  - cs: Deterministická simulace (seeded RNG) – stejné vstupy + stejný seed = stejné
      výsledky.
    en: "Deterministic simulations (seeded RNG): same inputs + same seed = identical
      results."
  - cs: Canonical TickEngine – jedna “pravda” pro preview, batch i analýzy
      (sjednocená tick semantika).
    en: "Canonical TickEngine: a single source of truth for preview, batch runs, and
      analysis."
  - cs: Splitter node – explicitní dělení toku (equal/weighted), aby bylo chování
      grafu čitelné a kontrolované.
    en: "Splitter node: explicit flow splitting (equal/weighted) for clear,
      controllable routing."
  - cs: Graph Validator + Issues panel – kontrola grafu před spuštěním + kliknutím
      přejdeš na problematický node/edge.
    en: "Graph Validator + Issues panel: pre-run checks with clickable, actionable
      diagnostics."
  - cs: Scenario Runner + A/B Compare – uložené scénáře a porovnání metrik (delta
      finálních hodnot, time-to-target, growth).
    en: "Scenario Runner + A/B Compare: saved scenarios and metric comparisons
      (final deltas, time-to-target, growth)."
  - cs: Player Personas (MVP) – simulace různých stylů hráčů (např.
      casual/grinder/min-max) a rozdíly ve výsledcích.
    en: "Player Personas (MVP): simulate different player behaviors (e.g.,
      casual/grinder/min-max) and compare outcomes."
  - cs: Parameter Sweep + Sensitivity – sweep parametrů + “co má největší dopad”
      (tornado/ranking) + export výsledků.
    en: "Parameter Sweep + Sensitivity: sweep parameters, rank impact
      (tornado/ranking), export results."
  - cs: Visual Graph Diff + Impact Diff – nejen “co se změnilo”, ale i “jaký to má
      dopad” po spuštění scénáře na A vs B.
    en: "Visual Graph Diff + Impact Diff: see what changed and what it caused by
      running the same scenario on both versions."
  - cs: Trace & Replay (MVP) – záznam průběhu a možnost přehrát časovou osu a
      zkoumat chování nodeů.
    en: "Trace & Replay (MVP): record run traces and scrub a timeline to inspect
      node behavior over time."
  - cs: Export snapshots + sample projekty – ochrana proti regresím v exportu
      (diffy, kontrola driftu).
    en: "Export snapshots + sample projects: regression protection against exporter
      drift via snapshot diffs."
  - cs: Licensing změny (pokud je v changelogu) – migrace/licence řešená čistěji
      (bez hardcoded secretů).
    en: "Licensing cleanup (if applicable): removed hardcoded secrets and moved to a
      cleaner distribution flow."
fixes:
  - cs: Nahrazení náhodnosti v simulaci za seeded RNG (reprodukovatelnost + Monte
      Carlo per-run seed).
    en: Replaced simulation-side global randomness with seeded RNG (including Monte
      Carlo per-run seeding).
  - cs: Sjednocení simulace přes TickEngine (méně “driftu” mezi režimy).
    en: Unified simulation logic through TickEngine to reduce semantic drift between
      modes.
  - cs: Opravy UI/ergonomie (toolbar overflow, drobné warningy/typy/label overlap –
      dle tvého changelogu).
    en: Multiple UI/quality fixes (toolbar overflow, label overlaps, reduced console
      warnings, safer typing/casts—per your changelog).
  - cs: Stabilnější workflow pro export (snapshots + vzorové projekty).
    en: More reliable export workflow with snapshots + samples.
known_issues:
  - cs: "Výkon na velkých grafech: u opravdu velkých systémů může být batch/sweep
      pomalejší (hlavně při vysokém počtu runů)."
    en: "Performance on large graphs: very large systems and heavy sweeps can be
      slow (especially with many runs)."
  - cs: "Trace může být velký: při nízkém sampling intervalu naroste velikost trace
      souboru a UI replay může zpomalit"
    en: "Trace size & replay overhead: low sampling intervals can produce large
      trace files and slower replay UI."
  - cs: "Sweep guardrails: běhy jsou omezené limitem (max runs) – je to schválně,
      aby ses nezabil výkonem."
    en: "Sweep guardrails: run counts are intentionally capped to prevent runaway
      compute."
  - cs: "Semantika tick order / gates: pokud uživatel očekává jiné pořadí než
      aktuální tick spec, může být výsledek “překvapivý” (proto je Semantics
      panel)."
    en: "Tick semantics expectations: if users expect a different tick order
      (especially around gates), results may be surprising—use the Semantics
      panel as the source of truth."
  - cs: "Floating-point a extrémní čísla: u velmi dlouhých simulací a obřích hodnot
      může být potřeba další stabilizace/formatting."
    en: "Floating-point extremes: very long simulations with huge values may need
      additional numeric stabilization/formatting"
  - cs: "Export drift: snapshots pomáhají, ale každá změna core semantiky může
      vyžadovat update sample snapshotů."
    en: "Export drift management: snapshots help, but any core semantic change may
      require updating sample snapshots."
---
