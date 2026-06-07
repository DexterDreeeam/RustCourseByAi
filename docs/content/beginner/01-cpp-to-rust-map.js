(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
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
                        ["error[E0382]: borrow of moved value: `request`", "`enqueue(request)` 把 `Request` 移入队列，后面的 `request.body` 已经没有有效 owner。"],
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
                        ["`&Request` 只是临时观察权；`enqueue` 的设计语义是队列接管请求并负责之后的生命周期。"],
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
        });
})();

