# Academic Portfolio Website

## Project structure

- `index.html` - Home page
- `projects.html` - Projects page
- `publications.html` - Publications page
- `cv.html` - Curriculum Vitae page
- `assets/css/style.css` - Shared styling
- `assets/js/main.js` - Shared renderer for nav/footer and data-driven sections
- `assets/data/content.json` - Single source of content for projects, publications, CV, and repeated home sections
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow

## Updating content (single-file workflow)

All recurring content entries are managed from:

- `assets/data/content.json`

Common updates:

1. Add or edit a publication in `home.publications` and or `publicationsPage.sections`.
2. Add or edit a project in `projectsPage.sections`.
3. Add or edit CV entries in `cvPage` (`education`, `experience`, `skills`, `awards`, `certifications`, `contactHtml`).
4. Keep page-specific static text (profile/about/research intro) in the HTML files.

## Deploy to GitHub Pages

1. Push to `main`.
2. In repository settings, set **Pages** source to **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` deploys automatically.
