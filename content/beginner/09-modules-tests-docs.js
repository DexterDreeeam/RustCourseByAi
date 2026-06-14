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
                textExample(
                  "`use` 路径的起点：当前模块、`crate::`、`super::`、外部 crate",
                  "`use` path roots: current module, `crate::`, `super::`, external crates",
                  [
                    "`use model::Course;` 是相对当前模块/当前作用域找 `model`。在 `src/lib.rs` 这种 crate root 里，`model` 是当前模块的子模块，所以 `pub use model::Course;` 可以工作。",
                    "`use crate::model::Course;` 是从当前 crate root 开始找。`src/parse.rs` 位于 `crate::parse` 里，`model` 是它的兄弟模块，不是子模块，所以写 `crate::model::Course` 最清楚。",
                    "`use self::model::Course;` 明确表示从当前模块开始；在 crate root 里它等价于 `use model::Course;`。",
                    "`use super::model::Course;` 从父模块开始找，适合嵌套模块里访问父模块旁边的兄弟模块。`super` 类似文件系统里的 `..`，但它走的是 module tree，不是目录树。",
                    "`use course_core::from_toml;` 出现在 `tests/` 集成测试里，因为集成测试在 crate 外部，像下游用户一样从 library crate 名字开始导入。"
                  ],
                  [
                    "`use model::Course;` looks for `model` relative to the current module/current scope. In `src/lib.rs`, the crate root, `model` is a child module, so `pub use model::Course;` works.",
                    "`use crate::model::Course;` starts from the current crate root. `src/parse.rs` lives inside `crate::parse`, and `model` is its sibling module rather than a child, so `crate::model::Course` is the clearest path.",
                    "`use self::model::Course;` explicitly starts from the current module; in the crate root it is equivalent to `use model::Course;`.",
                    "`use super::model::Course;` starts from the parent module, useful when a nested module needs a sibling next to its parent. `super` is like `..` in a filesystem, but it follows the module tree, not directories.",
                    "`use course_core::from_toml;` appears in an integration test under `tests/` because integration tests are outside the crate and import the library crate like downstream users."
                  ]
                ),
                textExample(
                  "`#[...]` 是 attribute：给编译器或工具看的标记",
                  "`#[...]` is an attribute: metadata for the compiler or tools",
                  [
                    "Rust 里的 `#[...]` 叫 attribute，放在下一项代码前面，意思是“给下面这个 item 加一个编译器/工具能理解的标记”。它不是普通函数调用，也不会在运行时按顺序执行。",
                    "`#[derive(Debug)]` 放在 `struct` 或 `enum` 前面，要求编译器自动生成 `Debug` trait 的实现。这样这个类型就能用 `{:?}` 打印，也能让错误、测试输出更容易看。",
                    "`#[test]` 放在函数前面，告诉 `cargo test`：这个函数是测试用例。普通 `cargo build` 不会把它当业务入口执行；运行 `cargo test` 时测试框架会发现并调用它。"
                  ],
                  [
                    "`#[...]` is an attribute. It sits before the next item and gives the compiler or tooling metadata about that item. It is not a normal function call and does not run in order at runtime.",
                    "`#[derive(Debug)]` before a `struct` or `enum` asks the compiler to generate an implementation of the `Debug` trait. Then the type can be printed with `{:?}`, which makes errors and test output easier to read.",
                    "`#[test]` before a function tells `cargo test` that the function is a test case. `cargo build` does not treat it as business entry-point code; the test harness discovers and calls it when `cargo test` runs."
                  ]
                ),
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
