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
                ["`trait` 定义一种能力，`impl Trait for Type` 表示某个类型具备这种能力。", "泛型参数可以用 `T: Trait` 或 `where` 写清楚需要哪些能力。"],
                ["A `trait` defines behavior, and `impl Trait for Type` implements it.", "Generic parameters can be constrained with `T: Trait` or `where` clauses."]
              ],
              engineering: [
                ["trait 适合抽象存储、时钟、网络、随机数等外部依赖。", "不要为了“看起来架构高级”提前抽象；至少有真实替换点时再引入。"],
                ["Traits fit storage, clocks, networking, randomness, and other external dependencies.", "Do not abstract early just to look architectural; introduce traits when there is a real substitution point."]
              ],
              cppComparison: [
                ["trait 有时像 C++ concept，用来说明类型必须具备什么能力；也可以像虚接口一样做运行时调用。Rust 会要求你明确选择哪一种用法。"],
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

// where 写法：效果和 <C: Clock> 相同，参数多时更清晰。
fn retry_with_backoff<C>(clock: &C, attempts: u8, policy: &RetryPolicy) -> bool
where
    C: Clock,
{
    should_retry(clock, attempts, policy)
}

struct FakeClock(u64);

impl Clock for FakeClock {
    fn now_ms(&self) -> u64 { self.0 }
}

fn main() {
    let policy = RetryPolicy { deadline_ms: 5000, max_attempts: 3 };
    let fake = FakeClock(1000);

    assert!(should_retry(&fake, 0, &policy));   // 1000 < 5000, 0 < 3
    assert!(!should_retry(&fake, 3, &policy));  // attempts 已到上限

    // where 版本用法相同
    assert!(retry_with_backoff(&fake, 1, &policy));
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
                        ["error[E0599]: no method named `now_ms` found for reference `&C`", "泛型 `C` 没有写明必须实现 `Clock`，所以编译器不能假设它有 `now_ms` 方法。"],
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
                sharedExample("Rust: blanket impl \u2014 \u4e3a\u6240\u6709\u5b9e\u73b0 A \u7684\u7c7b\u578b\u81ea\u52a8\u5b9e\u73b0 B", "Rust: blanket impl \u2014 auto-implement B for all types that implement A", "rust", `trait Describable {
    fn describe(&self) -> String;
}

// blanket impl: \u4efb\u4f55\u5b9e\u73b0\u4e86 Describable \u7684\u7c7b\u578b\uff0c\u81ea\u52a8\u83b7\u5f97 log \u65b9\u6cd5\u3002
// \u8fd9\u548c\u6807\u51c6\u5e93\u7684 impl<T: Display> ToString for T \u662f\u540c\u4e00\u79cd\u6a21\u5f0f\u3002
trait Loggable: Describable {
    fn log(&self) {
        println!("[LOG] {}", self.describe());
    }
}

// \u4e3a\u6240\u6709\u5b9e\u73b0\u4e86 Describable \u7684\u7c7b\u578b\u81ea\u52a8\u5b9e\u73b0 Loggable\u3002
impl<T: Describable> Loggable for T {}

struct Sensor { id: u32, value: f64 }

impl Describable for Sensor {
    fn describe(&self) -> String {
        format!("Sensor #{}: {:.2}", self.id, self.value)
    }
}

fn main() {
    let s = Sensor { id: 7, value: 23.5 };
    // Sensor \u53ea\u5199\u4e86 impl Describable\uff0c\u5c31\u81ea\u52a8\u62e5\u6709\u4e86 .log()\u3002
    s.log(); // [LOG] Sensor #7: 23.50
}`),
              references: ["serde-rs/serde"]
            })
          ]
        });
})();
