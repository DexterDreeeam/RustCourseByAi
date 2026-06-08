(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.beginner.push({
          id: "ownership-borrowing-lifetimes",
          title: t("所有权、借用与生命周期", "Ownership, borrowing, and lifetimes"),
          sections: [
            lesson({
              id: "ownership-api-design",
              title: ["用所有权设计 API", "Design APIs with ownership"],
              goals: [
                ["能根据函数签名判断资源归属。", "理解 borrow/借用：函数临时访问调用方的数据，但不拥有它。", "会选择 `T`、`&T`、`&mut T`、`&str`、`&[T]`。"],
                ["Read resource ownership from function signatures.", "Understand borrow as temporary access to caller-owned data.", "Choose between `T`, `&T`, `&mut T`, `&str`, and `&[T]`."]
              ],
              syntax: [
                ["所有权回答“这份值归谁管，谁负责释放”。借用回答“能不能临时看一下或改一下”。函数拿到借用时，所有者不变，函数不能负责释放这份数据，也不能随便把引用保存到更久的地方。", "`&T` 是共享借用：只读访问，可以同时有多个读者。适合查询、校验、格式化、计算长度；调用结束后，调用方继续拥有原值。", "`&mut T` 是可变借用：可以修改原值，但同一时间只能有一个，且不能和正在使用的 `&T` 混在一起。适合追加元素、填充缓冲区、原地更新状态。", "传 `T` 才是拿走所有权：函数可以保存、丢弃或继续转移它；调用方除非从返回值拿回所有权，否则不能再用原变量。", "`&str`、`&[T]` 是字符串和数组切片的借用视图，不拥有底层数据。API 只是读取时优先借用；需要长期保存时再转成 `String`、`Vec<T>` 等 owned 类型。", "返回 owned value 通常表示创建新资源或转移资源；返回引用表示结果依赖输入数据，需要讲清楚生命周期关系。"],
                ["Ownership answers “who controls this value and frees it”. Borrowing answers “may this function temporarily read or modify it”. When a function receives a borrow, the owner stays the same; the function does not free the data and cannot freely store the reference somewhere longer-lived.", "`&T` is a shared borrow: read-only access, with multiple readers allowed. It fits queries, validation, formatting, and length checks; after the call, the caller still owns the value.", "`&mut T` is a mutable borrow: it may modify the original value, but only one mutable borrow may exist at a time, and it cannot overlap with an actively used `&T`. It fits appending, filling buffers, and in-place state updates.", "Passing `T` is what takes ownership: the function may store, drop, or move it onward; unless ownership is returned, the caller cannot use the original variable afterward.", "`&str` and `&[T]` are borrowed views into strings and slices; they do not own the underlying data. Prefer borrowing when an API only reads data; convert to owned `String` or `Vec<T>` only when data must be stored.", "Returning an owned value usually creates or transfers a resource; returning a reference means the result depends on input data and needs a clear lifetime relationship."]
              ],
              engineering: [
                ["API 边界越清晰，调用方越少猜测谁负责释放、缓存或修改。", "如果为了通过编译到处加 `clone`，通常说明 API 边界还没想清楚。"],
                ["Clear API boundaries reduce guessing about who frees, caches, or mutates data.", "If you add `clone` everywhere to appease the compiler, the API boundary is probably unclear."]
              ],
              cppComparison: [
                ["C++ 可以通过 `const&`、`unique_ptr`、`shared_ptr` 表达意图；Rust 把普通引用也纳入检查。"],
                ["C++ expresses intent with `const&`, `unique_ptr`, and `shared_ptr`; Rust also checks ordinary references."]
              ],
              examples: [
                withMistakes(
                  localizedExample("Rust: borrow 是临时访问权限", "Rust: borrow is temporary access", "rust", `fn print_summary(title: &str, tags: &[String]) {
    println!("{title}: {} tags", tags.len());
}

fn add_tag(tags: &mut Vec<String>, tag: &str) {
    tags.push(tag.to_owned());
}

fn main() {
    let title = String::from("Rust course");
    let mut tags = vec![String::from("ownership")];

    print_summary(&title, &tags);      // 共享借用：只读，title/tags 仍归 main 所有
    add_tag(&mut tags, "borrowing");   // 可变借用：临时独占修改 tags
    print_summary(&title, &tags);      // 借用结束后还能继续使用原值
}`, `fn print_summary(title: &str, tags: &[String]) {
    println!("{title}: {} tags", tags.len());
}

fn add_tag(tags: &mut Vec<String>, tag: &str) {
    tags.push(tag.to_owned());
}

fn main() {
    let title = String::from("Rust course");
    let mut tags = vec![String::from("ownership")];

    print_summary(&title, &tags);      // shared borrow: read-only; main still owns title/tags
    add_tag(&mut tags, "borrowing");   // mutable borrow: temporary exclusive access to tags
    print_summary(&title, &tags);      // after the borrow ends, the original values are usable
}`),
                  [
                    {
                      title: t("错误：借用还在用时转移所有权", "Wrong: move ownership while a borrow is still used"),
                      language: "rust",
                      code: t(
                        `fn main() {
    let title = String::from("Rust course");
    let view = &title;        // 借用 title
    let moved = title;        // 试图把所有权 move 走
    println!("{view}");       // view 还要继续用
}`,
                        `fn main() {
    let title = String::from("Rust course");
    let view = &title;        // borrows title
    let moved = title;        // tries to move ownership away
    println!("{view}");       // view is still used
}`
                      ),
                      error: t(
                        ["error[E0505]: cannot move out of `title` because it is borrowed", "`view` 还会使用 `title` 的数据，此时不能把 `title` 的所有权转走。"],
                        ["error[E0505]: cannot move out of `title` because it is borrowed", "`view` still uses data inside `title`, so ownership of `title` cannot be moved away yet."]
                      ),
                      explanation: t(
                        ["借用不是复制。只要某个引用还活着并会被使用，原值就必须留在原处，不能被 move 到别处。"],
                        ["A borrow is not a copy. While a reference is still alive and used, the original value must stay in place and cannot be moved elsewhere."]
                      )
                    },
                    {
                      title: t("错误：没有 mut 却想做可变借用", "Wrong: mutable borrow without a mutable binding"),
                      language: "rust",
                      code: t(
                        `fn main() {
    let tags = vec![String::from("ownership")];
    add_tag(&mut tags, "borrowing");
}`,
                        `fn main() {
    let tags = vec![String::from("ownership")];
    add_tag(&mut tags, "borrowing");
}`
                      ),
                      error: t(
                        ["error[E0596]: cannot borrow `tags` as mutable, as it is not declared as mutable", "`&mut tags` 表示允许函数修改 `tags`，所以绑定本身必须写成 `let mut tags`。"],
                        ["error[E0596]: cannot borrow `tags` as mutable, as it is not declared as mutable", "`&mut tags` lets the function modify `tags`, so the binding itself must be `let mut tags`."]
                      ),
                      explanation: t(
                        ["Rust 把“是否允许修改”写在调用点：只读传 `&tags`，要改传 `&mut tags`，并且变量要声明为 `mut`。"],
                        ["Rust makes mutation explicit at the call site: pass `&tags` for read-only access, pass `&mut tags` for mutation, and declare the variable as `mut`."]
                      )
                    }
                  ]
                ),
                localizedExample("Rust: 解析后保存 owned 数据", "Rust: parse borrowed input and store owned data", "rust", `#[derive(Debug)]
struct User {
    normalized_name: String,
}

fn normalize_name(name: &str) -> String {
    name.trim().to_ascii_lowercase()
}

fn validate_name(name: &str) -> Result<(), &'static str> {
    if name.is_empty() { return Err("name must not be empty"); }
    if name.len() > 64 { return Err("name is too long"); }
    Ok(())
}

fn create_user(input: &str) -> Result<User, &'static str> {
    // input 只是借用；只有 User 需要保存时才分配 String。
    let normalized = normalize_name(input);
    validate_name(&normalized)?;
    Ok(User { normalized_name: normalized })
}`, `#[derive(Debug)]
struct User {
    normalized_name: String,
}

fn normalize_name(name: &str) -> String {
    name.trim().to_ascii_lowercase()
}

fn validate_name(name: &str) -> Result<(), &'static str> {
    if name.is_empty() { return Err("name must not be empty"); }
    if name.len() > 64 { return Err("name is too long"); }
    Ok(())
}

fn create_user(input: &str) -> Result<User, &'static str> {
    // input is borrowed; allocate String only when User must store it.
    let normalized = normalize_name(input);
    validate_name(&normalized)?;
    Ok(User { normalized_name: normalized })
}`),
                withMistakes(
                  localizedExample("Rust: 用参数类型表达资源归属", "Rust: encode ownership in parameter types", "rust", `// &str 只读访问输入；String 拿走所有权并长期保存
fn observe_len(name: &str) -> usize {
    name.trim().len()
}

#[derive(Debug)]
struct Account { name: String }

fn store_name(name: String) -> Account {
    Account { name }
}

fn main() {
    let raw = String::from("  Ada  ");
    let len = observe_len(&raw); // 借用，raw 仍归 main 所有
    let account = store_name(raw); // 把所有权交给 store_name
    println!("{len} {account:?}");
}`, `// &str only observes the input; String takes ownership to store it
fn observe_len(name: &str) -> usize {
    name.trim().len()
}

#[derive(Debug)]
struct Account { name: String }

fn store_name(name: String) -> Account {
    Account { name }
}

fn main() {
    let raw = String::from("  Ada  ");
    let len = observe_len(&raw); // borrow; raw is still owned by main
    let account = store_name(raw); // ownership moves into store_name
    println!("{len} {account:?}");
}`),
                  [
                    {
                      title: t("错误：move 之后继续使用（C++ 里 moved-from 还能用）", "Wrong: use after move (C++ leaves a usable moved-from object)"),
                      language: "rust",
                      code: t(
                        `fn main() {
    let raw = String::from("Ada");
    let account = store_name(raw); // 所有权已经 move 走
    println!("{raw}");             // 还想用 raw
}`,
                        `fn main() {
    let raw = String::from("Ada");
    let account = store_name(raw); // ownership already moved
    println!("{raw}");             // still trying to use raw
}`
                      ),
                      error: t(
                        ["error[E0382]: borrow of moved value: `raw`", "`store_name(raw)` 把 `raw` 的所有权交了出去，之后 `raw` 不能再用。"],
                        ["error[E0382]: borrow of moved value: `raw`", "`store_name(raw)` gave away ownership of `raw`, so `raw` cannot be used afterward."]
                      ),
                      explanation: t(
                        ["C++ 里 move 后对象还是个合法（但未指定）的值，可以继续访问；Rust 直接禁止 move 后使用。需要保留就传 `&raw`，或显式 `raw.clone()`。"],
                        ["In C++ a moved-from object is still a valid (unspecified) value you may touch; Rust forbids use after move. Pass `&raw` to keep it, or `raw.clone()` explicitly."]
                      )
                    },
                    {
                      title: t("错误：以为传值会自动拷贝", "Wrong: expecting pass-by-value to copy"),
                      language: "rust",
                      code: t(
                        `fn store_ids(ids: Vec<i32>) { /* ... */ }

fn main() {
    let ids = vec![1, 2, 3];
    store_ids(ids);            // 以为是拷贝
    println!("{}", ids.len()); // 还想用原来的 ids
}`,
                        `fn store_ids(ids: Vec<i32>) { /* ... */ }

fn main() {
    let ids = vec![1, 2, 3];
    store_ids(ids);            // assumed a copy
    println!("{}", ids.len()); // still using the original ids
}`
                      ),
                      error: t(
                        ["error[E0382]: borrow of moved value: `ids`", "`Vec<i32>` 没有实现 `Copy`，按值传递是 move 而不是拷贝。"],
                        ["error[E0382]: borrow of moved value: `ids`", "`Vec<i32>` is not `Copy`, so passing by value moves instead of copying."]
                      ),
                      explanation: t(
                        ["C++ 默认对类类型按值拷贝；Rust 默认 move（只有实现了 `Copy` 的简单类型才拷贝）。想让调用方保留就传 `&ids`。"],
                        ["C++ copies class types by value by default; Rust moves by default (only `Copy` types are copied). Pass `&ids` if the caller should keep it."]
                      )
                    }
                  ]
                ),
                withMistakes(
                  localizedExample("Rust: 返回 owned 还是借用？", "Rust: return owned or borrowed?", "rust", `// 借用输入、返回指向输入的 slice：返回值生命周期来自参数
fn first_word(text: &str) -> &str {
    text.split_whitespace().next().unwrap_or("")
}

// 需要新建数据时返回 owned String
fn shout(text: &str) -> String {
    text.to_uppercase()
}`, `// Borrow the input and return a slice into it: the result lifetime comes from the parameter
fn first_word(text: &str) -> &str {
    text.split_whitespace().next().unwrap_or("")
}

// Return an owned String when you build new data
fn shout(text: &str) -> String {
    text.to_uppercase()
}`),
                  [
                    {
                      title: t("错误：返回指向局部变量的引用（C++ 经典悬垂指针）", "Wrong: return a reference to a local (classic C++ dangling pointer)"),
                      language: "rust",
                      code: t(
                        `fn greeting() -> &str {
    let owned = String::from("hello");
    &owned // 返回指向局部 owned 的引用
}`,
                        `fn greeting() -> &str {
    let owned = String::from("hello");
    &owned // returning a reference into the local owned
}`
                      ),
                      error: t(
                        ["error[E0515]: cannot return reference to local variable `owned`", "`owned` 在函数结束时被释放，返回它的引用就是悬垂引用。"],
                        ["error[E0515]: cannot return reference to local variable `owned`", "`owned` is dropped at function exit, so a reference to it would dangle."]
                      ),
                      explanation: t(
                        ["C++ 里 `return &owned;`（或返回 `string_view`）能编译，运行期是未定义行为；Rust 在编译期就拦下。要么返回 owned `String`，要么让调用方传入数据再返回它的 slice。"],
                        ["C++ would compile `return &owned;` (or return a `string_view`) and invoke UB at runtime; Rust rejects it at compile time. Return an owned `String`, or take the data from the caller and return a slice into it."]
                      )
                    }
                  ]
                ),
                withMistakes(
                  localizedExample("Rust: &mut 表示独占修改", "Rust: &mut means exclusive mutation", "rust", `// &mut 独占借用：同一时间只能有一个可变借用
fn push_tag(tags: &mut Vec<String>, tag: &str) {
    if !tag.is_empty() {
        tags.push(tag.to_owned());
    }
}

fn main() {
    let mut tags = vec![String::from("rust")];
    push_tag(&mut tags, "cpp");
    println!("{tags:?}");
}`, `// &mut is an exclusive borrow: only one mutable borrow at a time
fn push_tag(tags: &mut Vec<String>, tag: &str) {
    if !tag.is_empty() {
        tags.push(tag.to_owned());
    }
}

fn main() {
    let mut tags = vec![String::from("rust")];
    push_tag(&mut tags, "cpp");
    println!("{tags:?}");
}`),
                  [
                    {
                      title: t("错误：迭代容器的同时修改它（C++ 迭代器失效）", "Wrong: mutate a container while iterating it (C++ iterator invalidation)"),
                      language: "rust",
                      code: t(
                        `fn main() {
    let mut nums = vec![1, 2, 3];
    for n in &nums {       // 不可变借用 nums
        if *n == 2 {
            nums.push(99); // 同时又想可变借用
        }
    }
}`,
                        `fn main() {
    let mut nums = vec![1, 2, 3];
    for n in &nums {       // immutable borrow of nums
        if *n == 2 {
            nums.push(99); // mutable borrow at the same time
        }
    }
}`
                      ),
                      error: t(
                        ["error[E0502]: cannot borrow `nums` as mutable because it is also borrowed as immutable", "迭代用的是 `&nums`，`push` 又需要 `&mut nums`，两者冲突。"],
                        ["error[E0502]: cannot borrow `nums` as mutable because it is also borrowed as immutable", "The loop holds `&nums` while `push` needs `&mut nums`; the two conflict."]
                      ),
                      explanation: t(
                        ["C++ 里这样写常常因迭代器失效导致崩溃或脏数据；Rust 用借用规则在编译期挡住。先收集要改的内容，循环结束后再 `push`。"],
                        ["In C++ this often crashes or corrupts data through iterator invalidation; Rust blocks it at compile time. Collect the changes first and `push` after the loop."]
                      )
                    },
                    {
                      title: t("错误：同时拿两个 &mut", "Wrong: take two &mut at once"),
                      language: "rust",
                      code: t(
                        `fn main() {
    let mut cfg = String::from("a");
    let r1 = &mut cfg;
    let r2 = &mut cfg; // 第二个可变借用
    r1.push('b');
    r2.push('c');
}`,
                        `fn main() {
    let mut cfg = String::from("a");
    let r1 = &mut cfg;
    let r2 = &mut cfg; // second mutable borrow
    r1.push('b');
    r2.push('c');
}`
                      ),
                      error: t(
                        ["error[E0499]: cannot borrow `cfg` as mutable more than once at a time", "`&mut` 是独占的，活跃期内不能再来第二个。"],
                        ["error[E0499]: cannot borrow `cfg` as mutable more than once at a time", "`&mut` is exclusive; no second one may exist while the first is active."]
                      ),
                      explanation: t(
                        ["C++ 允许多个非 const 引用同时指向一个对象，数据竞争要自己保证；Rust 用独占借用从根上排除。"],
                        ["C++ allows several non-const references to the same object and leaves data races to you; Rust rules them out with exclusive borrows."]
                      )
                    }
                  ]
                ),
                withMistakes(
                  localizedExample("Rust: &T 是只读视图", "Rust: &T is a read-only view", "rust", `// 只读借用：用于查询，不修改
fn total_len(parts: &[String]) -> usize {
    parts.iter().map(|p| p.len()).sum()
}`, `// Read-only borrow: query without mutating
fn total_len(parts: &[String]) -> usize {
    parts.iter().map(|p| p.len()).sum()
}`),
                  [
                    {
                      title: t("错误：通过共享引用修改（C++ 非 const 引用习惯）", "Wrong: mutate through a shared reference (C++ non-const reference habit)"),
                      language: "rust",
                      code: t(
                        `fn append_bang(text: &String) {
    text.push('!'); // 通过 &String 修改
}`,
                        `fn append_bang(text: &String) {
    text.push('!'); // mutating through &String
}`
                      ),
                      error: t(
                        ["error[E0596]: cannot borrow `*text` as mutable, as it is behind a `&` reference", "`&String` 是只读的，要修改必须是 `&mut String`。"],
                        ["error[E0596]: cannot borrow `*text` as mutable, as it is behind a `&` reference", "`&String` is read-only; mutation needs `&mut String`."]
                      ),
                      explanation: t(
                        ["C++ 的 `T&`（非 const）默认可改，只读要靠 `const T&` 的纪律；Rust 反过来：`&T` 默认只读，可改必须显式写 `&mut T`。"],
                        ["C++'s non-const `T&` is mutable by default and read-only relies on `const T&` discipline; Rust inverts this: `&T` is read-only and mutation must say `&mut T`."]
                      )
                    }
                  ]
                ),
                withMistakes(
                  localizedExample("Rust: 结构体借用数据要标注生命周期", "Rust: a struct borrowing data needs a lifetime", "rust", `// 解析器只借用输入，不复制；生命周期 'a 把这层依赖写进类型
struct Parser<'a> {
    input: &'a str,
    pos: usize,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Self {
        Parser { input, pos: 0 }
    }

    fn rest(&self) -> &'a str {
        &self.input[self.pos..]
    }
}`, `// The parser only borrows the input; lifetime 'a records that dependency in the type
struct Parser<'a> {
    input: &'a str,
    pos: usize,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Self {
        Parser { input, pos: 0 }
    }

    fn rest(&self) -> &'a str {
        &self.input[self.pos..]
    }
}`),
                  [
                    {
                      title: t("错误：结构体存引用却不写生命周期", "Wrong: store a reference in a struct without a lifetime"),
                      language: "rust",
                      code: t(
                        `struct Parser {
    input: &str, // 缺少生命周期标注
}`,
                        `struct Parser {
    input: &str, // missing lifetime annotation
}`
                      ),
                      error: t(
                        ["error[E0106]: missing lifetime specifier", "结构体保存引用时，必须写明这个引用依赖哪份数据，例如 `input: &'a str`。"],
                        ["error[E0106]: missing lifetime specifier", "A struct holding a reference must state which data it depends on, e.g. `input: &'a str`."]
                      ),
                      explanation: t(
                        ["C++ 里把指针/`string_view` 塞进类成员没人拦你，悬垂要自己保证；Rust 要求把生命周期写进类型，让编译器替你检查。"],
                        ["C++ lets you stash a pointer/`string_view` in a member with no checks and leaves dangling to you; Rust requires the lifetime in the type so the compiler verifies it."]
                      )
                    },
                    {
                      title: t("错误：让借用视图比数据活得更久", "Wrong: let a borrowing view outlive its data"),
                      language: "rust",
                      code: t(
                        `fn main() {
    let parser;
    {
        let input = String::from("1 2 3");
        parser = Parser::new(&input); // 借用 input
    } // input 在这里被释放
    println!("{}", parser.rest());    // parser 还在用已释放的数据
}`,
                        `fn main() {
    let parser;
    {
        let input = String::from("1 2 3");
        parser = Parser::new(&input); // borrows input
    } // input is dropped here
    println!("{}", parser.rest());    // parser still uses freed data
}`
                      ),
                      error: t(
                        ["error[E0597]: `input` does not live long enough", "`parser` 借用了 `input`，但 `input` 在内层作用域结束就释放了，`parser` 却用到更晚。"],
                        ["error[E0597]: `input` does not live long enough", "`parser` borrows `input`, but `input` is dropped at the end of the inner scope while `parser` is used later."]
                      ),
                      explanation: t(
                        ["这正是 C++ `string_view`/迭代器悬垂的场景，运行期才暴露；Rust 用生命周期在编译期发现。要么让 `input` 活得够久，要么让 `Parser` 拥有 owned `String`。"],
                        ["This is exactly the dangling `string_view`/iterator scenario in C++, surfacing only at runtime; Rust catches it at compile time via lifetimes. Keep `input` alive long enough, or make `Parser` own a `String`."]
                      )
                    }
                  ]
                ),
                localizedExample("Rust: 用类型表达所有权转移（builder 消费 self）", "Rust: encode ownership transfer in types (builder consumes self)", "rust", `// 每一步消费 self 再返回，所有权按链式流动，build 后原对象不可再用
#[derive(Default)]
struct RequestBuilder {
    url: String,
    headers: Vec<(String, String)>,
}

impl RequestBuilder {
    fn url(mut self, url: &str) -> Self {
        self.url = url.to_owned();
        self
    }

    fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.push((key.to_owned(), value.to_owned()));
        self
    }

    fn build(self) -> String {
        format!("{} ({} headers)", self.url, self.headers.len())
    }
}

fn main() {
    let req = RequestBuilder::default()
        .url("https://example.com")
        .header("accept", "application/json")
        .build();
    println!("{req}");
}`, `// Each step consumes self and returns it, so ownership flows through the chain; after build the original is gone
#[derive(Default)]
struct RequestBuilder {
    url: String,
    headers: Vec<(String, String)>,
}

impl RequestBuilder {
    fn url(mut self, url: &str) -> Self {
        self.url = url.to_owned();
        self
    }

    fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.push((key.to_owned(), value.to_owned()));
        self
    }

    fn build(self) -> String {
        format!("{} ({} headers)", self.url, self.headers.len())
    }
}

fn main() {
    let req = RequestBuilder::default()
        .url("https://example.com")
        .header("accept", "application/json")
        .build();
    println!("{req}");
}`)
              ],
              references: ["serde-rs/serde"]
            }),
            lesson({
              id: "lifetimes-in-practice",
              title: ["生命周期标注", "Lifetime annotations"],
              goals: [
                ["知道 `&'a str`、`fn f<'a>`、`'static` 分别在说什么。", "能从函数签名里看出返回值与输入的依赖关系。"],
                ["Understand what `&'a str`, `fn f<'a>`, and `'static` mean.", "Read the dependency between return values and inputs from a function signature."]
              ],
              syntax: [
                ["生命周期说的是“一个引用在多长范围内还能安全使用”。它不会让数据活得更久，只是让编译器检查：引用不能比它指向的数据活得更久。", "`'a` 不是字符串、字符或运行时变量，只是一个生命周期参数名。可以把它读成“生命周期 a”或“某个生命周期”；名字也可以写成 `'input`。", "`&'a str` 表示“这个 `str` 引用在生命周期 `'a` 内有效”。`fn first<'a>(x: &'a str, y: &'a str) -> &'a str` 里的 `<'a>` 是声明这个名字，后面的 `&'a` 是把参数和返回值绑到同一个有效期关系上。", "这类签名的意思不是返回值一定来自第一个参数，而是：返回的引用必须来自 `x` 或 `y` 这种至少能活到 `'a` 的输入，调用方不能把返回值用到输入失效之后。", "`'static` 是特殊生命周期，表示引用的数据能活到整个程序结束，例如字符串字面量。普通函数里编译器经常能自动推断生命周期，所以不一定都要手写 `<'a>`；当函数返回引用且有多个输入引用，或结构体字段保存引用时，通常就需要写清楚。"],
                ["Lifetimes describe the scope where a reference remains safe to use. They do not make data live longer; they let the compiler check that a reference never outlives the data it points at.", "`'a` is not a string, character, or runtime variable. It is a lifetime parameter name, read as \"lifetime a\" or \"some lifetime\"; longer names such as `'input` are also valid.", "`&'a str` means \"this `str` reference is valid for lifetime `'a`\". In `fn first<'a>(x: &'a str, y: &'a str) -> &'a str`, `<'a>` declares the name, and `&'a` ties the parameters and return value into the same validity relationship.", "That signature does not mean the result must be the first parameter. It means the returned reference must come from input data that is valid for `'a`, so the caller cannot use the result after the input has expired.", "`'static` is the special lifetime for data valid until the program ends, such as string literals. The compiler can infer lifetimes in many ordinary functions, so `<'a>` is not always written; it is usually needed when a function returns a reference with multiple input references, or when a struct stores references."]
              ],
              engineering: [
                ["缓存、解析器、HTTP header、少拷贝的数据视图里经常会看到生命周期。", "如果生命周期一路传到很多层，让代码很难读，可以考虑在某个模块入口把数据拷贝成 owned 类型。"],
                ["Caches, parsers, HTTP headers, and zero-copy views often involve lifetimes.", "If lifetimes spread across all layers, consider owning data at module boundaries."]
              ],
              cppComparison: [
                ["C++ `string_view` 是否悬垂主要靠调用者小心；Rust 会要求你在类型里把这层依赖关系说清楚。"],
                ["C++ `string_view` lifetime safety is a caller convention; Rust forces that relationship into types."]
              ],
              examples: [
                withMistakes(
                  localizedExample("Rust: 返回值依赖多个输入", "Rust: result depends on multiple inputs", "rust", `// 读法：'a 是“某个生命周期”的名字。
// x、y 和返回值都写成 &'a str，表示返回值依赖输入数据，
// 调用方不能让返回值比 x/y 背后的字符串活得更久。
fn first_non_empty<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.is_empty() { y } else { x }
}

fn main() {
    let owned = String::from("rust");
    let result = first_non_empty(owned.as_str(), "fallback");
    println!("{result}");
}`, `// Read this as: 'a is the name of "some lifetime".
// x, y, and the return value are all &'a str, so the result depends on input data.
// The caller cannot use the result after the strings behind x/y have expired.
fn first_non_empty<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.is_empty() { y } else { x }
}

fn main() {
    let owned = String::from("rust");
    let result = first_non_empty(owned.as_str(), "fallback");
    println!("{result}");
}`),
                  [
                    {
                      title: t("错误：多个输入引用却不说明返回值关系", "Wrong: multiple input references without an output relationship"),
                      language: "rust",
                      code: t(
                        `fn first_non_empty(x: &str, y: &str) -> &str {
    if x.is_empty() { y } else { x }
}`,
                        `fn first_non_empty(x: &str, y: &str) -> &str {
    if x.is_empty() { y } else { x }
}`
                      ),
                      error: t(
                        ["error[E0106]: missing lifetime specifier", "返回类型是借用，但签名没有说明它来自 `x` 还是 `y`，编译器不能替你猜。"],
                        ["error[E0106]: missing lifetime specifier", "The return type is borrowed, but the signature does not say whether it comes from `x` or `y`, so the compiler cannot guess."]
                      ),
                      explanation: t(
                        ["写成 `fn first_non_empty<'a>(x: &'a str, y: &'a str) -> &'a str`，就是告诉调用方：返回值依赖这两个输入中仍然有效的那一份数据。"],
                        ["Writing `fn first_non_empty<'a>(x: &'a str, y: &'a str) -> &'a str` tells callers that the result depends on input data that is still valid for `'a`."]
                      )
                    },
                    {
                      title: t("错误：返回局部变量的引用", "Wrong: return a reference to a local variable"),
                      language: "rust",
                      code: t(
                        `fn make_name<'a>() -> &'a str {
    let name = String::from("rust");
    name.as_str()
}`,
                        `fn make_name<'a>() -> &'a str {
    let name = String::from("rust");
    name.as_str()
}`
                      ),
                      error: t(
                        ["error[E0515]: cannot return value referencing local variable `name`", "`name` 在函数结束时释放，返回出去的 `&str` 会指向已经不存在的字符串。"],
                        ["error[E0515]: cannot return value referencing local variable `name`", "`name` is dropped when the function ends, so the returned `&str` would point at a string that no longer exists."]
                      ),
                      explanation: t(
                        ["生命周期标注不能延长局部变量的生命。这里应该返回 owned 的 `String`，或者返回字符串字面量这种 `&'static str`。"],
                        ["A lifetime annotation cannot extend a local variable's life. Return an owned `String`, or return a string literal as `&'static str`."]
                      )
                    }
                  ]
                ),
                withMistakes(
                  localizedExample("Rust: 返回值只依赖一个输入", "Rust: result depends on one input", "rust", `// 返回值一定是 text 的一部分，所以只需要把返回值和 text 绑在一起。
// prefix 只是用来判断，不会被返回，因此不需要写成 &'text str。
fn strip_known_prefix<'text>(text: &'text str, prefix: &str) -> &'text str {
    text.strip_prefix(prefix).unwrap_or(text)
}

fn main() {
    let line = String::from("error: disk full");
    let message = strip_known_prefix(line.as_str(), "error: ");
    println!("{message}");
}`, `// The result is always part of text, so only the result and text are tied together.
// prefix is only used for checking and is not returned, so it does not need &'text str.
fn strip_known_prefix<'text>(text: &'text str, prefix: &str) -> &'text str {
    text.strip_prefix(prefix).unwrap_or(text)
}

fn main() {
    let line = String::from("error: disk full");
    let message = strip_known_prefix(line.as_str(), "error: ");
    println!("{message}");
}`),
                  [
                    {
                      title: t("错误：签名说返回 text，却可能返回 prefix", "Wrong: the signature promises text but may return prefix"),
                      language: "rust",
                      code: t(
                        `fn bad_prefix<'text>(text: &'text str, prefix: &str) -> &'text str {
    if text.starts_with(prefix) { prefix } else { text }
}`,
                        `fn bad_prefix<'text>(text: &'text str, prefix: &str) -> &'text str {
    if text.starts_with(prefix) { prefix } else { text }
}`
                      ),
                      error: t(
                        ["error: lifetime may not live long enough", "签名承诺返回值和 `text` 一样久，但 `prefix` 有自己的生命周期，不能当作 `&'text str` 返回。"],
                        ["error: lifetime may not live long enough", "The signature promises a result valid as long as `text`, but `prefix` has its own lifetime and cannot be returned as `&'text str`."]
                      ),
                      explanation: t(
                        ["生命周期标注要和真实数据来源一致。如果可能返回 `prefix`，就不能把返回值只标成依赖 `text`。"],
                        ["Lifetime annotations must match the real data source. If the function may return `prefix`, the result cannot be annotated as depending only on `text`."]
                      )
                    }
                  ]
                ),
                localizedExample("Rust: Header 视图和默认值", "Rust: header view with fallback", "rust", `struct Header<'a> {
    name: &'a str,
    value: &'a str,
}

fn find_header<'a>(headers: &'a [Header<'a>], name: &str) -> Option<&'a str> {
    headers
        .iter()
        .find(|header| header.name.eq_ignore_ascii_case(name))
        .map(|header| header.value)
}

fn content_type_or_default<'a>(headers: &'a [Header<'a>]) -> &'a str {
    // 返回值来自 headers 或 'static 默认值，都能满足 'a。
    find_header(headers, "content-type").unwrap_or("application/octet-stream")
}`, `struct Header<'a> {
    name: &'a str,
    value: &'a str,
}

fn find_header<'a>(headers: &'a [Header<'a>], name: &str) -> Option<&'a str> {
    headers
        .iter()
        .find(|header| header.name.eq_ignore_ascii_case(name))
        .map(|header| header.value)
}

fn content_type_or_default<'a>(headers: &'a [Header<'a>]) -> &'a str {
    // The result comes from headers or a 'static fallback, both valid for 'a.
    find_header(headers, "content-type").unwrap_or("application/octet-stream")
}`)
              ],
              references: ["rust-lang/rust"]
            })
          ]
        });
})();
