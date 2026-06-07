(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
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
                ["core crate 定义领域模型和 trait，server crate 负责运行时和 HTTP，adapter crate 负责存储。", "使用有容量上限的 channel 做后台任务，用 tracing 串联请求上下文。"],
                ["The core crate defines domain and traits, the server crate owns runtime and HTTP, and adapter crates own storage.", "Use bounded channels for background work and tracing for request context."]
              ],
              engineering: [
                ["综合项目应该展示如何避免运行时细节进入核心库、如何让错误带上下文、如何测试 trait 抽象。", "最后再讨论性能瓶颈和 API 以后怎么演进。"],
                ["The capstone should show how to keep runtime out of core libraries, attach error context, and test trait boundaries.", "Finish with performance and API evolution discussion."]
              ],
              cppComparison: [
                ["这对应 C++ 中 library + service binary + adapter target 的工程结构；Rust 的 trait 和 Cargo 可选功能会让这些层次更明确。"],
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
        });
})();
