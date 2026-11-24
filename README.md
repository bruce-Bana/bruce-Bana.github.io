# Bruce Bana — Personal portfolio

A lightweight, responsive portfolio for Bruce Bana, an independent software developer in Uganda.

## Main pages

- `index.html` — Home, introduction and selected work
- `projects.html` — Software projects and experiments
- `about.html` — Background, skills and approach
- `contact.html` — Phone, WhatsApp, email and social links

The site intentionally keeps its public navigation to these four pages. Supporting files such as the custom 404 page, Google verification, sitemap, web manifest and service worker are infrastructure, not extra navigation pages.

## Features

- Responsive, accessible layouts
- Lightweight plain HTML, CSS and JavaScript; no frontend framework
- Search metadata, canonical URLs, structured data, robots.txt and a focused XML sitemap
- Installable/offline support through the web manifest and service worker
- Reduced-motion support

## Local preview

Run `python -m http.server 8000` in the project directory and visit `http://localhost:8000`.

## Deployment

Hosted on GitHub Pages. Commits to the publishing branch trigger the existing deployment workflow.

## SEO

Canonical site: https://bruce-bana.github.io/

Submit `https://bruce-bana.github.io/sitemap.xml` in Google Search Console after deployment.

## License

MIT.
