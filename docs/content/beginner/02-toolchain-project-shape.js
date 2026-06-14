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
                ["从大到小看：workspace 管多个 package；package 是一个可发布/可构建的项目；Cargo 会根据 package 里的配置和默认规则，挑出哪些文件是 crate root，然后每个 crate root 编译成一个 crate。", "crate root 文件包括 `src/lib.rs`、`src/main.rs`、`src/bin/*.rs` 这类 Cargo 会交给 rustc 的编译入口。", "module 是 Rust 里的命名空间和可见性边界；普通模块文件通过 crate root 里的 `mod xxx;` 接进当前 crate 的模块树。"],
                ["A package is a publishing unit, a crate is a compilation unit, a module is a visibility boundary, and a workspace coordinates packages.", "`src/lib.rs` exposes library APIs, while `src/main.rs` is a binary entry point."]
              ],
              engineering: [
                ["中小项目先保持一个 package、一个主要 crate；当核心逻辑、CLI、服务端、外部适配层需要分开演进时，再把它们拆成 workspace 里的多个 package。", "`pub` 表示 crate 外部也能访问；`pub(crate)` 表示当前 crate 内部能访问；默认私有时，通常只有当前模块能访问。", "模块用来决定哪些代码可以被外部依赖，哪些代码属于内部实现。"],
                ["Keep small projects in one crate; split into a workspace when domain, CLI, server, and adapters have separate lifecycles.", "Module boundaries define what external users can rely on and what remains internal implementation."]
              ],
              cppComparison: [
                ["C++ 的 include 目录很容易把内部实现也暴露给使用者；Rust 默认私有，只有你写 `pub` 或 `pub use` 的内容才会公开，所以更容易先只开放真正需要给别人用的接口。"],
                ["C++ include directories often leak internals; Rust private-by-default modules and `pub use` make it easier to narrow APIs."]
              ],
              examples: [
                textExample(
                  "第一步：先把四个概念分清楚",
                  "Step 1: separate the four concepts first",
                  [
                    "workspace：最外层的工作区。它由根目录的 `Cargo.toml` 里的 `[workspace]` 定义，主要职责是列出一组 package。",
                    "package：Cargo 管理的项目单元。一个 package 一定有自己的 `Cargo.toml`，里面写 `[package]` 名字、版本、依赖等信息。",
                    "crate：rustc 的一次编译单位。Cargo 会把某个 crate root 文件交给 rustc，rustc 从这个 root 开始编译出一个库或一个可执行程序。",
                    "module：crate 内部的命名空间和可见性边界。普通 `.rs` 文件通常作为 module 文件，通过 crate root 里的 `mod xxx;` 接入当前 crate。"
                  ],
                  [
                    "A workspace is the outer working area defined by a root Cargo.toml [workspace]. Its main job is to list related packages.",
                    "A package is the project unit Cargo manages. A package has its own Cargo.toml with [package] name, version, dependencies, and related metadata.",
                    "A crate is one rustc compilation unit. Cargo passes a crate root file to rustc, and rustc compiles a library or executable from that root.",
                    "A module is a namespace and visibility boundary inside a crate. Ordinary .rs files usually hold module code and become part of a crate only when pulled in by mod declarations."
                  ]
                ),
                textExample(
                  "第二步：完整例子的文件树",
                  "Step 2: full example file tree",
                  [
                    "下面这个例子有一个 workspace，里面有两个 package：`course-core` 和 `course-cli`。",
                    "`course-core` 这个 package 里面会产生两个 crate：一个 library crate `course_core`，一个 binary crate `inspect`。",
                    "`parser.rs`、`model.rs`、`validate.rs` 是 `course_core` 这个 crate 里的 module 文件。"
                  ],
                  [
                    "This example has one workspace with two packages: `course-core` and `course-cli`.",
                    "The `course-core` package produces two crates: a library crate `course_core` and a binary crate `inspect`.",
                    "`parser.rs`, `model.rs`, and `validate.rs` are module files inside the `course_core` crate."
                  ],
                  `rust-course/                         # workspace 目录
├── Cargo.toml                       # [workspace]，列出成员 package
└── crates/
    ├── course-core/                 # package: course-core
    │   ├── Cargo.toml               # [package] name = "course-core"
    │   └── src/
    │       ├── lib.rs               # crate root -> library crate: course_core
    │       ├── parser.rs            # module file -> parser
    │       ├── model.rs             # module file -> model
    │       ├── validate.rs          # module file -> validate
    │       └── bin/
    │           └── inspect.rs       # crate root -> binary crate: inspect
    └── course-cli/                  # package: course-cli
        ├── Cargo.toml               # [package] name = "course-cli"
        └── src/main.rs              # crate root -> binary crate: course-cli`
                ),
                textExample(
                  "第三步：Cargo 和 rustc 的读取链路",
                  "Step 3: how Cargo and rustc read this project",
                  [
                    "1. 你运行 `cargo build --workspace` 时，Cargo 先读 `rust-course/Cargo.toml`。这个文件是 workspace 的清单文件，Cargo 用它找到成员 package。",
                    "2. Cargo 从 `[workspace] members` 找到两个 package：`crates/course-core/Cargo.toml` 和 `crates/course-cli/Cargo.toml`。这一步由 Cargo 负责。",
                    "3. Cargo 读取 `crates/course-core/Cargo.toml`，发现 `[lib] path = \"src/lib.rs\"`，于是调用 rustc 编译 `crates/course-core/src/lib.rs`，得到 library crate `course_core`。",
                    "4. Cargo 在同一个 package 里又发现 `[[bin]] path = \"src/bin/inspect.rs\"`，于是再调用一次 rustc 编译 `crates/course-core/src/bin/inspect.rs`，得到 binary crate `inspect`。",
                    "5. rustc 编译 `crates/course-core/src/lib.rs` 时，看到 `mod parser;`，于是按规则读取 `crates/course-core/src/parser.rs`，把它作为当前 crate 里的 `parser` module。",
                    "6. package 和 crate root 由 Cargo 根据 `Cargo.toml` 决定；module 文件由 rustc 根据 `mod` 声明加载。"
                  ],
                  [
                    "1. Running `cargo build --workspace` makes Cargo read `rust-course/Cargo.toml`, the workspace manifest.",
                    "2. Cargo uses `[workspace] members` to find package manifests such as `crates/course-core/Cargo.toml` and `crates/course-cli/Cargo.toml`.",
                    "3. Cargo reads `crates/course-core/Cargo.toml`, finds `[lib] path = \"src/lib.rs\"`, and invokes rustc on `crates/course-core/src/lib.rs` to produce the `course_core` library crate.",
                    "4. Cargo also finds `[[bin]] path = \"src/bin/inspect.rs\"`, and invokes rustc again on `crates/course-core/src/bin/inspect.rs` to produce the `inspect` binary crate.",
                    "5. While compiling `src/lib.rs`, rustc sees `mod parser;` and loads `crates/course-core/src/parser.rs` as a module inside the current crate.",
                    "6. Cargo decides packages and crate roots from `Cargo.toml`; rustc follows `mod` declarations to load module files inside one crate."
                  ],
                  `Cargo.toml
├── [lib] path = "src/lib.rs"          -> rustc src/lib.rs          -> crate: course_core
└── [[bin]] path = "src/bin/inspect.rs" -> rustc src/bin/inspect.rs -> crate: inspect

src/lib.rs
└── mod parser;                         -> loads src/parser.rs as module parser

src/parser.rs
└── loaded by mod parser as a module file inside course_core`
                ),
                textExample(
                  "`mod`、`use`、`pub use` 不是一回事",
                  "`mod`, `use`, and `pub use` are different",
                  [
                    "`mod parser;` 是把 `src/parser.rs` 接进当前 crate 的模块树，创建 `crate::parser` 这个 module。它决定 rustc 要读取哪个 module 文件。",
                    "`use crate::model::Course;` 不会加载文件，也不会创建 module；它只是把已经存在的路径引入当前作用域，让后面可以少写 `crate::model::Course`。",
                    "不写 `use` 也可以直接写完整路径，例如 `crate::model::Course`。`use` 只是本地简写，不改变可见性。",
                    "`pub use model::Course;` 是重新导出：把内部 module 里的类型放到当前 crate 的对外入口上，让调用方可以写 `course_core::Course`，而不用依赖 `course_core::model::Course` 这种内部路径。"
                  ],
                  [
                    "`mod parser;` pulls `src/parser.rs` into the current crate's module tree and creates the `crate::parser` module. It tells rustc which module file to read.",
                    "`use crate::model::Course;` does not load a file and does not create a module; it only brings an existing path into the current scope so later code can write less than `crate::model::Course`.",
                    "Without `use`, you can still write the full path directly, such as `crate::model::Course`. `use` is only a local shorthand; it does not change visibility.",
                    "`pub use model::Course;` is a re-export: it puts a type from an internal module onto the crate's public entry point, so callers can write `course_core::Course` instead of depending on an internal path like `course_core::model::Course`."
                  ]
                ),
                textExample(
                  "第四步：下面开始看每个文件的内容",
                  "Step 4: now read each file",
                  [
                    "前面的说明告诉你哪些文件是 workspace/package/crate/module。下面的代码块才是这些文件的实际内容。",
                    "读代码时先看 `Cargo.toml` 怎么声明 package 和 crate root，再看 crate root 里的 `mod` 怎么把普通模块文件接进来。"
                  ],
                  [
                    "The previous cards explain which files are workspace, package, crate roots, and modules. The following code cards show the actual file contents.",
                    "Read Cargo.toml first to see packages and crate roots, then read crate roots to see how `mod` pulls ordinary module files into the crate."
                  ]
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

// pub(crate)：调用范围是整个 course-core crate。
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

// 非 pub：文件内 helper，解析细节保留在 parser.rs 里。
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

// pub(crate)：调用范围是整个 course-core crate，比如 lib.rs。
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
