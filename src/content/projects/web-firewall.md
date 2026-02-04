---
projectSlug: web-firewall
status: prototype
category: tool
featured: true
year: 2024
title_cs: "Web Firewall"
title_en: "Web Firewall"
summary_cs: "Skener, který prohledává stránky s rizikovými prvky a pokusy donutit AI/skripty ukládat nebo odesílat data. Upozorňuje na manipulativní a nebezpečné vzory."
summary_en: "Scanner that detects risky patterns and attempts to force AI/scripts to store or exfiltrate data; highlights manipulative elements."
stack:
  - Web scanning
  - Rules
  - Security
links_website: ""
links_demo: ""
links_github: ""
links_other: ""
images:
  - /uploads/web-firewall-screenshot-1.png
---

## About the Project

Modern websites contain hidden manipulative elements that try to deceive users or abuse AI systems. Regular users can't see these threats.

### Solution

Web Firewall scans pages and detects risky patterns — from prompt injection attempts to manipulative dark patterns. It alerts about dangerous elements before they can cause harm.

### Features

- Prompt injection attempt detection
- Manipulative pattern scanning (dark patterns)
- Data exfiltration checks
- Rule engine for custom checks
- Reports and alerts
