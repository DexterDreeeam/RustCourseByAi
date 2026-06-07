# Rust Course By AI project instructions

## Project purpose

This repository hosts a GitHub Pages tutorial site that teaches Rust to programmers who already know C++. The first half of the course builds Rust syntax and mental models; the second half moves into real project engineering experience. The site should constantly explain how Rust concepts relate to familiar C++ concepts.

## Required site principles

- The website is a no-build static site under `docs\` and is intended to be viewed through GitHub Pages.
- The UI uses a black/dark theme by default.
- The course has Chinese (`zh`) and English (`en`) versions, but product copy should foreground the C++-to-Rust learning path rather than bilingual support.
- Chinese and English content must stay conceptually aligned as an implementation requirement. Do not add a section in one language without the matching section in the other language.
- Each lesson teaches one concrete knowledge point.
- Each lesson must include two required explanations:
  1. Syntax-level explanation.
  2. Concrete engineering/project usage.
- Lessons should assume the reader understands C++ basics, RAII, templates, references, pointers, build systems, and common project organization.
- Prefer Rust-vs-C++ comparisons over generic Rust explanations when a comparison clarifies the idea.
- Examples should be original or short adapted snippets. Do not copy large blocks from other repositories.
- Avoid using "bilingual" as a primary marketing point in visible site text. Mention language switching only where it helps navigation or contribution rules.

## Content data contract

Course content is stored as structured JavaScript data under `docs\content\`.

Every section should have:

- A stable `id`.
- `title.zh` and `title.en`.
- `goals.zh` and `goals.en`.
- `syntax.zh` and `syntax.en`.
- `engineering.zh` and `engineering.en`.
- `cppComparison.zh` and `cppComparison.en`.
- `examples`, each with a language label such as `rust`, `cpp`, or `toml`. Example `code` may be a shared string or localized `code.zh` / `code.en` object.
- Optional `references` containing repository names from the reference table below.

When adding or changing content:

- Keep section order identical for both language versions by storing both versions in the same section object.
- Keep code examples small and focused on the section's single knowledge point.
- If a code example contains explanatory comments, Chinese pages should show Chinese comments and English pages should show English comments.
- If a concept differs sharply between Rust and C++, explicitly describe the trade-off.
- Engineering explanations should answer: "How would this appear in a real project?"

## Engineering topics to cover

Future content should gradually cover:

- Module and crate organization.
- Workspace layout and API boundaries.
- Formatting, linting, naming, documentation, and examples.
- Error handling and diagnostics.
- Communication mechanisms: channels, shared state, ownership transfer, and message passing.
- Async Rust, cancellation, runtime boundaries, and performance implications.
- Performance: allocation, zero-copy, iterators, profiling, and benchmarking concepts.
- Debugging, tracing, testing, reproducible examples, and encapsulation.
- Unsafe isolation and C/C++ FFI boundaries.
- Packaging, feature flags, semantic versioning, and CI/release workflows.

## Rust engineering reference repositories

Use these repositories as long-term references for examples, comparisons, and engineering lessons:

| Repository | URL | Lessons to extract |
| --- | --- | --- |
| `rust-lang/rust` | https://github.com/rust-lang/rust | Large-scale Rust organization, compiler diagnostics, safety boundaries, contribution discipline. |
| `rust-lang/cargo` | https://github.com/rust-lang/cargo | Cargo workflows, package metadata, feature flags, CLI architecture, integration testing. |
| `rust-lang/rust-analyzer` | https://github.com/rust-lang/rust-analyzer | Modular architecture, incremental computation, LSP-style project structure, performance-aware design. |
| `tokio-rs/tokio` | https://github.com/tokio-rs/tokio | Async runtime design, tasks, channels, cancellation, synchronization primitives. |
| `serde-rs/serde` | https://github.com/serde-rs/serde | Trait-driven APIs, derive macros, generic design, zero-copy serialization patterns. |
| `BurntSushi/ripgrep` | https://github.com/BurntSushi/ripgrep | CLI ergonomics, performance-focused IO, crate decomposition, practical error handling. |
| `hyperium/hyper` | https://github.com/hyperium/hyper | Async networking, service abstractions, HTTP protocol layering. |
| `rustls/rustls` | https://github.com/rustls/rustls | Security-sensitive API boundaries, encapsulation, testing discipline, safe defaults. |
| `clap-rs/clap` | https://github.com/clap-rs/clap | Builder/derive API design, command-line UX, macro ergonomics. |
| `tauri-apps/tauri` | https://github.com/tauri-apps/tauri | Large workspace layout, cross-platform application boundaries, command/plugin architecture. |

## Page behavior expectations

- Language switching must keep the reader on the same lesson.
- Section URLs should be hash-based and shareable.
- On desktop, the left navigation should stay fixed in place while the main content scrolls.
- Beginner and advanced parts should be switched with top tabs; do not show both parts' full navigation at the same time.
- Navigation should show chapter and section hierarchy for the active part.
- Display the project name as `Rust Course By AI` in visible UI text.
- The top title banner should slide out while the reader is scrolling through the middle of the page, and show again near the top or bottom.
- Code blocks should show the source language.
- Reference repositories used by a lesson should be visible in the rendered page.
