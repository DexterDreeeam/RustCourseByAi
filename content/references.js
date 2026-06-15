(function () {
  const { t } = window.Course;
  window.RUST_COURSE_REFERENCES = [
    { name: "rust-lang/rust", url: "https://github.com/rust-lang/rust", lesson: t("大型 Rust 项目组织、诊断信息和安全边界。", "Large Rust project organization, diagnostics, and safety boundaries.") },
    { name: "rust-lang/cargo", url: "https://github.com/rust-lang/cargo", lesson: t("Cargo 工作流、feature、CLI 架构和集成测试。", "Cargo workflows, features, CLI architecture, and integration testing.") },
    { name: "rust-lang/rust-analyzer", url: "https://github.com/rust-lang/rust-analyzer", lesson: t("模块化架构、增量计算和性能敏感的工具设计。", "Modular architecture, incremental computation, and performance-aware tooling.") },
    { name: "tokio-rs/tokio", url: "https://github.com/tokio-rs/tokio", lesson: t("异步任务、channel、取消和运行时边界。", "Async tasks, channels, cancellation, and runtime boundaries.") },
    { name: "serde-rs/serde", url: "https://github.com/serde-rs/serde", lesson: t("trait 驱动 API、derive 宏和零拷贝序列化。", "Trait-driven APIs, derive macros, and zero-copy serialization.") },
    { name: "BurntSushi/ripgrep", url: "https://github.com/BurntSushi/ripgrep", lesson: t("CLI 体验、IO 性能、crate 拆分和实用错误处理。", "CLI ergonomics, IO performance, crate decomposition, and practical errors.") },
    { name: "hyperium/hyper", url: "https://github.com/hyperium/hyper", lesson: t("异步网络、service 抽象和协议分层。", "Async networking, service abstractions, and protocol layering.") },
    { name: "rustls/rustls", url: "https://github.com/rustls/rustls", lesson: t("安全敏感 API、封装、测试纪律和安全默认值。", "Security-sensitive APIs, encapsulation, test discipline, and safe defaults.") },
    { name: "clap-rs/clap", url: "https://github.com/clap-rs/clap", lesson: t("命令行 UX、builder/derive API 和宏的人体工学。", "Command-line UX, builder/derive APIs, and macro ergonomics.") },
    { name: "tauri-apps/tauri", url: "https://github.com/tauri-apps/tauri", lesson: t("大型 workspace、跨平台边界和命令/插件架构。", "Large workspaces, cross-platform boundaries, and command/plugin architecture.") },
    { name: "RustCourseByAi/projects/beginner-course-index-cli", url: "https://github.com/DexterDreeeam/RustCourseByAi/tree/main/projects/beginner-course-index-cli", lesson: t("本课程入门阶段的完整综合项目源码。", "Complete source code for this course's beginner capstone project.") },
    { name: "RustCourseByAi/projects/advanced-course-service-workspace", url: "https://github.com/DexterDreeeam/RustCourseByAi/tree/main/projects/advanced-course-service-workspace", lesson: t("本课程进阶阶段的完整 workspace 综合项目源码。", "Complete source code for this course's advanced workspace capstone project.") }
  ];
})();
