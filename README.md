# Spark Companies — Website

Multi-page static site. Six pages, shared stylesheet and script.

## Pages
| File | Purpose |
|---|---|
| `index.html` | Home — hero, stats, the five firms, one-partner pitch, services overview, why Spark |
| `services.html` | Services & Pricing — staffing/BPO/ASO, 4-step process, **enrollment configurator**, industries |
| `companies.html` | The five specialist firms |
| `about.html` | Why Spark, leadership, video |
| `careers.html` | Employer / job-seeker paths, Hub & Swag |
| `contact.html` | Form, both offices, phone, fax, socials |

## Publishing on GitHub Pages
1. Push these files to the repository root (or a `/docs` folder).
2. Settings → Pages → Source: `Deploy from a branch` → `main` → `/ (root)`.
3. Site goes live at `https://sparkcompanies.github.io/<repo-name>/`.

## BEFORE LAUNCH — required edits

**1. Pricing is placeholder.** Every rate in the enrollment configurator is invented.
Open `assets/app.js`, find the `PRICING` object at the top, and replace all values with
Spark's real rates. Then delete the yellow warning banner in `services.html`
(search for `pricenote`).

**2. Social preview image.** Upload the supplied 1200×630 `spark-og-share-image-v2.png`
and add OG tags to each page `<head>`, or set it in Yoast if this moves into WordPress.
Force a re-scrape in Facebook Sharing Debugger and LinkedIn Post Inspector afterwards.

**3. Contact form** is display-only — wire it to a real handler or CRM.

**4. Video titles** in `about.html` are placeholders.

**5. Add** Privacy Policy and Terms pages; they're linked in the footer.

## Notes
- Logos and the team photo load from `sparkcompanies.com`. If that domain changes,
  update the `src` attributes or host the images in `assets/`.
- Fonts: Google Fonts (Bebas Neue, Lato, Roboto Condensed).
- The `®` is appended in markup; ideally bake it into the master logo file.
- Motion respects `prefers-reduced-motion`.
