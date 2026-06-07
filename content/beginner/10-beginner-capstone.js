(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "beginner-capstone",
          title: t("入门综合项目", "Beginner capstone project"),
          sections: [
            lesson({
              id: "course-index-cli",
              title: ["综合项目：课程索引 CLI", "Capstone: course index CLI"],
              goals: [
                ["把入门阶段知识连成一个小工程。", "练习模块拆分、所有权、错误、迭代器和测试。"],
                ["Connect beginner topics into a small project.", "Practice modules, ownership, errors, iterators, and tests."]
              ],
              syntax: [
                ["项目包含 `model`、`parser`、`validate`、`cli` 模块。", "入口层处理 IO，库层处理纯逻辑和结构化错误。"],
                ["The project contains `model`, `parser`, `validate`, and `cli` modules.", "The entry point handles IO, while the library handles pure logic and structured errors."]
              ],
              engineering: [
                ["这个项目应该能从配置加载课程，校验 slug，按标签输出索引，并提供测试。", "这是入门阶段结束时判断是否真正理解 Rust 基础的标准。"],
                ["The project should load a course config, validate slugs, output an index by tag, and include tests.", "This is the beginner-track checkpoint for real Rust understanding."]
              ],
              cppComparison: [
                ["C++ 中这可能是 CMake target + library + executable；Rust 中用 library crate + binary crate + tests 更直接。"],
                ["In C++ this might be a CMake target with library and executable; in Rust, a library crate plus binary crate and tests is more direct."]
              ],
              examples: [
                sharedExample("Rust: 入门综合项目主流程", "Rust: beginner capstone main flow", "rust", `mod model;
mod parser;
mod validate;

use std::collections::BTreeMap;

pub fn build_index(input: &str) -> Result<BTreeMap<String, Vec<String>>, parser::Error> {
    let course = parser::parse_course(input)?;
    validate::course(&course)?;

    let mut index: BTreeMap<String, Vec<String>> = BTreeMap::new();
    for lesson in course.lessons {
        for tag in lesson.tags {
            index.entry(tag).or_default().push(lesson.title.clone());
        }
    }

    Ok(index)
}`)
              ],
              references: ["rust-lang/cargo", "BurntSushi/ripgrep"]
            })
          ]
        });
})();

