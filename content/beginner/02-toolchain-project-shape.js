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
                ["`Cargo.toml` 描述包信息、依赖、可选功能和构建配置；命令行统一由 `cargo` 驱动。", "`edition` 让 Rust 语言可以继续演进，同时不破坏老项目。"],
                ["`Cargo.toml` describes packages, dependencies, features, and profiles; `cargo` drives the workflow.", "`edition` lets language evolution coexist with older code."]
              ],
              engineering: [
                ["团队项目应把 `cargo fmt --check`、`cargo clippy`、`cargo test` 放进 CI。", "文档和 examples 也会影响用户怎么使用你的库，所以也要当成对外承诺来维护。"],
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
                ["从大到小看：workspace 管多个 package；package 是一个可发布/可构建的项目；package 里会产生一个或多个 crate；crate 里面再用 module 组织代码。", "module 不等于文件。module 是 Rust 里的命名空间和可见性边界；文件只是承载 module 代码的常见方式。", "`src/lib.rs` 通常生成 library crate，`src/main.rs` 通常生成 binary crate；`mod xxx;` 可以把 `xxx.rs`、`xxx/mod.rs` 或当前文件里的内联模块接进当前 crate 的模块树。"],
                ["A package is a publishing unit, a crate is a compilation unit, a module is a visibility boundary, and a workspace coordinates packages.", "`src/lib.rs` exposes library APIs, while `src/main.rs` is a binary entry point."]
              ],
              engineering: [
                ["中小项目先保持一个 package、一个主要 crate；当核心逻辑、CLI、服务端、外部适配层需要分开演进时，再把它们拆成 workspace 里的多个 package。", "`pub` 表示 crate 外部也能访问；`pub(crate)` 表示只有当前 crate 内部能访问；不写 `pub` 时，通常只有当前模块能访问。", "模块不是为了把文件夹摆整齐，而是为了决定哪些代码可以被外部依赖，哪些只是内部实现。"],
                ["Keep small projects in one crate; split into a workspace when domain, CLI, server, and adapters have separate lifecycles.", "Module boundaries are not folder decoration; they are the start of stable API design."]
              ],
              cppComparison: [
                ["C++ 的 include 目录很容易把内部实现也暴露给使用者；Rust 默认私有，只有你写 `pub` 或 `pub use` 的内容才会公开，所以更容易先只开放真正需要给别人用的接口。"],
                ["C++ include directories often leak internals; Rust private-by-default modules and `pub use` make it easier to narrow APIs."]
              ],
              examples: [
                sharedExample("包含关系图：workspace、package、crate、module", "Containment: workspace, package, crate, module", "text", `workspace
└── package: course-core
    ├── Cargo.toml
    └── crate: course_core
        ├── crate root: src/lib.rs
        ├── module: model    -> src/model.rs
        ├── module: parser   -> src/parser.rs
        └── module: validate -> src/validate.rs

workspace
└── package: course-cli
    ├── Cargo.toml
    └── crate: course_cli
        └── crate root: src/main.rs

记法：
- workspace：一组 package 的工作区
- package：有 Cargo.toml 的项目单元
- crate：一次编译出来的库或可执行程序
- module：crate 内部的代码组织和可见性边界`),
                sharedExample("module 与文件：不是严格一一对应", "Modules and files are not strictly one-to-one", "rust", `// 1. 内联 module：模块直接写在当前文件里，不需要单独文件。
mod inline_parser {
    pub(crate) fn parse_line(line: &str) -> &str {
        line.trim()
    }
}

// 2. 文件 module：下面这句通常对应 src/parser.rs。
mod parser;

// 3. 目录 module：parser.rs 里面还可以继续声明子模块：
// src/parser.rs
// mod token; // 对应 src/parser/token.rs
// mod ast;   // 对应 src/parser/ast.rs

// 结论：
// - module 是代码名字空间/可见性边界
// - 文件只是放 module 代码的一种方式
// - 小模块可以内联，大模块通常拆到文件或目录里`),
                sharedExample("root Cargo.toml: workspace 只负责组织成员", "root Cargo.toml: workspace organizes members", "toml", `[workspace]
members = ["crates/course-core", "crates/course-cli"]
resolver = "2"`),
                sharedExample("crates/course-core/src/lib.rs: 对外入口", "crates/course-core/src/lib.rs: public entry point", "rust", `mod model;    // 内部文件：src/model.rs
mod parser;   // 内部文件：src/parser.rs
mod validate; // 内部文件：src/validate.rs

// 只有这里 pub use 的类型，才是调用方推荐使用的入口。
pub use model::{Course, Lesson};
pub use parser::ParseError;

// 对外公开函数：CLI、server、tests 都应该从这里加载课程。
pub fn load_course(input: &str) -> Result<Course, ParseError> {
    let course = parser::parse(input)?;
    validate::course(&course)?;
    Ok(course)
}`),
                sharedExample("crates/course-core/src/model.rs: 公开数据类型", "crates/course-core/src/model.rs: public data types", "rust", `#[derive(Debug, Clone)]
pub struct Course {
    pub title: String,
    pub lessons: Vec<Lesson>,
}

#[derive(Debug, Clone)]
pub struct Lesson {
    pub slug: String,
    pub title: String,
}`),
                sharedExample("crates/course-core/src/parser.rs: crate 内部解析实现", "crates/course-core/src/parser.rs: crate-internal parser", "rust", `use crate::model::{Course, Lesson};

#[derive(Debug)]
pub enum ParseError {
    Empty,
    InvalidLine(String),
}

// 非 pub：只在 parser.rs 内部使用，外部和兄弟模块都看不到。
struct RawLesson<'a> {
    slug: &'a str,
    title: &'a str,
}

// pub(crate)：整个 course-core crate 内都能调用，但外部 crate 不能调用。
pub(crate) fn parse(input: &str) -> Result<Course, ParseError> {
    if input.trim().is_empty() {
        return Err(ParseError::Empty);
    }

    let lessons = input
        .lines()
        .map(parse_line)
        .map(|raw| Lesson {
            slug: raw.slug.to_owned(),
            title: raw.title.to_owned(),
        })
        .collect();

    Ok(Course { title: "Rust Course".to_owned(), lessons })
}

// 非 pub：文件内 helper，调用方不应该知道解析细节。
fn parse_line(line: &str) -> RawLesson<'_> {
    let slug = line.trim();
    RawLesson {
        slug,
        title: slug,
    }
}`),
                sharedExample("crates/course-core/src/validate.rs: crate 内部校验", "crates/course-core/src/validate.rs: crate-internal validation", "rust", `use crate::model::Course;
use crate::parser::ParseError;

// 非 pub：只服务于本文件的校验规则。
struct SlugRule {
    allow_dash: bool,
}

// pub(crate)：lib.rs 能调用，但 course-cli 不能直接调用。
pub(crate) fn course(course: &Course) -> Result<(), ParseError> {
    let rule = SlugRule { allow_dash: true };

    for lesson in &course.lessons {
        if !is_valid_slug(&lesson.slug, &rule) {
            return Err(ParseError::InvalidLine(lesson.slug.clone()));
        }
    }
    Ok(())
}

// 非 pub：内部 helper，外部只关心 validate::course 是否通过。
fn is_valid_slug(slug: &str, rule: &SlugRule) -> bool {
    slug.chars().all(|ch| {
        ch.is_ascii_lowercase()
            || ch.is_ascii_digit()
            || (rule.allow_dash && ch == '-')
    })
}`),
                sharedExample("crates/course-cli/Cargo.toml: 依赖 core crate", "crates/course-cli/Cargo.toml: depend on the core crate", "toml", `[dependencies]
course-core = { path = "../course-core" }`),
                sharedExample("crates/course-cli/src/main.rs: 只调用公开 API", "crates/course-cli/src/main.rs: call only the public API", "rust", `use course_core::load_course;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let input = std::fs::read_to_string("course.txt")?;
    let course = load_course(&input)?;

    println!("course: {}", course.title);
    for lesson in course.lessons {
        println!("- {} ({})", lesson.title, lesson.slug);
    }

    Ok(())
}`)
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer"]
            })
          ]
        });
})();
