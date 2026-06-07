(function () {
  const { t, sharedExample, localizedExample, withMistakes, lesson } = window.Course;
  window.RUST_COURSE_CHAPTERS.advanced.push({
          id: "unsafe-ffi",
          title: t("unsafe、FFI 与安全封装", "Unsafe, FFI, and safe wrappers"),
          sections: [
            lesson({
              id: "ffi-safe-wrapper",
              title: ["把 unsafe 压到小边界", "Keep unsafe behind small boundaries"],
              goals: [
                ["理解 unsafe 是局部证明责任。", "把 C ABI 包装成安全 Rust API。"],
                ["Understand unsafe as a local proof obligation.", "Wrap C ABI in safe Rust APIs."]
              ],
              syntax: [
                ["`unsafe` 允许裸指针、unsafe 函数、可变 static、unsafe trait。", "`#[repr(C)]` 固定跨 FFI 的数据布局。"],
                ["`unsafe` permits raw pointers, unsafe functions, mutable statics, and unsafe traits.", "`#[repr(C)]` fixes layout across FFI."]
              ],
              engineering: [
                ["业务层不应该到处写 unsafe；unsafe 模块负责检查 null、长度、所有权和错误码。", "safety contract 必须写在 unsafe 函数或模块文档中。"],
                ["Business code should not write unsafe everywhere; the unsafe module checks nulls, lengths, ownership, and error codes.", "Safety contracts must be documented on unsafe functions or modules."]
              ],
              cppComparison: [
                ["C++ 默认允许指针操作；Rust 默认禁止，要求在 unsafe 处集中说明不变量。"],
                ["C++ permits pointer operations by default; Rust forbids them by default and requires invariants near unsafe code."]
              ],
              examples: [
                withMistakes(
                  sharedExample("Rust: FFI 安全包装", "Rust: safe FFI wrapper", "rust", `#[repr(C)]
pub struct CBuffer {
    ptr: *const u8,
    len: usize,
}

extern "C" {
    fn checksum(buffer: CBuffer) -> u32;
}

pub fn checksum_bytes(bytes: &[u8]) -> u32 {
    let buffer = CBuffer { ptr: bytes.as_ptr(), len: bytes.len() };
    unsafe { checksum(buffer) }
}`),
                  [
                    {
                      title: t("错误：把裸指针 API 暴露给业务层", "Wrong: expose raw pointer API to business code"),
                      language: "rust",
                      code: t(
                        `pub unsafe fn checksum_raw(ptr: *const u8, len: usize) -> u32 {
    checksum(CBuffer { ptr, len })
}

fn call_from_business() {
    let value = unsafe { checksum_raw(std::ptr::null(), 128) };
    println!("{value}");
}`,
                        `pub unsafe fn checksum_raw(ptr: *const u8, len: usize) -> u32 {
    checksum(CBuffer { ptr, len })
}

fn call_from_business() {
    let value = unsafe { checksum_raw(std::ptr::null(), 128) };
    println!("{value}");
}`
                      ),
                      error: t(
                        ["undefined behavior or native crash", "`ptr` 为 null 但 `len` 是 128，C 侧如果按长度读取会解引用无效内存。"],
                        ["undefined behavior or native crash", "`ptr` is null while `len` is 128; C code reading that range will dereference invalid memory."]
                      ),
                      explanation: t(
                        ["安全包装应该接收 `&[u8]`，由 Rust 保证指针和长度匹配；业务层不应该直接拼裸指针和长度。"],
                        ["A safe wrapper should accept `&[u8]`, letting Rust keep pointer and length consistent; business code should not assemble raw pointers and lengths."]
                      )
                    }
                  ]
                )
              ],
              references: ["rust-lang/rust", "rustls/rustls"]
            })
          ]
        });
})();
