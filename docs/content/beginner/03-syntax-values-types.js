(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "syntax-values-types",
          title: t("基础语法、值与类型", "Syntax, values, and types"),
          sections: [
            lesson({
              id: "bindings-mutability-shadowing",
              title: ["绑定、可变性与 shadowing", "Bindings, mutability, and shadowing"],
              goals: [
                ["理解 `let` 绑定不是 C++ 变量声明的简单替代。", "用 shadowing 表达逐步归一化。"],
                ["Understand `let` bindings as more than C++ variable declarations.", "Use shadowing to express step-by-step normalization."]
              ],
              syntax: [
                ["Rust 默认不可变，`mut` 明确标出哪里会改值；shadowing 会创建一个新的同名绑定，也可以改变类型。", "`const` 是编译时就确定的常量，`static` 是有固定地址的全局值。"],
                ["Rust is immutable by default; `mut` marks state changes; shadowing creates a new binding and may change type.", "`const` is a compile-time constant, while `static` is a global value with a fixed address."]
              ],
              engineering: [
                ["配置解析、CLI 参数清洗、路径归一化都适合用 shadowing 表达从 raw 到 typed 的过程。", "代码审查时看到 `mut` 就应该问：这个状态变化是否必要，作用域是否足够小。"],
                ["Config parsing, CLI cleanup, and path normalization fit shadowing from raw input to typed values.", "During review, every `mut` should trigger the question: is this mutation necessary and scoped tightly?"]
              ],
              cppComparison: [
                ["C++ 也能用 `const` 写不可变风格，但 Rust 把不可变作为默认值，减少了团队纪律成本。"],
                ["C++ can use `const` for immutable style, but Rust makes immutability the default and reduces reliance on team discipline."]
              ],
              examples: [
                withMistakes(
                  localizedExample("Rust: CLI 配置归一化", "Rust: CLI config normalization", "rust", `#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    workers: usize,
}

fn parse_config(raw_host: &str, raw_port: &str, raw_workers: &str) -> ServerConfig {
    let host = raw_host.trim();
    let host = if host.is_empty() { "127.0.0.1" } else { host };

    let port = raw_port.trim();
    let port: u16 = port.parse().expect("port must be a number");

    let workers = raw_workers.trim();
    let workers: usize = workers.parse().unwrap_or(4);

    // 每一步 shadowing 都把含义变窄，最后得到强类型配置。
    ServerConfig { host: host.to_owned(), port, workers }
}`, `#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    workers: usize,
}

fn parse_config(raw_host: &str, raw_port: &str, raw_workers: &str) -> ServerConfig {
    let host = raw_host.trim();
    let host = if host.is_empty() { "127.0.0.1" } else { host };

    let port = raw_port.trim();
    let port: u16 = port.parse().expect("port must be a number");

    let workers = raw_workers.trim();
    let workers: usize = workers.parse().unwrap_or(4);

    // Each shadowing step narrows meaning until we have typed config.
    ServerConfig { host: host.to_owned(), port, workers }
}`),
                  [
                    {
                      title: t("错误：修改不可变绑定", "Wrong: mutate an immutable binding"),
                      language: "rust",
                      code: t(
                        `fn normalize_port(raw: &str) -> u16 {
    let port = raw.trim();
    port = "8080";
    port.parse().unwrap()
}`,
                        `fn normalize_port(raw: &str) -> u16 {
    let port = raw.trim();
    port = "8080";
    port.parse().unwrap()
}`
                      ),
                      error: t(
                        ["error[E0384]: cannot assign twice to immutable variable `port`", "`let port` 默认不可变；如果要重新绑定，应该写新的 `let port = ...`，如果要原地修改才使用 `mut`。"],
                        ["error[E0384]: cannot assign twice to immutable variable `port`", "`let port` is immutable by default; use a new `let port = ...` binding for shadowing, or `mut` only for true in-place mutation."]
                      ),
                      explanation: t(
                        ["这里想表达的是“归一化步骤”，不是同一个变量反复改值；shadowing 比 `mut` 更能说明每一步的含义变化。"],
                        ["This is a normalization pipeline, not repeated mutation of one variable; shadowing communicates each meaning change better than `mut`."]
                      )
                    }
                  ]
                )
              ],
              references: ["rust-lang/rust"]
            }),
            lesson({
              id: "strings-slices-collections",
              title: ["String、slice 与常用集合", "String, slices, and common collections"],
              goals: [
                ["理解拥有类型和借用视图。", "知道 `String`、`&str`、`Vec<T>`、`HashMap<K,V>` 如何配合。"],
                ["Understand owned types and borrowed views.", "Know how `String`, `&str`, `Vec<T>`, and `HashMap<K,V>` work together."]
              ],
              syntax: [
                ["`String` 拥有堆内存，`&str` 是字符串视图；`Vec<T>` 拥有连续数组，`&[T]` 是切片视图。", "集合 API 经常通过借用避免不必要分配。"],
                ["`String` owns heap memory, `&str` is a string view; `Vec<T>` owns a contiguous array, and `&[T]` is a slice view.", "Collection APIs often use borrowing to avoid unnecessary allocation."]
              ],
              engineering: [
                ["公共 API 优先接收 `&str` 或 slice，只有需要保存数据时才转成 owned。", "集合选择应该来自访问模式：顺序、查找、排序、队列。"],
                ["Public APIs should prefer `&str` or slices and allocate owned values only when storing.", "Choose collections from access patterns: order, lookup, sorting, or queueing."]
              ],
              cppComparison: [
                ["`&str` 接近 `std::string_view`，`&[T]` 接近 span；不同的是，Rust 会检查这些视图不会比原始数据活得更久。"],
                ["`&str` resembles `std::string_view`, and `&[T]` resembles span; Rust checks that views cannot outlive sources."]
              ],
              examples: [
                withMistakes(
                  sharedExample("Rust: 统计课程标签", "Rust: count course tags", "rust", `use std::collections::HashMap;

#[derive(Debug)]
struct Lesson {
    title: String,
    tags: Vec<String>,
}

fn count_tags(lessons: &[Lesson]) -> HashMap<&str, usize> {
    let mut counts = HashMap::new();

    for lesson in lessons {
        for tag in &lesson.tags {
            *counts.entry(tag.as_str()).or_insert(0) += 1;
        }
    }

    counts
}`),
                  [
                    {
                      title: t("错误：返回指向局部 String 的 &str", "Wrong: return &str pointing into a local String"),
                      language: "rust",
                      code: t(
                        `fn first_tag() -> &str {
    let tags = vec![String::from("rust")];
    tags[0].as_str()
}`,
                        `fn first_tag() -> &str {
    let tags = vec![String::from("rust")];
    tags[0].as_str()
}`
                      ),
                      error: t(
                        ["error[E0515]: cannot return value referencing local variable `tags`", "`tags` 在函数结束时被释放，返回的 `&str` 会悬垂。"],
                        ["error[E0515]: cannot return value referencing local variable `tags`", "`tags` is dropped at function exit, so the returned `&str` would dangle."]
                      ),
                      explanation: t(
                        ["如果调用方需要长期保存结果，就返回 `String`；如果只是临时查看，就让调用方传入数据，并返回和输入绑定在一起的借用。"],
                        ["Return `String` if the caller needs to keep the result; return a borrow only when it is tied to caller-provided input."]
                      )
                    }
                  ]
                )
              ],
              references: ["BurntSushi/ripgrep"]
            })
          ]
        });
})();
