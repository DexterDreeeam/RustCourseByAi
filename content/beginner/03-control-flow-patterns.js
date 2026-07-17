(function () {
  const { t, localizedExample, tableExample, textExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
    id: "control-flow-patterns",
    title: t("控制流与模式匹配", "Control flow and pattern matching"),
    sections: [
      lesson({
        id: "control-flow-expressions",
        title: ["if、loop、while 与 for", "if, loop, while, and for"],
        goals: [
          ["知道 Rust 的 `if` 更像一个表达式，分支可以直接产生值。", "能把 C++ 里常见的条件、无限循环、条件循环和遍历循环对应到 Rust 写法。"],
          ["Know that Rust `if` is an expression and can produce a value directly.", "Map common C++ conditionals, infinite loops, conditional loops, and iteration loops to Rust syntax."]
        ],
        syntax: [
          ["`if` 条件必须是 `bool`，不会像 C++ 那样把整数、指针或容器隐式当真假值。`if` 可以返回值，但所有分支必须返回同一种类型。", "`loop` 是无限循环，可以用 `break value` 让整个 `loop` 表达式产生值；`while` 和 C++ 类似，适合条件循环；`for` 直接遍历 iterator / range / collection，不手写下标更常见。"],
          ["An `if` condition must be `bool`; Rust will not implicitly treat integers, pointers, or containers as truthy like C++ can. `if` can return a value, but all branches must return the same type.", "`loop` is an infinite loop and may use `break value` so the whole `loop` expression produces a value; `while` is similar to C++ for conditional loops; `for` iterates over iterators, ranges, and collections, so manual indexing is less common."]
        ],
        engineering: [
          ["项目代码里，`if` 表达式适合做小的策略选择和默认值选择；复杂流程仍应拆成函数，避免把很多业务逻辑塞进一个表达式。", "`for item in collection.iter()` 比手写 `for (i = 0; i < len; ++i)` 更安全：不会越界，也能表达“只读遍历 / 可变遍历 / 消费所有权”。"],
          ["In project code, `if` expressions fit small strategy choices and default selection; complex flows should still be split into functions instead of packed into one expression.", "`for item in collection.iter()` is safer than hand-written `for (i = 0; i < len; ++i)`: it cannot go out of bounds and expresses read-only iteration, mutable iteration, or ownership-consuming iteration."]
        ],
        cppComparison: [
          ["C++ 的 `if`/`while`/`for` 主要是 statement；Rust 的 `if` 和 `loop` 可以是 expression。C++ 允许 `if (ptr)`、`if (count)` 这类隐式真假判断，Rust 要写成 `ptr.is_null()`、`count > 0` 这种明确条件。"],
          ["C++ `if`/`while`/`for` are mostly statements; Rust `if` and `loop` can be expressions. C++ allows implicit truthiness such as `if (ptr)` or `if (count)`, while Rust requires explicit conditions such as `ptr.is_null()` or `count > 0`."]
        ],
        examples: [
          textExample(
            "先看差异：表达式和显式条件",
            "First difference: expressions and explicit conditions",
            [
              "`if` 分支在 Rust 里可以直接给 `let` 赋值，这让“小选择”更像普通表达式。",
              "但 Rust 不接受 `if count { ... }`，因为 `count` 是整数不是 `bool`。这会把 C++ 里容易隐藏的真假转换暴露出来。"
            ],
            [
              "`if` branches can assign directly into a `let`, so small choices read like ordinary expressions.",
              "But Rust rejects `if count { ... }` because `count` is an integer, not `bool`. This exposes truthiness conversions that C++ may hide."
            ]
          ),
          withMistakes(
            localizedExample("Rust: 控制流表达式", "Rust: control-flow expressions", "rust", `fn retry_delay_ms(failures: u32) -> u64 {
    // if 是表达式：三个分支都产生 u64
    let delay = if failures == 0 {
        0
    } else if failures < 3 {
        100
    } else {
        1_000
    };

    delay
}

fn first_even(values: &[i32]) -> Option<i32> {
    // loop 可以通过 break value 返回值
    let mut index = 0;
    loop {
        if index == values.len() {
            break None;
        }
        let value = values[index];
        if value % 2 == 0 {
            break Some(value);
        }
        index += 1;
    }
}

fn sum_ports(ports: &[u16]) -> u32 {
    let mut total = 0;
    for port in ports {
        total += u32::from(*port);
    }
    total
}`, `fn retry_delay_ms(failures: u32) -> u64 {
    // if is an expression: all branches produce u64
    let delay = if failures == 0 {
        0
    } else if failures < 3 {
        100
    } else {
        1_000
    };

    delay
}

fn first_even(values: &[i32]) -> Option<i32> {
    // loop may return a value through break value
    let mut index = 0;
    loop {
        if index == values.len() {
            break None;
        }
        let value = values[index];
        if value % 2 == 0 {
            break Some(value);
        }
        index += 1;
    }
}

fn sum_ports(ports: &[u16]) -> u32 {
    let mut total = 0;
    for port in ports {
        total += u32::from(*port);
    }
    total
}`),
            [
              {
                title: t("错误：把整数当 bool", "Wrong: treat an integer as bool"),
                language: "rust",
                code: t(
                  `fn enabled(count: u32) -> bool {
    if count {
        true
    } else {
        false
    }
}`,
                  `fn enabled(count: u32) -> bool {
    if count {
        true
    } else {
        false
    }
}`
                ),
                error: t(
                  ["error[E0308]: mismatched types: expected `bool`, found `u32`", "Rust 不做 C++ 风格的隐式真假转换，必须写成 `count > 0`。"],
                  ["error[E0308]: mismatched types: expected `bool`, found `u32`", "Rust does not do C++-style implicit truthiness; write `count > 0`."]
                ),
                explanation: t(
                  ["条件显式化能避免 `0`、空指针、空容器等语义混在一起。不同类型要用各自清楚的判断方法。"],
                  ["Explicit conditions avoid mixing the meanings of `0`, null pointers, and empty containers. Each type should use a clear predicate."]
                )
              },
              {
                title: t("错误：if 两个分支类型不同", "Wrong: if branches have different types"),
                language: "rust",
                code: t(
                  `fn label(ok: bool) -> String {
    if ok {
        "ready"
    } else {
        String::from("blocked")
    }
}`,
                  `fn label(ok: bool) -> String {
    if ok {
        "ready"
    } else {
        String::from("blocked")
    }
}`
                ),
                error: t(
                  ["error[E0308]: `if` and `else` have incompatible types", "`\"ready\"` 是 `&str`，`String::from(\"blocked\")` 是 `String`；表达式分支必须统一类型。"],
                  ["error[E0308]: `if` and `else` have incompatible types", "`\"ready\"` is `&str`, while `String::from(\"blocked\")` is `String`; expression branches must agree on one type."]
                ),
                explanation: t(
                  ["把两个分支都改成 `String`，或让函数返回 `&'static str`，不要让调用方猜一个表达式到底是什么类型。"],
                  ["Make both branches `String`, or return `&'static str`; do not make callers guess the type of an expression."]
                )
              }
            ]
          ),
          tableExample(
            "C++ 控制流到 Rust 的常见映射",
            "Common C++ control-flow mappings to Rust",
            [
              t("C++ 写法", "C++ form"),
              t("Rust 写法", "Rust form"),
              t("要注意的差异", "Difference to watch")
            ],
            [
              [t("`if (count)`", "`if (count)`"), t("`if count > 0`", "`if count > 0`"), t("条件必须是 `bool`。", "The condition must be `bool`.")],
              [t("`while (running)`", "`while (running)`"), t("`while running { ... }`", "`while running { ... }`"), t("基本相同，但条件仍必须是 `bool`。", "Mostly the same, but the condition must still be `bool`.")],
              [t("`for (int i = 0; i < n; ++i)`", "`for (int i = 0; i < n; ++i)`"), t("`for i in 0..n { ... }`", "`for i in 0..n { ... }`"), t("range 默认右开：包含 `0`，不包含 `n`。", "Ranges are end-exclusive by default: include `0`, exclude `n`.")],
              [t("`for (auto& x : xs)`", "`for (auto& x : xs)`"), t("`for x in &xs { ... }`", "`for x in &xs { ... }`"), t("用 `&xs`/`&mut xs`/`xs` 区分只读、可变、消费所有权。", "Use `&xs` / `&mut xs` / `xs` to choose read-only, mutable, or ownership-consuming iteration.")]
            ]
          )
        ],
        references: ["rust-lang/rust"]
      }),
      lesson({
        id: "match-patterns",
        title: ["match 与模式", "match and patterns"],
        goals: [
          ["理解 `match` 不只是 C++ 的 `switch`，它会解构 enum、tuple、struct 和引用。", "知道穷尽匹配如何让新增状态时的遗漏变成编译错误。"],
          ["Understand that `match` is more than C++ `switch`: it destructures enums, tuples, structs, and references.", "Know how exhaustive matching turns missed new states into compile errors."]
        ],
        syntax: [
          ["`match value { pattern => expr, ... }` 会从上到下测试 pattern，每个 arm 产生同一种结果类型。`_` 是兜底 pattern，`|` 可以合并多个 pattern，`if` guard 可以附加条件。", "`match` 必须穷尽：enum 的所有 variant、`Option` 的 `Some/None`、`Result` 的 `Ok/Err` 都要覆盖，除非用 `_` 明确兜底。"],
          ["`match value { pattern => expr, ... }` tests patterns from top to bottom, and every arm produces the same result type. `_` is the fallback pattern, `|` combines patterns, and an `if` guard adds a condition.", "`match` must be exhaustive: every enum variant, `Option`'s `Some/None`, and `Result`'s `Ok/Err` must be covered unless `_` explicitly catches the rest."]
        ],
        engineering: [
          ["状态机、协议消息、任务状态、错误分类都适合用 enum + `match`。当以后新增 variant，编译器会指出哪些业务分支还没处理。", "不要过早用 `_` 吞掉所有未来情况；在业务核心路径里，显式列出 variant 通常比兜底更利于维护。"],
          ["State machines, protocol messages, task statuses, and error categories fit enum + `match`. When a new variant is added later, the compiler points out which business branches still need handling.", "Avoid using `_` too early to swallow every future case; in core business paths, listing variants explicitly is usually more maintainable."]
        ],
        cppComparison: [
          ["C++ `switch` 主要按整数/枚举值跳转，容易漏 `case` 或忘 `break`。Rust `match` 没有隐式 fallthrough，并且会检查是否覆盖所有可能值，还能在匹配时把内部数据绑定出来。"],
          ["C++ `switch` mostly jumps on integers/enums and can miss `case` labels or `break`. Rust `match` has no implicit fallthrough, checks that all possible values are covered, and can bind inner data while matching."]
        ],
        examples: [
          textExample(
            "先看差异：穷尽和解构",
            "First difference: exhaustiveness and destructuring",
            [
              "`match` 的价值不只是少写 `if else`，而是把“所有状态必须被处理”交给编译器检查。",
              "当 enum variant 带数据时，pattern 可以直接把里面的数据绑定出来，不需要像 C++ 那样先判断 tag 再手动取 payload。"
            ],
            [
              "`match` is not just shorter `if else`; its value is asking the compiler to enforce that every state is handled.",
              "When an enum variant carries data, the pattern can bind that data directly, instead of checking a tag and then manually reading a payload as in C++."
            ]
          ),
          withMistakes(
            localizedExample("Rust: 用 match 实现任务状态机", "Rust: implement a task state machine with match", "rust", `#[derive(Debug)]
enum JobEvent {
    Started,
    Progress(u8),
    Finished { code: i32 },
    Failed(String),
}

fn summarize(event: JobEvent) -> String {
    match event {
        JobEvent::Started => String::from("started"),
        JobEvent::Progress(percent) if percent < 100 => {
            format!("running: {percent}%")
        }
        JobEvent::Progress(_) => String::from("almost done"),
        JobEvent::Finished { code: 0 } => String::from("success"),
        JobEvent::Finished { code } => format!("exit code {code}"),
        JobEvent::Failed(reason) => format!("failed: {reason}"),
    }
}`, `#[derive(Debug)]
enum JobEvent {
    Started,
    Progress(u8),
    Finished { code: i32 },
    Failed(String),
}

fn summarize(event: JobEvent) -> String {
    match event {
        JobEvent::Started => String::from("started"),
        JobEvent::Progress(percent) if percent < 100 => {
            format!("running: {percent}%")
        }
        JobEvent::Progress(_) => String::from("almost done"),
        JobEvent::Finished { code: 0 } => String::from("success"),
        JobEvent::Finished { code } => format!("exit code {code}"),
        JobEvent::Failed(reason) => format!("failed: {reason}"),
    }
}`),
            [
              {
                title: t("错误：没有覆盖所有 variant", "Wrong: not covering every variant"),
                language: "rust",
                code: t(
                  `enum JobEvent {
    Started,
    Finished,
    Failed(String),
}

fn label(event: JobEvent) -> &'static str {
    match event {
        JobEvent::Started => "started",
        JobEvent::Finished => "finished",
    }
}`,
                  `enum JobEvent {
    Started,
    Finished,
    Failed(String),
}

fn label(event: JobEvent) -> &'static str {
    match event {
        JobEvent::Started => "started",
        JobEvent::Finished => "finished",
    }
}`
                ),
                error: t(
                  ["error[E0004]: non-exhaustive patterns: `JobEvent::Failed(_)` not covered", "Rust 发现 `Failed` 分支没有处理，拒绝编译。"],
                  ["error[E0004]: non-exhaustive patterns: `JobEvent::Failed(_)` not covered", "Rust sees that the `Failed` case is unhandled and rejects the program."]
                ),
                explanation: t(
                  ["这正是 `match` 适合状态机的原因：新增状态后，遗漏处理不会悄悄跑到生产环境。"],
                  ["This is why `match` fits state machines: after adding a new state, missed handling does not silently reach production."]
                )
              },
              {
                title: t("错误：arm 返回类型不一致", "Wrong: match arms return different types"),
                language: "rust",
                code: t(
                  `fn status_code(ok: bool) -> i32 {
    match ok {
        true => 0,
        false => "failed",
    }
}`,
                  `fn status_code(ok: bool) -> i32 {
    match ok {
        true => 0,
        false => "failed",
    }
}`
                ),
                error: t(
                  ["error[E0308]: `match` arms have incompatible types", "`true` 分支是整数，`false` 分支是字符串；整个 `match` 必须有一个确定类型。"],
                  ["error[E0308]: `match` arms have incompatible types", "The `true` arm is an integer and the `false` arm is a string; the whole `match` must have one concrete type."]
                ),
                explanation: t(
                  ["和 `if` 表达式一样，`match` 每个 arm 都是在产生同一个表达式的结果。"],
                  ["Like an `if` expression, every `match` arm produces the result of the same expression."]
                )
              }
            ]
          ),
          tableExample(
            "match pattern 常用形态",
            "Common match pattern forms",
            [
              t("模式", "Pattern"),
              t("用途", "Use"),
              t("示例", "Example")
            ],
            [
              [t("精确 variant", "Exact variant"), t("处理 enum 的一个状态。", "Handle one enum state."), t("`JobEvent::Started`", "`JobEvent::Started`")],
              [t("解构 tuple/struct", "Destructure tuple/struct"), t("匹配时取出 payload。", "Extract payload while matching."), t("`Finished { code }`", "`Finished { code }`")],
              [t("合并分支", "Combine cases"), t("多个 pattern 共享逻辑。", "Share logic across patterns."), t("`0 | 1`", "`0 | 1`")],
              [t("guard", "Guard"), t("pattern 后再加布尔条件。", "Add a boolean condition after the pattern."), t("`Progress(p) if p < 100`", "`Progress(p) if p < 100`")],
              [t("兜底", "Fallback"), t("明确表示剩余情况走同一路径。", "Explicitly send remaining cases to one path."), t("`_`", "`_`")]
            ]
          )
        ],
        references: ["rust-lang/rust", "rust-lang/cargo"]
      })
    ]
  });
})();
