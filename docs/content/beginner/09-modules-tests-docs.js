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
                sharedExample("Rust: 对外稳定，对内可重构", "Rust: stable outside, refactorable inside", "rust", `// src/lib.rs
mod parse;
mod model;
mod validate;

pub use model::{Course, Lesson};
pub use parse::CourseParseError;

pub fn from_toml(input: &str) -> Result<Course, CourseParseError> {
    let course = parse::toml(input)?;
    validate::course(&course)?;
    Ok(course)
}

#[cfg(test)]
mod tests {
    use super::from_toml;

    #[test]
    fn rejects_empty_course() {
        assert!(from_toml("").is_err());
    }
}`)
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer"]
            })
          ]
        });
})();
