(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "testing-ci-release",
          title: t("测试策略、CI 与发布", "Testing strategy, CI, and release"),
          sections: [
            lesson({
              id: "feature-matrix-release",
              title: ["可选功能组合与发布检查", "Feature matrix and release checks"],
              goals: [
                ["理解发布前要测试的不只是默认配置。", "建立版本兼容、最低 Rust 版本、文档和示例检查清单。"],
                ["Understand that releases must test more than default paths.", "Build a semver, MSRV, docs, and examples checklist."]
              ],
              syntax: [
                ["Cargo profile 控制优化级别、调试信息和 LTO。", "CI 可以组合 `--no-default-features`、`--all-features` 和关键可选功能来测试。"],
                ["Cargo profiles control optimization, debug info, and LTO.", "CI can combine `--no-default-features`, `--all-features`, and key features."]
              ],
              engineering: [
                ["发布流程应检查 changelog、README、examples、docs、最低支持 Rust 版本和可选功能组合。", "CLI 工具还要检查退出码、stderr/stdout 和配置优先级。"],
                ["Release flow should check changelog, README, examples, docs, MSRV, and feature combinations.", "CLI tools also need exit code, stderr/stdout, and config precedence checks."]
              ],
              cppComparison: [
                ["C++ 发布常受 ABI 和平台依赖影响；Rust 简化了很多流程，但目标平台组合和可选功能组合仍然要认真管理。"],
                ["C++ releases are often constrained by ABI and platform dependencies; Rust simplifies many paths, but target and feature matrices still matter."]
              ],
              examples: [
                sharedExample("GitHub Actions: feature matrix", "GitHub Actions: feature matrix", "yaml", `strategy:
  matrix:
    features:
      - "--no-default-features"
      - "--all-features"
      - "--features json"

steps:
  - uses: actions/checkout@v4
  - uses: dtolnay/rust-toolchain@stable
  - run: cargo test --workspace \${{ matrix.features }}
  - run: cargo doc --workspace \${{ matrix.features }} --no-deps`)
              ],
              references: ["rust-lang/cargo", "BurntSushi/ripgrep"]
            })
          ]
        });
})();
