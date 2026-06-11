# Copilot instructions — Rust Course By AI

This is a **no-build static site** under `docs/` published to GitHub Pages
(`https://dexterdreeeam.github.io/RustCourseByAi/`). It teaches Rust to engineers
who already know C++. Read this file before making changes.

## Authoritative references
- **`docs/UX-DESIGN.md`** — UX, interaction, and content/formatting conventions.
  **Always consult it before any UI/UX or content change, and update it in the
  same change when behavior or visuals change.**
- **`.copilot/instruction.md`** — project purpose, content data contract, page
  behavior expectations, and the Rust reference-repository table.

## Architecture (where things live)
- `docs/index.html` — entry point; loads helpers, every chapter file, the data
  assembler, then `app.js`. Holds the shared `?v=` cache-buster.
- `docs/assets/app.js` — rendering, navigation, language switching, Rust syntax
  highlighting, and the method-reference tooltip system.
- `docs/assets/styles.css` — dark theme, layout, token colors, affordances.
- `docs/content/course-helpers.js` — authoring helpers on `window.Course`
  (`t`, `sharedExample`, `localizedExample`, `textExample`, `tableExample`,
  `searchableTableExample`, `methodTableExample`, `withMistakes`, `lesson`).
- `docs/content/{beginner,advanced}/NN-topic.js` — one chapter per file, each an
  IIFE that pushes into `window.RUST_COURSE_CHAPTERS`.
- `docs/content/course-data.js` — assembles `window.RUST_COURSE_DATA` only; never
  put chapter content here.

## Content rules (summary — full contract in `.copilot/instruction.md`)
- One concrete knowledge point per section; every section needs `id`, and `zh`+`en`
  for `title`, `goals`, `syntax`, `engineering`, `cppComparison`.
- **Bilingual parity is mandatory:** never add/edit one language without the other.
- Prefer Rust-vs-C++ comparisons; assume the reader knows C++ (RAII, templates,
  references, build systems).
- Section IDs are globally unique. Code cards carry a language label; comments
  follow the page language.

## Content/formatting conventions (enforced; see UX-DESIGN.md §2)
- **Explain the concept before showing the code** it illustrates.
- **Keep canonical technical terms in their original form** inside Chinese prose
  (e.g. `Option`, `Result`, `panic`, `absence`, `recoverable failure`,
  `program bug`). Do not force-translate them.
- **Be semantically precise** (e.g. `Option<T>` = value is optional, not "no
  value"; `Result<T, E>` = `Ok(T)`/`Err(E)` outcome, recoverable because the
  failure is returned).
- **Text cards support backticks only.** `formatInline` renders `` `code` `` →
  `<code>`; markdown `**bold**` is NOT supported — never use it in paragraphs.
- Provide correct-usage examples, not only `withMistakes` wrong-code blocks.

## UX / interaction rules (enforced; see UX-DESIGN.md §1)
- Methods that appear in a `methodTable` quick reference are made interactive in
  all code examples (including mistake blocks) via a registry built from
  `RUST_COURSE_DATA`. Mark an identifier only in a call position (preceded by `.`
  or followed by `(`).
- Method-reference tooltip layout is fixed: **bold uppercase interface type on
  top, then signature, then explanation**; language-aware; shows all owners of a
  shared name.
- Affordance must keep code **crisp**: use a **crisp offset `text-shadow`
  (blur 0)** at rest — **no glow/large-blur, no underline**. On hover/focus, lead
  with a faint background tint + thin ring and keep the offset shadow subtle (not
  stronger than rest).
- Hovering an identifier highlights occurrences of the **same identifier in the
  same lexical scope** within one code block (`.ident-highlight`, scoped to the
  nearest `<pre>`). Local vars/params are scoped per enclosing `fn` body (two
  same-named params in different functions do NOT cross-highlight); fn/item names
  and method refs are block-global. Keywords/types/literals and bare `_` do not
  participate.

## Page behavior (summary — full list in `.copilot/instruction.md`)
- Language switching keeps the reader on the same lesson; section URLs are
  hash-based and shareable. Fixed left nav, scrolling content. Beginner/Advanced
  switched by top tabs. Code blocks show their language. A lesson's reference
  repositories are visible on the page.

## Operational
- **After editing anything in `docs/assets/`, bump the shared `?v=` stamp on every
  asset URL in `docs/index.html`** so GitHub Pages serves fresh files.
- Verify visually: serve `docs/` statically and open affected lessons before
  considering a UI/UX change done.
- **After every content or code change, commit and push it to GitHub** (`origin`
  / `main`) once the change is verified, so the maintainer can review the diff and
  see it live on GitHub Pages. Use a concise, descriptive commit message and never
  leave finished work uncommitted.
- `git` may not be on `PATH` in this environment. If so, use the git bundled with
  GitHub Desktop at
  `%LOCALAPPDATA%\GitHubDesktop\app-*\resources\app\git\cmd\git.exe` (resolve the
  `app-*` wildcard to the newest install).
