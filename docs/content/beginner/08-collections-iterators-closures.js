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
                withMistakes(
                  sharedExample("Rust: 从日志行聚合错误次数", "Rust: aggregate error counts from log lines", "rust", `use std::collections::BTreeMap;

fn error_counts(lines: &[String]) -> BTreeMap<&str, usize> {
    lines
        // Iterate over each line by reference.
        .iter()
        // Keep only lines containing "ERROR "; split into (before, after).
        .filter_map(|line| line.split_once("ERROR "))
        // Split the part after "ERROR " at the first ':' to get (code, message).
        .filter_map(|(_, rest)| rest.split_once(':'))
        // Extract the error code, trimming whitespace.
        .map(|(code, _message)| code.trim())
        // Accumulate counts: for each code, insert 0 if absent then increment.
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
