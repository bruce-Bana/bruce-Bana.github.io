# Bruce Bana — Personal portfolio

A lightweight, responsive portfolio for Bruce Bana, software developer and AI systems builder based in Kampala, Uganda.

## Design

The site uses a dark editorial visual system with restrained cyan and violet accents, glass surfaces, responsive project cards, clear typography and a compact mobile navigation. The homepage highlights selected projects, technical interests, engineering notes and contact links.

## Features

- Responsive layouts for desktop, tablet and mobile
- Accessible navigation, keyboard escape support and skip-to-content link
- Lightweight animated starfield on capable desktop devices
- Reduced-motion and save-data awareness
- Project, blog, profile, dashboard, lab, games and search pages
- Search-engine metadata, canonical URLs, structured data, robots.txt and XML sitemap
- Installable/offline support through the existing web manifest and service worker
- No frontend framework or build dependencies; plain HTML, CSS and JavaScript

## Pages

- `index.html` — Home and selected work
- `about.html` — About and technical background
- `projects.html` — Project portfolio
- `interests.html` — Interests
- `contact.html` — Social and contact links
- `blog.html` and `blog-*.html` — Engineering notes
- `dashboard.html`, `lab.html`, `games.html`, `search.html`, `cv.html` — Interactive and profile pages

## Local preview

Open `index.html` directly in a browser, or run a simple static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

The repository is hosted on GitHub Pages. Commits to the configured publishing branch trigger the existing Pages deployment workflow.

## SEO

The canonical site address is https://bruce-bana.github.io/. The repository includes `robots.txt`, `sitemap.xml`, Google Search Console verification, Open Graph metadata and JSON-LD structured data. After deployment, submit `https://bruce-bana.github.io/sitemap.xml` in Google Search Console.

## License

MIT.
