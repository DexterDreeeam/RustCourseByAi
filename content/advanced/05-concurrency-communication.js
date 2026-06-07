(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
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
                withMistakes(
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
}`),
                  [
                    {
                      title: t("错误：持有 std::sync::MutexGuard 跨 await", "Wrong: hold std::sync::MutexGuard across await"),
                      language: "rust",
                      code: t(
                        `use std::sync::{Arc, Mutex};

async fn flush(queue: Arc<Mutex<Vec<Job>>>) {
    let mut guard = queue.lock().unwrap();
    send_batch(&guard).await;
    guard.clear();
}`,
                        `use std::sync::{Arc, Mutex};

async fn flush(queue: Arc<Mutex<Vec<Job>>>) {
    let mut guard = queue.lock().unwrap();
    send_batch(&guard).await;
    guard.clear();
}`
                      ),
                      error: t(
                        ["future cannot be sent between threads safely", "`std::sync::MutexGuard` 可能跨 `await` 保留；在多线程 runtime 中这个 future 通常不是 `Send`，也容易造成锁持有时间过长。"],
                        ["future cannot be sent between threads safely", "`std::sync::MutexGuard` may be held across `await`; on a multi-thread runtime this future is usually not `Send` and can hold the lock too long."]
                      ),
                      explanation: t(
                        ["先在同步作用域里把数据取出来，释放锁，再执行 `.await`；或者使用异步锁并仍然控制锁作用域。"],
                        ["Move data out in a synchronous scope, release the lock, then `.await`; or use an async lock while still keeping the lock scope short."]
                      )
                    }
                  ]
                )
              ],
              references: ["tokio-rs/tokio"]
            })
          ]
        });
})();
