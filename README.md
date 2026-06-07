# RustCourseByAi

A bilingual GitHub Pages course for C++ programmers who want to learn Rust syntax and real-world Rust engineering practices.

## View the site

This repository is designed to publish from `docs\` with GitHub Pages.

1. Open repository **Settings**.
2. Go to **Pages**.
3. Select the `main` branch and the `/docs` folder.
4. Save the setting and open the generated Pages URL.

For this repository, the expected Pages URL is:

```text
https://dexterdreeeam.github.io/RustCourseByAi/
```

## Repository structure

```text
.copilot\instruction.md   Project construction and content authoring principles
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

