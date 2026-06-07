# RustCourseByAi

A bilingual GitHub Pages course for C++ programmers who want to learn Rust syntax and real-world Rust engineering practices.

## View the site

This repository is designed to publish the static site in `docs\` with GitHub Pages. A GitHub Actions workflow is included at `.github\workflows\pages.yml`.

1. Open repository **Settings**.
2. Go to **Pages**.
3. Select **GitHub Actions** as the source. If branch publishing is preferred, select the `main` branch and the `/docs` folder.
4. Save the setting. The workflow will deploy the site on pushes to `main`.

For this repository, the expected Pages URL is:

```text
https://dexterdreeeam.github.io/RustCourseByAi/
```

## Repository structure

```text
.copilot\instruction.md   Project construction and content authoring principles
.github\workflows\pages.yml
                           GitHub Pages deployment workflow
docs\index.html           GitHub Pages entry point
docs\assets\styles.css    Dark theme and responsive layout
docs\assets\app.js        Navigation, language switching, and rendering
docs\content\course-data.js
                           Structured bilingual course content
docs\.nojekyll            Disables Jekyll processing on GitHub Pages
```

## Content principles

- Audience: programmers with C++ experience.
- Languages: Chinese and English must stay aligned.
- Lesson format: one knowledge point per section.
- Required lesson parts: syntax explanation and engineering usage.
- Comparisons: explain Rust concepts through C++ analogies when useful.
- Engineering references: see `.copilot\instruction.md` for the Rust repositories used as long-term examples.
