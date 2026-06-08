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
                ["`struct` 定义一个类型里有哪些字段：字段叫什么、字段类型是什么、字段是否对外公开。比如 `LessonDraft { title, body }` 表示一个草稿对象里有标题和正文。", "`impl Type { ... }` 是给这个类型写函数的地方。Rust 没有 `constructor` 关键字；`new` 只是约定俗成的名字。只有那些“创建这个类型并返回 `Self` / `Result<Self, ...>`”的函数，才是我们口头说的构造函数；`impl` 里也可以写普通关联函数，例如 `max_title_len() -> usize`，它不构造对象。", "`&self` 表示方法只是借用当前对象来读字段或计算结果；`&mut self` 表示方法要借用当前对象并修改它的字段；`self` 表示方法拿走当前对象的所有权，可以把它拆开、转换成别的类型，调用后原变量不能再用。", "newtype 是“用一个字段包住另一个已有类型”，例如 `pub struct PublishedLesson(LessonDraft);`。它有点像继承里“把一个已有类型变成更具体的类型”的目的，但 Rust 这里不是继承：没有父子类型关系，不会自动继承内部类型的方法，也不能把 `PublishedLesson` 自动当成 `LessonDraft` 传参。"],
                ["A `struct` defines which fields a type has: field names, field types, and field visibility. For example, `LessonDraft { title, body }` means a draft object has a title and body.", "`impl Type { ... }` is where functions for that type live. Rust has no `constructor` keyword; `new` is only a convention. Only functions that create the type and return `Self` / `Result<Self, ...>` are what we informally call constructors; an `impl` can also contain ordinary associated functions such as `max_title_len() -> usize`, which do not construct an object.", "`&self` means the method only borrows the current object to read fields or compute a result; `&mut self` means it borrows the current object and changes its fields; `self` means it takes ownership of the current object, so it may dismantle or convert it and the original variable cannot be used afterward.", "A newtype wraps one existing type in a one-field struct, such as `pub struct PublishedLesson(LessonDraft);`. It is similar to inheritance only in the goal of giving an existing type a more specific identity, but it is not inheritance: there is no parent/child type relationship, methods are not inherited automatically, and `PublishedLesson` is not automatically usable as `LessonDraft`."]
              ],
              engineering: [
                ["字段很多时，用普通 `struct` 把对象说明白；状态或身份更具体时，用 newtype 包住已有类型，例如 `PublishedLesson(LessonDraft)` 表示“已经发布过的课程”，不能和普通草稿混用。", "newtype 的字段通常保持私有，把状态转换或校验集中在 `new` 里；外部模块只拿到已经合法的领域对象。"],
                ["Use an ordinary `struct` to describe an object with multiple fields; use a newtype when state or identity becomes more specific, such as `PublishedLesson(LessonDraft)` meaning a published lesson that cannot be mixed with a plain draft.", "Newtype fields are usually private, with state transitions or validation centralized in `new`; external modules only receive valid domain objects."]
              ],
              cppComparison: [
                ["C++ 里可以用 wrapper class、strong typedef，甚至继承来表达“更具体的类型”。Rust 的 newtype 更接近 wrapper class / strong typedef，不是继承：它不自动复用内部类型的方法，需要你在 `impl PublishedLesson` 里明确暴露想提供的行为。"],
                ["C++ may use wrapper classes, strong typedefs, or even inheritance for a “more specific type”. Rust newtypes are closer to wrapper classes / strong typedefs, not inheritance: they do not automatically reuse inner methods; you explicitly expose behavior in `impl PublishedLesson`."]
              ],
              examples: [
                tableExample("struct、impl、newtype 分别是什么", "What struct, impl, and newtype mean",
                  [t("概念", "Concept"), t("写在哪里", "Where it is written"), t("作用", "Role")],
                  [
                    ["`struct LessonDraft { title, body }`", t("类型定义处", "type definition"), t("说明这个类型包含哪些字段、字段叫什么、字段类型是什么", "states which fields the type contains, their names, and their types")],
                    ["`impl LessonDraft { ... }`", t("类型定义后面", "after the type definition"), t("给 `LessonDraft` 写函数：构造函数、读取当前对象的方法、修改当前对象的方法、拿走当前对象的方法", "defines functions for `LessonDraft`: constructors, methods that read the current object, mutate it, or take it by value")],
                    ["`struct PublishedLesson(LessonDraft);`", t("类型定义处", "type definition"), t("newtype：包住一个已有自定义类型，让它变成更具体的新类型；不是继承，不自动继承方法", "newtype: wraps an existing custom type into a more specific new type; not inheritance and no automatic method inheritance")]
                  ]
                ),
                withMistakes(
                  localizedExample("Rust: struct + impl + newtype 骨架", "Rust: struct + impl + newtype skeleton", "rust", `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct LessonDraft {
    title: String,
    body: String,
}

impl LessonDraft {
    pub fn new(title: String, body: String) -> Self {
        Self { title, body }
    }

    pub fn max_title_len() -> usize {
        80
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
    pub fn new(draft: LessonDraft) -> Result<Self, &'static str> {
        // ...
        Ok(Self(draft))
    }

    pub fn draft(&self) -> &LessonDraft {
        &self.0
    }
}`, `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct LessonDraft {
    title: String,
    body: String,
}

impl LessonDraft {
    pub fn new(title: String, body: String) -> Self {
        Self { title, body }
    }

    pub fn max_title_len() -> usize {
        80
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
    pub fn new(draft: LessonDraft) -> Result<Self, &'static str> {
        // ...
        Ok(Self(draft))
    }

    pub fn draft(&self) -> &LessonDraft {
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
                      title: t("错误：绕过构造函数直接构造 newtype", "Wrong: bypass the constructor for a newtype"),
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
