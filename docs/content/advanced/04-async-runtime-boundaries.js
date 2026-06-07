(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
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
                withMistakes(
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
}`),
                  [
                    {
                      title: t("错误：spawn 捕获当前函数的借用", "Wrong: spawn captures a borrow from the current function"),
                      language: "rust",
                      code: t(
                        `async fn start_log_task(payload: &str) {
    tokio::spawn(async {
        println!("{payload}");
    });
}`,
                        `async fn start_log_task(payload: &str) {
    tokio::spawn(async {
        println!("{payload}");
    });
}`
                      ),
                      error: t(
                        ["error[E0373]: async block may outlive the current function", "`tokio::spawn` 的任务可能在当前函数返回后继续运行，不能持有 `payload: &str` 这种短生命周期借用。"],
                        ["error[E0373]: async block may outlive the current function", "A `tokio::spawn` task may continue after the function returns, so it cannot hold the short-lived `payload: &str` borrow."]
                      ),
                      explanation: t(
                        ["把需要的数据变成 owned，例如 `let payload = payload.to_owned(); tokio::spawn(async move { ... })`。"],
                        ["Make the data owned, for example `let payload = payload.to_owned(); tokio::spawn(async move { ... })`."]
                      )
                    }
                  ]
                )
              ],
              references: ["tokio-rs/tokio", "hyperium/hyper"]
            })
          ]
        });
})();
