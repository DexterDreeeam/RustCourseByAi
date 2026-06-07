(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "advanced-traits-generics",
          title: t("高级 trait 与泛型设计", "Advanced trait and generic design"),
          sections: [
            lesson({
              id: "associated-types-object-safety",
              title: ["associated type、object safety 与分发成本", "Associated types, object safety, and dispatch cost"],
              goals: [
                ["理解 associated type 适合把输出类型绑定到实现。", "知道为什么一些 trait 不能变成 `dyn Trait`。"],
                ["Understand associated types as output types tied to implementations.", "Know why some traits cannot become `dyn Trait`."]
              ],
              syntax: [
                ["associated type 写在 trait 内部，调用方通过实现选择具体类型。", "object safety 限制 trait object 能安全调用的方法集合。"],
                ["Associated types live inside traits, and implementations choose concrete types.", "Object safety limits the method set that can be safely called through trait objects."]
              ],
              engineering: [
                ["parser、storage、service 抽象常用 associated type 表达错误或输出。", "如果 API 暴露过度泛型，会增加编译时间和使用复杂度。"],
                ["Parser, storage, and service abstractions often use associated types for errors or outputs.", "Overly generic APIs increase compile time and usage complexity."]
              ],
              cppComparison: [
                ["这类似 C++ traits/type aliases 与虚接口之间的取舍；Rust 让静态和动态分发边界更显式。"],
                ["This resembles trade-offs between C++ traits/type aliases and virtual interfaces; Rust makes static and dynamic dispatch boundaries explicit."]
              ],
              examples: [
                withMistakes(
                  sharedExample("Rust: Parser trait 绑定输出和错误", "Rust: Parser trait binds output and error", "rust", `trait Parser {
    type Output;
    type Error;

    fn parse(&self, input: &str) -> Result<Self::Output, Self::Error>;
}

struct CourseParser;

impl Parser for CourseParser {
    type Output = Course;
    type Error = ParseError;

    fn parse(&self, input: &str) -> Result<Course, ParseError> {
        parse_course(input)
    }
}`),
                  [
                    {
                      title: t("错误：dyn Trait 忘记指定 associated type", "Wrong: dyn Trait without associated types"),
                      language: "rust",
                      code: t(
                        `fn run_parser(parser: Box<dyn Parser>, input: &str) {
    let _ = parser.parse(input);
}`,
                        `fn run_parser(parser: Box<dyn Parser>, input: &str) {
    let _ = parser.parse(input);
}`
                      ),
                      error: t(
                        ["error[E0191]: the value of the associated types `Output` and `Error` in `Parser` must be specified", "`dyn Parser` 需要知道 `Output` 和 `Error` 的具体类型，否则调用方不知道返回什么。"],
                        ["error[E0191]: the value of the associated types `Output` and `Error` in `Parser` must be specified", "`dyn Parser` needs concrete `Output` and `Error` types; otherwise callers do not know what is returned."]
                      ),
                      explanation: t(
                        ["写成 `Box<dyn Parser<Output = Course, Error = ParseError>>`，或者在这里继续使用泛型静态分发。"],
                        ["Write `Box<dyn Parser<Output = Course, Error = ParseError>>`, or keep static dispatch with generics here."]
                      )
                    }
                  ]
                )
              ],
              references: ["serde-rs/serde", "rust-lang/rust-analyzer"]
            })
          ]
        });
})();
