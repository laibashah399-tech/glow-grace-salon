# Glow & Grace Salon (static demo)
HTML5 + Tailwind (Play CDN) + vanilla JS. No build step.

## Preview locally
Open `index.html` in a browser (or run `python3 -m http.server` in this folder and visit http://localhost:8000). Needs internet for Tailwind CDN and Google Fonts.

## Edit
- WhatsApp number, form endpoint, GA4 ID: top of `assets/js/script.js` (`CONFIG`). Also replace `923001234567` inside the static `href` fallbacks (search all pages) or re-run your editor's find/replace.
- Production URL: replace `https://YOUR-USERNAME.github.io/glow-grace-salon` in all pages, `sitemap.xml` and `robots.txt` (find/replace).
- Prices/services: edit the cards in `services.html` (and `index.html`); keep `data-cat` and `data-service` attributes.
- Photos: put WebP files in `assets/images/` (descriptive names, e.g. `bridal-makeup-nikkah-lahore.webp`) and replace each gradient `<div role="img">` / gallery tile with `<img src="assets/images/..." alt="..." width="800" height="1000" loading="lazy">`. Do not lazy-load the hero image.
- Tailwind Play CDN is for development and demos. For production, install the Tailwind CLI, generate `assets/css/tailwind.css` and replace the CDN `<script>` tags.

## Contact form
A static site cannot send email by itself. Create a free Formspree form, copy its URL into `CONFIG.formEndpoint`. Until then the form says it is not connected and points to WhatsApp (no fake success).

## Deploy to GitHub Pages
1. Create a public repo (e.g. `glow-grace-salon`), upload all files.
2. Settings > Pages > Deploy from branch > `main` / root > Save.
3. Site URL: `https://USERNAME.github.io/glow-grace-salon/`. Update `BASE` URLs as above.
4. GitHub Pages serves `404.html` for missing pages with a real 404 status. `.htaccess` is ignored there (Apache only).

## Google Analytics 4
Set `CONFIG.ga4Id`. The script loads GA only after the visitor accepts the consent bar, tracks `whatsapp_click` and `form_submit_success`, and sends no personal data.

## Google Search Console
Add the site, verify with the HTML meta tag (paste into the comment spot in each page `<head>`) or an uploaded HTML file, then submit `sitemap.xml`, use URL Inspection, and watch the Pages report. Not verified or indexed until you do this.

## Checklist (tick after testing)
- [ ] All nav, footer and breadcrumb links work after deploy
- [ ] WhatsApp buttons open the right chat with the service name
- [ ] Filters work on Services and Gallery; lightbox: Esc, arrows
- [ ] Form: validation errors, success via real endpoint
- [ ] Canonical/OG URLs, sitemap and robots use the real domain
- [ ] Photos and OG image replaced; alt text added
- [ ] Privacy Policy [brackets] completed
- [ ] Lighthouse run (scores not measured yet)
