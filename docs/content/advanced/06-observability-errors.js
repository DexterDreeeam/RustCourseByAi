(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
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
        });
})();

