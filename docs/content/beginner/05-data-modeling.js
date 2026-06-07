(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "data-modeling",
          title: t("数据建模：struct、enum 与 pattern matching", "Data modeling: structs, enums, and pattern matching"),
          sections: [
            lesson({
              id: "struct-impl-newtype",
              title: ["struct、impl 与 newtype", "Structs, impl blocks, and newtypes"],
              goals: [
                ["用类型表达业务规则，而不是到处传裸 `String` / `u64`。", "理解方法接收者如何表达只读、可变和消耗这个值。"],
                ["Use types to express domain constraints instead of passing raw `String` / `u64` everywhere.", "Understand how method receivers express read-only, mutable, and consuming operations."]
              ],
              syntax: [
                ["`struct` 定义数据形状，`impl` 定义行为；`&self` 只读，`&mut self` 修改，`self` 消费。", "newtype 给普通值增加领域含义和校验边界。"],
                ["A `struct` defines data shape, and an `impl` defines behavior; `&self` reads, `&mut self` mutates, and `self` consumes.", "A newtype gives ordinary values domain meaning and validation boundaries."]
              ],
              engineering: [
                ["`UserId`、`Port`、`CourseSlug` 这类类型能防止参数顺序错误和非法值扩散。", "构造函数应集中校验，外部模块只拿到已经合法的领域对象。"],
                ["Types such as `UserId`, `Port`, and `CourseSlug` prevent argument order bugs and invalid values from spreading.", "Constructors should centralize validation so other modules receive valid domain objects."]
              ],
              cppComparison: [
                ["C++ 也能用强类型 typedef 或小 class 做类似封装；Rust 的私有字段和模块规则让这种做法更自然。"],
                ["C++ can build strong typedefs/classes, but Rust private fields and module visibility make this encapsulation natural."]
              ],
              examples: [
                withMistakes(
                  sharedExample("Rust: 用 newtype 封装课程 slug", "Rust: wrap course slug in a newtype", "rust", `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct CourseSlug(String);

impl CourseSlug {
    pub fn parse(raw: &str) -> Result<Self, &'static str> {
        let slug = raw.trim().to_ascii_lowercase();
        let valid = slug.chars().all(|ch| ch.is_ascii_lowercase() || ch.is_ascii_digit() || ch == '-');

        if slug.is_empty() || !valid {
            return Err("course slug must be lowercase kebab-case");
        }

        Ok(Self(slug))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}`),
                  [
                    {
                      title: t("错误：绕过构造函数直接构造 newtype", "Wrong: bypass the constructor for a newtype"),
                      language: "rust",
                      code: t(
                        `mod course {
    pub struct CourseSlug(String);
}

fn main() {
    let slug = course::CourseSlug("Not Valid!".to_owned());
}`,
                        `mod course {
    pub struct CourseSlug(String);
}

fn main() {
    let slug = course::CourseSlug("Not Valid!".to_owned());
}`
                      ),
                      error: t(
                        ["error[E0603]: tuple struct constructor `CourseSlug` is private", "字段没有 `pub`，模块外无法绕过 `parse` 校验。"],
                        ["error[E0603]: tuple struct constructor `CourseSlug` is private", "The field is not `pub`, so callers outside the module cannot bypass `parse` validation."]
                      ),
                      explanation: t(
                        ["这正是 newtype 的工程价值：非法 slug 无法从模块外被随手构造出来。"],
                        ["That is the engineering value of a newtype: invalid slugs cannot be casually constructed outside the module."]
                      )
                    }
                  ]
                )
              ],
              references: ["rustls/rustls"]
            }),
            lesson({
              id: "enum-match-state-machine",
              title: ["enum、Option 与状态机", "Enums, Option, and state machines"],
              goals: [
                ["用 enum 表达有限状态，而不是字符串或整数 tag。", "理解 `match` 的穷尽性为什么适合工程重构。"],
                ["Use enums for finite states instead of string or integer tags.", "Understand why exhaustive `match` helps refactoring."]
              ],
              syntax: [
                ["`enum` 的不同变体可以携带不同数据；`Option<T>` 是标准库提供的“有或无”。", "`match` 必须处理所有变体，`if let` 和 `let else` 适合只关心一个分支。"],
                ["Each `enum` variant can carry different data; `Option<T>` is the standard present-or-absent type.", "`match` must cover every variant, while `if let` and `let else` handle one interesting branch."]
              ],
              engineering: [
                ["任务状态、协议消息、解析结果和错误类别都适合用 enum。", "新增状态时，编译器会指出所有没处理新分支的位置。"],
                ["Task states, protocol messages, parse results, and error categories all fit enums.", "When a new state is added, the compiler points to every missing branch."]
              ],
              cppComparison: [
                ["C++17 `std::variant` 接近 Rust enum，但 Rust enum 与 `match` 是语言核心组合，使用成本更低。"],
                ["C++17 `std::variant` is close to Rust enums, but Rust enums and `match` are a core language pair with lower friction."]
              ],
              examples: [
                withMistakes(
                  sharedExample("Rust: 下载任务状态机", "Rust: download job state machine", "rust", `enum DownloadState {
    Queued { url: String },
    Fetching { url: String, retry: u8 },
    Stored { path: String, bytes: u64 },
    Failed { reason: String },
}

fn next(state: DownloadState) -> DownloadState {
    match state {
        DownloadState::Queued { url } => DownloadState::Fetching { url, retry: 0 },
        DownloadState::Fetching { url, retry } if retry < 3 => {
            DownloadState::Fetching { url, retry: retry + 1 }
        }
        DownloadState::Fetching { url, .. } => DownloadState::Failed {
            reason: format!("too many retries for {url}"),
        },
        terminal @ DownloadState::Stored { .. } | terminal @ DownloadState::Failed { .. } => terminal,
    }
}`),
                  [
                    {
                      title: t("错误：match 没覆盖所有状态", "Wrong: match does not cover every state"),
                      language: "rust",
                      code: t(
                        `fn is_done(state: DownloadState) -> bool {
    match state {
        DownloadState::Stored { .. } => true,
        DownloadState::Failed { .. } => true,
    }
}`,
                        `fn is_done(state: DownloadState) -> bool {
    match state {
        DownloadState::Stored { .. } => true,
        DownloadState::Failed { .. } => true,
    }
}`
                      ),
                      error: t(
                        ["error[E0004]: non-exhaustive patterns", "`Queued` 和 `Fetching` 没有处理；新增状态时编译器也会继续提醒。"],
                        ["error[E0004]: non-exhaustive patterns", "`Queued` and `Fetching` are not handled; the compiler will also remind you when new states are added."]
                      ),
                      explanation: t(
                        ["状态机代码不要靠默认分支掩盖遗漏；显式处理每个状态更适合维护。"],
                        ["Do not hide missing state-machine branches behind defaults; explicit states are easier to maintain."]
                      )
                    }
                  ]
                )
              ],
              references: ["rust-lang/rust-analyzer"]
            })
          ]
        });
})();
