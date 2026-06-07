(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "ownership-borrowing-lifetimes",
          title: t("所有权、借用与生命周期", "Ownership, borrowing, and lifetimes"),
          sections: [
            lesson({
              id: "ownership-api-design",
              title: ["用所有权设计 API", "Design APIs with ownership"],
              goals: [
                ["能根据函数签名判断资源归属。", "会选择 `T`、`&T`、`&mut T`、`&str`、`&[T]`。"],
                ["Read resource ownership from function signatures.", "Choose between `T`, `&T`, `&mut T`, `&str`, and `&[T]`."]
              ],
              syntax: [
                ["传 `T` 表示拿走所有权，传 `&T` 表示只读观察，传 `&mut T` 表示独占修改。", "返回 owned value 通常表示创建新资源或转移资源。"],
                ["Passing `T` means taking ownership, `&T` observes, and `&mut T` mutates exclusively.", "Returning an owned value usually creates or transfers a resource."]
              ],
              engineering: [
                ["API 边界越清晰，调用方越少猜测谁负责释放、缓存或修改。", "如果为了通过编译到处加 `clone`，通常说明 API 边界还没想清楚。"],
                ["Clear API boundaries reduce guessing about who frees, caches, or mutates data.", "If you add `clone` everywhere to appease the compiler, the API boundary is probably unclear."]
              ],
              cppComparison: [
                ["C++ 可以通过 `const&`、`unique_ptr`、`shared_ptr` 表达意图；Rust 把普通引用也纳入检查。"],
                ["C++ expresses intent with `const&`, `unique_ptr`, and `shared_ptr`; Rust also checks ordinary references."]
              ],
              examples: [
                localizedExample("Rust: 解析后保存 owned 数据", "Rust: parse borrowed input and store owned data", "rust", `#[derive(Debug)]
struct User {
    normalized_name: String,
}

fn normalize_name(name: &str) -> String {
    name.trim().to_ascii_lowercase()
}

fn validate_name(name: &str) -> Result<(), &'static str> {
    if name.is_empty() { return Err("name must not be empty"); }
    if name.len() > 64 { return Err("name is too long"); }
    Ok(())
}

fn create_user(input: &str) -> Result<User, &'static str> {
    // input 只是借用；只有 User 需要保存时才分配 String。
    let normalized = normalize_name(input);
    validate_name(&normalized)?;
    Ok(User { normalized_name: normalized })
}`, `#[derive(Debug)]
struct User {
    normalized_name: String,
}

fn normalize_name(name: &str) -> String {
    name.trim().to_ascii_lowercase()
}

fn validate_name(name: &str) -> Result<(), &'static str> {
    if name.is_empty() { return Err("name must not be empty"); }
    if name.len() > 64 { return Err("name is too long"); }
    Ok(())
}

fn create_user(input: &str) -> Result<User, &'static str> {
    // input is borrowed; allocate String only when User must store it.
    let normalized = normalize_name(input);
    validate_name(&normalized)?;
    Ok(User { normalized_name: normalized })
}`)
              ],
              references: ["serde-rs/serde"]
            }),
            lesson({
              id: "lifetimes-in-practice",
              title: ["生命周期该怎么读", "Reading lifetimes in practice"],
              goals: [
                ["把生命周期理解为“这个引用依赖哪份数据”。", "能读懂返回引用和结构体里保存引用的代码。"],
                ["Understand lifetimes as descriptions of reference relationships.", "Read functions returning references and structs storing references."]
              ],
              syntax: [
                ["生命周期参数不会改变程序运行方式，只是在说明引用之间的有效关系：谁必须至少和谁一样久。", "常见函数里编译器会自动推断，所以不一定都要手写 `<'a>`。"],
                ["Lifetime parameters do not change runtime behavior; they describe which references must live at least as long as others.", "Lifetime elision removes `<'a>` from common cases."]
              ],
              engineering: [
                ["缓存、解析器、HTTP header、少拷贝的数据视图里经常会看到生命周期。", "如果生命周期一路传到很多层，让代码很难读，可以考虑在某个模块入口把数据拷贝成 owned 类型。"],
                ["Caches, parsers, HTTP headers, and zero-copy views often involve lifetimes.", "If lifetimes spread across all layers, consider owning data at module boundaries."]
              ],
              cppComparison: [
                ["C++ `string_view` 是否悬垂主要靠调用者小心；Rust 会要求你在类型里把这层依赖关系说清楚。"],
                ["C++ `string_view` lifetime safety is a caller convention; Rust forces that relationship into types."]
              ],
              examples: [
                localizedExample("Rust: Header 视图和默认值", "Rust: header view with fallback", "rust", `struct Header<'a> {
    name: &'a str,
    value: &'a str,
}

fn find_header<'a>(headers: &'a [Header<'a>], name: &str) -> Option<&'a str> {
    headers
        .iter()
        .find(|header| header.name.eq_ignore_ascii_case(name))
        .map(|header| header.value)
}

fn content_type_or_default<'a>(headers: &'a [Header<'a>]) -> &'a str {
    // 返回值来自 headers 或 'static 默认值，都能满足 'a。
    find_header(headers, "content-type").unwrap_or("application/octet-stream")
}`, `struct Header<'a> {
    name: &'a str,
    value: &'a str,
}

fn find_header<'a>(headers: &'a [Header<'a>], name: &str) -> Option<&'a str> {
    headers
        .iter()
        .find(|header| header.name.eq_ignore_ascii_case(name))
        .map(|header| header.value)
}

fn content_type_or_default<'a>(headers: &'a [Header<'a>]) -> &'a str {
    // The result comes from headers or a 'static fallback, both valid for 'a.
    find_header(headers, "content-type").unwrap_or("application/octet-stream")
}`)
              ],
              references: ["rust-lang/rust"]
            })
          ]
        });
})();
