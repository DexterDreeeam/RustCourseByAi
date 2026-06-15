(function () {
  const { t, sharedExample, textExample, sourceTableExample, fileTreeExample, lesson } = window.Course;
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
                fileTreeExample(
                  "文件目录",
                  "File tree",
                  [
                    "`Cargo.toml` 定义 package、library crate 和 binary crate。`src/lib.rs` 是库入口，`src/main.rs` 是 CLI 入口。`tests/public_api.rs` 像外部用户一样测试公开 API。"
                  ],
                  [
                    "`Cargo.toml` defines the package, library crate, and binary crate. `src/lib.rs` is the library entry point, and `src/main.rs` is the CLI entry point. `tests/public_api.rs` tests the public API like an external user."
                  ],
                  "projects/beginner-course-index-cli/",
                  [
                    { depth: 0, type: "file", badge: "toml", name: "Cargo.toml", note: t("定义 package、library crate 和 binary crate。", "Defines the package, library crate, and binary crate.") },
                    { depth: 0, type: "file", badge: "md", name: "README.md", note: t("项目本身的运行说明。", "Run instructions for the project itself.") },
                    { depth: 0, type: "dir", badge: "dir", name: "examples/", note: t("示例输入数据。", "Example input data.") },
                    { depth: 1, type: "file", badge: "txt", name: "course.txt", note: t("CLI 默认演示用的课程文本。", "Course text used by the CLI demo.") },
                    { depth: 0, type: "dir", badge: "src", name: "src/", note: t("library crate 和 binary crate 的源码。", "Source for the library and binary crates.") },
                    { depth: 1, type: "file", badge: "api", name: "lib.rs", note: t("库入口和 public API。", "Library entry point and public API.") },
                    { depth: 1, type: "file", badge: "bin", name: "main.rs", note: t("很薄的 binary crate 入口。", "Thin binary crate entry point.") },
                    { depth: 1, type: "file", badge: "rs", name: "model.rs", note: t("领域模型、私有字段和 newtype。", "Domain models, private fields, and newtypes.") },
                    { depth: 1, type: "file", badge: "rs", name: "parser.rs", note: t("文本解析和 `ParseError`。", "Text parsing and `ParseError`.") },
                    { depth: 1, type: "file", badge: "rs", name: "validate.rs", note: t("业务校验和 `ValidationError`。", "Business validation and `ValidationError`.") },
                    { depth: 1, type: "file", badge: "rs", name: "index.rs", note: t("tag 索引与 collection/iterator 用法。", "Tag indexing and collection/iterator usage.") },
                    { depth: 1, type: "file", badge: "cli", name: "cli.rs", note: t("参数解析、文件 IO 和输出格式。", "Argument parsing, file IO, and output formatting.") },
                    { depth: 0, type: "dir", badge: "test", name: "tests/", note: t("集成测试目录。", "Integration test directory.") },
                    { depth: 1, type: "file", badge: "test", name: "public_api.rs", note: t("像外部用户一样测试公开 API。", "Tests public APIs like an external user.") }
                  ]
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
}`),
                textExample(
                  "最后按这张表读源码",
                  "Finally, read the source in this table order",
                  [
                    "前面的卡片先说明项目目标、目录和 crate/module 设计；现在再按下面表格读源码。不要从 `main.rs` 开始一路猜，按表格顺序从 library API 读到 CLI 边界和测试。",
                    "每一行都是一个可展开的 `.rs` 文件；点击文件名会在表格内展开完整源码。"
                  ],
                  [
                    "The previous cards explain the project goal, file tree, and crate/module design first; now read the source files in the table below. Do not start at `main.rs` and guess the structure; follow the order from library API to CLI boundary and tests.",
                    "Each row is a collapsible `.rs` file; click the file name to expand the full source inline inside the table."
                  ]
                ),
                sourceTableExample(
                  "源码阅读顺序",
                  "Source reading order",
                  [t("顺序", "Order"), t("文件", "File"), t("阅读重点", "What to read for")],
                  [
                    {
                      order: 1,
                      file: "src/lib.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/src/lib.rs",
                      focus: t("从这里看 public API、`mod` 如何接入模块、`pub use` 如何暴露稳定入口。", "Start here for the public API, how `mod` pulls modules in, and how `pub use` exposes stable entry points.")
                    },
                    {
                      order: 2,
                      file: "src/model.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/src/model.rs",
                      focus: t("看 `Course`、`Lesson`、`LessonSlug`、`Tag` 如何表达领域概念、私有字段和 newtype 边界。", "Read how `Course`, `Lesson`, `LessonSlug`, and `Tag` model domain concepts, private fields, and newtype boundaries.")
                    },
                    {
                      order: 3,
                      file: "src/parser.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/src/parser.rs",
                      focus: t("看文本如何变成模型：`Result`、`ParseError`、`let else`、逐行解析。", "Read how text becomes models: `Result`, `ParseError`, `let else`, and line-by-line parsing.")
                    },
                    {
                      order: 4,
                      file: "src/validate.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/src/validate.rs",
                      focus: t("看业务规则放在哪里：空标题、重复 slug、重复 tag，以及 `BTreeSet` 的去重用法。", "Read where business rules live: empty titles, duplicate slugs, duplicate tags, and deduplication with `BTreeSet`.")
                    },
                    {
                      order: 5,
                      file: "src/index.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/src/index.rs",
                      focus: t("看 collection/iterator 的工程用途：用 `BTreeMap` 建 tag 索引，用 helper 查询某个 tag。", "Read the engineering use of collections/iterators: building a tag index with `BTreeMap` and querying one tag with a helper.")
                    },
                    {
                      order: 6,
                      file: "src/cli.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/src/cli.rs",
                      focus: t("看边界层：命令行参数、文件 IO、错误转换、输出格式，不把业务逻辑塞进 `main`。", "Read the boundary layer: command-line args, file IO, error conversion, output formatting, and why business logic is not put in `main`.")
                    },
                    {
                      order: 7,
                      file: "src/main.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/src/main.rs",
                      focus: t("最后看 binary crate 入口：它只调用 `cli::run`，把成功/失败转换成输出和 exit code。", "Read the binary entry point last: it only calls `cli::run` and turns success/failure into output and exit codes.")
                    },
                    {
                      order: 8,
                      file: "tests/public_api.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/beginner-course-index-cli/tests/public_api.rs",
                      focus: t("用外部用户视角读测试：只通过公开 API 使用库，避免依赖内部 module 路径。", "Read the test from an external user's point of view: use only public APIs and avoid internal module paths.")
                    }
                  ]
                )
              ],
              references: ["RustCourseByAi/projects/beginner-course-index-cli", "rust-lang/cargo", "BurntSushi/ripgrep"]
            })
          ]
        });
})();
