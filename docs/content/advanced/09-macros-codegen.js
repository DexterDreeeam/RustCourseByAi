(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "macros-codegen",
          title: t("宏、代码生成与可维护性", "Macros, code generation, and maintainability"),
          sections: [
            lesson({
              id: "derive-builder-macros",
              title: ["derive、builder 与宏边界", "Derive, builders, and macro boundaries"],
              goals: [
                ["知道宏适合消除重复模式，不适合隐藏复杂逻辑。", "理解 derive API 对用户体验的影响。"],
                ["Use macros to remove repeated patterns, not to hide complex logic.", "Understand how derive APIs affect user experience."]
              ],
              syntax: [
                ["`macro_rules!` 适合局部语法重复；derive macro 能为类型生成 impl。", "宏错误信息通常比函数差，公共宏需要格外克制。"],
                ["`macro_rules!` fits local syntax repetition; derive macros generate impls for types.", "Macro errors are often worse than function errors, so public macros need restraint."]
              ],
              engineering: [
                ["builder/derive API 可以显著改善 CLI、配置、序列化体验。", "如果普通函数和 trait 能解决，就不要急着写宏。"],
                ["Builder/derive APIs can significantly improve CLI, config, and serialization ergonomics.", "If functions and traits solve the problem, do not rush into macros."]
              ],
              cppComparison: [
                ["Rust 宏比 C 预处理器更结构化，但依然会增加调试和学习成本。"],
                ["Rust macros are more structured than the C preprocessor, but they still add debugging and learning cost."]
              ],
              examples: [
                sharedExample("Rust: derive + builder 风格配置", "Rust: derive + builder-style config", "rust", `#[derive(Debug, Clone, serde::Deserialize)]
struct CliConfig {
    host: String,
    port: u16,
    #[serde(default = "default_workers")]
    workers: usize,
}

fn default_workers() -> usize { 4 }

impl CliConfig {
    fn address(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
}`)
              ],
              references: ["serde-rs/serde", "clap-rs/clap"]
            })
          ]
        });
})();

