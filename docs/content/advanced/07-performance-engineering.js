(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "performance-engineering",
          title: t("性能工程：分配、零拷贝与 profiling", "Performance engineering: allocation, zero-copy, and profiling"),
          sections: [
            lesson({
              id: "allocation-api-design",
              title: ["从 API 设计减少分配", "Reduce allocations through API design"],
              goals: [
                ["识别 clone 和 String 分配热点。", "理解零拷贝和清晰边界的取舍。"],
                ["Spot clone and String allocation hotspots.", "Understand the trade-off between zero-copy and clear boundaries."]
              ],
              syntax: [
                ["`&str`、`&[u8]`、`Cow<'a, T>` 可以复用已有数据。", "`String`、`Vec<T>`、`Box<T>` 表示拥有堆内存。"],
                ["`&str`, `&[u8]`, and `Cow<'a, T>` can reuse existing data.", "`String`, `Vec<T>`, and `Box<T>` own heap memory."]
              ],
              engineering: [
                ["先测量，再优化；常见热点是分配、锁竞争、系统调用和序列化。", "不要为了零拷贝把生命周期污染到所有业务层。"],
                ["Measure first; common hotspots are allocations, lock contention, syscalls, and serialization.", "Do not spread lifetimes through every business layer just for zero-copy."]
              ],
              cppComparison: [
                ["Rust 的借用像 `string_view` / span，但编译器会检查生命周期，因此 API 约束更强。"],
                ["Rust borrows resemble `string_view` / span, but the compiler checks lifetimes, making APIs more constrained."]
              ],
              examples: [
                sharedExample("Rust: 借用输入，边界处拥有", "Rust: borrow input, own at boundary", "rust", `use std::borrow::Cow;

fn normalize_title(input: &str) -> Cow<'_, str> {
    let trimmed = input.trim();
    if trimmed == input && input.is_ascii() {
        Cow::Borrowed(input)
    } else {
        Cow::Owned(trimmed.to_ascii_lowercase())
    }
}

fn store_title(input: &str) -> String {
    normalize_title(input).into_owned()
}`)
              ],
              references: ["BurntSushi/ripgrep", "serde-rs/serde"]
            })
          ]
        });
})();

