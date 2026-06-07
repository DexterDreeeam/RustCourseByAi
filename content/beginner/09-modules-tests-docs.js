(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "modules-tests-docs",
          title: t("模块、可见性、测试与文档", "Modules, visibility, tests, and docs"),
          sections: [
            lesson({
              id: "visibility-tests-docs",
              title: ["可见性、测试与文档示例", "Visibility, tests, and documentation examples"],
              goals: [
                ["用模块规则把内部实现藏起来。", "理解测试和文档示例也会影响别人怎么使用你的 API。"],
                ["Protect internals with module visibility.", "Understand tests and documentation examples as API design."]
              ],
              syntax: [
                ["Rust 默认私有；`pub`、`pub(crate)`、`pub(super)` 控制谁能访问这些代码。", "模块内 `#[test]` 测内部细节，`tests/` 测对外 API，doc test 测文档里的代码。"],
                ["Rust is private by default; `pub`, `pub(crate)`, and `pub(super)` control exposure.", "Module `#[test]` checks internals, `tests/` checks public APIs, and doc tests check docs."]
              ],
              engineering: [
                ["先把实现藏起来，再按需求开放对外接口；这样以后重构 parser/model/validate 时，不容易影响使用者。", "示例越贴近真实使用，用户越不容易误用 API。"],
                ["Hide implementation first and expose APIs intentionally; then parser/model/validate can be refactored without caller breakage.", "The closer examples are to real usage, the less users misuse APIs."]
              ],
              cppComparison: [
                ["C++ 头文件经常会把实现细节也暴露出去；Rust 的模块规则更容易把实现藏起来，doc test 还能检查文档示例能不能编译。"],
                ["C++ headers often expose details; Rust module boundaries make hiding implementation easier, and doc tests compile documentation snippets."]
              ],
              examples: [
                sharedExample("src/lib.rs: 稳定公开入口", "src/lib.rs: stable public entry point", "rust", `mod parse;    // 私有模块：外部不能 course_core::parse::toml(...)
mod model;    // 私有模块：外部不能依赖文件结构
mod validate; // 私有模块：校验细节可以以后重构

pub use model::{Course, Lesson};
pub use parse::CourseParseError;

pub fn from_toml(input: &str) -> Result<Course, CourseParseError> {
    let course = parse::toml(input)?;
    validate::course(&course)?;
    Ok(course)
}`),
                sharedExample("src/parse.rs: 内部解析模块", "src/parse.rs: internal parser module", "rust", `use crate::model::{Course, Lesson};

#[derive(Debug)]
pub enum CourseParseError {
    Empty,
}

pub(crate) fn toml(input: &str) -> Result<Course, CourseParseError> {
    if input.trim().is_empty() {
        return Err(CourseParseError::Empty);
    }
    Ok(Course {
        title: "Rust Course".to_owned(),
        lessons: vec![Lesson { title: "Ownership".to_owned() }],
    })
}`),
                sharedExample("src/model.rs: 对外复用的数据类型", "src/model.rs: reusable public data types", "rust", `#[derive(Debug)]
pub struct Course {
    pub title: String,
    pub lessons: Vec<Lesson>,
}

#[derive(Debug)]
pub struct Lesson {
    pub title: String,
}`),
                sharedExample("tests/load_course.rs: 只通过公开入口测试", "tests/load_course.rs: test through public entry point", "rust", `use course_core::from_toml;

#[test]
fn rejects_empty_course() {
    assert!(from_toml("").is_err());
}`)
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer"]
            })
          ]
        });
})();
