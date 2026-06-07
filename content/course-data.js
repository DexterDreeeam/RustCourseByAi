window.RUST_COURSE_DATA = {
  hero: {
    zh: {
      eyebrow: "Rust for C++ Engineers",
      title: "从 C++ 视角深入 Rust",
      description: "这是一套面向 C++ 程序员的双语 Rust 教程：前半部分建立语法和心智模型，后半部分进入真实项目工程经验。",
      cards: [
        { title: "双语一致", text: "中文和英文共享同一份结构化课程数据，随时切换语言。" },
        { title: "C++ 对照", text: "用 RAII、模板、引用、构建系统等熟悉概念解释 Rust。" },
        { title: "工程导向", text: "每节同时讲语法和项目中的具体用法。" }
      ]
    },
    en: {
      eyebrow: "Rust for C++ Engineers",
      title: "Learn Rust deeply from a C++ perspective",
      description: "A bilingual Rust course for C++ programmers: the first half builds syntax and mental models, while the second half moves into real project engineering.",
      cards: [
        { title: "Bilingual parity", text: "Chinese and English share the same structured course data and can be switched anytime." },
        { title: "C++ comparisons", text: "Rust is explained through familiar ideas such as RAII, templates, references, and build systems." },
        { title: "Engineering focused", text: "Every lesson covers both syntax and concrete project usage." }
      ]
    }
  },
  references: [
    {
      name: "rust-lang/rust",
      url: "https://github.com/rust-lang/rust",
      lesson: {
        zh: "大型 Rust 项目组织、诊断信息和安全边界。",
        en: "Large Rust project organization, diagnostics, and safety boundaries."
      }
    },
    {
      name: "rust-lang/cargo",
      url: "https://github.com/rust-lang/cargo",
      lesson: {
        zh: "Cargo 工作流、feature、CLI 架构和集成测试。",
        en: "Cargo workflows, features, CLI architecture, and integration testing."
      }
    },
    {
      name: "rust-lang/rust-analyzer",
      url: "https://github.com/rust-lang/rust-analyzer",
      lesson: {
        zh: "模块化架构、增量计算和性能敏感的工具设计。",
        en: "Modular architecture, incremental computation, and performance-aware tooling."
      }
    },
    {
      name: "tokio-rs/tokio",
      url: "https://github.com/tokio-rs/tokio",
      lesson: {
        zh: "异步任务、channel、取消和运行时边界。",
        en: "Async tasks, channels, cancellation, and runtime boundaries."
      }
    },
    {
      name: "serde-rs/serde",
      url: "https://github.com/serde-rs/serde",
      lesson: {
        zh: "trait 驱动 API、derive 宏和零拷贝序列化。",
        en: "Trait-driven APIs, derive macros, and zero-copy serialization."
      }
    },
    {
      name: "BurntSushi/ripgrep",
      url: "https://github.com/BurntSushi/ripgrep",
      lesson: {
        zh: "CLI 体验、IO 性能、crate 拆分和实用错误处理。",
        en: "CLI ergonomics, IO performance, crate decomposition, and practical errors."
      }
    },
    {
      name: "hyperium/hyper",
      url: "https://github.com/hyperium/hyper",
      lesson: {
        zh: "异步网络、service 抽象和协议分层。",
        en: "Async networking, service abstractions, and protocol layering."
      }
    },
    {
      name: "rustls/rustls",
      url: "https://github.com/rustls/rustls",
      lesson: {
        zh: "安全敏感 API、封装、测试纪律和安全默认值。",
        en: "Security-sensitive APIs, encapsulation, test discipline, and safe defaults."
      }
    },
    {
      name: "clap-rs/clap",
      url: "https://github.com/clap-rs/clap",
      lesson: {
        zh: "命令行 UX、builder/derive API 和宏的人体工学。",
        en: "Command-line UX, builder/derive APIs, and macro ergonomics."
      }
    },
    {
      name: "tauri-apps/tauri",
      url: "https://github.com/tauri-apps/tauri",
      lesson: {
        zh: "大型 workspace、跨平台边界和命令/插件架构。",
        en: "Large workspaces, cross-platform boundaries, and command/plugin architecture."
      }
    }
  ],
  parts: [
    {
      id: "beginner",
      title: { zh: "入门篇", en: "Beginner track" },
      chapters: [
        {
          id: "mindset-tools",
          title: { zh: "心智模型与工具链", en: "Mental model and toolchain" },
          sections: [
            {
              id: "rust-vs-cpp-model",
              title: { zh: "Rust 与 C++ 的核心差异", en: "Core differences between Rust and C++" },
              goals: {
                zh: ["理解 Rust 为什么把所有权放在语言中心。", "把 RAII、move 和 borrow checker 放到同一张图里理解。"],
                en: ["Understand why Rust puts ownership at the center of the language.", "Connect RAII, move semantics, and the borrow checker in one mental model."]
              },
              syntax: {
                zh: ["Rust 的值默认不可变，移动语义是默认行为，借用必须通过 `&T` 或 `&mut T` 明确表达。", "编译器会在编译期检查同一时刻只能有多个不可变借用，或一个可变借用。"],
                en: ["Rust values are immutable by default, moves are the default transfer operation, and borrows must be written explicitly as `&T` or `&mut T`.", "The compiler checks at compile time that a value has either many immutable borrows or one mutable borrow at a time."]
              },
              engineering: {
                zh: ["真实项目中，所有权帮助 API 表达资源归属：函数接收 `T` 表示拿走资源，接收 `&T` 表示只读观察，接收 `&mut T` 表示独占修改。", "这让模块边界更清晰，也减少了 C++ 中常见的悬垂引用、重复释放和隐式共享所有权问题。"],
                en: ["In real projects, ownership makes resource boundaries explicit: taking `T` consumes ownership, `&T` observes, and `&mut T` mutates exclusively.", "That clarity reduces dangling references, double frees, and unclear shared ownership that often appear in C++ codebases."]
              },
              cppComparison: {
                zh: ["C++ 依赖 RAII 和约定来管理生命周期，智能指针表达一部分所有权语义。Rust 把这些约定提升为类型系统规则，并让普通引用也参与生命周期检查。"],
                en: ["C++ relies on RAII and conventions, with smart pointers expressing part of ownership. Rust lifts those conventions into type-system rules and makes ordinary references participate in lifetime checking."]
              },
              examples: [
                {
                  title: { zh: "Rust: 所有权移动", en: "Rust: ownership move" },
                  language: "rust",
                  code: `fn consume(name: String) {
    println!("hello {name}");
}

fn main() {
    let user = String::from("Ada");
    consume(user);
    // user can no longer be used here because ownership moved.
}`
                },
                {
                  title: { zh: "C++: 调用约定需要人工判断", en: "C++: ownership depends on convention" },
                  language: "cpp",
                  code: `void consume(std::string name) {
    std::cout << "hello " << name << "\\n";
}

int main() {
    std::string user = "Ada";
    consume(std::move(user));
}`
                }
              ],
              references: ["rust-lang/rust"]
            },
            {
              id: "cargo-crates-modules",
              title: { zh: "Cargo、crate 与模块", en: "Cargo, crates, and modules" },
              goals: {
                zh: ["理解 Cargo 在 Rust 项目中的角色。", "区分 package、crate、module 和 workspace。"],
                en: ["Understand Cargo's role in Rust projects.", "Distinguish packages, crates, modules, and workspaces."]
              },
              syntax: {
                zh: ["`Cargo.toml` 描述 package 元数据和依赖；`src/lib.rs` 定义库 crate；`src/main.rs` 定义二进制 crate。", "`mod` 声明模块，`pub` 控制可见性，路径使用 `crate::`、`self::` 或 `super::` 表达层级关系。"],
                en: ["`Cargo.toml` describes package metadata and dependencies; `src/lib.rs` defines a library crate; `src/main.rs` defines a binary crate.", "`mod` declares modules, `pub` controls visibility, and paths use `crate::`, `self::`, or `super::` to express hierarchy."]
              },
              engineering: {
                zh: ["小项目可以从一个 crate 开始，大项目逐步拆成 workspace：核心领域逻辑放库 crate，CLI/API/服务入口放二进制 crate。", "模块不是文件夹整理工具，而是 API 边界工具；不要把所有内容都 `pub` 出去。"],
                en: ["Small projects can start with one crate; larger systems can evolve into a workspace with domain logic in library crates and CLI/API/service entry points in binary crates.", "Modules are API boundary tools, not just folder organization. Avoid making everything `pub`."]
              },
              cppComparison: {
                zh: ["C++ 常用 CMake/Bazel 加头文件组织依赖。Rust 的 Cargo 把包管理、构建、测试和文档入口合在一起，模块可见性比头文件暴露更细。"],
                en: ["C++ often combines CMake/Bazel with headers. Rust's Cargo unifies package management, builds, tests, and docs, while module visibility is finer-grained than header exposure."]
              },
              examples: [
                {
                  title: { zh: "Cargo.toml 最小依赖", en: "Minimal Cargo.toml dependency" },
                  language: "toml",
                  code: `[package]
name = "course-demo"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }`
                },
                {
                  title: { zh: "Rust 模块边界", en: "Rust module boundary" },
                  language: "rust",
                  code: `pub mod parser;

mod internals;

pub use parser::parse_config;`
                }
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer"]
            }
          ]
        },
        {
          id: "values-ownership",
          title: { zh: "值、可变性与所有权", en: "Values, mutability, and ownership" },
          sections: [
            {
              id: "variables-mutability-types",
              title: { zh: "变量、可变性与基础类型", en: "Variables, mutability, and basic types" },
              goals: {
                zh: ["理解 Rust 默认不可变的设计。", "区分 shadowing 和可变赋值。"],
                en: ["Understand Rust's immutable-by-default design.", "Distinguish shadowing from mutable assignment."]
              },
              syntax: {
                zh: ["`let` 绑定默认不可变，`let mut` 才能重新赋值。shadowing 使用新的 `let` 创建新绑定，可以改变类型。", "基础类型包括整数、浮点、布尔、字符、tuple、array；类型推断常用，但公共 API 应写清类型。"],
                en: ["A `let` binding is immutable by default; `let mut` allows reassignment. Shadowing creates a new binding with `let` and may change the type.", "Basic types include integers, floats, booleans, chars, tuples, and arrays. Type inference is common, but public APIs should be explicit."]
              },
              engineering: {
                zh: ["默认不可变让代码审查更容易：看到 `mut` 就知道这里有状态变化。shadowing 适合表达解析、校验、归一化等一步步收窄类型的流程。", "在大型项目中，减少可变共享状态通常比追求局部少写几个变量更重要。"],
                en: ["Immutable-by-default code is easier to review: `mut` marks state changes. Shadowing is useful for parsing, validation, and normalization pipelines that refine a value step by step.", "In large projects, reducing shared mutable state is usually more valuable than minimizing local variable count."]
              },
              cppComparison: {
                zh: ["C++ 可以使用 `const` 表达不可变，但很多代码库默认可变。Rust 反过来：不可变是默认，可变性是显式例外。"],
                en: ["C++ can express immutability with `const`, but many codebases default to mutable variables. Rust reverses that: immutability is the default and mutability is explicit."]
              },
              examples: [
                {
                  title: { zh: "Rust: shadowing 改变类型", en: "Rust: shadowing changes type" },
                  language: "rust",
                  code: `let port = "8080";
let port: u16 = port.parse().expect("valid port");
println!("listening on {port}");`
                },
                {
                  title: { zh: "C++: 可变性通常靠 const 纪律", en: "C++: immutability relies on const discipline" },
                  language: "cpp",
                  code: `const std::string raw = "8080";
const auto port = static_cast<std::uint16_t>(std::stoi(raw));`
                }
              ],
              references: ["rust-lang/rust"]
            },
            {
              id: "ownership-borrowing",
              title: { zh: "所有权、借用与生命周期", en: "Ownership, borrowing, and lifetimes" },
              goals: {
                zh: ["理解 move、copy、borrow 的差异。", "理解生命周期不是运行时机制，而是引用有效性的静态证明。"],
                en: ["Understand the difference between move, copy, and borrow.", "Understand that lifetimes are static proofs of reference validity, not runtime objects."]
              },
              syntax: {
                zh: ["实现 `Copy` 的小值会按位复制；大多数拥有堆内存的类型会 move。`&T` 是共享借用，`&mut T` 是独占借用。", "生命周期参数如 `<'a>` 描述多个引用之间的有效期关系，常见于返回借用或结构体保存借用时。"],
                en: ["Small values implementing `Copy` are bitwise copied; most heap-owning types move. `&T` is a shared borrow, and `&mut T` is an exclusive borrow.", "Lifetime parameters such as `<'a>` describe validity relationships between references, commonly when returning a borrow or storing one in a struct."]
              },
              engineering: {
                zh: ["API 设计时先问资源归谁：如果函数只读，不要拿走 `String`，用 `&str`；如果需要保存，通常接收 owned value。", "生命周期错误往往提示边界设计不清晰；在工程中可以通过 owned 类型、newtype 或明确的缓存对象来简化。"],
                en: ["When designing APIs, ask who owns the resource. If a function only reads text, prefer `&str` over `String`; if it must store the value, take an owned value.", "Lifetime errors often reveal unclear boundaries. In projects, owned types, newtypes, or explicit cache objects can simplify the design."]
              },
              cppComparison: {
                zh: ["C++ 引用和指针可能悬垂，编译器通常无法跨函数证明生命周期。Rust 借用把这类证明前移到编译期，但代价是 API 边界必须更明确。"],
                en: ["C++ references and pointers can dangle, and the compiler usually cannot prove cross-function lifetimes. Rust moves that proof to compile time, at the cost of clearer API boundaries."]
              },
              examples: [
                {
                  title: { zh: "Rust: 只读 API 使用 &str", en: "Rust: read-only API with &str" },
                  language: "rust",
                  code: `fn normalize_name(name: &str) -> String {
    name.trim().to_ascii_lowercase()
}`
                },
                {
                  title: { zh: "Rust: 生命周期表达返回值来源", en: "Rust: lifetime ties output to input" },
                  language: "rust",
                  code: `fn first_non_empty<'a>(left: &'a str, right: &'a str) -> &'a str {
    if !left.is_empty() { left } else { right }
}`
                }
              ],
              references: ["rust-lang/rust", "serde-rs/serde"]
            }
          ]
        },
        {
          id: "data-modeling",
          title: { zh: "数据建模", en: "Data modeling" },
          sections: [
            {
              id: "structs-enums-match",
              title: { zh: "struct、enum 与模式匹配", en: "Structs, enums, and pattern matching" },
              goals: {
                zh: ["用 struct 表达产品类型，用 enum 表达和类型。", "理解 `match` 为什么能减少遗漏分支。"],
                en: ["Use structs for product types and enums for sum types.", "Understand why `match` reduces missing cases."]
              },
              syntax: {
                zh: ["`struct` 把多个字段组合成一个值；`enum` 的每个变体可以携带不同数据。`match` 必须穷尽所有可能情况。", "`if let` 和 `let else` 适合只关心一个分支的简化写法。"],
                en: ["A `struct` combines fields into one value; each `enum` variant can carry different data. `match` must cover all possible cases.", "`if let` and `let else` simplify code that cares about only one branch."]
              },
              engineering: {
                zh: ["工程中优先用 enum 表达状态机、协议消息、命令类型和错误类别，而不是用字符串或整数 tag 到处判断。", "穷尽匹配让新增状态时编译器帮你找到所有需要修改的地方。"],
                en: ["In projects, prefer enums for state machines, protocol messages, command kinds, and error categories instead of scattered string or integer tags.", "Exhaustive matching lets the compiler find all places that must change when a new state is added."]
              },
              cppComparison: {
                zh: ["C++17 的 `std::variant` 接近 Rust enum，但 Rust enum 和 `match` 是语言核心组合，写状态机更自然。"],
                en: ["C++17 `std::variant` is close to Rust enums, but Rust enums and `match` are a core language pair, making state machines more natural."]
              },
              examples: [
                {
                  title: { zh: "Rust: 用 enum 表示任务状态", en: "Rust: task state as enum" },
                  language: "rust",
                  code: `enum JobState {
    Queued,
    Running { worker_id: u64 },
    Failed(String),
    Done,
}

fn is_terminal(state: &JobState) -> bool {
    matches!(state, JobState::Failed(_) | JobState::Done)
}`
                }
              ],
              references: ["rust-lang/rust-analyzer", "rustls/rustls"]
            },
            {
              id: "traits-generics",
              title: { zh: "trait、泛型与约束", en: "Traits, generics, and bounds" },
              goals: {
                zh: ["理解 trait 是行为抽象，不是类继承。", "理解泛型约束如何替代一部分模板约定。"],
                en: ["Understand traits as behavioral abstraction, not class inheritance.", "Understand how generic bounds replace part of template convention."]
              },
              syntax: {
                zh: ["`trait` 定义一组方法契约，`impl Trait for Type` 为类型实现行为。泛型使用 `T: Trait` 或 `where` 子句声明能力要求。", "`impl Trait` 可以用于参数和返回值，表达调用者不必知道的具体类型。"],
                en: ["A `trait` defines a method contract, and `impl Trait for Type` implements behavior for a type. Generics use `T: Trait` or `where` clauses to declare required capabilities.", "`impl Trait` can appear in parameters and return types when callers do not need the concrete type."]
              },
              engineering: {
                zh: ["trait 适合定义模块边界：存储层、网络层、解析器、时钟、随机数等都可以通过 trait 替换实现，方便测试。", "不要过早抽象；当至少有两个真实实现或需要测试替身时再引入 trait 往往更稳。"],
                en: ["Traits are good module boundaries: storage, network, parsers, clocks, and randomness can be trait-backed for testing.", "Avoid premature abstraction; traits are more justified when there are at least two real implementations or a test double is needed."]
              },
              cppComparison: {
                zh: ["trait 和 C++ concept 都能表达能力约束；trait 还可以像虚接口一样做动态分发。Rust 要你在静态分发和 `dyn Trait` 之间显式选择。"],
                en: ["Traits and C++ concepts both express capability constraints; traits can also support dynamic dispatch like virtual interfaces. Rust asks you to choose explicitly between static dispatch and `dyn Trait`."]
              },
              examples: [
                {
                  title: { zh: "Rust: trait 作为边界", en: "Rust: trait as boundary" },
                  language: "rust",
                  code: `trait Clock {
    fn now_ms(&self) -> u64;
}

fn should_retry(clock: &impl Clock, deadline_ms: u64) -> bool {
    clock.now_ms() < deadline_ms
}`
                }
              ],
              references: ["serde-rs/serde", "clap-rs/clap"]
            }
          ]
        },
        {
          id: "daily-programming",
          title: { zh: "日常编程模式", en: "Daily programming patterns" },
          sections: [
            {
              id: "errors-option-result",
              title: { zh: "Option、Result 与错误处理", en: "Option, Result, and error handling" },
              goals: {
                zh: ["区分缺失值和失败。", "理解 `?` 如何传播错误。"],
                en: ["Distinguish absence from failure.", "Understand how `?` propagates errors."]
              },
              syntax: {
                zh: ["`Option<T>` 表示有或没有，`Result<T, E>` 表示成功或失败。`?` 会在错误时提前返回，并通过 `From` 转换错误类型。", "`panic!` 适合不可恢复 bug，不适合普通业务错误。"],
                en: ["`Option<T>` means present or absent; `Result<T, E>` means success or failure. `?` returns early on errors and converts error types through `From`.", "`panic!` is for unrecoverable bugs, not normal business errors."]
              },
              engineering: {
                zh: ["库代码通常返回结构化错误，应用入口负责把错误转成人能理解的日志或退出码。", "错误类型应该帮助调用者决策：能重试、能提示用户、还是必须终止。"],
                en: ["Library code usually returns structured errors; application entry points turn them into human-readable logs or exit codes.", "Error types should help callers decide whether to retry, inform the user, or stop."]
              },
              cppComparison: {
                zh: ["C++ 常在异常、错误码、optional 之间混用。Rust 把可恢复错误放进返回类型，让调用点必须处理或显式传播。"],
                en: ["C++ often mixes exceptions, error codes, and optionals. Rust puts recoverable errors in return types, forcing call sites to handle or explicitly propagate them."]
              },
              examples: [
                {
                  title: { zh: "Rust: ? 传播错误", en: "Rust: propagate with ?" },
                  language: "rust",
                  code: `fn read_port(raw: &str) -> Result<u16, std::num::ParseIntError> {
    let port = raw.trim().parse::<u16>()?;
    Ok(port)
}`
                }
              ],
              references: ["BurntSushi/ripgrep", "rust-lang/cargo"]
            },
            {
              id: "iterators-closures",
              title: { zh: "迭代器与闭包", en: "Iterators and closures" },
              goals: {
                zh: ["理解迭代器是惰性的。", "用闭包表达局部行为，而不是到处创建临时循环变量。"],
                en: ["Understand that iterators are lazy.", "Use closures to express local behavior instead of scattered temporary loop variables."]
              },
              syntax: {
                zh: ["`iter()` 借用元素，`iter_mut()` 可变借用元素，`into_iter()` 消耗集合。`map`、`filter`、`fold` 等适合流水线处理。", "闭包可以捕获环境，捕获方式由使用方式推断：借用、可变借用或移动。"],
                en: ["`iter()` borrows elements, `iter_mut()` mutably borrows them, and `into_iter()` consumes the collection. `map`, `filter`, and `fold` are useful for pipelines.", "Closures capture their environment, and the capture mode is inferred from usage: borrow, mutable borrow, or move."]
              },
              engineering: {
                zh: ["迭代器链适合表达转换逻辑，尤其是解析配置、过滤请求、统计指标。复杂链条超过可读性阈值时，应拆成命名函数。", "性能敏感路径中，迭代器通常能被内联优化，但仍要关注分配点和临时 `String`。"],
                en: ["Iterator chains are good for transformation logic such as config parsing, request filtering, and metrics. When chains become hard to read, extract named functions.", "In performance-sensitive paths, iterators often inline well, but allocations and temporary `String` values still matter."]
              },
              cppComparison: {
                zh: ["C++ ranges 和算法库能表达类似流水线，但 Rust 的所有权会明确区分借用迭代和消费迭代。"],
                en: ["C++ ranges and algorithms can express similar pipelines, but Rust ownership makes borrowed iteration and consuming iteration explicit."]
              },
              examples: [
                {
                  title: { zh: "Rust: 过滤并转换", en: "Rust: filter and transform" },
                  language: "rust",
                  code: `let ports: Vec<u16> = ["80", "bad", "443"]
    .into_iter()
    .filter_map(|raw| raw.parse::<u16>().ok())
    .collect();`
                }
              ],
              references: ["BurntSushi/ripgrep"]
            }
          ]
        }
      ]
    },
    {
      id: "advanced",
      title: { zh: "进阶篇", en: "Advanced track" },
      chapters: [
        {
          id: "architecture",
          title: { zh: "项目架构", en: "Project architecture" },
          sections: [
            {
              id: "workspace-module-boundaries",
              title: { zh: "workspace 与模块边界", en: "Workspaces and module boundaries" },
              goals: {
                zh: ["知道何时从单 crate 演进到 workspace。", "用模块边界保护内部实现。"],
                en: ["Know when to evolve from one crate into a workspace.", "Use module boundaries to protect internals."]
              },
              syntax: {
                zh: ["workspace 在根 `Cargo.toml` 中声明成员 crate。crate 内部用 `pub(crate)`、`pub(super)` 和私有模块控制可见性。", "`pub use` 可以重新导出稳定 API，让内部目录结构不泄漏给调用者。"],
                en: ["A workspace declares member crates in the root `Cargo.toml`. Inside a crate, `pub(crate)`, `pub(super)`, and private modules control visibility.", "`pub use` can re-export stable APIs so internal folder layout does not leak to callers."]
              },
              engineering: {
                zh: ["常见拆分方式是 core/domain crate、adapters crate、cli/server crate。核心 crate 不依赖外部运行时，外层 crate 负责 IO、配置和启动。", "模块边界越清晰，测试替身、性能优化和重构越容易。"],
                en: ["A common split is core/domain crates, adapter crates, and CLI/server crates. Core crates avoid runtime dependencies while outer crates handle IO, configuration, and startup.", "Clear module boundaries make test doubles, performance work, and refactoring easier."]
              },
              cppComparison: {
                zh: ["C++ 常通过库目标和 include 目录表达边界，但头文件容易暴露实现细节。Rust 的私有默认和 re-export 让 API 表面更容易收窄。"],
                en: ["C++ often expresses boundaries through library targets and include directories, but headers can expose implementation details. Rust's private-by-default model and re-exports make API surfaces easier to narrow."]
              },
              examples: [
                {
                  title: { zh: "Workspace 根配置", en: "Workspace root configuration" },
                  language: "toml",
                  code: `[workspace]
members = ["crates/core", "crates/cli", "crates/server"]
resolver = "2"`
                },
                {
                  title: { zh: "稳定 re-export", en: "Stable re-export" },
                  language: "rust",
                  code: `mod parser;
mod validate;

pub use parser::parse_course;`
                }
              ],
              references: ["rust-lang/cargo", "rust-lang/rust-analyzer", "tauri-apps/tauri"]
            },
            {
              id: "public-api-features",
              title: { zh: "公共 API、feature 与版本", en: "Public APIs, features, and versions" },
              goals: {
                zh: ["理解 feature flag 的工程价值和风险。", "把公共 API 当作长期兼容承诺。"],
                en: ["Understand the engineering value and risk of feature flags.", "Treat public APIs as long-term compatibility promises."]
              },
              syntax: {
                zh: ["Cargo feature 可以启用可选依赖或条件编译：`#[cfg(feature = \"json\")]`。公开类型、trait、函数和错误枚举都属于 API。", "语义化版本中，破坏公共 API 应进入 major 版本。"],
                en: ["Cargo features can enable optional dependencies or conditional compilation: `#[cfg(feature = \"json\")]`. Public types, traits, functions, and error enums are all API.", "Under semantic versioning, breaking public API changes belong in major versions."]
              },
              engineering: {
                zh: ["feature 应尽量 additive，不要让两个 feature 组合后产生隐藏冲突。公共 API 暴露越少，未来重构空间越大。", "文档示例和 examples 目录是 API 设计的一部分，因为用户通常先复制这些路径。"],
                en: ["Features should be additive when possible; avoid hidden conflicts between feature combinations. The smaller the public API, the more room future refactors have.", "Docs and examples are part of API design because users often copy those paths first."]
              },
              cppComparison: {
                zh: ["C++ 的 ABI/API 兼容常被动态库和头文件约束。Rust crate 更关注源码级 semver，但公开泛型和 trait 约束同样会形成兼容压力。"],
                en: ["C++ ABI/API compatibility is often constrained by dynamic libraries and headers. Rust crates focus more on source-level semver, but public generics and trait bounds still create compatibility pressure."]
              },
              examples: [
                {
                  title: { zh: "Feature 控制可选功能", en: "Feature-gated optional capability" },
                  language: "rust",
                  code: `#[cfg(feature = "json")]
pub fn export_json(report: &Report) -> Result<String, serde_json::Error> {
    serde_json::to_string(report)
}`
                }
              ],
              references: ["serde-rs/serde", "clap-rs/clap", "rust-lang/cargo"]
            }
          ]
        },
        {
          id: "communication",
          title: { zh: "并发、通信与异步", en: "Concurrency, communication, and async" },
          sections: [
            {
              id: "shared-state-send-sync",
              title: { zh: "Send、Sync 与共享状态", en: "Send, Sync, and shared state" },
              goals: {
                zh: ["理解 `Send` 和 `Sync` 是线程安全能力标记。", "知道何时用消息传递，何时用共享状态。"],
                en: ["Understand `Send` and `Sync` as thread-safety capability markers.", "Know when to use message passing and when to use shared state."]
              },
              syntax: {
                zh: ["`Send` 表示值可以移动到另一个线程，`Sync` 表示 `&T` 可以在线程间共享。`Arc<T>` 提供原子引用计数，`Mutex<T>` 和 `RwLock<T>` 提供同步访问。", "很多类型自动实现这些 trait；包含非线程安全内部状态的类型不会自动实现。"],
                en: ["`Send` means a value can move to another thread, and `Sync` means `&T` can be shared between threads. `Arc<T>` provides atomic reference counting, while `Mutex<T>` and `RwLock<T>` synchronize access.", "Many types implement these traits automatically; types containing non-thread-safe internals do not."]
              },
              engineering: {
                zh: ["共享状态适合小而稳定的配置、缓存和计数器；复杂业务流程更适合通过 channel 传递拥有权明确的消息。", "锁的作用域要短，不要在持锁时执行 IO、await 或调用未知回调。"],
                en: ["Shared state fits small stable configuration, caches, and counters; complex workflows often work better as messages with clear ownership.", "Keep lock scopes short. Do not perform IO, await, or call unknown callbacks while holding a lock."]
              },
              cppComparison: {
                zh: ["C++ 也有 mutex/shared_ptr，但 Rust 的 `Send`/`Sync` 会把跨线程错误变成类型错误，而不是靠代码审查发现。"],
                en: ["C++ also has mutexes and shared pointers, but Rust's `Send`/`Sync` turn cross-thread mistakes into type errors instead of relying only on review."]
              },
              examples: [
                {
                  title: { zh: "Rust: Arc + Mutex", en: "Rust: Arc + Mutex" },
                  language: "rust",
                  code: `use std::sync::{Arc, Mutex};

let counter = Arc::new(Mutex::new(0u64));
{
    let mut value = counter.lock().expect("counter lock");
    *value += 1;
}`
                }
              ],
              references: ["tokio-rs/tokio", "rust-lang/rust"]
            },
            {
              id: "async-tokio-channels",
              title: { zh: "Tokio、任务与 channel", en: "Tokio, tasks, and channels" },
              goals: {
                zh: ["理解 async Rust 是状态机，不是自动创建线程。", "用 channel 表达任务之间的拥有权转移。"],
                en: ["Understand async Rust as state machines, not automatic thread creation.", "Use channels to express ownership transfer between tasks."]
              },
              syntax: {
                zh: ["`async fn` 返回 future，只有被 runtime poll 时才执行。Tokio 提供 runtime、任务、timer、IO 和 channel。", "`tokio::spawn` 要求 future 通常是 `Send + 'static`，因为任务可能在线程间调度。"],
                en: ["An `async fn` returns a future and runs only when polled by a runtime. Tokio provides the runtime, tasks, timers, IO, and channels.", "`tokio::spawn` usually requires futures to be `Send + 'static` because tasks may be scheduled across threads."]
              },
              engineering: {
                zh: ["工程中要明确 runtime 边界：库函数优先暴露 async API，不要悄悄创建全局 runtime。服务内部用 bounded channel 形成背压。", "取消不是异常；future 被 drop 就停止推进，因此清理逻辑要放在明确的 owner 或 guard 中。"],
                en: ["In projects, make runtime boundaries explicit: libraries should expose async APIs instead of secretly creating global runtimes. Bounded channels provide backpressure inside services.", "Cancellation is not an exception; a dropped future stops making progress, so cleanup should live in explicit owners or guards."]
              },
              cppComparison: {
                zh: ["C++ coroutine 也会编译成状态机，但生态中 runtime 选择更分散。Rust async 的难点在生命周期和 `Send` 约束，收益是类型系统能约束任务边界。"],
                en: ["C++ coroutines also compile to state machines, but runtime choices are more fragmented. Rust async is difficult around lifetimes and `Send` bounds, but the type system can enforce task boundaries."]
              },
              examples: [
                {
                  title: { zh: "Rust: bounded channel 形成背压", en: "Rust: bounded channel creates backpressure" },
                  language: "rust",
                  code: `let (tx, mut rx) = tokio::sync::mpsc::channel::<Job>(128);

tokio::spawn(async move {
    while let Some(job) = rx.recv().await {
        process(job).await;
    }
});`
                }
              ],
              references: ["tokio-rs/tokio", "hyperium/hyper"]
            }
          ]
        },
        {
          id: "performance-boundaries",
          title: { zh: "性能与边界", en: "Performance and boundaries" },
          sections: [
            {
              id: "performance-allocation-zero-copy",
              title: { zh: "性能、分配与零拷贝", en: "Performance, allocation, and zero-copy" },
              goals: {
                zh: ["知道 Rust 的零成本抽象并不等于自动最快。", "学会从所有权角度减少不必要分配。"],
                en: ["Know that Rust's zero-cost abstractions do not mean automatically fastest.", "Learn to reduce unnecessary allocation from an ownership perspective."]
              },
              syntax: {
                zh: ["`&str`、`&[u8]`、迭代器和 `Cow<'a, T>` 都能帮助复用已有数据。`String`、`Vec<T>`、`Box<T>` 表示拥有堆内存。", "克隆 `Arc` 便宜但不是免费；克隆 `String` 会复制堆数据。"],
                en: ["`&str`, `&[u8]`, iterators, and `Cow<'a, T>` can reuse existing data. `String`, `Vec<T>`, and `Box<T>` own heap memory.", "Cloning an `Arc` is cheap but not free; cloning a `String` copies heap data."]
              },
              engineering: {
                zh: ["性能优化先测量，再定位分配、锁竞争、系统调用和序列化边界。公共 API 可以接受 `impl AsRef<Path>`、`&str` 或 slice，避免强迫调用者分配。", "不要为了零拷贝把生命周期扩散到所有层；在模块边界拥有数据有时更便宜也更清晰。"],
                en: ["Optimize by measuring first, then locate allocations, lock contention, syscalls, and serialization boundaries. Public APIs can accept `impl AsRef<Path>`, `&str`, or slices to avoid forcing allocation.", "Do not spread lifetimes everywhere just for zero-copy; owning data at module boundaries can be cheaper and clearer overall."]
              },
              cppComparison: {
                zh: ["C++ 的 `string_view` 和 span 与 Rust 借用类似，但 Rust 会检查它们不能超过被借用数据。性能写法因此更受约束，也更安全。"],
                en: ["C++ `string_view` and span resemble Rust borrows, but Rust checks that they cannot outlive the borrowed data. Performance-oriented code is more constrained and safer."]
              },
              examples: [
                {
                  title: { zh: "Rust: 避免强迫分配", en: "Rust: avoid forced allocation" },
                  language: "rust",
                  code: `fn has_prefix(line: &str, prefix: &str) -> bool {
    line.trim_start().starts_with(prefix)
}`
                }
              ],
              references: ["BurntSushi/ripgrep", "serde-rs/serde", "rust-lang/rust-analyzer"]
            },
            {
              id: "unsafe-ffi-isolation",
              title: { zh: "unsafe 与 C/C++ FFI 隔离", en: "Unsafe and C/C++ FFI isolation" },
              goals: {
                zh: ["理解 `unsafe` 是局部放宽编译器检查，不是关闭所有安全。", "知道 FFI 边界应该被安全 API 包起来。"],
                en: ["Understand `unsafe` as a local relaxation of compiler checks, not a full safety shutdown.", "Know that FFI boundaries should be wrapped in safe APIs."]
              },
              syntax: {
                zh: ["`unsafe` 允许解引用裸指针、调用 unsafe 函数、访问可变静态变量、实现 unsafe trait。调用点必须维护该 API 的 safety contract。", "`extern \"C\"` 声明 C ABI，跨边界传递的数据布局要用 `#[repr(C)]` 明确。"],
                en: ["`unsafe` allows raw pointer dereference, calling unsafe functions, accessing mutable statics, and implementing unsafe traits. The call site must uphold the API's safety contract.", "`extern \"C\"` declares the C ABI, and cross-boundary data layout should be made explicit with `#[repr(C)]`."]
              },
              engineering: {
                zh: ["把 unsafe 压到小模块里，给外部暴露安全函数，并在注释或文档中写清楚不变量。FFI 层负责转换错误码、空指针和所有权规则。", "安全封装的目标是让业务层完全不需要写 unsafe。"],
                en: ["Keep unsafe code in small modules, expose safe functions, and document invariants. FFI layers should convert error codes, null pointers, and ownership rules.", "The goal of a safe wrapper is that business code never needs to write unsafe."]
              },
              cppComparison: {
                zh: ["C++ 默认允许指针和生命周期错误，靠工具和规范控制。Rust 默认禁止这些操作，需要在 unsafe 块中显式承担证明责任。"],
                en: ["C++ permits pointer and lifetime mistakes by default and relies on tools and discipline. Rust forbids those operations by default and makes unsafe code explicitly carry the proof burden."]
              },
              examples: [
                {
                  title: { zh: "Rust: FFI 数据布局", en: "Rust: FFI data layout" },
                  language: "rust",
                  code: `#[repr(C)]
pub struct CPoint {
    pub x: f64,
    pub y: f64,
}

extern "C" {
    fn distance(point: CPoint) -> f64;
}`
                }
              ],
              references: ["rust-lang/rust", "rustls/rustls", "tauri-apps/tauri"]
            }
          ]
        },
        {
          id: "operations",
          title: { zh: "调试、封装与交付", en: "Debugging, encapsulation, and delivery" },
          sections: [
            {
              id: "debugging-tracing-testing",
              title: { zh: "调试、tracing 与测试", en: "Debugging, tracing, and testing" },
              goals: {
                zh: ["用结构化日志理解异步和并发流程。", "区分单元测试、集成测试和文档测试。"],
                en: ["Use structured logs to understand async and concurrent flows.", "Distinguish unit tests, integration tests, and documentation tests."]
              },
              syntax: {
                zh: ["`#[test]` 标记单元测试，`tests\\` 目录放集成测试，文档注释中的代码块可以成为 doc test。`Debug` 和 `Display` 分别面向开发者和用户。", "`tracing` 的 span 能把一次请求、任务或操作的上下文串起来。"],
                en: ["`#[test]` marks unit tests, the `tests\\` directory stores integration tests, and code blocks in docs can become doc tests. `Debug` is for developers, while `Display` is for users.", "`tracing` spans connect context for a request, task, or operation."]
              },
              engineering: {
                zh: ["调试不是只在失败后打印变量；工程化做法是在边界处记录输入摘要、决策点和错误上下文。", "测试应该覆盖状态机分支、错误路径和 public API 示例，而不是只测试 happy path。"],
                en: ["Debugging is not just printing variables after failure; engineering practice records input summaries, decision points, and error context at boundaries.", "Tests should cover state-machine branches, error paths, and public API examples, not only happy paths."]
              },
              cppComparison: {
                zh: ["C++ 项目常依赖 gdb/lldb、日志和断言。Rust 同样使用这些工具，但 `Result`、类型状态和穷尽匹配能把很多错误提前到测试之前。"],
                en: ["C++ projects often rely on gdb/lldb, logs, and assertions. Rust uses the same tools, but `Result`, type states, and exhaustive matching move many errors before testing."]
              },
              examples: [
                {
                  title: { zh: "Rust: 给错误补上下文", en: "Rust: add context to errors" },
                  language: "rust",
                  code: `fn load_config(path: &std::path::Path) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
}`
                }
              ],
              references: ["tokio-rs/tokio", "rust-lang/cargo", "rustls/rustls"]
            },
            {
              id: "packaging-ci-release",
              title: { zh: "打包、CI 与发布", en: "Packaging, CI, and release" },
              goals: {
                zh: ["理解 release profile、feature matrix 和示例的重要性。", "把交付流程当作工程设计的一部分。"],
                en: ["Understand the importance of release profiles, feature matrices, and examples.", "Treat delivery workflow as part of engineering design."]
              },
              syntax: {
                zh: ["Cargo profile 控制优化级别、debug 信息和 LTO。`cargo test`、`cargo clippy`、`cargo fmt`、`cargo doc` 通常构成基础质量门。", "examples 目录可放可运行示例，benches 可放基准测试入口。"],
                en: ["Cargo profiles control optimization level, debug info, and LTO. `cargo test`, `cargo clippy`, `cargo fmt`, and `cargo doc` often form the basic quality gate.", "The examples directory can hold runnable examples, and benches can hold benchmark entry points."]
              },
              engineering: {
                zh: ["CI 应覆盖默认 feature 和关键 feature 组合；发布前应检查 README、示例、变更日志和最小支持 Rust 版本。", "命令行工具要关注退出码、stderr/stdout 分离和配置优先级，这些细节决定可脚本化程度。"],
                en: ["CI should cover default features and important feature combinations. Before release, check README, examples, changelog, and minimum supported Rust version.", "CLI tools should care about exit codes, stderr/stdout separation, and configuration precedence because those details determine scriptability."]
              },
              cppComparison: {
                zh: ["C++ 交付经常被平台 ABI、编译器版本和系统依赖影响。Rust 的静态链接和 Cargo 生态简化了很多路径，但 feature 组合和 target matrix 仍需要严肃管理。"],
                en: ["C++ delivery is often affected by platform ABI, compiler versions, and system dependencies. Rust's static linking and Cargo ecosystem simplify many paths, but feature combinations and target matrices still need careful management."]
              },
              examples: [
                {
                  title: { zh: "Cargo release profile", en: "Cargo release profile" },
                  language: "toml",
                  code: `[profile.release]
opt-level = 3
lto = "thin"
codegen-units = 1`
                }
              ],
              references: ["BurntSushi/ripgrep", "clap-rs/clap", "tauri-apps/tauri"]
            }
          ]
        }
      ]
    }
  ]
};
