(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
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
        });
})();

