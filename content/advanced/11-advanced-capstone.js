(function () {
  const { t, sharedExample, textExample, sourceTableExample, fileTreeExample, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "advanced-capstone",
          title: t("进阶综合项目", "Advanced capstone project"),
          sections: [
            lesson({
              id: "service-workspace-capstone",
              title: ["综合项目：service + library workspace", "Capstone: service + library workspace"],
              goals: [
                ["把进阶阶段工程主题整合成一个完整 workspace。", "按 crate 边界阅读领域模型、索引、存储 adapter、服务编排和 CLI 入口。"],
                ["Integrate advanced engineering topics into a complete workspace.", "Read domain models, indexing, storage adapters, service orchestration, and CLI entry points by crate boundary."]
              ],
              syntax: [
                ["这个项目放在 `projects/advanced-course-service-workspace/`，是一个多 crate workspace。`course-core` 定义领域模型和 trait；`course-index` 做索引；`course-store-memory` 是 adapter；`course-service` 组合 store、bounded channel 和后台任务；`course-cli` 是 binary composition root。"],
                ["This project lives under `projects/advanced-course-service-workspace/` and is a multi-crate workspace. `course-core` defines domain models and traits; `course-index` builds indexes; `course-store-memory` is an adapter; `course-service` composes a store, bounded channel, and background worker; `course-cli` is the binary composition root."]
              ],
              engineering: [
                ["它展示进阶 Rust 的核心工程边界：核心库不依赖运行时或 CLI，adapter 向内实现 trait，service 层负责并发边界，binary 层只组合依赖。", "完整源码在本节参考链接里的 GitHub 项目目录。"],
                ["It demonstrates advanced Rust engineering boundaries: the core library does not depend on runtime or CLI details, adapters implement inward-facing traits, the service layer owns concurrency boundaries, and the binary layer only composes dependencies.", "The full source is linked from this section's references."]
              ],
              cppComparison: [
                ["这类似 C++ 的 domain library、index library、adapter target、service target 和 binary target；Rust 用 Cargo workspace、trait 和 crate 可见性把这些边界写得更明确。"],
                ["This resembles C++ domain libraries, index libraries, adapter targets, service targets, and binary targets; Rust makes those boundaries more explicit with Cargo workspaces, traits, and crate visibility."]
              ],
              examples: [
                textExample(
                  "项目做什么",
                  "What the project does",
                  [
                    "项目模拟一个课程服务：CLI 初始化内存 store，service 根据课程 slug 加载课程，构建 tag 索引，并把浏览事件发给有容量上限的后台队列。",
                    "它没有强行引入 HTTP 或数据库；重点是把这些真实系统里会出现的边界先拆清楚。后续进阶章节可以继续把 Tokio、tracing、feature matrix 等主题接到这个结构上。"
                  ],
                  [
                    "The project simulates a course service: the CLI initializes an in-memory store, the service loads a course by slug, builds a tag index, and sends view events to a bounded background queue.",
                    "It does not force HTTP or a database into the first version; the point is to make the boundaries that real systems need visible first. Later advanced chapters can connect Tokio, tracing, feature matrices, and other topics to this structure."
                  ]
                ),
                fileTreeExample(
                  "workspace 文件目录",
                  "Workspace file tree",
                  [
                    "`Cargo.toml` 是 workspace root。每个 `crates/*` 目录是一个独立 package，有自己的 crate 边界和可测试 API。"
                  ],
                  [
                    "`Cargo.toml` is the workspace root. Each `crates/*` directory is an independent package with its own crate boundary and testable API."
                  ],
                  "projects/advanced-course-service-workspace/",
                  [
                    { depth: 0, type: "file", badge: "toml", name: "Cargo.toml", note: t("workspace root，列出所有 member crate。", "Workspace root listing all member crates.") },
                    { depth: 0, type: "dir", badge: "dir", name: "crates/", note: t("所有 package 都放在这里。", "Holds all packages.") },
                    { depth: 1, type: "dir", badge: "core", name: "course-core/", note: t("领域模型、公开 trait、sealed event。", "Domain model, public traits, sealed event.") },
                    { depth: 1, type: "dir", badge: "idx", name: "course-index/", note: t("索引构建和查询 helper。", "Index building and query helpers.") },
                    { depth: 1, type: "dir", badge: "store", name: "course-store-memory/", note: t("内存存储 adapter，实现 core trait。", "In-memory storage adapter implementing the core trait.") },
                    { depth: 1, type: "dir", badge: "svc", name: "course-service/", note: t("服务编排、bounded channel、后台 worker。", "Service orchestration, bounded channel, background worker.") },
                    { depth: 1, type: "dir", badge: "cli", name: "course-cli/", note: t("binary composition root。", "Binary composition root.") }
                  ]
                ),
                textExample(
                  "按这张表读源码",
                  "Read the source in this table order",
                  [
                    "第一次阅读按下面表格顺序走：先看 workspace 和 core API，再看 index、adapter、service，最后看 CLI 和集成测试。每行都能展开完整源码。"
                  ],
                  [
                    "On the first read, follow the table below: workspace and core APIs first, then index, adapter, service, and finally CLI plus integration tests. Each row expands the full source inline."
                  ]
                ),
                sourceTableExample(
                  "源码阅读顺序",
                  "Source reading order",
                  [t("顺序", "Order"), t("文件", "File"), t("阅读重点", "What to read for")],
                  [
                    {
                      order: 1,
                      file: "Cargo.toml",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/Cargo.toml",
                      focus: t("先看 workspace 成员如何拆分。", "Start with how workspace members are split.")
                    },
                    {
                      order: 2,
                      file: "course-core/src/lib.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-core/src/lib.rs",
                      focus: t("看公开 API、sealed event、trait 出口。", "Read public APIs, sealed event, and trait exports.")
                    },
                    {
                      order: 3,
                      file: "course-core/src/model.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-core/src/model.rs",
                      focus: t("看领域模型、newtype 和私有字段。", "Read domain models, newtypes, and private fields.")
                    },
                    {
                      order: 4,
                      file: "course-core/src/store.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-core/src/store.rs",
                      focus: t("看 `CourseStore` trait 和 associated error type。", "Read the `CourseStore` trait and associated error type.")
                    },
                    {
                      order: 5,
                      file: "course-index/src/lib.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-index/src/lib.rs",
                      focus: t("看 `BTreeMap` tag index、iterator 聚合和查询 helper。", "Read the `BTreeMap` tag index, iterator aggregation, and query helper.")
                    },
                    {
                      order: 6,
                      file: "course-store-memory/src/lib.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-store-memory/src/lib.rs",
                      focus: t("看 adapter 如何用 `Arc<RwLock<_>>` 实现 core trait。", "Read how the adapter uses `Arc<RwLock<_>>` to implement the core trait.")
                    },
                    {
                      order: 7,
                      file: "course-service/src/lib.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-service/src/lib.rs",
                      focus: t("看服务编排、bounded channel、后台 worker 和错误上下文。", "Read service orchestration, bounded channel, background worker, and error context.")
                    },
                    {
                      order: 8,
                      file: "course-cli/src/main.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-cli/src/main.rs",
                      focus: t("看 binary 如何作为 composition root 组装 store 和 service。", "Read how the binary acts as the composition root for store and service.")
                    },
                    {
                      order: 9,
                      file: "course-service/tests/service_flow.rs",
                      sourceUrl: "https://raw.githubusercontent.com/DexterDreeeam/RustCourseByAi/main/projects/advanced-course-service-workspace/crates/course-service/tests/service_flow.rs",
                      focus: t("最后看集成测试如何只通过公开 API 验证服务流程。", "Finally, read how the integration test verifies service flow through public APIs only.")
                    }
                  ]
                ),
                sharedExample("course-service: 服务组合根", "course-service: service composition root", "rust", `pub struct CourseService<S> {
    store: S,
    jobs: SyncSender<IndexJob>,
}

impl<S> CourseService<S>
where
    S: CourseStore,
{
    pub fn view_course(
        &self,
        request_id: impl Into<String>,
        slug: LessonSlug,
    ) -> Result<CourseResponse, ServiceError<S::Error>> {
        let course = self
            .store
            .load(&slug)
            .map_err(ServiceError::Store)?
            .ok_or_else(|| ServiceError::NotFound(slug.clone()))?;
        let index = build_tag_index(&course);
        let job = IndexJob::Viewed { request_id: request_id.into(), slug };
        self.jobs.try_send(job).map_err(|error| match error {
            TrySendError::Full(job) => ServiceError::QueueFull(job),
            TrySendError::Disconnected(job) => ServiceError::QueueClosed(job),
        })?;
        Ok(CourseResponse { course, index })
    }
}`)
              ],
              references: ["RustCourseByAi/projects/advanced-course-service-workspace", "rust-lang/cargo", "tokio-rs/tokio", "rust-lang/rust-analyzer"]
            })
          ]
        });
})();
