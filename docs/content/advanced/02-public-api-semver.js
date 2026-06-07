(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "public-api-semver",
          title: t("公共 API 设计与 semver 兼容", "Public API design and semver compatibility"),
          sections: [
            lesson({
              id: "sealed-api-features",
              title: ["稳定 API、sealed trait 与 feature", "Stable APIs, sealed traits, and features"],
              goals: [
                ["识别哪些内容属于公共 API。", "用 sealed trait 和 feature 控制扩展面。"],
                ["Recognize what belongs to public API.", "Use sealed traits and features to control extension surface."]
              ],
              syntax: [
                ["公开类型、公开 trait、错误枚举、trait bounds 都会影响 semver。", "sealed trait 通过私有 supertrait 阻止外部实现。"],
                ["Public types, public traits, error enums, and trait bounds all affect semver.", "A sealed trait uses a private supertrait to prevent external implementations."]
              ],
              engineering: [
                ["库越流行，破坏 API 的代价越高。先收窄 public surface，再根据真实需求扩展。", "feature 应尽量 additive，避免组合爆炸和隐藏冲突。"],
                ["The more popular a library is, the more expensive breaking APIs become. Narrow public surface first, then expand by real needs.", "Features should be additive where possible to avoid combination explosions and hidden conflicts."]
              ],
              cppComparison: [
                ["C++ ABI 兼容常被二进制边界约束；Rust crate 更多关注源码级 semver，但泛型约束同样会成为兼容承诺。"],
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

