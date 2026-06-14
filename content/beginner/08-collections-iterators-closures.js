(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "collections-iterators-closures",
          title: t("集合、迭代器与闭包", "Collections, iterators, and closures"),
          sections: [
            lesson({
              id: "iterator-pipeline",
              title: ["迭代器流水线与闭包捕获", "Iterator pipelines and closure capture"],
              goals: [
                ["理解 `iter`、`iter_mut`、`into_iter` 的所有权差异。", "用闭包表达局部过滤、转换和聚合逻辑。"],
                ["Understand ownership differences among `iter`, `iter_mut`, and `into_iter`.", "Use closures for local filtering, mapping, and aggregation logic."]
              ],
              syntax: [
                ["`iter()` 产生 `&T`，`iter_mut()` 产生 `&mut T`，`into_iter()` 消费集合产生 `T`。", "闭包根据捕获方式实现 `Fn`、`FnMut` 或 `FnOnce`。"],
                ["`iter()` yields `&T`, `iter_mut()` yields `&mut T`, and `into_iter()` consumes the collection and yields `T`.", "Closures implement `Fn`, `FnMut`, or `FnOnce` based on capture behavior."]
              ],
              engineering: [
                ["解析、过滤、聚合和报表生成非常适合 iterator pipeline。", "链条过长时拆成命名函数，避免为了炫技牺牲可读性。"],
                ["Parsing, filtering, aggregation, and report generation fit iterator pipelines.", "When a chain gets too long, extract named functions instead of sacrificing readability."]
              ],
              cppComparison: [
                ["C++ ranges 也能表达流水线，但 Rust 迭代器会把消费和借用写进类型。"],
                ["C++ ranges can express pipelines too, but Rust iterators encode consumption and borrowing in types."]
              ],
              examples: [
                textExample(
                  "为什么链式调用能工作",
                  "Why chaining works",
                  ["每个适配器（`filter_map`、`map` 等）返回的类型（如 `FilterMap<I, F>`）都实现了 `Iterator` trait。所以你可以继续在它上面调用 `.filter_map()`、`.map()` 等——这些方法定义在 `Iterator` trait 上，任何 `impl Iterator` 的类型都拥有它们。", "链条最后用 `.fold()`、`.collect()` 或 `.for_each()` 等终止操作消费迭代器，得到最终结果。在终止操作之前，整条链都是惰性的，不会真正遍历元素。"],
                  ["Each adapter (`filter_map`, `map`, etc.) returns a type (like `FilterMap<I, F>`) that implements the `Iterator` trait. So you can keep calling `.filter_map()`, `.map()`, etc. — these methods are defined on `Iterator`, and any type that `impl Iterator` has them.", "The chain ends with a terminal operation like `.fold()`, `.collect()`, or `.for_each()` that consumes the iterator and produces the final result. Before that, the entire chain is lazy — no elements are actually traversed."]
                ),
                withMistakes(
                  sharedExample("Rust: 从日志行聚合错误次数", "Rust: aggregate error counts from log lines", "rust", `use std::collections::BTreeMap;

fn error_counts(lines: &[String]) -> BTreeMap<&str, usize> {
    lines
        .iter()
        // 只保留含 "ERROR " 的行，按 "ERROR " 切成 (前, 后)。
        .filter_map(|line| line.split_once("ERROR "))
        // 在后半段按第一个 ':' 再切一刀，得到 (错误码, 消息)。
        .filter_map(|(_, rest)| rest.split_once(':'))
        // 取错误码，去掉两端空白。
        .map(|(code, _message)| code.trim())
        // 折叠：遇到一个 code 就在 map 里 +1。
        .fold(BTreeMap::new(), |mut counts, code| {
            *counts.entry(code).or_insert(0) += 1;
            counts
        })
}`),
                  [
                    {
                      title: t("错误：into_iter 消费集合后继续使用", "Wrong: use a collection after into_iter consumes it"),
                      language: "rust",
                      code: t(
                        `fn count_and_log(lines: Vec<String>) -> usize {
    let count = lines.into_iter().filter(|line| line.contains("ERROR")).count();
    println!("processed {} lines", lines.len());
    count
}`,
                        `fn count_and_log(lines: Vec<String>) -> usize {
    let count = lines.into_iter().filter(|line| line.contains("ERROR")).count();
    println!("processed {} lines", lines.len());
    count
}`
                      ),
                      error: t(
                        ["error[E0382]: borrow of moved value: `lines`", "`into_iter()` 消费了 `Vec<String>`，后面不能再调用 `lines.len()`。"],
                        ["error[E0382]: borrow of moved value: `lines`", "`into_iter()` consumed the `Vec<String>`, so `lines.len()` cannot be called afterward."]
                      ),
                      explanation: t(
                        ["如果还要保留集合，用 `lines.iter()`；如果确实要消费集合，就在消费前先记录长度。"],
                        ["Use `lines.iter()` if the collection must remain available; if consuming is intended, record the length before consumption."]
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
