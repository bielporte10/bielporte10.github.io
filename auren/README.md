# Auren — website example

A 4-page marketing site demo for **Auren**, a fictional clean-energy infrastructure company (invented for this demo, not a real company). Built to show a client-ready multi-page, multi-language site: no build tooling, no framework, just HTML/CSS/JS.

## Pages

- `index.html` — Home
- `company.html` — Company
- `solutions.html` — Solutions
- `contact.html` — Contact (working client-side form validation; no backend, so nothing is actually sent)

## Languages

English, Español, Català and Français, switchable live from the nav bar (no page reload). Translations live in `i18n/*.js`.

## Running locally

Opening the HTML files directly (`file://`) won't load the language files in every browser. Serve the folder instead:

```bash
python -m http.server 8000
# then open http://localhost:8000/index.html
```

## Stack

Plain HTML, CSS and vanilla JS. No dependencies, no build step.
