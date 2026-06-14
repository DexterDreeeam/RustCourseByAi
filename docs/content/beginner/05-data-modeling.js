(function () {
  const { t, sharedExample, localizedExample, textExample, withMistakes, lesson } = window.Course;
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
                ["`struct` 定义一个类型里有哪些字段：字段叫什么、字段类型是什么、字段是否对外公开。比如 `LessonDraft { title, body }` 表示一个草稿对象里有标题和正文。", "`impl Type { ... }` 是给这个类型写函数的地方。Rust 里没有 C++ 那种构造函数语法；字段在当前位置可见时，可以直接写 `LessonDraft { title, body }`；如果字段不 `pub`、需要校验，或者以后不想让调用方依赖字段细节，就提供 `LessonDraft::new(...)` 这样的构造入口。", "`Self` 不是另写出来的新类型名。在 `impl LessonDraft { ... }` 里面，`Self` 就等于 `LessonDraft`；在 `impl PublishedLesson { ... }` 里面，`Self` 就等于 `PublishedLesson`。所以 `-> Self` 是返回当前类型，`Self { ... }` 是构造当前普通 struct，`Self(...)` 是构造当前 tuple struct/newtype。", "`&self` 表示方法只借用当前对象，读取它的数据，并基于这些数据返回结果；`&mut self` 表示方法要借用当前对象并修改它的字段；`self` 表示方法拿走当前对象的所有权，可以把它拆开、转换成别的类型，调用后原变量不能再用。", "newtype 先看最小形式：`struct B(A);`。它表示定义一个新类型 `B`，里面只有一个字段，字段类型是 `A`。这种没有字段名、按位置放字段的 struct 叫 tuple struct；tuple struct 可以有多个字段，例如 `struct Pair(A, C);`，访问时是 `.0`、`.1`。", "但 newtype 这个说法通常特指“只有一个字段”的 tuple struct：`struct B(A);`。如果写成 `struct Pair(A, C);`，它仍然是 tuple struct，但不是通常说的 newtype，因为它不再是单纯把一个已有类型 `A` 整体包成新类型 `B`。"],
                ["A `struct` defines which fields a type has: field names, field types, and field visibility. For example, `LessonDraft { title, body }` means a draft object has a title and body.", "`impl Type { ... }` is where functions for that type live. Rust has no C++-style constructor syntax; when fields are visible at the call site, writing `LessonDraft { title, body }` is fine. If fields are not `pub`, construction needs validation, or you do not want callers to depend on field details, provide a construction entry point such as `LessonDraft::new(...)`.", "`Self` is not a separate type name you declare. Inside `impl LessonDraft { ... }`, `Self` means `LessonDraft`; inside `impl PublishedLesson { ... }`, `Self` means `PublishedLesson`. So `-> Self` returns the current type, `Self { ... }` constructs the current ordinary struct, and `Self(...)` constructs the current tuple struct/newtype.", "`&self` means the method only borrows the current object, reads its data, and returns a result based on that data; `&mut self` means it borrows the current object and changes its fields; `self` means it takes ownership of the current object, so it may dismantle or convert it and the original variable cannot be used afterward.", "Start with the smallest newtype form: `struct B(A);`. It defines a new type `B` with exactly one field, and that field has type `A`. This field-without-a-name form is a tuple struct; tuple structs can have multiple fields, such as `struct Pair(A, C);`, accessed as `.0`, `.1`.", "But the term newtype usually means a tuple struct with exactly one field: `struct B(A);`. If you write `struct Pair(A, C);`, it is still a tuple struct, but it is not what people usually mean by newtype, because it no longer wraps one existing type `A` as the whole new type `B`."]
              ],
              engineering: [
                ["字段很多、内部有多个组成部分时，用普通 `struct`。某个已有值本身就是你要表达的新业务概念时，用 newtype；它通常只有一个私有字段，状态转换或校验集中在 `new` 里。", "外部模块拿到的是已经合法的领域对象，也只能调用这个对象明确暴露的方法；防止把草稿传给公开页面只是这种类型边界带来的结果之一。"],
                ["Use an ordinary `struct` when a value has multiple components. Use a newtype when an existing value itself is the new domain concept; it usually has one private field, with state transitions or validation centralized in `new`.", "External modules receive a valid domain object and can only call the methods it explicitly exposes; preventing a draft from being passed to a public page is one consequence of that type boundary."]
              ],
              cppComparison: [
                ["C++ 里可以用 wrapper class、strong typedef，甚至继承来表达“基于 A 做出一个 B”。Rust 的 newtype 更接近 wrapper class / strong typedef，不是继承：它不自动复用 `A` 的方法，需要你在 `impl B` 里明确暴露想提供的行为。", "Rust 的字段可见性只有 `pub`（公开）和默认（私有，仅当前模块可见）两种，没有 C++ 的 `protected`。因为 Rust 没有继承，子类访问父类成员的场景不存在。如果需要让特定模块访问而不对外暴露，可以用 `pub(crate)` 或 `pub(super)` 限制可见范围。"],
                ["C++ may use wrapper classes, strong typedefs, or even inheritance to build a `B` from an `A`. Rust newtypes are closer to wrapper classes / strong typedefs, not inheritance: they do not automatically reuse `A`'s methods; you explicitly expose behavior in `impl B`.", "Rust field visibility has only two levels: `pub` (public) and the default (private to the current module). There is no `protected` like C++. Since Rust has no inheritance, there is no child-class-accesses-parent scenario. If you need restricted visibility beyond the module without full public exposure, use `pub(crate)` or `pub(super)`."]
              ],
              examples: [
                withMistakes(
                  localizedExample("Rust: struct + impl + newtype 骨架", "Rust: struct + impl + newtype skeleton", "rust", `#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct LessonDraft {
    // pub 字段：模块外可以直接读写。
    pub title: String,
    // 没有 pub 的字段：模块外不能直接访问。
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
    // pub field: outside modules can read/write directly.
    pub title: String,
    // No pub: outside modules cannot access this field.
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
                        ["正确写法：`let lesson = course::PublishedLesson::new(draft)?;`。如果把字段写成 `pub LessonDraft`，外部就能绕过发布校验，newtype 就失去保护边界。", "如果你的 newtype 只是为了语义区分（比如给 `u32` 起个别名来区分不同 ID），不需要保护边界，就可以把字段写成 `pub`：`pub struct UserId(pub u32);`。这样外部能直接 `UserId(42)` 构造和 `.0` 访问，不需要 `new` 函数。"],
                        ["Correct fix: `let lesson = course::PublishedLesson::new(draft)?;`. If the field were `pub LessonDraft`, callers could bypass publication validation and the newtype would lose its protection boundary.", "If your newtype is only for semantic distinction (e.g. giving `u32` a name to tell different IDs apart) and does not need a protection boundary, make the field `pub`: `pub struct UserId(pub u32);`. Then callers can directly write `UserId(42)` and access `.0` without a `new` function."]
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
                textExample(
                  "match 里的 `@` 绑定与 `_` 通配",
                  "`@` binding and `_` wildcard in match",
                  [
                    "`@` 是 pattern binding，写法是 `name @ pattern`：先判断右边的 pattern 是否匹配；如果匹配，就把“整个被匹配到的值”绑定到左边的变量名 `name`。所以下面示例里的 `terminal @ DownloadState::Stored { .. }` 意思是：如果当前状态是 `Stored`，不要拆字段，只把整个 `DownloadState::Stored { ... }` 取名为 `terminal`。",
                    "下面示例最后一行用了 or-pattern：`terminal @ DownloadState::Stored { .. } | terminal @ DownloadState::Failed { .. } => terminal`。它表示 `Stored` 和 `Failed` 都是终态；无论匹配到哪一个，都把整个原状态绑定成 `terminal`，然后原样返回。这里的 `terminal` 不是关键字，只是变量名，换成 `done`、`state` 也可以。`|` 两边必须绑定同名、同类型的变量，所以两边都写 `terminal @ ...`。",
                    "不用 `@` 也能写，但会啰嗦：`DownloadState::Stored { path, bytes } => DownloadState::Stored { path, bytes }`，`DownloadState::Failed { reason } => DownloadState::Failed { reason }`。`@` 的作用就是在检查具体变体的同时，保留整个值，方便直接返回或继续传给别的函数。",
                    "`_` 是通配 pattern：它匹配任何值，但什么都不绑定、直接忽略。单独作为一条 match 分支时，`_ => ...` 就是“默认分支 / 兜底分支”，处理前面没有列出的所有情况，相当于 C/C++ `switch` 里的 `default`。它也能忽略局部：`Some(_)` 表示“是 `Some`，但不关心里面的值”，而结构体里的 `..`（如 `Stored { path, .. }`）忽略其余字段。",
                    "但状态机里通常会故意不写 `_`：一旦加了兜底分支，以后新增枚举变体时 `match` 仍然能编译，编译器就不会再提醒你漏处理了新状态。所以默认分支只适合“确实有合理默认行为”的场景；想让编译器帮你查漏（像下面的 `next` 那样），就把每个变体显式写出来，不要用 `_` 兜底。"
                  ],
                  [
                    "`@` is pattern binding. The form is `name @ pattern`: Rust first checks whether the pattern on the right matches; if it does, the whole matched value is bound to the name on the left. So `terminal @ DownloadState::Stored { .. }` in the example below means: if the current state is `Stored`, do not unpack its fields; keep the whole `DownloadState::Stored { ... }` value and call it `terminal`.",
                    "The last arm in the example below uses an or-pattern: `terminal @ DownloadState::Stored { .. } | terminal @ DownloadState::Failed { .. } => terminal`. It says both `Stored` and `Failed` are terminal states; whichever one matches, bind the whole original state as `terminal` and return it unchanged. `terminal` is not a keyword, just a variable name; `done` or `state` would also work. Both sides of `|` must bind the same variable name with the same type, so both sides write `terminal @ ...`.",
                    "You can write the same logic without `@`, but it is more verbose: `DownloadState::Stored { path, bytes } => DownloadState::Stored { path, bytes }`, `DownloadState::Failed { reason } => DownloadState::Failed { reason }`. `@` lets you check a specific variant while keeping the whole value for returning or passing onward.",
                    "`_` is the wildcard pattern: it matches any value but binds nothing and simply ignores it. As a standalone match arm, `_ => ...` is the default / catch-all arm that handles every case not listed above, just like `default` in a C/C++ `switch`. It can also ignore parts: `Some(_)` means \"it is `Some`, but I don't care about the inner value,\" while `..` in a struct (such as `Stored { path, .. }`) ignores the remaining fields.",
                    "In a state machine, though, you usually leave `_` out on purpose: once a catch-all arm exists, the `match` still compiles when you add a new enum variant, so the compiler stops reminding you that a new state is unhandled. A default arm only fits cases that truly have a sensible fallback; when you want the compiler to catch omissions (like `next` below), list every variant explicitly instead of falling back to `_`."
                  ]
                ),
                sharedExample("Rust: 用 `_` 作为默认 state 分支", "Rust: use `_` as the default-state arm", "rust", `fn label(state: &DownloadState) -> &'static str {
    match state {
        DownloadState::Fetching { .. } => "downloading",
        DownloadState::Failed { .. } => "needs attention",
        // 默认 state：Queued、Stored 以及以后新增的变体都落到这里。
        _ => "idle",
    }
}`),
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
