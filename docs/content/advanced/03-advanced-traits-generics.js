(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "advanced-traits-generics",
          title: t("高级 trait 与泛型设计", "Advanced trait and generic design"),
          sections: [
            lesson({
              id: "associated-types-object-safety",
              title: ["关联类型、trait object 与调用成本", "Associated types, object safety, and dispatch cost"],
              goals: [
                ["理解关联类型适合把输出类型绑定到具体实现上。", "知道为什么有些 trait 不能直接写成 `dyn Trait`。"],
                ["Understand associated types as output types tied to implementations.", "Know why some traits cannot become `dyn Trait`."]
              ],
              syntax: [
                ["关联类型写在 trait 内部，由每个实现决定具体类型。", "trait object 只能调用一部分满足规则的方法，否则编译器无法保证运行时调用是安全的。"],
                ["Associated types live inside traits, and implementations choose concrete types.", "Object safety limits the method set that can be safely called through trait objects."]
              ],
              engineering: [
                ["parser、storage、service 这类抽象常用关联类型表达错误或输出。", "如果对外 API 设计得过度泛型，用户会更难理解，编译时间也可能变长。"],
                ["Parser, storage, and service abstractions often use associated types for errors or outputs.", "Overly generic APIs increase compile time and usage complexity."]
              ],
              cppComparison: [
                ["这有点像 C++ 里 traits/type aliases 和虚接口之间的取舍；Rust 会更明确地区分两种情况：一种是在编译时就知道要调用哪个具体类型，另一种是在运行时通过 trait object 再决定。"],
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
                      title: t("错误：dyn Trait 忘记指定关联类型", "Wrong: dyn Trait without associated types"),
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
                        ["error[E0191]: the value of the associated types `Output` and `Error` in `Parser` must be specified", "`dyn Parser` 必须写清楚 `Output` 和 `Error` 的具体类型，否则调用方不知道 `parse` 会返回什么。"],
                        ["error[E0191]: the value of the associated types `Output` and `Error` in `Parser` must be specified", "`dyn Parser` needs concrete `Output` and `Error` types; otherwise callers do not know what is returned."]
                      ),
                      explanation: t(
                        ["可以写成 `Box<dyn Parser<Output = Course, Error = ParseError>>`；如果不需要运行时替换实现，也可以继续使用泛型。"],
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
