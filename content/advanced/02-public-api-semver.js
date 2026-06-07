(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "public-api-semver",
          title: t("对外 API 设计与版本兼容", "Public API design and semver compatibility"),
          sections: [
            lesson({
              id: "sealed-api-features",
              title: ["稳定接口、sealed trait 与可选功能", "Stable APIs, sealed traits, and features"],
              goals: [
                ["识别哪些内容一旦公开就会变成兼容承诺。", "用 sealed trait 和可选功能控制别人能扩展到什么程度。"],
                ["Recognize what belongs to public API.", "Use sealed traits and features to control extension surface."]
              ],
              syntax: [
                ["公开类型、公开 trait、错误枚举、trait bounds 都会影响版本兼容。", "sealed trait 通过一个私有的父 trait 阻止外部自己实现。"],
                ["Public types, public traits, error enums, and trait bounds all affect semver.", "A sealed trait uses a private supertrait to prevent external implementations."]
              ],
              engineering: [
                ["库越流行，破坏已有接口的代价越高。先少公开一点，等真的有需求时再扩展。", "可选功能尽量只增加能力，不要让不同功能组合后互相冲突。"],
                ["The more popular a library is, the more expensive breaking APIs become. Narrow public surface first, then expand by real needs.", "Features should be additive where possible to avoid combination explosions and hidden conflicts."]
              ],
              cppComparison: [
                ["C++ 经常要考虑二进制 ABI 兼容；Rust crate 更多关注源码层面的版本兼容，但公开的泛型约束同样会变成承诺。"],
                ["C++ ABI compatibility is often binary-boundary driven; Rust crates focus on source semver, but generic bounds also become compatibility promises."]
              ],
              examples: [
                sharedExample("Rust: sealed trait 限制外部实现", "Rust: sealed trait limits external impls", "rust", `mod sealed {
    pub trait Sealed {}
}

pub trait LessonFormat: sealed::Sealed {
    fn extension(&self) -> &'static str;
}

pub struct Markdown;
pub struct Html;

impl sealed::Sealed for Markdown {}
impl sealed::Sealed for Html {}

impl LessonFormat for Markdown {
    fn extension(&self) -> &'static str { "md" }
}

impl LessonFormat for Html {
    fn extension(&self) -> &'static str { "html" }
}`)
              ],
              references: ["serde-rs/serde", "rustls/rustls"]
            })
          ]
        });
})();
