# Rajae Elkamili, Portfolio

Static portfolio (HTML, CSS, vanilla JavaScript), served by GitHub Pages at https://rajaeelkamili.github.io/portfolio/

## Features
- English / French toggle, dark / light theme
- 21 projects with filters, search and a case study for each (problem, what I built, results, stack, links, screenshots)
- Results charts for the MLOps and sentiment-analysis projects
- Experience, skills, certifications, contact, downloadable CV
- Responsive, keyboard accessible, respects reduced-motion

## Structure
- `index.html`: page shell and SEO metadata
- `assets/data.js`: all content (EN and FR) and the project list
- `assets/app.js`: rendering, filters, project case studies, animations
- `assets/style.css`: design
- `assets/img/`: screenshots and the social preview image
- `cv/CV_Rajae_Elkamili.pdf`: CV

## Add or edit a project
Edit the `PROJECTS` array in `assets/data.js` (one object per project, text in `en` and `fr`). No build step.

## Run locally
Open `index.html` in a browser.
