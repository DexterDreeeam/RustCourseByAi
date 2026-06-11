(function () {
  const { t, sharedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
    id: "error-boundaries",
    title: t("错误处理与失败边界", "Error handling and failure boundaries"),
    sections: [
      lesson({
        id: "option-result-panic",
        title: ["Option、Result 与 panic 边界", "Option, Result, and panic boundaries"],
        goals: [
          ["区分 absence、recoverable failure 和 program bug。", "知道什么时候返回 `Result`，什么时候允许 `panic!`。"],
          ["Distinguish absence, recoverable failure, and program bugs.", "Know when to return `Result` and when `panic!` is acceptable."]
        ],
        syntax: [
          ["`Option<T>` 表示值可有可无（可能是 `Some(T)`，也可能是 `None`），`Result<T,E>` 表示一次操作的结果：要么 `Ok(T)` 成功带着值，要么 `Err(E)` 失败带着错误，失败以返回值交回调用方因此可恢复；`panic!` 表示不可恢复 bug，直接中止。", "`?` 是错误传播运算符：遇到 `Ok` 就取出里面的值继续执行，遇到 `Err` 就从当前函数提前返回这个错误。"],
          ["`Option<T>` means a value is optional (either `Some(T)` or `None`); `Result<T,E>` is the outcome of an operation: either `Ok(T)` carrying the success value or `Err(E)` carrying the error, and because the failure comes back as a return value the caller can recover from it; `panic!` is an unrecoverable bug that aborts.", "`?` returns early and converts errors through `From`."]
        ],
        engineering: [
          ["库代码应该把失败放进返回类型，应用入口再决定日志、提示和退出码。", "错误类型应该帮助调用者决策：重试、提示用户、跳过还是终止。"],
          ["Library code should put failures in return types; app entry points decide logs, messages, and exit codes.", "Error types should help callers decide: retry, inform the user, skip, or stop."]
        ],
        cppComparison: [
          ["C++ 项目常混用异常、错误码和 optional；Rust 让可恢复错误显式出现在函数签名中。"],
          ["C++ projects often mix exceptions, error codes, and optionals; Rust makes recoverable errors explicit in signatures."]
        ],
        examples: [
          withMistakes(
            sharedExample("Rust: 配置解析错误带上下文", "Rust: config parse errors with context", "rust", `#[derive(Debug)]
enum ConfigError {
    MissingField(&'static str),
    InvalidPort { raw: String },
}

struct Config {
    host: String,
    port: u16,
}

fn parse_config(host: Option<&str>, port: Option<&str>) -> Result<Config, ConfigError> {
    let host = host.ok_or(ConfigError::MissingField("host"))?;
    let raw_port = port.ok_or(ConfigError::MissingField("port"))?;
    let port = raw_port
        .parse::<u16>()
        .map_err(|_| ConfigError::InvalidPort { raw: raw_port.to_owned() })?;

    Ok(Config { host: host.to_owned(), port })
}`),
            [
              {
                title: t("错误：库函数里直接 unwrap 用户输入", "Wrong: unwrap user input inside library code"),
                language: "rust",
                code: t(
                  `fn parse_port(raw: &str) -> u16 {
    raw.parse::<u16>().unwrap()
}`,
                  `fn parse_port(raw: &str) -> u16 {
    raw.parse::<u16>().unwrap()
}`
                ),
                error: t(
                  ["runtime panic: called `Result::unwrap()` on an `Err` value", "用户输入 `abc` 时，库函数直接 panic，调用方无法决定重试、提示还是使用默认值。"],
                  ["runtime panic: called `Result::unwrap()` on an `Err` value", "For input `abc`, the library panics and the caller cannot choose retry, user feedback, or a default."]
                ),
                explanation: t(
                  ["解析用户输入属于可恢复失败，应返回 `Result`，让应用入口决定如何展示错误。"],
                  ["Parsing user input is a recoverable failure; return `Result` and let the application boundary format the error."]
                )
              }
            ]
          ),
          sharedExample("Rust: `?` 等价的 match 展开", "Rust: `?` expanded as match", "rust", `fn parse_port_without_question_mark(raw: &str) -> Result<u16, ConfigError> {
    let port = match raw.parse::<u16>() {
        Ok(port) => port,
        Err(_) => {
            return Err(ConfigError::InvalidPort {
                raw: raw.to_owned(),
            });
        }
    };

    Ok(port)
}

fn parse_port_with_question_mark(raw: &str) -> Result<u16, ConfigError> {
    let port = raw
        .parse::<u16>()
        .map_err(|_| ConfigError::InvalidPort { raw: raw.to_owned() })?;

    Ok(port)
}`),
          sharedExample("Rust: panic! 的正确使用场景", "Rust: when to use panic!", "rust", `// 1. 程序内部不变量被破坏：是 bug，不是可恢复失败。
fn split_even(values: &[i32]) -> (&[i32], &[i32]) {
    if values.len() % 2 != 0 {
        panic!("split_even 要求偶数长度，实际是 {}", values.len());
    }
    values.split_at(values.len() / 2)
}

// 2. 原型 / 测试里用 expect 直接终止，并附上说明。
fn load_builtin_config() -> Config {
    parse_config(Some("localhost"), Some("8080"))
        .expect("内置默认配置必须有效，否则就是编译进二进制的 bug")
}

// 3. 断言和不可达分支也会 panic。
fn checked_index(slice: &[u8], i: usize) -> u8 {
    assert!(i < slice.len(), "下标越界：{i} >= {}", slice.len());
    slice[i]
}`)
        ],
        references: ["BurntSushi/ripgrep"]
      })
    ]
  });
})();
