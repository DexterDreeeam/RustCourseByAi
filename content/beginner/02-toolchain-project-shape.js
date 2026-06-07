(function () {
  const { t, sharedExample, localizedExample, textExample, withMistakes, lesson } = window.Course;
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
                ["从大到小看：workspace 管多个 package；package 是一个可发布/可构建的项目；Cargo 会根据 package 里的配置和默认规则，挑出哪些文件是 crate root，然后每个 crate root 编译成一个 crate。", "不是随便一个 `.rs` 文件都是 crate。只有被 Cargo 当成编译入口交给 rustc 的文件，才是 crate root，比如 `src/lib.rs`、`src/main.rs`、`src/bin/*.rs`。", "module 不等于文件。module 是 Rust 里的命名空间和可见性边界；普通模块文件只有被 crate root 里的 `mod xxx;` 接进来，才会成为这个 crate 的一部分。"],
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
                textExample(
                  "从外到内：workspace、package、crate、module",
                  "From outside to inside: workspace, package, crate, module",
                  [
                    "workspace 是最外层的工作区，它自己通常不编译代码，而是列出要一起管理的 package。",
                    "package 是有 `Cargo.toml` 的项目单元。Cargo 先看到 package，再决定这个 package 里面有哪些编译目标。",
                    "crate 是 rustc 的一次编译单位。Cargo 会把 crate root 文件交给 rustc；rustc 从这个 root 开始编译出一个库或一个可执行程序。",
                    "module 是 crate 里面的名字空间。`src/parser.rs`、`src/parser/token.rs` 这类文件通常只是被 root 通过 `mod` 拉进来的模块文件，不会单独编译成 crate。"
                  ],
                  [
                    "A workspace is the outer working area. It usually does not compile code by itself; it lists packages managed together.",
                    "A package is a project unit with Cargo.toml. Cargo sees the package first, then uses source roots to decide which crates to compile.",
                    "A crate is not just any .rs file. A crate is a compilation root and result. By default, src/lib.rs, src/main.rs, and src/bin/*.rs are crate roots.",
                    "A module is a namespace inside a crate. Files such as src/parser.rs and src/parser/token.rs usually hold module code, not separate crates."
                  ],
                  `rust-course/                         # workspace 目录
├── Cargo.toml                       # [workspace]，列出成员 package
└── crates/
    ├── course-core/                 # package: course-core
    │   ├── Cargo.toml               # [package] name = "course-core"
    │   └── src/
    │       ├── lib.rs               # crate root -> library crate: course_core
    │       ├── parser.rs            # module: parser，不是 crate
    │       ├── model.rs             # module: model，不是 crate
    │       ├── validate.rs          # module: validate，不是 crate
    │       └── bin/
    │           └── inspect.rs       # crate root -> binary crate: inspect
    └── course-cli/                  # package: course-cli
        ├── Cargo.toml               # [package] name = "course-cli"
        └── src/main.rs              # crate root -> binary crate: course-cli`
                ),
                textExample(
                  "什么文件算 crate？什么文件只是 module？",
                  "Which files are crates and which are modules?",
                  [
                    "根本区别是：谁把这个文件交给 rustc 当“起点”。Cargo 会把 `src/lib.rs`、`src/main.rs`、`src/bin/*.rs` 这类文件当作起点，所以它们是 crate root。",
                    "rustc 从 crate root 开始构建模块树。root 里写 `mod parser;`，rustc 才会去找 `src/parser.rs`，把它作为 `parser` 模块接进当前 crate。",
                    "`src/parser.rs` 没有被 Cargo 单独交给 rustc，它只是被 `src/lib.rs` 拉进来的模块文件，所以它不是一个 crate。",
                    "所以判断一个 `.rs` 文件是不是 crate，不是看扩展名，也不是看它能不能写 Rust 代码，而是看它是不是 Cargo/rustc 的编译起点。"
                  ],
                  [
                    "`src/lib.rs` is the root of a library crate.",
                    "`src/main.rs` or `src/bin/inspect.rs` are roots of binary crates.",
                    "`src/parser.rs` is not a crate root. It is a module file included into the `course_core` crate by `mod parser;`.",
                    "So a `.rs` file is a crate only when it is a Cargo/rustc compilation entry point."
                  ]
                ),
                textExample(
                  "Cargo 和 rustc 实际怎么找到这些文件",
                  "How Cargo and rustc find these files",
                  [
                    "第一步：Cargo 读 `Cargo.toml`，发现 `src/lib.rs` 是 library crate root，`src/bin/inspect.rs` 是 binary crate root。",
                    "第二步：Cargo 分别调用 rustc 编译这些 root。编译 `src/lib.rs` 会得到 `course_core` 这个 library crate；编译 `src/bin/inspect.rs` 会得到 `inspect` 这个 binary crate。",
                    "第三步：rustc 编译 `src/lib.rs` 时看到 `mod parser;`，才会加载 `src/parser.rs`。这说明 `parser.rs` 是 `course_core` crate 的一个 module 文件，不是新的 crate。"
                  ],
                  [
                    "Step 1: Cargo reads Cargo.toml and discovers src/lib.rs as the library crate root and src/bin/inspect.rs as a binary crate root.",
                    "Step 2: Cargo invokes rustc separately for those roots. Compiling src/lib.rs produces the course_core library crate; compiling src/bin/inspect.rs produces the inspect binary crate.",
                    "Step 3: When rustc compiles src/lib.rs and sees mod parser;, it loads src/parser.rs. That makes parser.rs a module file inside course_core, not a new crate."
                  ],
                  `Cargo.toml
├── [lib] path = "src/lib.rs"          -> rustc src/lib.rs          -> crate: course_core
└── [[bin]] path = "src/bin/inspect.rs" -> rustc src/bin/inspect.rs -> crate: inspect

src/lib.rs
└── mod parser;                         -> loads src/parser.rs as module parser

src/parser.rs
└── not passed to rustc as a root        -> not a crate by itself`
                ),
                sharedExample("root Cargo.toml: workspace 只负责组织成员", "root Cargo.toml: workspace organizes members", "toml", `[workspace]
members = ["crates/course-core", "crates/course-cli"]
resolver = "2"`),
                sharedExample("crates/course-core/Cargo.toml: 一个 package，可产生两个 crate", "crates/course-core/Cargo.toml: one package can produce two crates", "toml", `[package]
name = "course-core"
version = "0.1.0"
edition = "2021"

[lib]
name = "course_core"
path = "src/lib.rs"

[[bin]]
name = "inspect"
path = "src/bin/inspect.rs"`),
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
                sharedExample("crates/course-core/src/bin/inspect.rs: 同一 package 里的 binary crate", "crates/course-core/src/bin/inspect.rs: binary crate in the same package", "rust", `use course_core::load_course;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let input = "ownership-basics";
    let course = load_course(input)?;
    println!("{} has {} lessons", course.title, course.lessons.len());
    Ok(())
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
