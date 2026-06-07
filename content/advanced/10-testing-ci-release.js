(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "testing-ci-release",
          title: t("测试策略、CI 与发布", "Testing strategy, CI, and release"),
          sections: [
            lesson({
              id: "feature-matrix-release",
              title: ["feature matrix 与发布检查", "Feature matrix and release checks"],
              goals: [
                ["理解发布前要测试的不只是默认路径。", "建立 semver、MSRV、文档和示例检查清单。"],
                ["Understand that releases must test more than default paths.", "Build a semver, MSRV, docs, and examples checklist."]
              ],
              syntax: [
                ["Cargo profile 控制优化、debug info、LTO。", "CI 可以组合 `--no-default-features`、`--all-features` 和关键 feature。"],
                ["Cargo profiles control optimization, debug info, and LTO.", "CI can combine `--no-default-features`, `--all-features`, and key features."]
              ],
              engineering: [
                ["发布流程应检查 changelog、README、examples、docs、MSRV 和 feature 组合。", "CLI 工具还要检查退出码、stderr/stdout 和配置优先级。"],
                ["Release flow should check changelog, README, examples, docs, MSRV, and feature combinations.", "CLI tools also need exit code, stderr/stdout, and config precedence checks."]
              ],
              cppComparison: [
                ["C++ 发布常受 ABI 和平台依赖影响；Rust 简化了很多路径，但 target matrix 和 feature matrix 仍要管理。"],
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

