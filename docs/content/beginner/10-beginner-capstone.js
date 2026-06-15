(function () {
  const { t, sharedExample, textExample, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "beginner-capstone",
          title: t("入门综合项目", "Beginner capstone project"),
          sections: [
            lesson({
              id: "course-index-cli",
              title: ["综合项目：课程索引 CLI", "Capstone: course index CLI"],
              goals: [
                ["把入门阶段知识连成一个完整小工程。", "理解完整源码如何从 course 页面跳到 GitHub 项目目录。"],
                ["Connect beginner topics into a complete small project.", "Understand how the course page points to the full GitHub project source."]
              ],
              syntax: [
                ["这个项目放在仓库根目录 `projects/beginner-course-index-cli/`，是一个真实 Cargo package。它同时有 library crate 和 binary crate：`src/lib.rs` 暴露可测试的纯逻辑，`src/main.rs` 只负责命令行入口。", "项目用 `mod` 把 `model`、`parser`、`validate`、`index`、`cli` 接进 crate；再通过 `pub use` 暴露真正希望调用者使用的 API。"],
                ["The project lives under `projects/beginner-course-index-cli/` at the repository root and is a real Cargo package. It has both a library crate and a binary crate: `src/lib.rs` exposes testable pure logic, while `src/main.rs` is only the command-line entry point.", "The project uses `mod` to pull `model`, `parser`, `validate`, `index`, and `cli` into the crate, then uses `pub use` to expose the API callers should rely on."]
              ],
              engineering: [
                ["它读取一个简单课程文本文件，解析成领域模型，校验 slug/tag，再用 `BTreeMap` 建立 tag 索引，最后由 CLI 渲染输出。完整源码在本节参考链接里的 GitHub 项目目录。", "这比单个函数更接近真实工程：IO 和参数解析在边界层，解析、校验、索引是可测试的库逻辑。"],
                ["It reads a small course text file, parses it into domain models, validates slugs/tags, builds a tag index with `BTreeMap`, and lets the CLI render output. The full source is linked from this section's references.", "This is closer to real engineering than one function: IO and argument parsing stay at the boundary, while parsing, validation, and indexing remain testable library logic."]
              ],
              cppComparison: [
                ["C++ 里你可能会把它拆成 library target、CLI target 和 tests；Rust 里同一个 Cargo package 可以自然包含 `src/lib.rs`、`src/main.rs` 和 `tests/`。"],
                ["In C++ you might split this into a library target, a CLI target, and tests; in Rust, one Cargo package naturally contains `src/lib.rs`, `src/main.rs`, and `tests/`."]
              ],
              examples: [
                textExample(
                  "项目做什么",
                  "What the project does",
                  [
                    "输入文件是一组课程元数据，例如课程标题和多行 lesson。每个 lesson 有 `slug`、标题和 tags。",
                    "运行 `cargo run -- examples/course.txt` 会打印按 tag 分组的课程索引；运行 `cargo run -- examples/course.txt --tag ownership` 只看某个 tag 下的课程。",
                    "运行 `cargo test` 会覆盖 parser、validate、index 和 public API。"
                  ],
                  [
                    "The input file is a small course metadata file: a course title plus lesson rows. Each lesson has a `slug`, a title, and tags.",
                    "Running `cargo run -- examples/course.txt` prints a course index grouped by tag; running `cargo run -- examples/course.txt --tag ownership` shows lessons for one tag.",
                    "Running `cargo test` covers the parser, validator, index builder, and public API."
                  ]
                ),
                textExample(
                  "文件目录",
                  "File tree",
                  [
                    "`Cargo.toml` 定义 package、library crate 和 binary crate。`src/lib.rs` 是库入口，`src/main.rs` 是 CLI 入口。`tests/public_api.rs` 像外部用户一样测试公开 API。"
                  ],
                  [
                    "`Cargo.toml` defines the package, library crate, and binary crate. `src/lib.rs` is the library entry point, and `src/main.rs` is the CLI entry point. `tests/public_api.rs` tests the public API like an external user."
                  ],
                  `projects/beginner-course-index-cli/
├── Cargo.toml
├── README.md
├── examples/
│   └── course.txt
├── src/
│   ├── lib.rs
│   ├── main.rs
│   ├── model.rs
│   ├── parser.rs
│   ├── validate.rs
│   ├── index.rs
│   └── cli.rs
└── tests/
    └── public_api.rs`
                ),
                textExample(
                  "crate / module 设计方向",
                  "Crate and module design direction",
                  [
                    "`model` 定义 `Course`、`Lesson`、`LessonSlug`、`Tag`，把字段和 newtype 边界集中起来。",
                    "`parser` 只负责把文本变成模型，并用 `ParseError` 描述格式问题；`validate` 负责跨字段、跨 lesson 的业务校验。",
                    "`index` 只负责从 `Course` 生成 `BTreeMap<Tag, Vec<LessonSummary>>`，展示 collection 和 iterator 的工程用法。",
                    "`cli` 负责参数、文件 IO 和输出格式；它调用库层 API，而不是把所有逻辑写进 `main`。"
                  ],
                  [
                    "`model` defines `Course`, `Lesson`, `LessonSlug`, and `Tag`, keeping fields and newtype boundaries in one place.",
                    "`parser` only turns text into models and reports format issues with `ParseError`; `validate` handles cross-field and cross-lesson business checks.",
                    "`index` only turns a `Course` into `BTreeMap<Tag, Vec<LessonSummary>>`, showing collections and iterators in an engineering setting.",
                    "`cli` owns arguments, file IO, and output formatting; it calls library APIs instead of putting all logic in `main`."
                  ]
                ),
                sharedExample("src/lib.rs: 项目的公开 API 形状", "src/lib.rs: public API shape", "rust", `mod index;
mod model;
mod parser;
mod validate;

pub mod cli;

pub use index::{build_tag_index, lessons_for_tag, LessonSummary, TagIndex};
pub use model::{Course, Lesson, LessonSlug, Tag};
pub use parser::{parse_course, ParseError};
pub use validate::{validate_course, ValidationError};

pub fn load_and_index(input: &str) -> Result<TagIndex, CourseError> {
    let course = parse_course(input)?;
    validate_course(&course)?;
    Ok(build_tag_index(&course))
}`)
              ],
              references: ["RustCourseByAi/projects/beginner-course-index-cli", "rust-lang/cargo", "BurntSushi/ripgrep"]
            })
          ]
        });
})();
