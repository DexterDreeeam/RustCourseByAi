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
                ["分清 `struct`、`impl`、newtype 各自负责什么。", "知道 newtype 的 `new` 函数在哪里，以及为什么外部不能绕过它。"],
                ["Separate the roles of `struct`, `impl`, and newtypes.", "Know where a newtype's `new` function lives and why callers cannot bypass it."]
              ],
              syntax: [
                ["`struct` 定义一个类型里有哪些字段：字段叫什么、字段类型是什么、字段是否对外公开。比如 `LessonDraft { title, body }` 表示一个草稿对象里有标题和正文。", "`impl Type { ... }` 是给这个类型写函数的地方。Rust 里没有 C++ 那种构造函数语法；字段在当前位置可见时，可以直接写 `LessonDraft { title, body }`；如果字段不 `pub`、需要校验，或者以后不想让调用方依赖字段细节，就提供 `LessonDraft::new(...)` 这样的构造入口。", "`Self` 不是另写出来的新类型名。在 `impl LessonDraft { ... }` 里面，`Self` 就等于 `LessonDraft`；在 `impl PublishedLesson { ... }` 里面，`Self` 就等于 `PublishedLesson`。所以 `-> Self` 是返回当前类型，`Self { ... }` 是构造当前普通 struct，`Self(...)` 是构造当前 tuple struct/newtype。", "`&self` 表示方法只借用当前对象，读取它的数据，并基于这些数据返回结果；`&mut self` 表示方法要借用当前对象并修改它的字段；`self` 表示方法拿走当前对象的所有权，可以把它拆开、转换成别的类型，调用后原变量不能再用。", "newtype 先看最小形式：`struct B(A);`。它表示定义一个新类型 `B`，`B` 里面只有一个字段，这个字段的类型是 `A`。这种没有字段名、按位置放字段的 struct 叫 tuple struct；`self.0` 表示第 1 个字段，也就是里面那个 `A`。", "和 `struct B { value: A }` 相比，底层都是“`B` 里放了一个 `A`”；区别在写法和意图。`struct B(A);` 通常表示“把整个 `A` 当成一个新的类型 `B` 来管理”，让 `B` 有自己的 `new`、自己的方法、自己的 trait 实现，也不会自动继承 `A` 的方法或自动当成 `A` 传参。"],
                ["A `struct` defines which fields a type has: field names, field types, and field visibility. For example, `LessonDraft { title, body }` means a draft object has a title and body.", "`impl Type { ... }` is where functions for that type live. Rust has no C++-style constructor syntax; when fields are visible at the call site, writing `LessonDraft { title, body }` is fine. If fields are not `pub`, construction needs validation, or you do not want callers to depend on field details, provide a construction entry point such as `LessonDraft::new(...)`.", "`Self` is not a separate type name you declare. Inside `impl LessonDraft { ... }`, `Self` means `LessonDraft`; inside `impl PublishedLesson { ... }`, `Self` means `PublishedLesson`. So `-> Self` returns the current type, `Self { ... }` constructs the current ordinary struct, and `Self(...)` constructs the current tuple struct/newtype.", "`&self` means the method only borrows the current object, reads its data, and returns a result based on that data; `&mut self` means it borrows the current object and changes its fields; `self` means it takes ownership of the current object, so it may dismantle or convert it and the original variable cannot be used afterward.", "Start with the smallest newtype form: `struct B(A);`. It defines a new type `B` with exactly one field, and that field has type `A`. This field-without-a-name form is a tuple struct; `self.0` means the first field, which is the inner `A`.", "Compared with `struct B { value: A }`, both store an `A` inside `B`; the difference is style and intent. `struct B(A);` usually means “treat the whole `A` as a new type `B`”, so `B` has its own `new`, methods, and trait implementations, and it neither inherits `A`'s methods nor automatically passes as `A`."]
              ],
              engineering: [
                ["字段很多、内部有多个组成部分时，用普通 `struct`。某个已有值本身就是你要表达的新业务概念时，用 newtype；它通常只有一个私有字段，状态转换或校验集中在 `new` 里。", "外部模块拿到的是已经合法的领域对象，也只能调用这个对象明确暴露的方法；防止把草稿传给公开页面只是这种类型边界带来的结果之一。"],
                ["Use an ordinary `struct` when a value has multiple components. Use a newtype when an existing value itself is the new domain concept; it usually has one private field, with state transitions or validation centralized in `new`.", "External modules receive a valid domain object and can only call the methods it explicitly exposes; preventing a draft from being passed to a public page is one consequence of that type boundary."]
              ],
              cppComparison: [
                ["C++ 里可以用 wrapper class、strong typedef，甚至继承来表达“基于 A 做出一个 B”。Rust 的 newtype 更接近 wrapper class / strong typedef，不是继承：它不自动复用 `A` 的方法，需要你在 `impl B` 里明确暴露想提供的行为。"],
                ["C++ may use wrapper classes, strong typedefs, or even inheritance to build a `B` from an `A`. Rust newtypes are closer to wrapper classes / strong typedefs, not inheritance: they do not automatically reuse `A`'s methods; you explicitly expose behavior in `impl B`."]
              ],
              examples: [
                withMistakes(
                  localizedExample("Rust: struct + impl + newtype 骨架", "Rust: struct + impl + newtype skeleton", "rust", `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct LessonDraft {
    // 字段没有 pub：模块外不能直接写 LessonDraft { ... }。
    title: String,
    body: String,
}

impl LessonDraft {
    // 在 impl LessonDraft 里，Self 就是 LessonDraft。
    pub fn new(title: String, body: String) -> Self {
        Self { title, body }
    }

    pub fn title(&self) -> &str {
        &self.title
    }

    pub fn rename(&mut self, title: String) {
        self.title = title;
    }

    pub fn publish(self) -> Result<PublishedLesson, &'static str> {
        PublishedLesson::new(self)
    }
}

pub struct PublishedLesson(LessonDraft);

impl PublishedLesson {
    // 在 impl PublishedLesson 里，Self 就是 PublishedLesson。
    pub fn new(draft: LessonDraft) -> Result<Self, &'static str> {
        // ...
        Ok(Self(draft))
    }

    pub fn draft(&self) -> &LessonDraft {
        // PublishedLesson 是 tuple struct；self.0 是第 1 个字段。
        &self.0
    }
}`, `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct LessonDraft {
    // Fields are not pub: outside modules cannot write LessonDraft { ... } directly.
    title: String,
    body: String,
}

impl LessonDraft {
    // Inside impl LessonDraft, Self means LessonDraft.
    pub fn new(title: String, body: String) -> Self {
        Self { title, body }
    }

    pub fn title(&self) -> &str {
        &self.title
    }

    pub fn rename(&mut self, title: String) {
        self.title = title;
    }

    pub fn publish(self) -> Result<PublishedLesson, &'static str> {
        PublishedLesson::new(self)
    }
}

pub struct PublishedLesson(LessonDraft);

impl PublishedLesson {
    // Inside impl PublishedLesson, Self means PublishedLesson.
    pub fn new(draft: LessonDraft) -> Result<Self, &'static str> {
        // ...
        Ok(Self(draft))
    }

    pub fn draft(&self) -> &LessonDraft {
        // PublishedLesson is a tuple struct; self.0 is its first field.
        &self.0
    }
}`),
                  [
                    {
                      title: t("错误：把草稿当成已发布课程传", "Wrong: pass a draft where a published lesson is required"),
                      language: "rust",
                      code: t(
                        `fn show_public_page(lesson: PublishedLesson) {
    // ...
}

fn main() {
    let draft = LessonDraft::new("Ownership".to_owned(), "...".to_owned());
    show_public_page(draft);
}`,
                        `fn show_public_page(lesson: PublishedLesson) {
    // ...
}

fn main() {
    let draft = LessonDraft::new("Ownership".to_owned(), "...".to_owned());
    show_public_page(draft);
}`
                      ),
                      error: t(
                        ["error[E0308]: mismatched types", "`show_public_page` 要的是 `PublishedLesson`，不是普通 `LessonDraft`。"],
                        ["error[E0308]: mismatched types", "`show_public_page` expects `PublishedLesson`, not a plain `LessonDraft`."]
                      ),
                      explanation: t(
                        ["正确写法：先走状态转换入口 `let lesson = PublishedLesson::new(draft)?;`，再传 `show_public_page(lesson)`。这一步就是把“草稿”变成“已发布课程”。"],
                        ["Correct fix: go through the state transition entry point first, `let lesson = PublishedLesson::new(draft)?;`, then pass `show_public_page(lesson)`. That step turns a draft into a published lesson."]
                      )
                    },
                    {
                      title: t("错误：绕过 new 函数直接构造 newtype", "Wrong: bypass the `new` function for a newtype"),
                      language: "rust",
                      code: t(
                        `mod course {
    pub struct LessonDraft {
        title: String,
        body: String,
    }

    pub struct PublishedLesson(LessonDraft);

    impl PublishedLesson {
        pub fn new(draft: LessonDraft) -> Result<Self, &'static str> {
            // ...
            Ok(Self(draft))
        }
    }
}

fn publish_without_check(draft: course::LessonDraft) {
    let lesson = course::PublishedLesson(draft);
}`,
                        `mod course {
    pub struct LessonDraft {
        title: String,
        body: String,
    }

    pub struct PublishedLesson(LessonDraft);

    impl PublishedLesson {
        pub fn new(draft: LessonDraft) -> Result<Self, &'static str> {
            // ...
            Ok(Self(draft))
        }
    }
}

fn publish_without_check(draft: course::LessonDraft) {
    let lesson = course::PublishedLesson(draft);
}`
                      ),
                      error: t(
                        ["error[E0603]: tuple struct constructor `PublishedLesson` is private", "`PublishedLesson` 里面那个 `LessonDraft` 字段没有 `pub`，模块外不能直接 `PublishedLesson(draft)`。"],
                        ["error[E0603]: tuple struct constructor `PublishedLesson` is private", "The wrapped `LessonDraft` field inside `PublishedLesson` is not `pub`, so callers outside the module cannot directly write `PublishedLesson(draft)`."]
                      ),
                      explanation: t(
                        ["正确写法：`let lesson = course::PublishedLesson::new(draft)?;`。如果把字段写成 `pub LessonDraft`，外部就能绕过发布校验，newtype 就失去保护边界。"],
                        ["Correct fix: `let lesson = course::PublishedLesson::new(draft)?;`. If the field were `pub LessonDraft`, callers could bypass publication validation and the newtype would lose its protection boundary."]
                      )
                    },
                    {
                      title: t("错误：以为 newtype 会继承内部类型的方法", "Wrong: assume a newtype inherits inner methods"),
                      language: "rust",
                      code: t(
                        `fn rename_published(mut lesson: PublishedLesson) {
    lesson.rename("New title".to_owned());
}`,
                        `fn rename_published(mut lesson: PublishedLesson) {
    lesson.rename("New title".to_owned());
}`
                      ),
                      error: t(
                        ["error[E0599]: no method named `rename` found for struct `PublishedLesson`", "`rename` 是 `LessonDraft` 的方法，`PublishedLesson` 不会自动继承它。"],
                        ["error[E0599]: no method named `rename` found for struct `PublishedLesson`", "`rename` is a method on `LessonDraft`; `PublishedLesson` does not inherit it automatically."]
                      ),
                      explanation: t(
                        ["正确做法：如果发布后的课程也允许改名，就在 `impl PublishedLesson` 里明确写一个 `rename`；如果不允许，就不要暴露这个方法。这正是 newtype 和继承的区别。"],
                        ["Correct fix: if a published lesson is allowed to be renamed, explicitly write a `rename` method in `impl PublishedLesson`; if it is not allowed, do not expose that method. That is the difference between newtype and inheritance."]
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
