const t = (zh, en) => ({ zh, en });
const block = (value) => value.trim();

const sharedExample = (zhTitle, enTitle, language, code) => ({
  title: t(zhTitle, enTitle),
  language,
  code: block(code)
});

const localizedExample = (zhTitle, enTitle, language, zhCode, enCode) => ({
  title: t(zhTitle, enTitle),
  language,
  code: {
    zh: block(zhCode),
    en: block(enCode)
  }
});

const lesson = ({
  id,
  title,
  goals,
  syntax,
  engineering,
  cppComparison,
  examples,
  references
}) => ({
  id,
  title: t(title[0], title[1]),
  goals: t(goals[0], goals[1]),
  syntax: t(syntax[0], syntax[1]),
  engineering: t(engineering[0], engineering[1]),
  cppComparison: t(cppComparison[0], cppComparison[1]),
  examples,
  references
});

window.RUST_COURSE_DATA = {
  references: [
    { name: "rust-lang/rust", url: "https://github.com/rust-lang/rust", lesson: t("大型 Rust 项目组织、诊断信息和安全边界。", "Large Rust project organization, diagnostics, and safety boundaries.") },
    { name: "rust-lang/cargo", url: "https://github.com/rust-lang/cargo", lesson: t("Cargo 工作流、feature、CLI 架构和集成测试。", "Cargo workflows, features, CLI architecture, and integration testing.") },
    { name: "rust-lang/rust-analyzer", url: "https://github.com/rust-lang/rust-analyzer", lesson: t("模块化架构、增量计算和性能敏感的工具设计。", "Modular architecture, incremental computation, and performance-aware tooling.") },
    { name: "tokio-rs/tokio", url: "https://github.com/tokio-rs/tokio", lesson: t("异步任务、channel、取消和运行时边界。", "Async tasks, channels, cancellation, and runtime boundaries.") },
    { name: "serde-rs/serde", url: "https://github.com/serde-rs/serde", lesson: t("trait 驱动 API、derive 宏和零拷贝序列化。", "Trait-driven APIs, derive macros, and zero-copy serialization.") },
    { name: "BurntSushi/ripgrep", url: "https://github.com/BurntSushi/ripgrep", lesson: t("CLI 体验、IO 性能、crate 拆分和实用错误处理。", "CLI ergonomics, IO performance, crate decomposition, and practical errors.") },
    { name: "hyperium/hyper", url: "https://github.com/hyperium/hyper", lesson: t("异步网络、service 抽象和协议分层。", "Async networking, service abstractions, and protocol layering.") },
    { name: "rustls/rustls", url: "https://github.com/rustls/rustls", lesson: t("安全敏感 API、封装、测试纪律和安全默认值。", "Security-sensitive APIs, encapsulation, test discipline, and safe defaults.") },
    { name: "clap-rs/clap", url: "https://github.com/clap-rs/clap", lesson: t("命令行 UX、builder/derive API 和宏的人体工学。", "Command-line UX, builder/derive APIs, and macro ergonomics.") },
    { name: "tauri-apps/tauri", url: "https://github.com/tauri-apps/tauri", lesson: t("大型 workspace、跨平台边界和命令/插件架构。", "Large workspaces, cross-platform boundaries, and command/plugin architecture.") }
  ],
  parts: [
    {
      id: "beginner",
      title: t("入门", "Beginner"),
      chapters: [
        {
          id: "cpp-to-rust-map",
          title: t("从 C++ 到 Rust 的迁移地图", "Migration map from C++ to Rust"),
          sections: [
            lesson({
              id: "rust-safety-goals",
              title: ["Rust 解决的问题", "Problems Rust is designed to solve"],
              goals: [
                ["理解 Rust 为什么强调编译期约束。", "把内存安全、并发安全和零成本抽象放在同一个目标里看。"],
                ["Understand why Rust emphasizes compile-time constraints.", "Connect memory safety, concurrency safety, and zero-cost abstraction as one goal."]
              ],
              syntax: [
                ["Rust 没有 GC，却要求值有唯一 owner；引用必须满足借用规则；`Drop` 在作用域结束时释放资源。", "`Send`、`Sync`、`Result`、`Option` 这些常见类型和 trait 都是在把运行期事故前移到类型系统中。"],
                ["Rust has no GC, but each value has an owner; references must satisfy borrowing rules; `Drop` releases resources at scope end.", "`Send`, `Sync`, `Result`, and `Option` push many runtime accidents into the type system."]
              ],
              engineering: [
                ["真实工程中，Rust 的价值不是少写代码，而是让资源生命周期、错误传播和并发边界在 API 上可见。", "当你设计函数签名时，就已经在设计资源归属、线程边界和失败策略。"],
                ["In real projects, Rust's value is not fewer lines; it is making resource lifetime, error flow, and concurrency boundaries visible in APIs.", "When you design a function signature, you are already designing ownership, thread boundaries, and failure strategy."]
              ],
              cppComparison: [
                ["C++ 也能通过 RAII、智能指针、const、工具和规范写出安全代码；Rust 的区别是把很多规范变成默认规则。"],
                ["C++ can be safe with RAII, smart pointers, const discipline, tools, and conventions; Rust makes many of those conventions default rules."]
              ],
              examples: [
                localizedExample(
                  "Rust: 请求生命周期从入口到队列",
                  "Rust: request lifetime from entry to queue",
                  "rust",
                  `struct Request {
    id: u64,
    body: String,
}

fn audit(request: &Request) {
    // 只读借用：审计日志不拥有请求。
    println!("audit request #{} bytes={}", request.id, request.body.len());
}

fn enqueue(request: Request) {
    // 所有权移动：队列从这里开始负责释放 body。
    println!("enqueue request #{}", request.id);
}

fn handle_request(request: Request) {
    audit(&request);
    enqueue(request);
    // request 已经移动，不能再读 id 或 body。
}`,
                  `struct Request {
    id: u64,
    body: String,
}

fn audit(request: &Request) {
    // Shared borrow: audit logging does not own the request.
    println!("audit request #{} bytes={}", request.id, request.body.len());
}

fn enqueue(request: Request) {
    // Ownership moves: the queue now owns and will drop the body.
    println!("enqueue request #{}", request.id);
}

fn handle_request(request: Request) {
    audit(&request);
    enqueue(request);
    // request moved and can no longer be read.
}`
                )
              ],
              references: ["rust-lang/rust"]
            }),
            lesson({
              id: "drop-move-copy-clone",
              title: ["RAII、Drop、move、Copy/Clone", "RAII, Drop, move, Copy/Clone"],
              goals: [
                ["理解 Rust 的 move 默认行为。", "知道什么时候应该显式 `clone`，什么时候不应该。"],
                ["Understand Rust's move-by-default behavior.", "Know when explicit `clone` is appropriate and when it is a smell."]
              ],
              syntax: [
                ["实现 `Copy` 的值会按位复制；拥有堆内存或文件句柄的类型通常 move。", "`Clone` 是显式复制，`Drop` 是确定性释放。"],
                ["Values implementing `Copy` are bitwise copied; heap-owning or handle-owning types usually move.", "`Clone` is explicit duplication, and `Drop` is deterministic cleanup."]
              ],
              engineering: [
                ["工程中不要把 `clone` 当成借用错误的万能修复。先判断 API 是否真的需要拥有数据。", "资源类型可以用 `Drop` 做审计、flush、关闭文件、释放锁，但不要在 `Drop` 里隐藏复杂失败逻辑。"],
                ["Do not use `clone` as a universal fix for borrow errors. First ask whether the API truly needs ownership.", "Resource types can use `Drop` for auditing, flushing, closing files, or releasing locks, but complex fallible cleanup should not be hidden there."]
              ],
              cppComparison: [
                ["C++ move 后对象仍存在但处于 moved-from 状态；Rust move 后绑定不可用，减少了“还能不能用”的约定负担。"],
                ["A moved-from C++ object still exists; a moved Rust binding is unusable, reducing convention-heavy reasoning."]
              ],
              examples: [
                localizedExample(
                  "Rust: 显式 clone 代表真实复制成本",
                  "Rust: explicit clone marks real copy cost",
                  "rust",
                  `#[derive(Clone)]
struct BuildPlan {
    target: String,
    flags: Vec<String>,
}

fn schedule(plan: BuildPlan) {
    println!("schedule {}", plan.target);
}

fn dry_run(plan: &BuildPlan) {
    println!("dry-run {} with {} flags", plan.target, plan.flags.len());
}

fn main() {
    let plan = BuildPlan {
        target: "x86_64-pc-windows-msvc".to_owned(),
        flags: vec!["release".to_owned(), "lto".to_owned()],
    };

    dry_run(&plan);
    schedule(plan.clone()); // 这里确实需要复制一份给调度器。
    dry_run(&plan);
}`,
                  `#[derive(Clone)]
struct BuildPlan {
    target: String,
    flags: Vec<String>,
}

fn schedule(plan: BuildPlan) {
    println!("schedule {}", plan.target);
}

fn dry_run(plan: &BuildPlan) {
    println!("dry-run {} with {} flags", plan.target, plan.flags.len());
}

fn main() {
    let plan = BuildPlan {
        target: "x86_64-pc-windows-msvc".to_owned(),
        flags: vec!["release".to_owned(), "lto".to_owned()],
    };

    dry_run(&plan);
    schedule(plan.clone()); // This is a deliberate copy for the scheduler.
    dry_run(&plan);
}`
                )
              ],
              references: ["rust-lang/rust"]
            })
          ]
        },
        {
          id: "toolchain-project-shape",
          title: t("工具链与项目基本形态", "Toolchain and project shape"),
          sections: [
            lesson({
              id: "cargo-workflow",
              title: ["Cargo 工作流与质量门", "Cargo workflow and quality gates"],
              goals: [
                ["理解 Cargo 不只是构建工具。", "建立 build/test/fmt/clippy/doc 的工程闭环。"],
                ["Understand Cargo as more than a build tool.", "Establish the build/test/fmt/clippy/doc quality loop."]
              ],
              syntax: [
                ["`Cargo.toml` 描述 package、dependencies、features、profiles；命令行统一由 `cargo` 驱动。", "`edition` 让语言演进和老代码兼容可以共存。"],
                ["`Cargo.toml` describes packages, dependencies, features, and profiles; `cargo` drives the workflow.", "`edition` lets language evolution coexist with older code."]
              ],
              engineering: [
                ["团队项目应把 `cargo fmt --check`、`cargo clippy`、`cargo test` 放进 CI。", "文档和 examples 也应该被看作 public API 的一部分。"],
                ["Team projects should put `cargo fmt --check`, `cargo clippy`, and `cargo test` in CI.", "Docs and examples should be treated as part of the public API."]
              ],
              cppComparison: [
                ["C++ 常把 CMake、包管理、测试框架、文档工具分散组合；Rust 通过 Cargo 统一了多数入口。"],
                ["C++ often combines CMake, package management, tests, and docs from separate tools; Rust unifies many entry points through Cargo."]
              ],
              examples: [
                sharedExample("GitHub Actions: Cargo 质量门", "GitHub Actions: Cargo quality gate", "yaml", `name: Rust CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo fmt --all -- --check
      - run: cargo clippy --workspace --all-targets -- -D warnings
      - run: cargo test --workspace --all-features
      - run: cargo doc --workspace --no-deps`)
              ],
              references: ["rust-lang/cargo"]
            }),
            lesson({
              id: "package-crate-module-workspace",
              title: ["package、crate、module、workspace", "Package, crate, module, workspace"],
              goals: [
                ["区分 Rust 项目的四个组织层级。", "知道何时从单 crate 演进到 workspace。"],
                ["Distinguish Rust's four organization levels.", "Know when to evolve from one crate into a workspace."]
              ],
              syntax: [
                ["package 是发布单位，crate 是编译单位，module 是代码可见性边界，workspace 是多 package 协作边界。", "`src/lib.rs` 暴露库 API，`src/main.rs` 是二进制入口。"],
                ["A package is a publishing unit, a crate is a compilation unit, a module is a visibility boundary, and a workspace coordinates packages.", "`src/lib.rs` exposes library APIs, while `src/main.rs` is a binary entry point."]
              ],
              engineering: [
                ["中小项目先保持单 crate；当 domain、CLI、server、adapter 生命周期明显分离时再拆 workspace。", "模块边界不是目录美化，而是长期 API 稳定性的起点。"],
                ["Keep small projects in one crate; split into a workspace when domain, CLI, server, and adapters have separate lifecycles.", "Module boundaries are not folder decoration; they are the start of stable API design."]
              ],
              cppComparison: [
                ["C++ include 目录很容易泄漏内部细节；Rust 私有默认和 `pub use` 更适合先收窄 API 表面。"],
                ["C++ include directories often leak internals; Rust private-by-default modules and `pub use` make it easier to narrow APIs."]
              ],
              examples: [
                sharedExample("Workspace + lib.rs 边界", "Workspace + lib.rs boundary", "rust", `// root Cargo.toml
// [workspace]
// members = ["crates/course-core", "crates/course-cli"]
// resolver = "2"

// crates/course-core/src/lib.rs
mod model;
mod parser;
mod validate;

pub use model::{Course, Lesson};
pub use parser::ParseError;

pub fn load_course(input: &str) -> Result<Course, ParseError> {
    let course = parser::parse(input)?;
    validate::course(&course)?;
    Ok(course)
}`)
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer"]
            })
          ]
        },
        {
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
                ["Rust 默认不可变，`mut` 标出状态变化；shadowing 创建新绑定，可以改变类型。", "`const` 是编译期常量，`static` 是具有固定地址的全局值。"],
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
}`)
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
                ["`&str` 接近 `std::string_view`，`&[T]` 接近 span；Rust 会检查视图不能超过源数据生命周期。"],
                ["`&str` resembles `std::string_view`, and `&[T]` resembles span; Rust checks that views cannot outlive sources."]
              ],
              examples: [
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
}`)
              ],
              references: ["BurntSushi/ripgrep"]
            })
          ]
        },
        {
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
        },
        {
          id: "data-modeling",
          title: t("数据建模：struct、enum 与 pattern matching", "Data modeling: structs, enums, and pattern matching"),
          sections: [
            lesson({
              id: "struct-impl-newtype",
              title: ["struct、impl 与 newtype", "Structs, impl blocks, and newtypes"],
              goals: [
                ["用类型表达领域约束，而不是到处传裸 `String` / `u64`。", "理解方法接收者如何表达只读、可变和消费。"],
                ["Use types to express domain constraints instead of passing raw `String` / `u64` everywhere.", "Understand how method receivers express read-only, mutable, and consuming operations."]
              ],
              syntax: [
                ["`struct` 定义数据形状，`impl` 定义行为；`&self` 只读，`&mut self` 修改，`self` 消费。", "newtype 给普通值增加领域含义和校验边界。"],
                ["A `struct` defines data shape, and an `impl` defines behavior; `&self` reads, `&mut self` mutates, and `self` consumes.", "A newtype gives ordinary values domain meaning and validation boundaries."]
              ],
              engineering: [
                ["`UserId`、`Port`、`CourseSlug` 这类类型能防止参数顺序错误和非法值扩散。", "构造函数应集中校验，外部模块只拿到已经合法的领域对象。"],
                ["Types such as `UserId`, `Port`, and `CourseSlug` prevent argument order bugs and invalid values from spreading.", "Constructors should centralize validation so other modules receive valid domain objects."]
              ],
              cppComparison: [
                ["C++ 也能用强类型 typedef/class 做 newtype，但 Rust 的私有字段和模块可见性让这种封装更自然。"],
                ["C++ can build strong typedefs/classes, but Rust private fields and module visibility make this encapsulation natural."]
              ],
              examples: [
                sharedExample("Rust: 用 newtype 封装课程 slug", "Rust: wrap course slug in a newtype", "rust", `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct CourseSlug(String);

impl CourseSlug {
    pub fn parse(raw: &str) -> Result<Self, &'static str> {
        let slug = raw.trim().to_ascii_lowercase();
        let valid = slug.chars().all(|ch| ch.is_ascii_lowercase() || ch.is_ascii_digit() || ch == '-');

        if slug.is_empty() || !valid {
            return Err("course slug must be lowercase kebab-case");
        }

        Ok(Self(slug))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}`)
              ],
              references: ["rustls/rustls"]
            }),
            lesson({
              id: "enum-match-state-machine",
              title: ["enum、Option 与状态机", "Enums, Option, and state machines"],
              goals: [
                ["用 enum 表达有限状态，而不是字符串或整数 tag。", "理解 `match` 的穷尽性为什么适合工程重构。"],
                ["Use enums for finite states instead of string or integer tags.", "Understand why exhaustive `match` helps refactoring."]
              ],
              syntax: [
                ["`enum` 的不同变体可以携带不同数据；`Option<T>` 是标准库提供的“有或无”。", "`match` 必须处理所有变体，`if let` 和 `let else` 适合只关心一个分支。"],
                ["Each `enum` variant can carry different data; `Option<T>` is the standard present-or-absent type.", "`match` must cover every variant, while `if let` and `let else` handle one interesting branch."]
              ],
              engineering: [
                ["任务状态、协议消息、解析结果和错误类别都适合用 enum。", "新增状态时，编译器会指出所有没处理新分支的位置。"],
                ["Task states, protocol messages, parse results, and error categories all fit enums.", "When a new state is added, the compiler points to every missing branch."]
              ],
              cppComparison: [
                ["C++17 `std::variant` 接近 Rust enum，但 Rust enum 与 `match` 是语言核心组合，使用成本更低。"],
                ["C++17 `std::variant` is close to Rust enums, but Rust enums and `match` are a core language pair with lower friction."]
              ],
              examples: [
                sharedExample("Rust: 下载任务状态机", "Rust: download job state machine", "rust", `enum DownloadState {
    Queued { url: String },
    Fetching { url: String, retry: u8 },
    Stored { path: String, bytes: u64 },
    Failed { reason: String },
}

fn next(state: DownloadState) -> DownloadState {
    match state {
        DownloadState::Queued { url } => DownloadState::Fetching { url, retry: 0 },
        DownloadState::Fetching { url, retry } if retry < 3 => {
            DownloadState::Fetching { url, retry: retry + 1 }
        }
        DownloadState::Fetching { url, .. } => DownloadState::Failed {
            reason: format!("too many retries for {url}"),
        },
        terminal @ DownloadState::Stored { .. } | terminal @ DownloadState::Failed { .. } => terminal,
    }
}`)
              ],
              references: ["rust-lang/rust-analyzer"]
            })
          ]
        },
        {
          id: "error-boundaries",
          title: t("错误处理与失败边界", "Error handling and failure boundaries"),
          sections: [
            lesson({
              id: "option-result-panic",
              title: ["Option、Result 与 panic 边界", "Option, Result, and panic boundaries"],
              goals: [
                ["区分缺失、可恢复失败和程序 bug。", "知道什么时候返回 `Result`，什么时候允许 `panic!`。"],
                ["Distinguish absence, recoverable failure, and program bugs.", "Know when to return `Result` and when `panic!` is acceptable."]
              ],
              syntax: [
                ["`Option<T>` 表示没有值，`Result<T,E>` 表示可恢复失败，`panic!` 表示不可恢复 bug。", "`?` 在错误时提前返回，并通过 `From` 转换错误类型。"],
                ["`Option<T>` means no value, `Result<T,E>` means recoverable failure, and `panic!` means unrecoverable bug.", "`?` returns early and converts errors through `From`."]
              ],
              engineering: [
                ["库代码应该把失败放进返回类型，应用入口再决定日志、提示和退出码。", "错误类型应该帮助调用者决策：重试、提示用户、跳过还是终止。"],
                ["Library code should put failures in return types; app entry points decide logs, messages, and exit codes.", "Error types should help callers decide: retry, inform the user, skip, or stop."]
              ],
              cppComparison: [
                ["C++ 项目常混用异常、错误码和 optional；Rust 让可恢复错误显式出现在函数签名中。"],
                ["C++ projects often mix exceptions, error codes, and optional values; Rust makes recoverable errors explicit in signatures."]
              ],
              examples: [
                sharedExample("Rust: 配置解析错误带上下文", "Rust: config parse errors with context", "rust", `#[derive(Debug)]
enum ConfigError {
    MissingField(&'static str),
    InvalidPort { raw: String },
}

struct Config {
    host: String,
    port: u16,
}

fn parse_config(host: Option<&str>, port: Option<&str>) -> Result<Config, ConfigError> {
    let host = host.ok_or(ConfigError::MissingField("host"))?;
    let raw_port = port.ok_or(ConfigError::MissingField("port"))?;
    let port = raw_port
        .parse::<u16>()
        .map_err(|_| ConfigError::InvalidPort { raw: raw_port.to_owned() })?;

    Ok(Config { host: host.to_owned(), port })
}`)
              ],
              references: ["BurntSushi/ripgrep"]
            })
          ]
        },
        {
          id: "traits-generics-basic",
          title: t("trait、泛型与抽象基础", "Traits, generics, and abstraction basics"),
          sections: [
            lesson({
              id: "trait-as-contract",
              title: ["trait 作为行为契约", "Traits as behavioral contracts"],
              goals: [
                ["理解 trait 不是类继承。", "会用 trait 切开模块边界和测试替身。"],
                ["Understand that traits are not class inheritance.", "Use traits to cut module boundaries and create test doubles."]
              ],
              syntax: [
                ["`trait` 定义行为，`impl Trait for Type` 为类型实现行为。", "泛型参数可以用 `T: Trait` 或 `where` 约束。"],
                ["A `trait` defines behavior, and `impl Trait for Type` implements it.", "Generic parameters can be constrained with `T: Trait` or `where` clauses."]
              ],
              engineering: [
                ["trait 适合抽象存储、时钟、网络、随机数等外部依赖。", "不要为了“看起来架构高级”提前抽象；至少有真实替换点时再引入。"],
                ["Traits fit storage, clocks, networking, randomness, and other external dependencies.", "Do not abstract early just to look architectural; introduce traits when there is a real substitution point."]
              ],
              cppComparison: [
                ["trait 既像 C++ concept 的能力约束，也能像虚接口一样动态分发；Rust 要你显式选择。"],
                ["Traits can act like C++ concepts for capability bounds and like virtual interfaces for dynamic dispatch; Rust makes the choice explicit."]
              ],
              examples: [
                sharedExample("Rust: 用 Clock trait 测试重试逻辑", "Rust: test retry logic with a Clock trait", "rust", `trait Clock {
    fn now_ms(&self) -> u64;
}

struct RetryPolicy {
    deadline_ms: u64,
    max_attempts: u8,
}

fn should_retry<C: Clock>(clock: &C, attempts: u8, policy: &RetryPolicy) -> bool {
    attempts < policy.max_attempts && clock.now_ms() < policy.deadline_ms
}

struct FakeClock(u64);

impl Clock for FakeClock {
    fn now_ms(&self) -> u64 { self.0 }
}`)
              ],
              references: ["serde-rs/serde"]
            })
          ]
        },
        {
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
                sharedExample("Rust: 从日志行聚合错误次数", "Rust: aggregate error counts from log lines", "rust", `use std::collections::BTreeMap;

fn error_counts(lines: &[String]) -> BTreeMap<&str, usize> {
    lines
        .iter()
        .filter_map(|line| line.split_once("ERROR "))
        .filter_map(|(_, rest)| rest.split_once(':'))
        .map(|(code, _message)| code.trim())
        .fold(BTreeMap::new(), |mut counts, code| {
            *counts.entry(code).or_insert(0) += 1;
            counts
        })
}`)
              ],
              references: ["BurntSushi/ripgrep"]
            })
          ]
        },
        {
          id: "modules-tests-docs",
          title: t("模块、可见性、测试与文档", "Modules, visibility, tests, and docs"),
          sections: [
            lesson({
              id: "visibility-tests-docs",
              title: ["可见性、测试与文档示例", "Visibility, tests, and documentation examples"],
              goals: [
                ["用模块可见性保护内部实现。", "理解测试和文档示例也是 API 设计。"],
                ["Protect internals with module visibility.", "Understand tests and documentation examples as API design."]
              ],
              syntax: [
                ["Rust 默认私有；`pub`、`pub(crate)`、`pub(super)` 控制暴露范围。", "模块内 `#[test]` 测私有细节，`tests/` 测 public API，doc test 测文档代码。"],
                ["Rust is private by default; `pub`, `pub(crate)`, and `pub(super)` control exposure.", "Module `#[test]` checks internals, `tests/` checks public APIs, and doc tests check docs."]
              ],
              engineering: [
                ["先隐藏实现，再按需求暴露 API；这样重构 parser/model/validate 不会影响调用方。", "示例越贴近真实使用，用户越不容易误用 API。"],
                ["Hide implementation first and expose APIs intentionally; then parser/model/validate can be refactored without caller breakage.", "The closer examples are to real usage, the less users misuse APIs."]
              ],
              cppComparison: [
                ["C++ 头文件经常被迫暴露细节；Rust 模块边界更适合把实现藏起来，doc test 还能编译文档示例。"],
                ["C++ headers often expose details; Rust module boundaries make hiding implementation easier, and doc tests compile documentation snippets."]
              ],
              examples: [
                sharedExample("Rust: 对外稳定，对内可重构", "Rust: stable outside, refactorable inside", "rust", `// src/lib.rs
mod parse;
mod model;
mod validate;

pub use model::{Course, Lesson};
pub use parse::CourseParseError;

pub fn from_toml(input: &str) -> Result<Course, CourseParseError> {
    let course = parse::toml(input)?;
    validate::course(&course)?;
    Ok(course)
}

#[cfg(test)]
mod tests {
    use super::from_toml;

    #[test]
    fn rejects_empty_course() {
        assert!(from_toml("").is_err());
    }
}`)
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer"]
            })
          ]
        },
        {
          id: "beginner-capstone",
          title: t("入门综合项目", "Beginner capstone project"),
          sections: [
            lesson({
              id: "course-index-cli",
              title: ["综合项目：课程索引 CLI", "Capstone: course index CLI"],
              goals: [
                ["把入门阶段知识连成一个小工程。", "练习模块拆分、所有权、错误、迭代器和测试。"],
                ["Connect beginner topics into a small project.", "Practice modules, ownership, errors, iterators, and tests."]
              ],
              syntax: [
                ["项目包含 `model`、`parser`、`validate`、`cli` 模块。", "入口层处理 IO，库层处理纯逻辑和结构化错误。"],
                ["The project contains `model`, `parser`, `validate`, and `cli` modules.", "The entry point handles IO, while the library handles pure logic and structured errors."]
              ],
              engineering: [
                ["这个项目应该能从配置加载课程，校验 slug，按标签输出索引，并提供测试。", "这是入门阶段结束时判断是否真正理解 Rust 基础的标准。"],
                ["The project should load a course config, validate slugs, output an index by tag, and include tests.", "This is the beginner-track checkpoint for real Rust understanding."]
              ],
              cppComparison: [
                ["C++ 中这可能是 CMake target + library + executable；Rust 中用 library crate + binary crate + tests 更直接。"],
                ["In C++ this might be a CMake target with library and executable; in Rust, a library crate plus binary crate and tests is more direct."]
              ],
              examples: [
                sharedExample("Rust: 入门综合项目主流程", "Rust: beginner capstone main flow", "rust", `mod model;
mod parser;
mod validate;

use std::collections::BTreeMap;

pub fn build_index(input: &str) -> Result<BTreeMap<String, Vec<String>>, parser::Error> {
    let course = parser::parse_course(input)?;
    validate::course(&course)?;

    let mut index: BTreeMap<String, Vec<String>> = BTreeMap::new();
    for lesson in course.lessons {
        for tag in lesson.tags {
            index.entry(tag).or_default().push(lesson.title.clone());
        }
    }

    Ok(index)
}`)
              ],
              references: ["rust-lang/cargo", "BurntSushi/ripgrep"]
            })
          ]
        }
      ]
    },
    {
      id: "advanced",
      title: t("进阶", "Advanced"),
      chapters: [
        {
          id: "workspace-architecture",
          title: t("大型项目结构与 workspace 架构", "Large project structure and workspace architecture"),
          sections: [
            lesson({
              id: "workspace-layering",
              title: ["workspace 分层与 crate 边界", "Workspace layering and crate boundaries"],
              goals: [
                ["理解何时拆 workspace。", "用 core/adapters/cli/server 分层控制依赖方向。"],
                ["Know when to split into a workspace.", "Use core/adapters/cli/server layers to control dependency direction."]
              ],
              syntax: [
                ["workspace 根 `Cargo.toml` 管理 members、resolver 和 workspace dependencies。", "每个 crate 有自己的 public API 和 feature。"],
                ["The workspace root `Cargo.toml` manages members, resolver, and workspace dependencies.", "Each crate has its own public API and features."]
              ],
              engineering: [
                ["核心 crate 不依赖 Tokio、HTTP 或数据库；外层 adapter 把 IO 转成领域对象。", "这种结构让测试、性能优化和替换外部依赖更简单。"],
                ["Core crates should not depend on Tokio, HTTP, or databases; outer adapters turn IO into domain objects.", "This structure simplifies tests, performance work, and dependency replacement."]
              ],
              cppComparison: [
                ["这类似 C++ 中 domain library、adapter library、binary target 的拆分，但 Cargo workspace 同时管理依赖版本。"],
                ["This resembles C++ domain libraries, adapter libraries, and binary targets, while Cargo workspaces also coordinate dependency versions."]
              ],
              examples: [
                sharedExample("Cargo workspace 分层", "Cargo workspace layering", "toml", `[workspace]
members = [
  "crates/course-core",
  "crates/course-fs",
  "crates/course-cli",
  "crates/course-server",
]
resolver = "2"

[workspace.dependencies]
thiserror = "1"
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }`)
              ],
              references: ["rust-lang/cargo", "tauri-apps/tauri"]
            })
          ]
        },
        {
          id: "public-api-semver",
          title: t("公共 API 设计与 semver 兼容", "Public API design and semver compatibility"),
          sections: [
            lesson({
              id: "sealed-api-features",
              title: ["稳定 API、sealed trait 与 feature", "Stable APIs, sealed traits, and features"],
              goals: [
                ["识别哪些内容属于公共 API。", "用 sealed trait 和 feature 控制扩展面。"],
                ["Recognize what belongs to public API.", "Use sealed traits and features to control extension surface."]
              ],
              syntax: [
                ["公开类型、公开 trait、错误枚举、trait bounds 都会影响 semver。", "sealed trait 通过私有 supertrait 阻止外部实现。"],
                ["Public types, public traits, error enums, and trait bounds all affect semver.", "A sealed trait uses a private supertrait to prevent external implementations."]
              ],
              engineering: [
                ["库越流行，破坏 API 的代价越高。先收窄 public surface，再根据真实需求扩展。", "feature 应尽量 additive，避免组合爆炸和隐藏冲突。"],
                ["The more popular a library is, the more expensive breaking APIs become. Narrow public surface first, then expand by real needs.", "Features should be additive where possible to avoid combination explosions and hidden conflicts."]
              ],
              cppComparison: [
                ["C++ ABI 兼容常被二进制边界约束；Rust crate 更多关注源码级 semver，但泛型约束同样会成为兼容承诺。"],
                ["C++ ABI compatibility is often binary-boundary driven; Rust crates focus on source semver, but generic bounds also become compatibility promises."]
              ],
              examples: [
                sharedExample("Rust: sealed trait 限制外部实现", "Rust: sealed trait limits external impls", "rust", `mod sealed {
    pub trait Sealed {}
}

pub trait LessonFormat: sealed::Sealed {
    fn extension(&self) -> &'static str;
}

pub struct Markdown;
pub struct Html;

impl sealed::Sealed for Markdown {}
impl sealed::Sealed for Html {}

impl LessonFormat for Markdown {
    fn extension(&self) -> &'static str { "md" }
}

impl LessonFormat for Html {
    fn extension(&self) -> &'static str { "html" }
}`)
              ],
              references: ["serde-rs/serde", "rustls/rustls"]
            })
          ]
        },
        {
          id: "advanced-traits-generics",
          title: t("高级 trait 与泛型设计", "Advanced trait and generic design"),
          sections: [
            lesson({
              id: "associated-types-object-safety",
              title: ["associated type、object safety 与分发成本", "Associated types, object safety, and dispatch cost"],
              goals: [
                ["理解 associated type 适合把输出类型绑定到实现。", "知道为什么一些 trait 不能变成 `dyn Trait`。"],
                ["Understand associated types as output types tied to implementations.", "Know why some traits cannot become `dyn Trait`."]
              ],
              syntax: [
                ["associated type 写在 trait 内部，调用方通过实现选择具体类型。", "object safety 限制 trait object 能安全调用的方法集合。"],
                ["Associated types live inside traits, and implementations choose concrete types.", "Object safety limits the method set that can be safely called through trait objects."]
              ],
              engineering: [
                ["parser、storage、service 抽象常用 associated type 表达错误或输出。", "如果 API 暴露过度泛型，会增加编译时间和使用复杂度。"],
                ["Parser, storage, and service abstractions often use associated types for errors or outputs.", "Overly generic APIs increase compile time and usage complexity."]
              ],
              cppComparison: [
                ["这类似 C++ traits/type aliases 与虚接口之间的取舍；Rust 让静态和动态分发边界更显式。"],
                ["This resembles trade-offs between C++ traits/type aliases and virtual interfaces; Rust makes static and dynamic dispatch boundaries explicit."]
              ],
              examples: [
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
}`)
              ],
              references: ["serde-rs/serde", "rust-lang/rust-analyzer"]
            })
          ]
        },
        {
          id: "async-runtime-boundaries",
          title: t("异步 Rust 与 runtime 边界", "Async Rust and runtime boundaries"),
          sections: [
            lesson({
              id: "future-task-cancellation",
              title: ["future、task 与取消", "Futures, tasks, and cancellation"],
              goals: [
                ["理解 async Rust 是状态机。", "知道 runtime 边界应该出现在应用入口。"],
                ["Understand async Rust as state machines.", "Know that runtime boundaries belong at app entry points."]
              ],
              syntax: [
                ["`async fn` 返回 future，只有被 runtime poll 才推进。", "`tokio::spawn` 常要求 future 是 `Send + 'static`。"],
                ["`async fn` returns a future that progresses only when polled by a runtime.", "`tokio::spawn` often requires futures to be `Send + 'static`."]
              ],
              engineering: [
                ["库应暴露 async API，而不是偷偷创建全局 runtime。", "取消通常通过 drop future 发生，因此清理逻辑要放在明确 owner 中。"],
                ["Libraries should expose async APIs instead of secretly creating a global runtime.", "Cancellation usually happens by dropping futures, so cleanup needs explicit owners."]
              ],
              cppComparison: [
                ["C++ coroutine 也会生成状态机，但 Rust async 还受到所有权和 `Send` 边界约束。"],
                ["C++ coroutines also become state machines, but Rust async is additionally constrained by ownership and `Send` boundaries."]
              ],
              examples: [
                sharedExample("Tokio: bounded queue + worker", "Tokio: bounded queue + worker", "rust", `use tokio::sync::mpsc;

struct Job {
    id: u64,
    payload: String,
}

async fn run_worker(mut rx: mpsc::Receiver<Job>) {
    while let Some(job) = rx.recv().await {
        process(job).await;
    }
}

async fn start() -> mpsc::Sender<Job> {
    let (tx, rx) = mpsc::channel(128);
    tokio::spawn(run_worker(rx));
    tx
}`)
              ],
              references: ["tokio-rs/tokio", "hyperium/hyper"]
            })
          ]
        },
        {
          id: "concurrency-communication",
          title: t("并发通信与共享状态", "Concurrent communication and shared state"),
          sections: [
            lesson({
              id: "channels-shared-state",
              title: ["channel、Arc 与锁边界", "Channels, Arc, and lock boundaries"],
              goals: [
                ["知道什么时候用消息传递，什么时候用共享状态。", "避免持锁 await。"],
                ["Know when to use message passing and when to use shared state.", "Avoid awaiting while holding locks."]
              ],
              syntax: [
                ["`Arc<T>` 共享所有权，`Mutex<T>` / `RwLock<T>` 控制可变访问。", "mpsc、oneshot、broadcast、watch 对应不同通信模式。"],
                ["`Arc<T>` shares ownership, while `Mutex<T>` / `RwLock<T>` synchronize mutable access.", "mpsc, oneshot, broadcast, and watch map to different communication patterns."]
              ],
              engineering: [
                ["复杂业务流程通常用消息传递更清晰；小配置和缓存适合共享状态。", "锁作用域要短，拿到数据后尽快释放锁。"],
                ["Complex workflows are often clearer with messages; small configs and caches fit shared state.", "Keep lock scopes short and release locks before slow work."]
              ],
              cppComparison: [
                ["C++ 也有 mutex/shared_ptr，但 Rust 的 `Send`/`Sync` 会把跨线程错误变成类型错误。"],
                ["C++ has mutex/shared_ptr too, but Rust's `Send`/`Sync` turn cross-thread mistakes into type errors."]
              ],
              examples: [
                sharedExample("Rust: 共享只读配置，消息传递任务", "Rust: share read-only config, send jobs by message", "rust", `use std::sync::Arc;
use tokio::sync::mpsc;

#[derive(Clone)]
struct AppConfig {
    max_payload: usize,
}

async fn submit(tx: mpsc::Sender<Job>, config: Arc<AppConfig>, payload: String) {
    if payload.len() <= config.max_payload {
        let _ = tx.send(Job { payload }).await;
    }
}

struct Job {
    payload: String,
}`)
              ],
              references: ["tokio-rs/tokio"]
            })
          ]
        },
        {
          id: "observability-errors",
          title: t("错误、日志与可观测性", "Errors, logs, and observability"),
          sections: [
            lesson({
              id: "tracing-error-context",
              title: ["tracing span 与错误上下文", "Tracing spans and error context"],
              goals: [
                ["让异步任务和请求可追踪。", "把错误和上下文绑定。"],
                ["Make async tasks and requests traceable.", "Attach errors to context."]
              ],
              syntax: [
                ["`tracing` 用 span 表示一次操作的上下文。", "错误类型保留结构化信息，日志层决定如何输出。"],
                ["`tracing` spans represent operation context.", "Error types keep structured information, and logging decides how to render it."]
              ],
              engineering: [
                ["服务端不要只记录字符串，要记录 request id、user id、路径、耗时。", "CLI 要区分 stdout 数据输出和 stderr 诊断。"],
                ["Servers should log request id, user id, path, and latency, not just strings.", "CLIs should separate stdout data from stderr diagnostics."]
              ],
              cppComparison: [
                ["C++ 日志库也能结构化；Rust 的 `Result` 和 `tracing` 组合能让错误路径更明确。"],
                ["C++ logging libraries can be structured too; Rust's `Result` plus `tracing` makes error paths explicit."]
              ],
              examples: [
                sharedExample("Rust: 带 request_id 的处理函数", "Rust: handler with request_id", "rust", `#[tracing::instrument(skip(store), fields(request_id = %request.id))]
async fn handle_request(store: &Store, request: Request) -> Result<Response, AppError> {
    let course = store
        .load_course(&request.course_id)
        .await
        .map_err(|source| AppError::LoadCourse {
            course_id: request.course_id.clone(),
            source,
        })?;

    Ok(Response::from(course))
}`)
              ],
              references: ["tokio-rs/tokio", "rust-lang/cargo"]
            })
          ]
        },
        {
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
        },
        {
          id: "unsafe-ffi",
          title: t("unsafe、FFI 与安全封装", "Unsafe, FFI, and safe wrappers"),
          sections: [
            lesson({
              id: "ffi-safe-wrapper",
              title: ["把 unsafe 压到小边界", "Keep unsafe behind small boundaries"],
              goals: [
                ["理解 unsafe 是局部证明责任。", "把 C ABI 包装成安全 Rust API。"],
                ["Understand unsafe as a local proof obligation.", "Wrap C ABI in safe Rust APIs."]
              ],
              syntax: [
                ["`unsafe` 允许裸指针、unsafe 函数、可变 static、unsafe trait。", "`#[repr(C)]` 固定跨 FFI 的数据布局。"],
                ["`unsafe` permits raw pointers, unsafe functions, mutable statics, and unsafe traits.", "`#[repr(C)]` fixes layout across FFI."]
              ],
              engineering: [
                ["业务层不应该到处写 unsafe；unsafe 模块负责检查 null、长度、所有权和错误码。", "safety contract 必须写在 unsafe 函数或模块文档中。"],
                ["Business code should not write unsafe everywhere; the unsafe module checks nulls, lengths, ownership, and error codes.", "Safety contracts must be documented on unsafe functions or modules."]
              ],
              cppComparison: [
                ["C++ 默认允许指针操作；Rust 默认禁止，要求在 unsafe 处集中说明不变量。"],
                ["C++ permits pointer operations by default; Rust forbids them by default and requires invariants near unsafe code."]
              ],
              examples: [
                sharedExample("Rust: FFI 安全包装", "Rust: safe FFI wrapper", "rust", `#[repr(C)]
pub struct CBuffer {
    ptr: *const u8,
    len: usize,
}

extern "C" {
    fn checksum(buffer: CBuffer) -> u32;
}

pub fn checksum_bytes(bytes: &[u8]) -> u32 {
    let buffer = CBuffer { ptr: bytes.as_ptr(), len: bytes.len() };
    unsafe { checksum(buffer) }
}`)
              ],
              references: ["rust-lang/rust", "rustls/rustls"]
            })
          ]
        },
        {
          id: "macros-codegen",
          title: t("宏、代码生成与可维护性", "Macros, code generation, and maintainability"),
          sections: [
            lesson({
              id: "derive-builder-macros",
              title: ["derive、builder 与宏边界", "Derive, builders, and macro boundaries"],
              goals: [
                ["知道宏适合消除重复模式，不适合隐藏复杂逻辑。", "理解 derive API 对用户体验的影响。"],
                ["Use macros to remove repeated patterns, not to hide complex logic.", "Understand how derive APIs affect user experience."]
              ],
              syntax: [
                ["`macro_rules!` 适合局部语法重复；derive macro 能为类型生成 impl。", "宏错误信息通常比函数差，公共宏需要格外克制。"],
                ["`macro_rules!` fits local syntax repetition; derive macros generate impls for types.", "Macro errors are often worse than function errors, so public macros need restraint."]
              ],
              engineering: [
                ["builder/derive API 可以显著改善 CLI、配置、序列化体验。", "如果普通函数和 trait 能解决，就不要急着写宏。"],
                ["Builder/derive APIs can significantly improve CLI, config, and serialization ergonomics.", "If functions and traits solve the problem, do not rush into macros."]
              ],
              cppComparison: [
                ["Rust 宏比 C 预处理器更结构化，但依然会增加调试和学习成本。"],
                ["Rust macros are more structured than the C preprocessor, but they still add debugging and learning cost."]
              ],
              examples: [
                sharedExample("Rust: derive + builder 风格配置", "Rust: derive + builder-style config", "rust", `#[derive(Debug, Clone, serde::Deserialize)]
struct CliConfig {
    host: String,
    port: u16,
    #[serde(default = "default_workers")]
    workers: usize,
}

fn default_workers() -> usize { 4 }

impl CliConfig {
    fn address(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
}`)
              ],
              references: ["serde-rs/serde", "clap-rs/clap"]
            })
          ]
        },
        {
          id: "testing-ci-release",
          title: t("测试策略、CI 与发布", "Testing strategy, CI, and release"),
          sections: [
            lesson({
              id: "feature-matrix-release",
              title: ["feature matrix 与发布检查", "Feature matrix and release checks"],
              goals: [
                ["理解发布前要测试的不只是默认路径。", "建立 semver、MSRV、文档和示例检查清单。"],
                ["Understand that releases must test more than default paths.", "Build a semver, MSRV, docs, and examples checklist."]
              ],
              syntax: [
                ["Cargo profile 控制优化、debug info、LTO。", "CI 可以组合 `--no-default-features`、`--all-features` 和关键 feature。"],
                ["Cargo profiles control optimization, debug info, and LTO.", "CI can combine `--no-default-features`, `--all-features`, and key features."]
              ],
              engineering: [
                ["发布流程应检查 changelog、README、examples、docs、MSRV 和 feature 组合。", "CLI 工具还要检查退出码、stderr/stdout 和配置优先级。"],
                ["Release flow should check changelog, README, examples, docs, MSRV, and feature combinations.", "CLI tools also need exit code, stderr/stdout, and config precedence checks."]
              ],
              cppComparison: [
                ["C++ 发布常受 ABI 和平台依赖影响；Rust 简化了很多路径，但 target matrix 和 feature matrix 仍要管理。"],
                ["C++ releases are often constrained by ABI and platform dependencies; Rust simplifies many paths, but target and feature matrices still matter."]
              ],
              examples: [
                sharedExample("GitHub Actions: feature matrix", "GitHub Actions: feature matrix", "yaml", `strategy:
  matrix:
    features:
      - "--no-default-features"
      - "--all-features"
      - "--features json"

steps:
  - uses: actions/checkout@v4
  - uses: dtolnay/rust-toolchain@stable
  - run: cargo test --workspace \${{ matrix.features }}
  - run: cargo doc --workspace \${{ matrix.features }} --no-deps`)
              ],
              references: ["rust-lang/cargo", "BurntSushi/ripgrep"]
            })
          ]
        },
        {
          id: "advanced-capstone",
          title: t("进阶综合项目", "Advanced capstone project"),
          sections: [
            lesson({
              id: "async-service-workspace",
              title: ["综合项目：async service + library workspace", "Capstone: async service + library workspace"],
              goals: [
                ["把进阶阶段工程主题整合成一个小型服务。", "练习 workspace、trait、async、tracing、错误和测试。"],
                ["Integrate advanced engineering topics into a small service.", "Practice workspaces, traits, async, tracing, errors, and tests."]
              ],
              syntax: [
                ["core crate 定义领域和 trait，server crate 负责 runtime 和 HTTP，adapter crate 负责存储。", "使用 bounded channel 做后台任务，tracing 串联请求上下文。"],
                ["The core crate defines domain and traits, the server crate owns runtime and HTTP, and adapter crates own storage.", "Use bounded channels for background work and tracing for request context."]
              ],
              engineering: [
                ["综合项目应该展示如何避免 runtime 泄漏进核心库、如何让错误有上下文、如何测试 trait 边界。", "最后再做性能和 API 演进讨论。"],
                ["The capstone should show how to keep runtime out of core libraries, attach error context, and test trait boundaries.", "Finish with performance and API evolution discussion."]
              ],
              cppComparison: [
                ["这对应 C++ 中 library + service binary + adapter target 的工程结构，但 Rust 的 trait 和 Cargo feature 让边界更显式。"],
                ["This maps to C++ library + service binary + adapter targets, but Rust traits and Cargo features make boundaries more explicit."]
              ],
              examples: [
                sharedExample("Rust: service 组合根", "Rust: service composition root", "rust", `trait CourseStore {
    type Error;
    async fn load(&self, slug: &str) -> Result<Course, Self::Error>;
}

struct App<S> {
    store: S,
    jobs: tokio::sync::mpsc::Sender<IndexJob>,
}

impl<S> App<S>
where
    S: CourseStore + Send + Sync,
{
    #[tracing::instrument(skip(self))]
    async fn get_course(&self, slug: &str) -> Result<Course, AppError<S::Error>> {
        let course = self.store.load(slug).await.map_err(AppError::Store)?;
        let _ = self.jobs.send(IndexJob::Viewed(slug.to_owned())).await;
        Ok(course)
    }
}`)
              ],
              references: ["tokio-rs/tokio", "hyperium/hyper", "rust-lang/rust-analyzer"]
            })
          ]
        }
      ]
    }
  ]
};
