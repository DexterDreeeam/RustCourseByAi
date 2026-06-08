(function () {
  const { t, sharedExample, localizedExample, tableExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "data-modeling",
          title: t("数据建模：struct、enum 与 pattern matching", "Data modeling: structs, enums, and pattern matching"),
          sections: [
            lesson({
              id: "struct-impl-newtype",
              title: ["struct、impl 与 newtype", "Structs, impl blocks, and newtypes"],
              goals: [
                ["分清 `struct`、`impl`、newtype 各自负责什么。", "知道 newtype 的构造函数在哪里，以及为什么外部不能绕过它。"],
                ["Separate the roles of `struct`, `impl`, and newtypes.", "Know where a newtype constructor lives and why callers cannot bypass it."]
              ],
              syntax: [
                ["`struct` 只定义数据形状：有哪些字段、每个字段是什么类型。字段是否 `pub` 决定外部模块能不能直接读写或直接构造。", "`impl Type { ... }` 是给这个类型放函数的地方。`fn new(...) -> Self` 或 `fn new(...) -> Result<Self, ...>` 通常就是构造函数；`&self` 是只读方法，`&mut self` 是修改方法，`self` 是消费这个值。", "newtype 是“只包一层”的结构体，例如 `pub struct CourseSlug(String);`。运行期里面还是一个 `String`，但类型层面它已经不是普通 `String`，不能随便和其他字符串参数混用。"],
                ["A `struct` defines data shape: which fields exist and what type each field has. Field visibility controls whether external modules may read/write or construct it directly.", "`impl Type { ... }` is where functions for that type live. `fn new(...) -> Self` or `fn new(...) -> Result<Self, ...>` is usually the constructor; `&self` reads, `&mut self` mutates, and `self` consumes the value.", "A newtype is a one-field wrapper such as `pub struct CourseSlug(String);`. At runtime it still contains a `String`, but at the type level it is no longer an arbitrary `String` and cannot be mixed with unrelated string parameters."]
              ],
              engineering: [
                ["字段很多时，用普通 `struct` 给字段命名；同样都是 `String`/`u64` 但业务含义不同，用 newtype 防止传错。", "newtype 的字段通常保持私有，把校验集中在 `new` 里；外部模块只拿到已经合法的领域对象。"],
                ["Use an ordinary `struct` to name many fields; use a newtype when several values share the same raw type (`String`/`u64`) but mean different things.", "Newtype fields are usually private, with validation centralized in `new`; external modules only receive valid domain objects."]
              ],
              cppComparison: [
                ["C++ 也能用强类型 typedef 或小 class 做类似封装；Rust 的私有字段和模块规则让这种做法更自然。"],
                ["C++ can build strong typedefs/classes, but Rust private fields and module visibility make this encapsulation natural."]
              ],
              examples: [
                tableExample("struct、impl、newtype 分别是什么", "What struct, impl, and newtype mean",
                  [t("概念", "Concept"), t("写在哪里", "Where it is written"), t("作用", "Role")],
                  [
                    ["`struct Lesson { ... }`", t("类型定义处", "type definition"), t("定义数据形状：字段名和字段类型", "defines data shape: field names and field types")],
                    ["`impl Lesson { ... }`", t("类型定义后面", "after the type definition"), t("定义构造函数和方法：`new`、getter、修改方法、消费方法", "defines constructors and methods: `new`, getters, mutating methods, consuming methods")],
                    ["`struct CourseSlug(String);`", t("类型定义处", "type definition"), t("newtype：给普通 `String` 加上业务含义和校验入口", "newtype: gives an ordinary `String` domain meaning and a validation entry point")]
                  ]
                ),
                withMistakes(
                  localizedExample("Rust: struct + impl + newtype 骨架", "Rust: struct + impl + newtype skeleton", "rust", `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct CourseSlug(String);

impl CourseSlug {
    pub fn new(raw: &str) -> Result<Self, &'static str> {
        let slug = raw.trim().to_ascii_lowercase();
        // 其他校验逻辑省略：这里只展示构造函数的位置。
        Ok(Self(slug))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug)]
pub struct Lesson {
    slug: CourseSlug,
    title: String,
}

impl Lesson {
    pub fn new(slug: CourseSlug, title: String) -> Self {
        Self { slug, title }
    }

    pub fn slug(&self) -> &CourseSlug {
        &self.slug
    }

    pub fn rename(&mut self, title: String) {
        self.title = title;
    }

    pub fn into_title(self) -> String {
        self.title
    }
}

fn build_lesson() -> Result<Lesson, &'static str> {
    let slug = CourseSlug::new(" ownership ")?;
    Ok(Lesson::new(slug, "Ownership".to_owned()))
}`, `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct CourseSlug(String);

impl CourseSlug {
    pub fn new(raw: &str) -> Result<Self, &'static str> {
        let slug = raw.trim().to_ascii_lowercase();
        // Other validation logic omitted: this shows where the constructor lives.
        Ok(Self(slug))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug)]
pub struct Lesson {
    slug: CourseSlug,
    title: String,
}

impl Lesson {
    pub fn new(slug: CourseSlug, title: String) -> Self {
        Self { slug, title }
    }

    pub fn slug(&self) -> &CourseSlug {
        &self.slug
    }

    pub fn rename(&mut self, title: String) {
        self.title = title;
    }

    pub fn into_title(self) -> String {
        self.title
    }
}

fn build_lesson() -> Result<Lesson, &'static str> {
    let slug = CourseSlug::new(" ownership ")?;
    Ok(Lesson::new(slug, "Ownership".to_owned()))
}`),
                  [
                    {
                      title: t("错误：把普通 String 当成 CourseSlug 传", "Wrong: pass a plain String where CourseSlug is required"),
                      language: "rust",
                      code: t(
                        `fn load_lesson(slug: CourseSlug) {
    // ...
}

fn main() {
    let raw = "ownership".to_owned();
    load_lesson(raw);
}`,
                        `fn load_lesson(slug: CourseSlug) {
    // ...
}

fn main() {
    let raw = "ownership".to_owned();
    load_lesson(raw);
}`
                      ),
                      error: t(
                        ["error[E0308]: mismatched types", "`load_lesson` 要的是 `CourseSlug`，不是任意 `String`。"],
                        ["error[E0308]: mismatched types", "`load_lesson` expects `CourseSlug`, not an arbitrary `String`."]
                      ),
                      explanation: t(
                        ["正确写法：先走构造函数 `let slug = CourseSlug::new(&raw)?;`，再传 `load_lesson(slug)`。这一步就是把普通字符串变成已经校验过的领域类型。"],
                        ["Correct fix: call the constructor first, `let slug = CourseSlug::new(&raw)?;`, then pass `load_lesson(slug)`. That step turns a plain string into a validated domain type."]
                      )
                    },
                    {
                      title: t("错误：绕过构造函数直接构造 newtype", "Wrong: bypass the constructor for a newtype"),
                      language: "rust",
                      code: t(
                        `mod course {
    pub struct CourseSlug(String);

    impl CourseSlug {
        pub fn new(raw: &str) -> Result<Self, &'static str> {
            // 校验逻辑省略
            Ok(Self(raw.to_owned()))
        }
    }
}

fn main() {
    let slug = course::CourseSlug("Not Valid!".to_owned());
}`,
                        `mod course {
    pub struct CourseSlug(String);

    impl CourseSlug {
        pub fn new(raw: &str) -> Result<Self, &'static str> {
            // validation omitted
            Ok(Self(raw.to_owned()))
        }
    }
}

fn main() {
    let slug = course::CourseSlug("Not Valid!".to_owned());
}`
                      ),
                      error: t(
                        ["error[E0603]: tuple struct constructor `CourseSlug` is private", "字段没有 `pub`，模块外无法直接调用 `CourseSlug(...)`。"],
                        ["error[E0603]: tuple struct constructor `CourseSlug` is private", "The field is not `pub`, so callers outside the module cannot call `CourseSlug(...)` directly."]
                      ),
                      explanation: t(
                        ["正确写法：`let slug = course::CourseSlug::new(\"valid-slug\")?;`。如果你把字段写成 `pub String`，外部就能绕过校验，newtype 的意义就少了一半。"],
                        ["Correct fix: `let slug = course::CourseSlug::new(\"valid-slug\")?;`. If the field were `pub String`, callers could bypass validation and the newtype would lose much of its value."]
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
