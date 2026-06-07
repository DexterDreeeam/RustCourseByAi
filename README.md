# Rust Course By AI

A GitHub Pages course for C++ programmers who want to learn Rust syntax, mental models, and real-world Rust engineering practices.

## View the site

This repository is designed to publish the static site in `docs\` with GitHub Pages. The current deployed site is published from the `gh-pages` branch, where the site files live at the branch root.

1. Open repository **Settings**.
2. Go to **Pages**.
3. Use the `gh-pages` branch as the Pages source if GitHub asks for a source.
4. Open the generated Pages URL.

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
docs\assets\rust-logo.svg Official Rust logo source asset
docs\assets\rust-logo-favicon.svg
                           Theme-adaptive Rust logo used as the browser tab icon
docs\assets\rust-logo-white.svg
                           White transparent Rust logo used in the site UI
docs\content\course-helpers.js
                           Shared content authoring helpers
docs\content\references.js
                           Shared Rust engineering reference repositories
docs\content\beginner\*.js
                           Beginner chapters, one chapter per file
docs\content\advanced\*.js
                           Advanced chapters, one chapter per file
docs\content\course-data.js
                           Final data assembler for the page
docs\.nojekyll            Disables Jekyll processing on GitHub Pages
```

The deployed `gh-pages` branch contains the same site files at its root, plus the Pages deployment workflow used by GitHub Actions.

## Content principles

- Audience: programmers with C++ experience.
- Chinese and English versions share the same structure, but the site should emphasize the C++-to-Rust learning path rather than language support.
- Lesson format: one knowledge point per section.
- Required lesson parts: syntax explanation and engineering usage.
- Comparisons: explain Rust concepts through C++ analogies when useful.
- Engineering references: see `.copilot\instruction.md` for the Rust repositories used as long-term examples.

## Logo attribution

The Rust logo asset is from `rust-lang/rust-artwork` and is distributed under the Creative Commons Attribution license (CC-BY 4.0). Rust and Cargo names/logos are Rust trademarks and should follow the Rust trademark policy.
