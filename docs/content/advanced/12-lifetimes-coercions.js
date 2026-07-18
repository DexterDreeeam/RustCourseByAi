(function () {
  const { t, textExample, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "advanced-lifetimes-coercions",
          title: t("生命周期省略与借用转换", "Lifetime elision and borrow coercions"),
          sections: [
            lesson({
              id: "lifetime-elision-api-signatures",
              title: ["lifetime elision 与 API 签名", "Lifetime elision and API signatures"],
              goals: [
                ["把 `fn first_word(text: &str) -> &str` 读成完整的 lifetime 关系。", "知道什么时候必须显式写出 `'a`。"],
                ["Read `fn first_word(text: &str) -> &str` as a complete lifetime relationship.", "Know when `'a` must be written explicitly."]
              ],
              syntax: [
                ["当函数只有一个 borrowed input 时，省略的输出 lifetime 默认来自这个输入；多个输入时通常必须显式标注。"],
                ["When a function has exactly one borrowed input, an elided output lifetime comes from that input; with multiple inputs, it usually must be written explicitly."]
              ],
              engineering: [
                ["进阶章节后续会把这个规则放到 parser、cache view、zero-copy API 里讲，避免把 lifetime 当成神秘语法。"],
                ["A later advanced pass will connect this rule to parsers, cache views, and zero-copy APIs so lifetimes read as API contracts rather than mystery syntax."]
              ],
              cppComparison: [
                ["C++ `string_view` 的生命周期靠约定和 review；Rust 把关系写进类型签名或用省略规则补全。"],
                ["C++ `string_view` lifetimes rely on convention and review; Rust records the relationship in the type signature or fills it through elision rules."]
              ],
              examples: [
                textExample(
                  "后续扩展占位",
                  "Placeholder for later expansion",
                  ["这里会补充 lifetime elision 三条规则、多个输入参数的歧义、method receiver 的特殊规则，以及为什么这些规则不依赖函数体推测。"],
                  ["This section will later cover the lifetime elision rules, ambiguity with multiple input parameters, the special method receiver rule, and why none of this depends on guessing from the function body."]
                )
              ],
              references: ["rust-lang/rust", "serde-rs/serde"]
            }),
            lesson({
              id: "deref-coercion-api-boundaries",
              title: ["Deref coercion 与 API 边界", "Deref coercion and API boundaries"],
              goals: [
                ["解释为什么 `&String` 能传给需要 `&str` 的函数。", "区分显式 `.as_str()` 和自动 deref coercion 的可读性取舍。"],
                ["Explain why `&String` can be passed to a function expecting `&str`.", "Distinguish explicit `.as_str()` from automatic deref coercion as a readability trade-off."]
              ],
              syntax: [
                ["`String` 实现 `Deref<Target = str>`，所以某些借用位置可以从 `&String` 自动转换成 `&str`。"],
                ["`String` implements `Deref<Target = str>`, so some borrow positions can coerce from `&String` to `&str` automatically."]
              ],
              engineering: [
                ["进阶章节后续会把 `String`、`Vec<T>`、`Box<T>`、`Arc<T>` 的 deref 行为和 API 参数设计放在一起讲。"],
                ["A later advanced pass will connect deref behavior for `String`, `Vec<T>`, `Box<T>`, and `Arc<T>` to API parameter design."]
              ],
              cppComparison: [
                ["这不像 C++ 隐式构造一个新对象；通常只是把 smart/owned wrapper 借成它暴露的目标视图。"],
                ["This is not like implicitly constructing a new C++ object; it usually borrows a smart/owned wrapper as the target view it exposes."]
              ],
              examples: [
                textExample(
                  "后续扩展占位",
                  "Placeholder for later expansion",
                  ["这里会补充 deref coercion 的触发位置、不会发生自动 owned 转换的场景，以及为什么入门示例优先写 `.as_str()`。"],
                  ["This section will later cover where deref coercion is triggered, cases where automatic owned conversion does not happen, and why beginner examples prefer `.as_str()`."]
                )
              ],
              references: ["rust-lang/rust", "tokio-rs/tokio"]
            })
          ]
        });
})();
