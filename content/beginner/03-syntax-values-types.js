(function () {
  const { t, sharedExample, localizedExample, tableExample, methodTableExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "syntax-values-types",
          title: t("基础语法、值与类型", "Syntax, values, and types"),
          sections: [
            lesson({
              id: "scalar-compound-types",
              title: ["标量与复合类型", "Scalar and compound types"],
              goals: [
                ["认识 Rust 的标量类型：定长整数、浮点、`bool`、`char`，看清它们和 C++ 内置类型的差异。", "认识复合类型 tuple 和定长 array，知道它们何时直接存在栈上。"],
                ["Know Rust's scalar types: fixed-width integers, floats, `bool`, and `char`, and how they differ from C++ built-ins.", "Know the compound types `tuple` and fixed-size `array`, and when they live directly on the stack."]
              ],
              syntax: [
                ["整数把位宽和符号写进类型名：`i8/i16/i32/i64/i128/isize` 有符号，`u8/u16/u32/u64/u128/usize` 无符号；不标类型时默认推断成 `i32`。`usize`/`isize` 按指针宽度走，专门用于下标、长度和容量。", "浮点只有 `f32` 和 `f64`（默认 `f64`）；`bool` 占 1 字节；`char` 占 4 字节，能放下一个字母、一个汉字或一个 emoji。字面量可以用 `_` 分隔（`1_000_000`）、写进制（`0xff`、`0o77`、`0b1010`）、带后缀（`42u8`、`3.14f32`）。", "不过 `char` 的 4 字节不代表字符串很占空间：Rust 的字符串 `String`/`&str` 底层是 UTF-8 编码的字节序列，不是 `char` 数组——ASCII（英文）字符每个仍只占 1 字节，其他文字按 UTF-8 占 1 到 4 字节不等；只有当你显式按 `char` 存储（`Vec<char>`、`[char; N]`）时，每个字符才固定占 4 字节，这种用法很少见。", "复合类型里，tuple 把若干不同类型的值打包成一个值，`()` 是空 tuple（unit 类型）；array 是 `[T; N]`，定长、同类型、连续存放，越界访问会 panic 而不是读到脏数据。"],
                ["Integers bake width and sign into the type name: `i8/i16/i32/i64/i128/isize` are signed, the `u*` family is unsigned, and an unannotated literal defaults to `i32`. `usize`/`isize` are pointer-sized and used for indices, lengths, and capacities.", "Floats are only `f32`/`f64` (default `f64`); `bool` is one byte; `char` is four bytes and holds a single letter, CJK character, or emoji. Literals allow `_` separators, `0x/0o/0b` bases, and type suffixes such as `42u8` or `3.14f32`.", "Still, a 4-byte `char` does not make strings heavy: Rust's `String`/`&str` are UTF-8 byte sequences, not arrays of `char` — ASCII characters take one byte each and other text takes 1 to 4 UTF-8 bytes; only explicit `char` storage such as `Vec<char>` or `[char; N]` uses a fixed four bytes per character, which is rare.", "For compound types, a tuple packs several differently typed values into one value (`()` is the unit type), and an array `[T; N]` is fixed-length, same-typed, and contiguous; out-of-bounds access panics instead of reading garbage."]
              ],
              engineering: [
                ["选整数类型要看语义边界：协议字段、字节缓冲用 `u8`/`u16` 这种明确宽度；下标、长度、容量统一用 `usize`，避免和有符号类型来回转换。", "Rust 没有隐式数值转换，跨类型运算都要显式 `as` 或 `try_into()`；这看着啰嗦，但能让截断和符号变化在 code review 时一眼看出来。"],
                ["Pick integer types from semantics: protocol fields and byte buffers use `u8`/`u16`, while indices, lengths, and capacities use `usize` to avoid signed/unsigned churn.", "Rust has no implicit numeric conversion, so every cross-type operation needs `as` or `try_into()`; it looks verbose but makes truncation and sign changes obvious during review."]
              ],
              cppComparison: [
                ["C++ 的 `int`、`long` 宽度依平台而定，Rust 把位宽写进类型名，跨平台行为一致。`usize` 对应 `size_t`；`char` 在 C++ 是一个字节，在 Rust 是 4 字节，要表示一个原始字节用 `u8`。", "C++ 整数溢出是未定义行为，Rust 把它定义清楚了：默认 debug build 直接 panic，release build 按二进制补码 wrap——这由 `overflow-checks` 标志控制，可在 release profile 里开启让它也 panic；另外提供 `checked_/wrapping_/saturating_/overflowing_` 系列方法显式选择行为。"],
                ["C++ `int`/`long` widths are platform-dependent; Rust bakes the width into the type name for consistent cross-platform behavior. `usize` maps to `size_t`; `char` is one byte in C++ but 4 bytes in Rust, so use `u8` for a raw byte.", "Integer overflow is UB in C++ but defined in Rust: by default debug builds panic and release builds wrap with two's complement — this is controlled by the `overflow-checks` flag, which you can enable in the release profile to panic there too — and the `checked_/wrapping_/saturating_/overflowing_` methods let you choose explicitly."]
              ],
              examples: [
                withMistakes(
                  localizedExample("Rust: 标量与复合类型", "Rust: scalar and compound types", "rust", `fn describe_packet() {
    // 定长整数：协议里常见的无符号字节与端口
    let version: u8 = 4;
    let port: u16 = 8080;
    let payload_len: usize = 1024; // 长度与下标统一用 usize

    // 浮点、布尔、字符
    let ratio: f64 = 0.75;
    let is_tls: bool = true;
    let marker: char = '中'; // char 是 4 字节 Unicode scalar，放得下非 ASCII

    // tuple：把不同类型打包成一个值
    let header: (u8, u16, usize) = (version, port, payload_len);
    let (v, p, len) = header; // 解构出三个绑定

    // array：定长、同类型、连续存放，越界会 panic
    let ports: [u16; 3] = [80, 443, 8080];
    let first = ports[0];

    println!("{v} {p} {len} {ratio} {is_tls} {marker} {first}");
}`, `fn describe_packet() {
    // Fixed-width integers: a common unsigned byte and port in protocols
    let version: u8 = 4;
    let port: u16 = 8080;
    let payload_len: usize = 1024; // lengths and indices use usize

    // Float, bool, and char
    let ratio: f64 = 0.75;
    let is_tls: bool = true;
    let marker: char = 'λ'; // char is a 4-byte Unicode scalar, not one byte

    // Tuple: pack values of different types into one value
    let header: (u8, u16, usize) = (version, port, payload_len);
    let (v, p, len) = header; // destructure into three bindings

    // Array: fixed-length, same-typed, contiguous; out-of-bounds panics
    let ports: [u16; 3] = [80, 443, 8080];
    let first = ports[0];

    println!("{v} {p} {len} {ratio} {is_tls} {marker} {first}");
}`),
                  [
                    {
                      title: t("错误：不同整数类型直接相加", "Wrong: add different integer types directly"),
                      language: "rust",
                      code: t(
                        `fn total(a: i32, b: i64) -> i64 {
    a + b
}`,
                        `fn total(a: i32, b: i64) -> i64 {
    a + b
}`
                      ),
                      error: t(
                        ["error[E0308]: mismatched types", "`a` 是 `i32`、`b` 是 `i64`，Rust 不会自动把窄类型提升到宽类型，需要显式写成 `a as i64 + b`。"],
                        ["error[E0308]: mismatched types", "`a` is `i32` and `b` is `i64`; Rust will not auto-promote the narrower type, so write `a as i64 + b` explicitly."]
                      ),
                      explanation: t(
                        ["Rust 没有隐式数值转换；显式 `as` 或 `try_into()` 让宽度变化在 review 时一眼可见，避免悄悄发生截断或符号翻转。"],
                        ["Rust has no implicit numeric conversion; explicit `as` or `try_into()` makes width changes visible in review and avoids silent truncation or sign flips."]
                      )
                    },
                    {
                      title: t("错误：用双引号写 char", "Wrong: use double quotes for a char"),
                      language: "rust",
                      code: t(
                        `fn marker() -> char {
    "x"
}`,
                        `fn marker() -> char {
    "x"
}`
                      ),
                      error: t(
                        ["error[E0308]: mismatched types: expected `char`, found `&str`", "双引号写出来的是字符串 slice `&str`，单个字符要用单引号 `'x'`。"],
                        ["error[E0308]: mismatched types: expected `char`, found `&str`", "Double quotes produce a string slice `&str`; a single character needs single quotes `'x'`."]
                      ),
                      explanation: t(
                        ["`char` 是一个 Unicode scalar，用单引号；`\"x\"` 是长度可变的字符串视图，两者是完全不同的类型。"],
                        ["A `char` is a single Unicode scalar written with single quotes; `\"x\"` is a variable-length string view, an entirely different type."]
                      )
                    },
                    {
                      title: t("错误：忽略整数溢出", "Wrong: ignore integer overflow"),
                      language: "rust",
                      code: t(
                        `fn next_id(id: u8) -> u8 {
    id + 1
}`,
                        `fn next_id(id: u8) -> u8 {
    id + 1
}`
                      ),
                      error: t(
                        ["thread 'main' panicked at 'attempt to add with overflow'（debug build）", "`u8` 最大是 255，`next_id(255)` 在 debug build 会直接 panic；release build 则会 wrap 成 0。"],
                        ["thread 'main' panicked at 'attempt to add with overflow' (debug build)", "`u8` maxes out at 255, so `next_id(255)` panics in a debug build and wraps to 0 in release."]
                      ),
                      explanation: t(
                        ["溢出在 Rust 是被定义的行为，但默认会 panic 提醒你；想明确选择行为就用 `checked_add`/`wrapping_add`/`saturating_add`。"],
                        ["Overflow is defined behavior in Rust but panics by default to warn you; choose behavior explicitly with `checked_add`/`wrapping_add`/`saturating_add`."]
                      )
                    }
                  ]
                ),
                localizedExample("Rust: 显式选择溢出行为", "Rust: choose overflow behavior explicitly", "rust", `fn main() {
    let x: u8 = 250;

    // 溢出时返回 None，强制调用方处理
    println!("{:?}", x.checked_add(10));

    // 按 2^8 取模 wrap（release build 的默认行为）
    println!("{}", x.wrapping_add(10));

    // 饱和：超过上界就停在 255
    println!("{}", x.saturating_add(10));

    // 同时拿到结果和“是否溢出”的标志
    let (value, overflowed) = x.overflowing_add(10);
    println!("{value} {overflowed}");
}`, `fn main() {
    let x: u8 = 250;

    // Returns None on overflow, forcing the caller to handle it
    println!("{:?}", x.checked_add(10));

    // Wraps modulo 2^8 (the default in release builds)
    println!("{}", x.wrapping_add(10));

    // Saturates: stops at the upper bound 255
    println!("{}", x.saturating_add(10));

    // Get both the result and an overflow flag
    let (value, overflowed) = x.overflowing_add(10);
    println!("{value} {overflowed}");
}`)
              ],
              references: ["rust-lang/rust"]
            }),
            lesson({
              id: "macros-vs-functions",
              title: ["宏调用与函数调用：为什么有的带 `!`", "Macro calls vs function calls: why some end with `!`"],
              goals: [
                ["把 `!` 读成宏调用标记，区分宏调用和普通函数调用。", "理解为什么 `println!`、`panic!`、`assert!`、`vec!` 必须是宏，而不能写成普通函数。"],
                ["Read `!` as a macro-invocation marker and tell macro calls apart from ordinary function calls.", "Understand why `println!`, `panic!`, `assert!`, and `vec!` must be macros rather than plain functions."]
              ],
              syntax: [
                ["名字后面带 `!` 的调用（`println!`、`vec!`、`panic!`）是宏调用，不是函数调用。宏在编译早期被展开成真正的 Rust 代码，然后才参与类型检查和代码生成；普通函数则是按签名直接调用的。", "宏能做函数做不到的事：接收任意数量、任意类型的参数（`println!` 想传几个值就传几个），在编译期检查格式串和参数是否对得上，以及直接生成代码（`vec![1, 2, 3]` 会展开成一段创建并填充 `Vec` 的代码）。普通函数的参数个数和类型在签名里就固定了，做不到这些。", "宏调用的定界符可以是 `()`、`[]` 或 `{}`，三者等价；习惯上 `vec![...]` 用方括号、`println!(...)` 用圆括号。带 `!` 的名字保留给宏，普通函数名后面绝不会出现 `!`。"],
                ["A call whose name ends with `!` (`println!`, `vec!`, `panic!`) is a macro invocation, not a function call. Macros expand into real Rust code early in compilation, before type checking and code generation; plain functions are called directly per their signature.", "Macros do what functions cannot: accept any number and mix of argument types (pass `println!` as many values as you like), check the format string against its arguments at compile time, and generate code outright (`vec![1, 2, 3]` expands into code that creates and fills a `Vec`). A plain function fixes its argument count and types in its signature, so it cannot.", "A macro's delimiters may be `()`, `[]`, or `{}` — all equivalent; conventionally `vec![...]` uses brackets and `println!(...)` uses parentheses. The `!` name is reserved for macros; an ordinary function name never carries a `!`."]
              ],
              engineering: [
                ["看到 `!` 就知道这是宏：展开后它可能生成一段代码、提前 return，或直接终止进程（`panic!`、`todo!`）。想看它到底展开成什么，可以用 `cargo expand`。", "日常工程里你主要是\"用\"标准库宏；自己\"写\"宏属于进阶话题，见进阶章节的宏与代码生成。"],
                ["Seeing `!` tells you it is a macro: after expansion it may generate code, return early, or abort the process (`panic!`, `todo!`). To see exactly what it expands to, use `cargo expand`.", "Day to day you mostly *use* standard-library macros; *writing* your own is an advanced topic — see the advanced macros and code-generation chapter."]
              ],
              cppComparison: [
                ["C++ 的 `#define` 宏是纯文本替换，不懂作用域也不懂类型，很容易踩坑；Rust 宏作用在 token / 语法树上，是 hygienic 的（不会意外捕获或污染外部的变量名），而且类型安全。`println!` 之于 C++ 更像编译期检查过的 `printf`：格式串和参数对不上会直接编译报错，而不是运行时未定义行为。"],
                ["C++ `#define` macros are raw text substitution that ignore scope and types and are easy to misuse; Rust macros operate on tokens / the syntax tree, are hygienic (they never accidentally capture or clobber outside names), and are type-safe. `println!` is closer to a compile-time-checked `printf`: a format/argument mismatch is a compile error, not run-time undefined behavior."]
              ],
              examples: [
                withMistakes(
                  sharedExample("Rust: 常见宏的用法", "Rust: common macros in use", "rust", `fn main() {
    // println! / eprintln!：格式化输出，参数个数可变，格式串在编译期检查
    println!("x = {}, y = {}", 1, 2);

    // format!：同样的格式化规则，但返回 String 而不是直接打印
    let label: String = format!("{}-{}", "id", 42);

    // vec!：用字面量直接构造 Vec，展开成创建并填充的代码
    let values: Vec<i32> = vec![1, 2, 3];

    // assert! / assert_eq!：条件不成立就 panic，常用于测试和不变量检查
    assert!(values.len() == 3);
    assert_eq!(label, "id-42");

    // dbg!：打印表达式的值和所在位置，并把值原样返回，方便临时调试
    let doubled = dbg!(values.len() * 2);

    // panic!：直接终止，报告不可恢复的 bug
    if doubled == 0 {
        panic!("长度不应该是 0");
    }
}`),
                  [
                    {
                      title: t("错误：把宏当普通函数调用，漏掉 `!`", "Wrong: calling a macro like a function, dropping the `!`"),
                      language: "rust",
                      code: t(
                        `fn main() {
    println("hello");
}`,
                        `fn main() {
    println("hello");
}`
                      ),
                      error: t(
                        ["error[E0423]: expected function, found macro `println`", "`println` 是宏不是函数，少了 `!` 编译器就去找名为 `println` 的函数，结果找不到。"],
                        ["error[E0423]: expected function, found macro `println`", "`println` is a macro, not a function; without `!` the compiler looks for a function named `println` and cannot find one."]
                      ),
                      explanation: t(
                        ["宏调用必须带 `!`：写成 `println!(\"hello\")`。`!` 不是可选的语法糖，而是告诉编译器\"这是宏，按宏展开\"。"],
                        ["A macro invocation must include `!`: write `println!(\"hello\")`. The `!` is not optional sugar; it tells the compiler \"this is a macro, expand it as one.\""]
                      )
                    }
                  ]
                ),
                tableExample("常用标准库宏速查", "Common standard-library macros",
                  [t("宏", "Macro"), t("作用", "What it does")],
                  [
                    ["`println!` / `print!` / `eprintln!`", t("格式化输出到标准输出 / 标准错误", "format and write to stdout / stderr")],
                    ["`format!`", t("按同样的格式化规则生成一个 `String`", "build a `String` using the same formatting rules")],
                    ["`vec!`", t("用字面量构造 `Vec`，如 `vec![0; n]`", "construct a `Vec` from a literal, e.g. `vec![0; n]`")],
                    ["`write!` / `writeln!`", t("向实现了 `Write`/`fmt::Write` 的目标写入格式化文本", "write formatted text into a `Write`/`fmt::Write` target")],
                    ["`panic!`", t("立即终止当前线程，报告不可恢复的 bug", "abort the current thread, reporting an unrecoverable bug")],
                    ["`assert!` / `assert_eq!` / `assert_ne!`", t("条件不成立就 panic，常用于测试和不变量", "panic when the condition fails; used in tests and invariants")],
                    ["`dbg!`", t("打印表达式的值和位置，并原样返回该值", "print an expression's value and location, returning it unchanged")],
                    ["`todo!` / `unimplemented!`", t("占位标记，一旦执行到就 panic", "placeholder markers that panic if reached")],
                    ["`matches!`", t("判断值是否匹配某个模式，返回 `bool`", "test whether a value matches a pattern, returning a `bool`")]
                  ]
                )
              ],
              references: ["rust-lang/rust"]
            }),
            lesson({
              id: "bindings-mutability-shadowing",
              title: ["绑定、可变性与 shadowing", "Bindings, mutability, and shadowing"],
              goals: [
                ["理解 `let` 绑定不是 C++ 变量声明的简单替代。", "用 shadowing 表达一步步 normalization：从原始输入变成可用配置。"],
                ["Understand `let` bindings as more than C++ variable declarations.", "Use shadowing to express step-by-step normalization."]
              ],
              syntax: [
                ["Rust 默认不可变，`mut` 明确标出哪里会改值；shadowing 会创建一个新的同名绑定，也可以改变类型。", "`const` 是编译时就确定的常量，`static` 是有固定地址的全局值。"],
                ["Rust is immutable by default; `mut` marks state changes; shadowing creates a new binding and may change type.", "`const` is a compile-time constant, while `static` is a global value with a fixed address."]
              ],
              engineering: [
                ["配置解析、CLI 参数清洗、路径 normalization 都适合用 shadowing 表达从 raw input 到 typed value 的过程。", "代码审查时看到 `mut` 就应该问：这个状态变化是否必要，作用域是否足够小。"],
                ["Config parsing, CLI cleanup, and path normalization fit shadowing from raw input to typed values.", "During review, every `mut` should trigger the question: is this mutation necessary and scoped tightly?"]
              ],
              cppComparison: [
                ["C++ 也能用 `const` 写不可变风格，但 Rust 把不可变作为默认值，减少了团队纪律成本。"],
                ["C++ can use `const` for immutable style, but Rust makes immutability the default and reduces reliance on team discipline."]
              ],
              examples: [
                withMistakes(
                  localizedExample("Rust: CLI config normalization", "Rust: CLI config normalization", "rust", `#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    workers: usize,
}

fn parse_config(raw_host: &str, raw_port: &str, raw_workers: &str) -> ServerConfig {
    let host = raw_host.trim();
    let host = if host.is_empty() { "127.0.0.1" } else { host };
    // 上面这一行是 shadowing：创建新的 host 绑定，覆盖同名旧绑定；不是修改旧变量。

    let port = raw_port.trim();
    let port: u16 = port.parse().expect("port must be a number");

    let workers = raw_workers.trim();
    let workers: usize = workers.parse().unwrap_or(4);

    // 每一步 shadowing 都让值更接近最终需要的强类型配置。
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
    // This is shadowing: create a new host binding with the same name; do not mutate the old one.

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
                        ["这里想表达的是 normalization 的步骤，不是反复修改同一个变量；shadowing 比 `mut` 更能说明每一步的含义变化。"],
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
                ["理解 owned type 和 borrowed view 的区别。", "先搞清楚 slice：它是指向一段连续数据的 borrowed view。"],
                ["Understand owned types and borrowed views.", "Know how `String`, `&str`, `Vec<T>`, and `HashMap<K,V>` work together."]
              ],
              syntax: [
                ["slice 表示“一段连续数据”的 borrowed view：它不拥有数据，只记录从哪里开始、长度是多少。`&str` 是字符串 slice，`&[T]` 是任意元素类型的 slice。", "`String` 拥有堆上的字符串数据，`&str` 只是看这段字符串；`Vec<T>` 拥有连续数组，`&[T]` 只是看这段数组。集合 API 经常通过 borrowed view 避免不必要分配。"],
                ["`String` owns heap memory, `&str` is a string view; `Vec<T>` owns a contiguous array, and `&[T]` is a slice view.", "Collection APIs often use borrowing to avoid unnecessary allocation."]
              ],
              engineering: [
                ["公共 API 优先接收 `&str` 或 `&[T]` 这样的 borrowed view；只有函数需要长期保存数据时，才转成 `String` 或 `Vec<T>` 这种 owned type。", "集合选择应该来自访问模式（access pattern）：要按顺序存取、用下标、在尾部追加，用 `Vec<T>`（order）；要按 key 快速查找或判断是否存在，用 `HashMap<K,V>`/`HashSet<T>`（lookup）；要让元素始终保持有序、支持范围查询，用 `BTreeMap`/`BTreeSet`（sorting）；要先进先出或两端进出的队列，用 `VecDeque<T>`（queue）。"],
                ["Public APIs should prefer `&str` or slices and allocate owned values only when storing.", "Choose collections from the access pattern: use `Vec<T>` for ordered, indexed, push-to-end access (order); `HashMap<K,V>`/`HashSet<T>` for fast key lookup or membership tests (lookup); `BTreeMap`/`BTreeSet` to keep entries sorted with range queries (sorting); and `VecDeque<T>` for FIFO or double-ended queues (queue)."]
              ],
              cppComparison: [
                ["`&str` 接近 `std::string_view`，`&[T]` 接近 span；不同的是，Rust 会检查这些 view 不会比原始数据活得更久。", "常用集合大多能在 C++ 标准库找到对应：`Vec<T>`↔`std::vector`、`VecDeque<T>`↔`std::deque`、`HashMap`/`HashSet`↔`std::unordered_map`/`unordered_set`、`BTreeMap`/`BTreeSet`↔有序的 `std::map`/`std::set`。差别在于 Rust 用所有权和借用规则约束谁能改、能借多久；完整对照见本页下方的表格。"],
                ["`&str` resembles `std::string_view`, and `&[T]` resembles span; Rust checks that views cannot outlive sources.", "Most collections map to the C++ standard library: `Vec<T>`↔`std::vector`, `VecDeque<T>`↔`std::deque`, `HashMap`/`HashSet`↔`std::unordered_map`/`unordered_set`, and `BTreeMap`/`BTreeSet`↔ordered `std::map`/`std::set`. The difference is that Rust's ownership and borrowing rules govern who may mutate and for how long; see the full comparison table at the bottom of this page."]
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
                      title: t("错误：返回指向局部 Vec 的 slice", "Wrong: return a slice into a local Vec"),
                      language: "rust",
                      code: t(
                        `fn default_ports() -> &[u16] {
    let ports = vec![80, 443, 8080];
    &ports[0..2]
}`,
                        `fn default_ports() -> &[u16] {
    let ports = vec![80, 443, 8080];
    &ports[0..2]
}`
                      ),
                      error: t(
                        ["error[E0515]: cannot return value referencing local variable `ports`", "`&ports[0..2]` 是一个 slice，它借用 `ports` 里的连续元素；`ports` 在函数结束时释放，所以这个 slice 不能返回。"],
                        ["error[E0515]: cannot return value referencing local variable `ports`", "`&ports[0..2]` is a slice borrowing consecutive elements from `ports`; `ports` is dropped at function exit, so the slice cannot be returned."]
                      ),
                      explanation: t(
                        ["slice 是 borrowed view，必须依附在仍然活着的数据上。要么返回 `Vec<u16>` 让调用方拥有数据，要么让调用方传入 `&[u16]`，再返回和输入同生命周期的 slice。"],
                        ["A slice is a borrowed view and must refer to data that is still alive. Return `Vec<u16>` if the caller should own the data, or accept `&[u16]` from the caller and return a slice tied to that input."]
                      )
                    }
                  ]
                ),
                sharedExample("Rust: slice 借用调用方仍然拥有的数据", "Rust: slice borrows data still owned by the caller", "rust", `fn first_two_ports(ports: &[u16]) -> &[u16] {
    &ports[0..2]
}

fn main() {
    let ports = vec![80, 443, 8080];
    let common = first_two_ports(&ports);
    println!("{common:?}");
}`),
                tableExample("Rust 与 C++ 常用集合对照", "Rust vs C++ common collections",
                  [t("Rust 类型", "Rust type"), t("C++ 标准库", "C++ standard library"), t("用途与特点", "Use case / notes")],
                  [
                    ["`Vec<T>`", "`std::vector<T>`", t("连续动态数组；尾部增删快，下标访问 O(1)", "Contiguous growable array; fast push/pop at the end, O(1) indexing")],
                    ["`VecDeque<T>`", "`std::deque<T>`", t("双端队列；两端进出都快", "Double-ended queue; fast push/pop at both ends")],
                    ["`String` / `&str`", "`std::string` / `std::string_view`", t("拥有的 UTF-8 字符串 / 借用视图", "Owned UTF-8 string / borrowed view")],
                    ["`&[T]`", "`std::span<T>`（C++20）", t("slice：连续数据的借用视图", "Slice: a borrowed view over contiguous data")],
                    ["`HashMap<K, V>`", "`std::unordered_map<K, V>`", t("哈希表；平均 O(1) 查找，元素无序", "Hash map; average O(1) lookup, unordered")],
                    ["`HashSet<T>`", "`std::unordered_set<T>`", t("哈希集合；去重、判断是否存在", "Hash set; dedup and membership tests")],
                    ["`BTreeMap<K, V>`", "`std::map<K, V>`", t("有序映射；支持范围查询（Rust 用 B-tree，C++ 用红黑树）", "Ordered map with range queries (Rust uses a B-tree, C++ a red-black tree)")],
                    ["`BTreeSet<T>`", "`std::set<T>`", t("有序集合", "Ordered set")],
                    ["`BinaryHeap<T>`", "`std::priority_queue<T>`", t("二叉堆；快速取出最大值", "Binary heap; pop the max quickly")],
                    ["`LinkedList<T>`", "`std::list<T>`", t("双向链表；实际很少需要", "Doubly linked list; rarely needed in practice")]
                  ]
                )
              ],
              references: ["BurntSushi/ripgrep"]
            }),
            lesson({
              id: "common-method-vocabulary",
              title: ["常用方法速查", "Common method vocabulary"],
              goals: [
                ["按接口类型查询常见方法签名。", "用搜索栏跨所有分表搜索，并把结果汇总成一张表。"],
                ["Look up common method signatures by interface type.", "Search across all grouped tables and see matches in one result table."]
              ],
              syntax: [
                ["这节只做速查表：默认按接口类型分表；签名里已经写出接收者、参数和结果类型。"],
                ["This section is a lookup table: by default it is grouped by interface type; each signature includes the receiver, input parameters, and return type."]
              ],
              engineering: [
                ["读不懂链式调用时，先看每一步签名的结果类型；下一步方法一定是在上一步结果类型上调用。"],
                ["When a method chain is unclear, look up each step's return type first; the next method is called on that returned type."]
              ],
              cppComparison: [
                ["C++ 里很多动作靠构造函数、隐式转换或 `operator[]`；Rust 更常把动作写成方法名，并把失败、借用、所有权转移体现在返回类型里。"],
                ["C++ often uses constructors, implicit conversions, or `operator[]`; Rust more often spells the action as a method and exposes failure, borrowing, and ownership transfer in the return type."]
              ],
              examples: [
                methodTableExample("常用方法接口表", "Common method interface table",
                  [
                    {
                      title: t("String", "String"),
                      rows: [
                        ["`fn String::new() -> String`", t("创建空字符串", "create an empty string")],
                        ["`fn String::from(s: &str) -> String`", t("从字符串 slice 复制出 owned 字符串", "copy from a string slice into an owned string")],
                        ["`fn as_str(&self) -> &str`", t("把 owned 字符串临时借用成字符串 slice", "borrow an owned string as a string slice")],
                        ["`fn push_str(&mut self, string: &str) -> ()`", t("把字符串片段追加到原字符串末尾", "append a string slice in place")],
                        ["`fn push(&mut self, ch: char) -> ()`", t("追加一个 Unicode 字符", "append one Unicode character")],
                        ["`fn clear(&mut self) -> ()`", t("清空内容，保留容量", "clear contents while keeping capacity")],
                        ["`fn len(&self) -> usize`", t("字节长度，不是字符数", "byte length, not character count")],
                        ["`fn is_empty(&self) -> bool`", t("长度是否为 0", "whether length is zero")]
                      ]
                    },
                    {
                      title: t("&str", "&str"),
                      rows: [
                        ["`fn trim(&self) -> &str`", t("去掉首尾空白，返回原字符串的一段借用视图", "remove surrounding whitespace and return a borrowed view")],
                        ["`fn trim_start(&self) -> &str` / `fn trim_end(&self) -> &str`", t("只去掉开头或结尾空白", "trim only the start or the end")],
                        ["`fn to_owned(&self) -> String`", t("复制成 owned 字符串", "copy into an owned string")],
                        ["`fn to_string(&self) -> String`", t("通过 `ToString` 生成字符串", "create a string through `ToString`")],
                        ["`fn to_ascii_lowercase(&self) -> String`", t("生成新的 ASCII 小写字符串", "create a new ASCII-lowercase string")],
                        ["`fn to_lowercase(&self) -> String`", t("生成新的 Unicode 小写字符串", "create a new Unicode-lowercase string")],
                        ["`fn contains<P: Pattern>(&self, pattern: P) -> bool`", t("是否包含子串或字符", "whether it contains a substring or character")],
                        ["`fn starts_with<P: Pattern>(&self, prefix: P) -> bool`", t("是否以前缀开头", "whether it starts with a prefix")],
                        ["`fn ends_with<P: Pattern>(&self, suffix: P) -> bool`", t("是否以后缀结尾", "whether it ends with a suffix")],
                        ["`fn split_whitespace(&self) -> SplitWhitespace<'_>`", t("按空白分割，返回迭代器", "split on whitespace and return an iterator")],
                        ["`fn split<P: Pattern>(&self, pat: P) -> Split<'_, P>`", t("按指定分隔符分割，返回迭代器", "split by a separator and return an iterator")],
                        ["`fn split_once<P: Pattern>(&self, delimiter: P) -> Option<(&str, &str)>`", t("只分割第一次，失败返回 `None`", "split once; return `None` if not found")],
                        ["`fn parse<T: FromStr>(&self) -> Result<T, T::Err>`", t("把字符串解析成目标类型", "parse a string into a target type")],
                        ["`fn chars(&self) -> Chars<'_>`", t("按 Unicode scalar 迭代", "iterate Unicode scalar values")],
                        ["`fn bytes(&self) -> Bytes<'_>`", t("按 UTF-8 原始字节迭代", "iterate raw UTF-8 bytes")]
                      ]
                    },
                    {
                      title: t("Vec<T> 与 slice", "Vec<T> and slices"),
                      rows: [
                        ["`fn Vec::new() -> Vec<T>`", t("创建空动态数组", "create an empty growable array")],
                        ["`fn Vec::with_capacity(capacity: usize) -> Vec<T>`", t("预留容量，减少后续分配", "reserve capacity to reduce later allocations")],
                        ["`fn push(&mut self, value: T) -> ()`", t("尾部追加元素", "append an element to the end")],
                        ["`fn pop(&mut self) -> Option<T>`", t("弹出尾部元素；空时返回 `None`", "remove the last element; `None` if empty")],
                        ["`fn len(&self) -> usize`", t("元素个数", "number of elements")],
                        ["`fn is_empty(&self) -> bool`", t("是否没有元素", "whether there are no elements")],
                        ["`fn as_slice(&self) -> &[T]`", t("把 `Vec` 借用成 slice", "borrow a `Vec` as a slice")],
                        ["`fn get<I: SliceIndex<[T]>>(&self, index: I) -> Option<&I::Output>`", t("安全下标访问，越界返回 `None`", "safe indexing; `None` if out of bounds")],
                        ["`fn first(&self) -> Option<&T>` / `fn last(&self) -> Option<&T>`", t("第一个或最后一个元素", "first or last element")],
                        ["`fn iter(&self) -> Iter<'_, T>`", t("迭代共享引用 `&T`", "iterate shared references `&T`")],
                        ["`fn iter_mut(&mut self) -> IterMut<'_, T>`", t("迭代可变引用 `&mut T`", "iterate mutable references `&mut T`")],
                        ["`fn into_iter(self) -> IntoIter<T>`", t("消费 `Vec`，迭代 owned 元素 `T`", "consume the `Vec` and iterate owned `T` values")],
                        ["`fn to_vec(&self) -> Vec<T> where T: Clone`", t("复制 slice 为 owned `Vec`", "clone a slice into an owned `Vec`")],
                        ["`fn sort(&mut self) -> () where T: Ord`", t("原地排序", "sort in place")],
                        ["`fn sort_by_key<K, F>(&mut self, f: F) -> () where F: FnMut(&T) -> K, K: Ord`", t("按 key 原地排序", "sort in place by a key")],
                        ["`fn contains(&self, x: &T) -> bool where T: PartialEq`", t("是否包含某个元素", "whether it contains an element")]
                      ]
                    },
                    {
                      title: t("HashMap<K, V>", "HashMap<K, V>"),
                      rows: [
                        ["`fn HashMap::new() -> HashMap<K, V>`", t("创建空哈希表", "create an empty hash map")],
                        ["`fn insert(&mut self, k: K, v: V) -> Option<V>`", t("插入键值；旧值存在时返回旧值", "insert key/value; return old value if replaced")],
                        ["`fn get<Q>(&self, k: &Q) -> Option<&V>`", t("按 key 读取 value", "read a value by key")],
                        ["`fn get_mut<Q>(&mut self, k: &Q) -> Option<&mut V>`", t("按 key 取得可变 value", "get a mutable value by key")],
                        ["`fn contains_key<Q>(&self, k: &Q) -> bool`", t("key 是否存在", "whether a key exists")],
                        ["`fn remove<Q>(&mut self, k: &Q) -> Option<V>`", t("删除 key 并返回 owned value", "remove a key and return the owned value")],
                        ["`fn entry(&mut self, key: K) -> Entry<K, V>`", t("进入“查找或插入”接口", "enter the find-or-insert API")],
                        ["`fn iter(&self) -> Iter<'_, K, V>`", t("迭代 `(&K, &V)`", "iterate `(&K, &V)`")],
                        ["`fn keys(&self) -> Keys<'_, K, V>` / `fn values(&self) -> Values<'_, K, V>`", t("只迭代 key 或 value", "iterate only keys or values")],
                        ["`fn len(&self) -> usize` / `fn is_empty(&self) -> bool`", t("元素个数 / 是否为空", "number of entries / whether empty")]
                      ]
                    },
                    {
                      title: t("Entry<K, V>", "Entry<K, V>"),
                      rows: [
                        ["`fn or_insert(self, default: V) -> &mut V`", t("没有 key 就插入 `default`，返回 value 的可变引用", "insert `default` if missing and return a mutable reference to the value")],
                        ["`fn or_insert_with<F: FnOnce() -> V>(self, default: F) -> &mut V`", t("没有 key 时才调用 `default` 创建默认值", "call `default` to create the value only if missing")],
                        ["`fn and_modify<F: FnOnce(&mut V)>(self, f: F) -> Entry<K, V>`", t("key 已存在时原地修改 value，然后继续保留 entry 链", "modify the value in place if the key exists, then keep the entry chain")]
                      ]
                    },
                    {
                      title: t("Option<T>", "Option<T>"),
                      rows: [
                        ["`fn unwrap(self) -> T`", t("取出 `Some(T)`；`None` 时 panic", "extract `Some(T)`; panic on `None`")],
                        ["`fn unwrap_or(self, default: T) -> T`", t("没有值时使用默认值", "use a fallback when missing")],
                        ["`fn map<U, F: FnOnce(T) -> U>(self, f: F) -> Option<U>`", t("只在 `Some` 时转换内部值", "transform the inner value only when `Some`")],
                        ["`fn and_then<U, F: FnOnce(T) -> Option<U>>(self, f: F) -> Option<U>`", t("连续执行可能失败的步骤", "chain steps that may return `None`")],
                        ["`fn ok_or<E>(self, err: E) -> Result<T, E>`", t("把 `Option` 转成 `Result`", "convert `Option` into `Result`")],
                        ["`fn is_some(&self) -> bool` / `fn is_none(&self) -> bool`", t("是否有值 / 是否为空", "whether it has a value / is empty")]
                      ]
                    },
                    {
                      title: t("Result<T, E>", "Result<T, E>"),
                      rows: [
                        ["`fn unwrap(self) -> T`", t("取出 `Ok(T)`；`Err` 时 panic", "extract `Ok(T)`; panic on `Err`")],
                        ["`fn expect(self, msg: &str) -> T`", t("失败时带消息 panic", "panic with a message on failure")],
                        ["`fn unwrap_or(self, default: T) -> T`", t("失败时使用默认值", "use a fallback on error")],
                        ["`fn map<U, F: FnOnce(T) -> U>(self, op: F) -> Result<U, E>`", t("只转换 `Ok` 值", "transform only the `Ok` value")],
                        ["`fn map_err<F, O: FnOnce(E) -> F>(self, op: O) -> Result<T, F>`", t("只转换错误值", "transform only the error value")],
                        ["`fn ok(self) -> Option<T>`", t("丢弃错误信息，转成 `Option`", "discard error details and convert to `Option`")]
                      ]
                    },
                    {
                      title: t("Iterator<Item = T>", "Iterator<Item = T>"),
                      rows: [
                        ["`fn map<B, F: FnMut(T) -> B>(self, f: F) -> Map<Self, F>`", t("逐项转换，仍是迭代器", "transform each item; still an iterator")],
                        ["`fn filter<P: FnMut(&T) -> bool>(self, predicate: P) -> Filter<Self, P>`", t("保留满足条件的元素", "keep items that match a predicate")],
                        ["`fn filter_map<B, F: FnMut(T) -> Option<B>>(self, f: F) -> FilterMap<Self, F>`", t("过滤并转换，跳过 `None`", "filter and transform, skipping `None`")],
                        ["`fn find<P: FnMut(&T) -> bool>(&mut self, predicate: P) -> Option<T>`", t("找到第一个满足条件的元素", "find the first matching item")],
                        ["`fn any<F: FnMut(T) -> bool>(&mut self, f: F) -> bool` / `fn all<F: FnMut(T) -> bool>(&mut self, f: F) -> bool`", t("是否任意满足 / 是否全部满足", "whether any / all items match")],
                        ["`fn collect<B: FromIterator<T>>(self) -> B`", t("收集成 `Vec`、`HashMap`、`String` 等集合", "collect into `Vec`, `HashMap`, `String`, etc.")],
                        ["`fn fold<B, F: FnMut(B, T) -> B>(self, init: B, f: F) -> B`", t("累加归约成一个值", "reduce into one accumulated value")],
                        ["`fn enumerate(self) -> Enumerate<Self>`", t("给每项附上下标 `(usize, T)`", "attach an index `(usize, T)` to each item")],
                        ["`fn take(self, n: usize) -> Take<Self>` / `fn skip(self, n: usize) -> Skip<Self>`", t("只取前 n 个 / 跳过前 n 个", "take the first n / skip the first n")]
                      ]
                    },
                    {
                      title: t("整数类型", "Integer types"),
                      rows: [
                        ["`fn checked_add(self, rhs: Self) -> Option<Self>`", t("溢出时返回 `None`", "return `None` on overflow")],
                        ["`fn wrapping_add(self, rhs: Self) -> Self`", t("溢出时按位宽回绕；这不是 `unwrap`", "wrap on overflow; unrelated to `unwrap`")],
                        ["`fn saturating_add(self, rhs: Self) -> Self`", t("溢出时停在最大值", "saturate at the maximum on overflow")],
                        ["`fn overflowing_add(self, rhs: Self) -> (Self, bool)`", t("返回结果和是否溢出", "return the result and an overflow flag")]
                      ]
                    },
                    {
                      title: t("通用 trait 与宏", "Common traits and macros"),
                      rows: [
                        ["`fn clone(&self) -> Self`", t("`Clone`：显式复制/克隆一个值", "`Clone`: explicitly copy/clone a value")],
                        ["`fn default() -> Self`", t("`Default`：创建类型的默认值", "`Default`: create a type's default value")],
                        ["`format!(...) -> String`", t("宏：格式化成 owned 字符串", "macro: format into an owned string")],
                        ["`vec![...] -> Vec<T>`", t("宏：创建 `Vec`", "macro: create a `Vec`")],
                        ["`println!(...) -> ()`", t("宏：输出到标准输出", "macro: print to standard output")]
                      ]
                    }
                  ],
                  "搜索接口类型、签名或说明",
                  "Search interface types, signatures, or notes"
                )
              ],
              references: ["rust-lang/rust"]
            })
          ]
        });
})();
