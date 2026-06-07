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
              title: ["生命周期的实际阅读方式", "Reading lifetimes in practice"],
              goals: [
                ["把生命周期理解为引用关系说明。", "能读懂返回引用和结构体保存引用。"],
                ["Understand lifetimes as descriptions of reference relationships.", "Read functions returning references and structs storing references."]
              ],
              syntax: [
                ["生命周期参数不改变运行时行为，只描述引用之间谁至少活得一样久。", "生命周期省略规则让常见函数不必显式写 `<'a>`。"],
                ["Lifetime parameters do not change runtime behavior; they describe which references must live at least as long as others.", "Lifetime elision removes `<'a>` from common cases."]
              ],
              engineering: [
                ["缓存、解析器、HTTP header、零拷贝视图经常出现生命周期。", "如果生命周期扩散到所有层，可以考虑在模块边界拥有数据。"],
                ["Caches, parsers, HTTP headers, and zero-copy views often involve lifetimes.", "If lifetimes spread across all layers, consider owning data at module boundaries."]
              ],
              cppComparison: [
                ["C++ `string_view` 的生命周期靠调用者保证；Rust 用类型系统强制表达这层关系。"],
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

