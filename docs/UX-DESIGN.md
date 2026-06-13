# UX & Interaction Design

This document records the user-experience and interaction decisions for the Rust
Course By AI site. **Whenever UX or interaction behavior changes, update this file
in the same change** so it stays the single source of truth for look-and-feel.

Implementation lives in `docs/assets/app.js` (behavior) and
`docs/assets/styles.css` (visuals). Content/formatting conventions are enforced
by chapter authors in `docs/content/**`.

---

## 1. Code-example interactivity

### 1.1 Method quick-reference tooltips
Goal: in any code example (including the wrong/`mistakes` code blocks), every
method that also appears in a "常用方法速查 / Common method interface table"
(`methodTable` example) is interactive — hovering it reveals its signature and
explanation pulled straight from that quick reference.

- **Registry source of truth.** A registry is built once at init
  (`buildMethodRegistry` in `app.js`) by scanning every `methodTable` example in
  `window.RUST_COURSE_DATA`. Each `fn <Type>::?name(...)` signature segment is
  parsed to its short method name. A name maps to **all** matching entries, so
  shared names show every owner (e.g. `unwrap` lists both `Option<T>` and
  `Result<T, E>`).
- **What gets marked.** During Rust syntax highlighting an identifier is marked
  as a method reference only when it is in a call position — preceded by `.`
  (method/turbofish call like `.parse::<u16>()`) or immediately followed by `(`
  (e.g. `String::new(`). This keeps variables named like methods unmarked.
- **Tooltip content order (fixed):**
  1. **Interface type / owner group** — bold, uppercase, accent color, on top.
  2. **Signature** — syntax-highlighted, below the type.
  3. **Explanation** — muted text, last.
- **Language aware.** Group title and explanation are picked for the active
  `zh`/`en` language at hover time.
- **Positioning.** Tooltip is `position: fixed`, placed below-left of the
  reference, flips above when there is no room, clamps to the viewport, is
  `pointer-events: none`, and repositions on scroll.

### 1.2 Visual affordance for method references
The reference must read as interactive **without blurring the code glyphs**.

- **Do NOT use glow / large-blur `text-shadow`.** Centered blurred glows smear the
  letters and were explicitly rejected. Keep code crisp.
- **Do NOT use an underline** for this affordance (too weak against the code).
- **At rest:** a crisp offset drop shadow that keeps edges sharp and hints the
  element is hoverable:
  `text-shadow: 1.5px 1.5px 0 rgba(56, 189, 248, 0.45);` (blur radius `0`).
- **On hover / focus:** feedback comes mainly from a faint background tint and a
  thin ring; the offset shadow stays **subtle — not stronger than the rest
  state**:
  - `background: rgba(56, 189, 248, 0.14);`
  - `box-shadow: 0 0 0 0.12rem rgba(56, 189, 248, 0.22);`
  - `text-shadow: 1px 1px 0 rgba(56, 189, 248, 0.3);`
- `cursor: help;` and keyboard focus (`tabindex="0"`, `:focus-visible`) are
  supported so the hint is reachable without a mouse.

### General interaction principle
Resting affordances should hint interactivity faintly but visibly; hover/focus
feedback should be clearly present but never overwhelming or blurry.

### 1.3 Same-identifier highlight on hover
Goal: in any code example, hovering an identifier highlights occurrences of the
**same identifier in the same lexical scope** within that code block, so a reader
can trace where a particular variable or function name is used.

- **Scope is the single code block** (the nearest `<pre>`), so the main example
  and each mistake block highlight independently and never bleed across blocks.
- **Scope-aware, not just name-matching.** Local variables and parameters are
  scoped to their enclosing `fn` body: two different `request` parameters in two
  different functions are treated as distinct and do **not** cross-highlight.
  Function/item names (definition and call sites) and method references are
  global within the block, so a function name highlights its definition and all
  its call sites together. (Heuristic: a fresh scope id is assigned per top-level
  `fn`, tracked by brace depth; `data-scope` carries it, `"g"` = global.)
- **Which tokens participate.** Plain identifiers (variables, fields), function
  names (call position), and method references carry `data-ident` + `data-scope`.
  Keywords, literals, types/enum variants, numbers, strings, comments, lifetimes,
  and the bare `_` wildcard do not participate.
