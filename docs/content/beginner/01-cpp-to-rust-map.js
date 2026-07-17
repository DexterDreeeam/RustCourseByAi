(function () {
  const { t, sharedExample, localizedExample, textExample, tableExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "cpp-to-rust-map",
          title: t("从 C++ 到 Rust 的迁移地图", "Migration map from C++ to Rust"),
          sections: [
            lesson({
              id: "rust-safety-goals",
              title: ["Rust 解决的问题", "Problems Rust is designed to solve"],
              goals: [
                ["理解 Rust 为什么尽量在编译时发现问题。", "把内存安全、并发安全和不牺牲性能的抽象放在同一个目标里看。"],
                ["Understand why Rust emphasizes compile-time constraints.", "Connect memory safety, concurrency safety, and zero-cost abstraction as one goal."]
              ],
              syntax: [
                ["Rust 没有 GC，却要求每个值都有明确的拥有者；引用必须满足借用规则；`Drop` 在作用域结束时释放资源。", "`Send`、`Sync`、`Result`、`Option` 这些常见类型和 trait，都是为了把很多本来运行时才会暴露的问题提前到编译时发现。"],
                ["Rust has no GC, but each value has an owner; references must satisfy borrowing rules; `Drop` releases resources at scope end.", "`Send`, `Sync`, `Result`, and `Option` push many runtime accidents into the type system."]
              ],
              engineering: [
                ["真实工程中，Rust 的价值不是少写几行代码，而是让“谁拥有资源、错误怎么传出去、能不能跨线程”这些事情直接体现在函数签名里。", "当你设计函数签名时，其实已经在决定资源归谁、能不能跨线程、失败时交给谁处理。"],
                ["In real projects, Rust's value is not fewer lines; it is making resource lifetime, error flow, and concurrency boundaries visible in APIs.", "When you design a function signature, you are already designing ownership, thread boundaries, and failure strategy."]
              ],
              cppComparison: [
                ["C++ 也能通过 RAII、智能指针、const、工具和规范写出安全代码；Rust 的区别是把很多规范变成默认规则。"],
                ["C++ can be safe with RAII, smart pointers, const discipline, tools, and conventions; Rust makes many of those conventions default rules."]
              ],
              examples: [
                withMistakes(
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
                  ),
                  [
                    {
                      title: t("错误：move 后继续使用 request", "Wrong: use request after move"),
                      language: "rust",
                      code: t(
                        `fn handle_request(request: Request) {
    audit(&request);
    enqueue(request);

    // 错误：enqueue 已经拿走 request 的所有权。
    println!("body bytes={}", request.body.len());
}`,
                        `fn handle_request(request: Request) {
    audit(&request);
    enqueue(request);

    // Wrong: enqueue already took ownership of request.
    println!("body bytes={}", request.body.len());
}`
                      ),
                      error: t(
                        ["error[E0382]: borrow of moved value: `request`", "`enqueue(request)` 已经把 `Request` 交给队列，后面的 `request.body` 不再属于当前函数。"],
                        ["error[E0382]: borrow of moved value: `request`", "`enqueue(request)` moved the `Request` into the queue, so `request.body` no longer has a valid owner here."]
                      ),
                      explanation: t(
                        ["如果后面还要读请求，就应该在 move 之前读完，或者把 `enqueue` 的签名改成借用；但改成借用意味着队列不能拥有请求。"],
                        ["If later code still needs to read the request, read it before the move or change `enqueue` to borrow; but borrowing means the queue cannot own the request."]
                      )
                    },
                    {
                      title: t("错误：把借用传给需要所有权的函数", "Wrong: pass a borrow to a function that needs ownership"),
                      language: "rust",
                      code: t(
                        `fn handle_request(request: Request) {
    audit(&request);

    // 错误：enqueue 的参数类型是 Request，不是 &Request。
    enqueue(&request);
}`,
                        `fn handle_request(request: Request) {
    audit(&request);

    // Wrong: enqueue expects Request, not &Request.
    enqueue(&request);
}`
                      ),
                      error: t(
                        ["error[E0308]: mismatched types", "expected `Request`, found `&Request`。"],
                        ["error[E0308]: mismatched types", "expected `Request`, found `&Request`."]
                      ),
                      explanation: t(
                        ["`&Request` 只能临时看一眼请求；而 `enqueue` 的设计意思是：队列要接手这个请求，并负责它后面的生命周期。"],
                        ["`&Request` is only temporary observation; `enqueue` is designed so the queue takes over the request lifetime."]
                      )
                    }
                  ]
                )
              ],
              references: ["rust-lang/rust"]
            }),
            lesson({
              id: "drop-move-copy-clone",
              title: ["RAII、Drop、move、Copy/Clone", "RAII, Drop, move, Copy/Clone"],
              goals: [
                ["理解 Rust 的 move 默认行为。", "说明 `Clone` 到底复制了什么，以及为什么它必须显式写出来。", "知道什么时候应该显式 `clone`，什么时候不应该。"],
                ["Understand Rust's move-by-default behavior.", "Explain what `Clone` actually duplicates and why it must be written explicitly.", "Know when explicit `clone` is appropriate and when it is a smell."]
              ],
              syntax: [
                ["实现 `Copy` 的值会按位复制，源绑定继续可用；没有 `Copy` 的值按值传递时会 move，源绑定失效。", "`Clone` 的核心接口是 `fn clone(&self) -> Self`：从借用的旧值构造一个新的 owned 值。`#[derive(Clone)]` 会按字段调用 `clone`，所以 `String`/`Vec<T>` 会复制 owned buffer，`Vec<T>` 还会逐个 clone 元素；但 `Arc<T>`/`Rc<T>` 的 `clone` 只是增加引用计数并共享同一份 `T`。", "`Drop` 是确定性释放；实现了 `Drop` 的类型不能实现 `Copy`，因为隐式按位复制会让资源释放语义变得不清楚。"],
                ["A `Copy` value is bitwise copied and the source binding stays usable; a non-`Copy` value is moved when passed by value, invalidating the source binding.", "`Clone`'s core interface is `fn clone(&self) -> Self`: build a new owned value from a borrowed old one. `#[derive(Clone)]` calls `clone` field by field, so `String` / `Vec<T>` duplicate owned buffers, and `Vec<T>` also clones every element; but `Arc<T>` / `Rc<T>` clones only increment the reference count and share the same `T`.", "`Drop` is deterministic cleanup; a type that implements `Drop` cannot implement `Copy`, because implicit bitwise copying would make resource cleanup semantics unclear."]
              ],
              engineering: [
                ["工程中不要把 `clone` 当成借用错误的万能修复。先判断 API 是否真的需要拥有数据：只读就传 `&T`，需要长期保存才接收 `T` 或主动 `clone`。", "`clone` 的成本和语义由类型决定：克隆 `String`、`Vec<String>` 可能分配并复制很多数据；克隆 `Arc<Cache>` 通常只是共享缓存所有权。读代码时看到 `.clone()`，应该问“这里是在复制数据，还是在复制共享句柄？”", "资源类型可以用 `Drop` 做审计、flush、关闭文件、释放锁，但不要在 `Drop` 里隐藏复杂失败逻辑。"],
                ["Do not use `clone` as a universal fix for borrow errors. First ask whether the API truly needs ownership: pass `&T` for read-only access, and accept `T` or clone explicitly only when data must be stored longer term.", "`clone` cost and semantics are type-defined: cloning `String` or `Vec<String>` may allocate and duplicate substantial data; cloning `Arc<Cache>` usually only shares cache ownership. When reading `.clone()`, ask: is this copying data, or copying a shared handle?", "Resource types can use `Drop` for auditing, flushing, closing files, or releasing locks, but complex fallible cleanup should not be hidden there."]
              ],
              cppComparison: [
                ["C++ 拷贝构造、移动构造和析构函数都可能被很多语法位置触发；Rust 把默认按值语义拆得更明确：普通 move 不复制内部资源，`Copy` 才是隐式轻量复制，`Clone` 是显式复制或共享句柄复制，`Drop` 负责离开作用域时清理。C++ move 后对象仍存在但处于 moved-from 状态；Rust move 后绑定不可用，减少了“还能不能用”的约定负担。"],
                ["C++ copy constructors, move constructors, and destructors may be triggered by many syntax positions; Rust makes the default-by-value story more explicit: an ordinary move does not duplicate inner resources, `Copy` is the only implicit lightweight copy, `Clone` is explicit data duplication or shared-handle duplication, and `Drop` cleans up at scope exit. A moved-from C++ object still exists; a moved Rust binding is unusable, reducing convention-heavy reasoning."]
              ],
              examples: [
                textExample(
                  "先把 `move`、`Copy`、`Clone` 分开",
                  "Separate `move`, `Copy`, and `Clone` first",
                  [
                    "`move` 是所有权转移：对非 `Copy` 类型来说，Rust 只把值的控制权交给新位置，旧绑定不能再用；它不是 C++ 那种“源对象还在但 moved-from”。",
                    "`Copy` 是类型承诺“按位复制就是完整语义”，所以整数、`bool`、`char`、简单坐标结构体可以隐式复制；拥有堆内存、文件句柄、锁、socket 的类型通常不能 `Copy`。",
                    "`Clone` 是类型作者定义的显式复制语义。派生 `Clone` 时，编译器生成的代码等价于逐字段调用 `.clone()`；因此内部数据是否也复制，取决于内部字段自己的 `Clone` 实现。"
                  ],
                  [
                    "`move` transfers ownership: for non-`Copy` types, Rust gives control of the value to the new place and makes the old binding unusable; this is not the C++ model where the source object remains in a moved-from state.",
                    "`Copy` is a type's promise that bitwise copying is the whole semantic story, so integers, `bool`, `char`, and simple coordinate structs can be copied implicitly; heap owners, file handles, locks, and sockets usually cannot be `Copy`.",
                    "`Clone` is explicit duplication semantics defined by the type author. When `Clone` is derived, the generated code is equivalent to calling `.clone()` on every field; therefore whether inner data is duplicated depends on each inner field's own `Clone` implementation."
                  ]
                ),
                tableExample(
                  "`clone` 会复制内部数据吗？",
                  "Does `clone` duplicate inner data?",
                  [
                    t("类型", "Type"),
                    t("`clone` 的典型行为", "Typical `clone` behavior"),
                    t("工程含义", "Engineering meaning")
                  ],
                  [
                    [t("`String`", "`String`"), t("分配新的字符串 buffer，并复制字节。", "Allocates a new string buffer and copies bytes."), t("新旧 `String` 互不影响；成本和长度相关。", "Old and new `String` values are independent; cost scales with length.")],
                    [t("`Vec<T>`", "`Vec<T>`"), t("分配新的 vector buffer，并逐个 `clone` 元素。", "Allocates a new vector buffer and clones elements one by one."), t("如果 `T` 很大或元素很多，成本可能很高。", "If `T` is large or there are many elements, this can be expensive.")],
                    [t("`Box<T>`", "`Box<T>`"), t("分配新的 box，并 clone 里面的 `T`。", "Allocates a new box and clones the inner `T`."), t("通常是 deep clone 到另一块堆内存。", "Usually a deep clone into another heap allocation.")],
                    [t("`Arc<T>` / `Rc<T>`", "`Arc<T>` / `Rc<T>`"), t("只复制智能指针并增加引用计数，不 clone 里面的 `T`。", "Copies only the smart pointer and increments the reference count; it does not clone the inner `T`."), t("这是共享所有权，不是独立副本。", "This is shared ownership, not an independent copy.")],
                    [t("`#[derive(Clone)] struct S { ... }`", "`#[derive(Clone)] struct S { ... }`"), t("按字段调用 `clone`。所有字段都必须实现 `Clone`。", "Calls `clone` field by field. Every field must implement `Clone`."), t("结构体整体是“混合语义”：有些字段深拷贝，有些字段共享。", "The struct as a whole has mixed semantics: some fields deep-copy, some share.")]
                  ]
                ),
                withMistakes(
                  localizedExample(
                    "Rust: clone 的成本和共享边界",
                    "Rust: clone cost and sharing boundary",
                    "rust",
                    `use std::path::PathBuf;
use std::sync::Arc;

#[derive(Debug)]
struct ArtifactCache {
    root: PathBuf,
}

#[derive(Clone, Debug)]
struct BuildPlan {
    target: String,
    flags: Vec<String>,
    cache: Arc<ArtifactCache>,
}

fn schedule(plan: BuildPlan) {
    println!(
        "schedule {} with {} flags; cache at {}",
        plan.target,
        plan.flags.len(),
        plan.cache.root.display()
    );
}

fn dry_run(plan: &BuildPlan) {
    println!("dry-run {} with {} flags", plan.target, plan.flags.len());
}

fn main() {
    let plan = BuildPlan {
        target: "x86_64-pc-windows-msvc".to_owned(),
        flags: vec!["release".to_owned(), "lto".to_owned()],
        cache: Arc::new(ArtifactCache {
            root: PathBuf::from("target/cache"),
        }),
    };

    dry_run(&plan);

    // derive(Clone) 会：
    // - clone String：复制 target 的字节
    // - clone Vec<String>：复制 Vec buffer，并 clone 每个 String
    // - clone Arc<ArtifactCache>：只增加引用计数，共享同一个 cache
    let scheduled = plan.clone();

    assert!(Arc::ptr_eq(&plan.cache, &scheduled.cache));
    schedule(scheduled);
    dry_run(&plan);
}`,
                    `use std::path::PathBuf;
use std::sync::Arc;

#[derive(Debug)]
struct ArtifactCache {
    root: PathBuf,
}

#[derive(Clone, Debug)]
struct BuildPlan {
    target: String,
    flags: Vec<String>,
    cache: Arc<ArtifactCache>,
}

fn schedule(plan: BuildPlan) {
    println!(
        "schedule {} with {} flags; cache at {}",
        plan.target,
        plan.flags.len(),
        plan.cache.root.display()
    );
}

fn dry_run(plan: &BuildPlan) {
    println!("dry-run {} with {} flags", plan.target, plan.flags.len());
}

fn main() {
    let plan = BuildPlan {
        target: "x86_64-pc-windows-msvc".to_owned(),
        flags: vec!["release".to_owned(), "lto".to_owned()],
        cache: Arc::new(ArtifactCache {
            root: PathBuf::from("target/cache"),
        }),
    };

    dry_run(&plan);

    // derive(Clone) will:
    // - clone String: copy target bytes
    // - clone Vec<String>: copy the Vec buffer and clone every String
    // - clone Arc<ArtifactCache>: increment the reference count and share one cache
    let scheduled = plan.clone();

    assert!(Arc::ptr_eq(&plan.cache, &scheduled.cache));
    schedule(scheduled);
    dry_run(&plan);
}`
                  ),
                  [
                    {
                      title: t("错误：以为 Arc::clone 会复制内部对象", "Wrong: assume Arc::clone duplicates the inner object"),
                      language: "rust",
                      code: t(
                        `use std::sync::{Arc, Mutex};

#[derive(Default)]
struct Metrics {
    count: Mutex<u64>,
}

fn main() {
    let metrics = Arc::new(Metrics::default());
    let worker_metrics = metrics.clone();

    *worker_metrics.count.lock().unwrap() += 1;

    // 这里不是两个独立 Metrics；两个 Arc 指向同一个对象。
    assert_eq!(*metrics.count.lock().unwrap(), 0);
}`,
                        `use std::sync::{Arc, Mutex};

#[derive(Default)]
struct Metrics {
    count: Mutex<u64>,
}

fn main() {
    let metrics = Arc::new(Metrics::default());
    let worker_metrics = metrics.clone();

    *worker_metrics.count.lock().unwrap() += 1;

    // These are not two independent Metrics values; both Arc handles point to one object.
    assert_eq!(*metrics.count.lock().unwrap(), 0);
}`
                      ),
                      error: t(
                        ["thread 'main' panicked: assertion `left == right` failed", "`Arc::clone` 只复制共享句柄，`Metrics` 仍然是同一个对象，所以计数已经变成 `1`。"],
                        ["thread 'main' panicked: assertion `left == right` failed", "`Arc::clone` only copies the shared handle. `Metrics` is still one object, so the count has become `1`."]
                      ),
                      explanation: t(
                        ["看到 `.clone()` 不能自动假设是 deep clone。对 `Arc<T>` / `Rc<T>`，clone 的语义是共享所有权；如果真的需要独立 `T`，需要让 `T: Clone` 并明确 clone 里面的值。"],
                        ["Do not automatically assume `.clone()` means a deep clone. For `Arc<T>` / `Rc<T>`, clone means shared ownership; if an independent `T` is required, make `T: Clone` and explicitly clone the inner value."]
                      )
                    },
                    {
                      title: t("错误：字段不是 Clone 时不能派生 Clone", "Wrong: cannot derive Clone when a field is not Clone"),
                      language: "rust",
                      code: t(
                        `use std::fs::File;

#[derive(Clone)]
struct LogSink {
    file: File,
}`,
                        `use std::fs::File;

#[derive(Clone)]
struct LogSink {
    file: File,
}`
                      ),
                      error: t(
                        ["error[E0277]: the trait bound `File: Clone` is not satisfied", "`derive(Clone)` 需要每个字段都能 clone；文件句柄复制可能失败，`File` 不提供普通 `Clone`。"],
                        ["error[E0277]: the trait bound `File: Clone` is not satisfied", "`derive(Clone)` requires every field to be cloneable; duplicating a file handle may fail, so `File` does not provide ordinary `Clone`."]
                      ),
                      explanation: t(
                        ["资源句柄的复制语义必须非常明确。对文件这种资源，通常使用显式的 fallible API，例如 `try_clone()`，并把错误返回给调用方。"],
                        ["Resource-handle duplication needs very explicit semantics. For a file, use an explicit fallible API such as `try_clone()` and return the error to the caller."]
                      )
                    }
                  ]
                )
              ],
              references: ["rust-lang/rust"]
            })
          ]
        });
})();
