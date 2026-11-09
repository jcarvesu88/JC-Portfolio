# Joey Christian Arvesu (JC Arvesu) — Personal Portfolio

A responsive, animated, dependency-free personal developer and cloud-support portfolio for Joey Christian Arvesu, professionally branded as JC Arvesu, built from his CV and featuring the OrbitDesk 1.1.0 helpdesk ticketing system.

## What is included

- Animated professional hero and interactive background
- About, expertise, full experience, certifications, education, and toolkit sections
- Featured OrbitDesk case study with three interactive screenshot-style UI previews
- Responsive navigation and layouts for desktop, tablet, and mobile
- Accessible keyboard states, semantic structure, skip link, and reduced-motion support
- Downloadable CV in `assets/Joey-Christian-Arvesu-CV.pdf`
- Contact form that opens the visitor's email client (no backend and no data collection)
- SEO/OG metadata, favicon, web manifest, robots file, and GitHub Pages-ready `.nojekyll`

## Run locally

No build step or package installation is required.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Upload the folder to any static host, including GitHub Pages, Azure Static Web Apps, Netlify, Cloudflare Pages, or an ordinary web server.

## Files

- `index.html` — page content and OrbitDesk preview markup
- `styles.css` — complete visual system, animation, and responsive behavior
- `script.js` — menu, particles, reveal, tabs, tilt, contact form, and interaction logic
- `assets/favicon.svg` — site icon
- `assets/Joey-Christian-Arvesu-CV.pdf` — downloadable CV

## Notes

OrbitDesk preview screens are browser-rendered, screenshot-style reproductions derived from the working OrbitDesk 1.1.0 application and its seeded demonstration data. The portfolio itself has no external runtime dependencies.