- **Visual.** Highlighted occurrences get a soft accent background tint plus a 1px
  ring (`.ident-highlight`), crisp (no blur). The hovered method reference still
  shows its own tooltip/affordance on top.
- **Implementation.** `setupIdentHighlight` in `app.js` uses delegated
  `mouseover`/`mouseout` on `root`; it scopes the lookup to `el.closest("pre")`
  and toggles `.ident-highlight` on every
  `[data-ident="<name>"][data-scope="<scope>"]` within it.

---

## 2. Header brand

Goal: the top-left brand should read as a polished course identity, not as a
plain repository name.

- **Visible title.** The primary visible brand text is only `Rust Course`.
- **Art direction.** The title uses a crisp gradient text treatment, tight
  tracking, and a subtle offset shadow so it feels more designed without blurring
  the glyphs.
- **AI note.** The small subtitle is `Course is generated by AI`, rendered in
  semi-transparent uppercase text. It is supporting metadata, not part of the
  main title.

---

## 3. Header GitHub Star CTA

Goal: the top-right header should make it obvious that readers can support the
project by starring the GitHub repository, while staying honest about what a pure
static GitHub Pages site can know.

- **CTA placement.** The Star CTA lives in `.header-actions` next to the language
  toggle. It keeps the existing rounded pill style, but uses a star icon, stronger
  label, and optional public count so it reads as an action rather than a generic
  repository link.
- **Public count only.** The page fetches
  `https://api.github.com/repos/DexterDreeeam/RustCourseByAi` and displays
  `stargazers_count` when available. If the public API fails or is rate-limited,
  the CTA remains usable and the count is hidden.
- **No verified per-user star state.** Without OAuth or a backend, the page cannot
  safely know whether the current GitHub user has starred the repository. Do not
  display a confirmed "already starred" state.
- **Click feedback.** After the reader clicks the CTA, store a local
  `localStorage` flag and change the label to a thank-you / support message. This
  means the reader followed the CTA; it is not proof that GitHub recorded a star.
- **Language aware.** CTA label, thank-you label, and accessible label follow the
  active `zh`/`en` language.

---

## 4. Content & formatting conventions (chapter authoring)

These shape the reading experience and must be followed in `docs/content/**`.

- **Concept before code.** An explanation card (`textExample`) for a syntax
  feature comes **before** the code example it describes — explain the idea, then
  show the code. (e.g. the `@` binding / `_` wildcard card precedes the download
  state-machine example.)
- **Keep canonical technical terms in their original form.** Do not force-translate
  proper/technical terms into Chinese when the English/original is the canonical
  name. Inside Chinese prose keep terms like `Option`, `Result`, `panic`,
  `absence`, `recoverable failure`, `program bug` as-is.
- **Be precise about semantics.** Examples of required accuracy:
  - `Option<T>` = a value is **optional** (`Some(T)` or `None`), not simply
    "no value".
  - `Result<T, E>` = the **outcome** of an operation: `Ok(T)` carries the value,
    `Err(E)` carries the error; it is "recoverable" because the failure is
    returned to the caller (vs `panic!`, which aborts).
- **Inline formatting in text cards: backticks only.** Paragraph text is rendered
  by `formatInline`, which converts only `` `code` `` to `<code>`. Markdown bold
  `**...**` is **not** supported and will render literal asterisks — do not use it.
- **Show positive usage, not only mistakes.** Each concept should include correct
  usage examples (e.g. a `panic!` "when to use" example), in addition to any
  `withMistakes` wrong-code blocks.
- **Bilingual parity.** Every section stores `zh` and `en` together; never add or
  edit one language without the matching other-language text. Code comments
  follow the page language.

---

## 5. Operational notes

- **Cache busting.** After editing any file under `docs/assets/`, bump the `?v=`
  query string on every asset reference in `docs/index.html` (single shared
  version stamp) so GitHub Pages serves fresh CSS/JS.
- **No-build static site.** All behavior is plain classic-script JS; chapter files
  run inside an IIFE consuming helpers from `window.Course`. No bundler step.

---

## 6. Change log discipline

When you change anything in this document's scope (interaction behavior, affordance
visuals, content/formatting conventions), update the relevant section here in the
same commit. Treat this file as the design contract that the broader
`.github/copilot-instructions.md` points to.
