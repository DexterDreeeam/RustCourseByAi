(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "traits-generics-basic",
          title: t("trait、泛型与抽象基础", "Traits, generics, and abstraction basics"),
          sections: [
            lesson({
              id: "trait-as-contract",
              title: ["trait 作为行为契约", "Traits as behavioral contracts"],
              goals: [
                ["理解 trait 不是类继承。", "会用 trait 切开模块边界和测试替身。"],
                ["Understand that traits are not class inheritance.", "Use traits to cut module boundaries and create test doubles."]
              ],
              syntax: [
                ["`trait` 定义行为，`impl Trait for Type` 为类型实现行为。", "泛型参数可以用 `T: Trait` 或 `where` 约束。"],
                ["A `trait` defines behavior, and `impl Trait for Type` implements it.", "Generic parameters can be constrained with `T: Trait` or `where` clauses."]
              ],
              engineering: [
                ["trait 适合抽象存储、时钟、网络、随机数等外部依赖。", "不要为了“看起来架构高级”提前抽象；至少有真实替换点时再引入。"],
                ["Traits fit storage, clocks, networking, randomness, and other external dependencies.", "Do not abstract early just to look architectural; introduce traits when there is a real substitution point."]
              ],
              cppComparison: [
                ["trait 既像 C++ concept 的能力约束，也能像虚接口一样动态分发；Rust 要你显式选择。"],
                ["Traits can act like C++ concepts for capability bounds and like virtual interfaces for dynamic dispatch; Rust makes the choice explicit."]
              ],
              examples: [
                withMistakes(
                  sharedExample("Rust: 用 Clock trait 测试重试逻辑", "Rust: test retry logic with a Clock trait", "rust", `trait Clock {
    fn now_ms(&self) -> u64;
}

struct RetryPolicy {
    deadline_ms: u64,
    max_attempts: u8,
}

fn should_retry<C: Clock>(clock: &C, attempts: u8, policy: &RetryPolicy) -> bool {
    attempts < policy.max_attempts && clock.now_ms() < policy.deadline_ms
}

struct FakeClock(u64);

impl Clock for FakeClock {
    fn now_ms(&self) -> u64 { self.0 }
}`),
                  [
                    {
                      title: t("错误：泛型函数忘记写 trait bound", "Wrong: generic function forgets the trait bound"),
                      language: "rust",
                      code: t(
                        `fn should_retry<C>(clock: &C, deadline_ms: u64) -> bool {
    clock.now_ms() < deadline_ms
}`,
                        `fn should_retry<C>(clock: &C, deadline_ms: u64) -> bool {
    clock.now_ms() < deadline_ms
}`
                      ),
                      error: t(
                        ["error[E0599]: no method named `now_ms` found for reference `&C`", "泛型 `C` 没有被约束为实现 `Clock`，编译器不能假设它有 `now_ms`。"],
                        ["error[E0599]: no method named `now_ms` found for reference `&C`", "Generic `C` is not constrained to implement `Clock`, so the compiler cannot assume `now_ms` exists."]
                      ),
                      explanation: t(
                        ["写 `C: Clock` 不是形式主义，它是把“需要时钟能力”写进 API 合约。"],
                        ["Writing `C: Clock` is not ceremony; it puts the required clock capability into the API contract."]
                      )
                    }
                  ]
                )
              ],
              references: ["serde-rs/serde"]
            })
          ]
        });
})();
