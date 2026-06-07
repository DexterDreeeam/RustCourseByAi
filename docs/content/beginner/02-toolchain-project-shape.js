(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "toolchain-project-shape",
          title: t("工具链与项目基本形态", "Toolchain and project shape"),
          sections: [
            lesson({
              id: "cargo-workflow",
              title: ["Cargo 工作流与质量门", "Cargo workflow and quality gates"],
              goals: [
                ["理解 Cargo 不只是构建工具。", "建立 build/test/fmt/clippy/doc 的工程闭环。"],
                ["Understand Cargo as more than a build tool.", "Establish the build/test/fmt/clippy/doc quality loop."]
              ],
              syntax: [
                ["`Cargo.toml` 描述 package、dependencies、features、profiles；命令行统一由 `cargo` 驱动。", "`edition` 让语言演进和老代码兼容可以共存。"],
                ["`Cargo.toml` describes packages, dependencies, features, and profiles; `cargo` drives the workflow.", "`edition` lets language evolution coexist with older code."]
              ],
              engineering: [
                ["团队项目应把 `cargo fmt --check`、`cargo clippy`、`cargo test` 放进 CI。", "文档和 examples 也应该被看作 public API 的一部分。"],
                ["Team projects should put `cargo fmt --check`, `cargo clippy`, and `cargo test` in CI.", "Docs and examples should be treated as part of the public API."]
              ],
              cppComparison: [
                ["C++ 常把 CMake、包管理、测试框架、文档工具分散组合；Rust 通过 Cargo 统一了多数入口。"],
                ["C++ often combines CMake, package management, tests, and docs from separate tools; Rust unifies many entry points through Cargo."]
              ],
              examples: [
                sharedExample("GitHub Actions: Cargo 质量门", "GitHub Actions: Cargo quality gate", "yaml", `name: Rust CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo fmt --all -- --check
      - run: cargo clippy --workspace --all-targets -- -D warnings
      - run: cargo test --workspace --all-features
      - run: cargo doc --workspace --no-deps`)
              ],
              references: ["rust-lang/cargo"]
            }),
            lesson({
              id: "package-crate-module-workspace",
              title: ["package、crate、module、workspace", "Package, crate, module, workspace"],
              goals: [
                ["区分 Rust 项目的四个组织层级。", "知道何时从单 crate 演进到 workspace。"],
                ["Distinguish Rust's four organization levels.", "Know when to evolve from one crate into a workspace."]
              ],
              syntax: [
                ["package 是发布单位，crate 是编译单位，module 是代码可见性边界，workspace 是多 package 协作边界。", "`src/lib.rs` 暴露库 API，`src/main.rs` 是二进制入口。"],
                ["A package is a publishing unit, a crate is a compilation unit, a module is a visibility boundary, and a workspace coordinates packages.", "`src/lib.rs` exposes library APIs, while `src/main.rs` is a binary entry point."]
              ],
              engineering: [
                ["中小项目先保持单 crate；当 domain、CLI、server、adapter 生命周期明显分离时再拆 workspace。", "模块边界不是目录美化，而是长期 API 稳定性的起点。"],
                ["Keep small projects in one crate; split into a workspace when domain, CLI, server, and adapters have separate lifecycles.", "Module boundaries are not folder decoration; they are the start of stable API design."]
              ],
              cppComparison: [
                ["C++ include 目录很容易泄漏内部细节；Rust 私有默认和 `pub use` 更适合先收窄 API 表面。"],
                ["C++ include directories often leak internals; Rust private-by-default modules and `pub use` make it easier to narrow APIs."]
              ],
              examples: [
                sharedExample("Workspace + lib.rs 边界", "Workspace + lib.rs boundary", "rust", `// root Cargo.toml
// [workspace]
// members = ["crates/course-core", "crates/course-cli"]
// resolver = "2"

// crates/course-core/src/lib.rs
mod model;
mod parser;
mod validate;

pub use model::{Course, Lesson};
pub use parser::ParseError;

pub fn load_course(input: &str) -> Result<Course, ParseError> {
    let course = parser::parse(input)?;
    validate::course(&course)?;
    Ok(course)
}`)
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer"]
            })
          ]
        });
})();

