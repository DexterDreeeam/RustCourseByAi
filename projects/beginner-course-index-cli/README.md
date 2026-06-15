# Beginner Course Index CLI

A complete beginner Rust project for the Rust Course capstone.

It reads a small course text file, validates lesson metadata, and prints an index by tag.

## Run

```powershell
cargo run -- examples\course.txt
cargo run -- examples\course.txt --list-tags
cargo run -- examples\course.txt --tag ownership
```

## Test

```powershell
cargo test
```

## File layout

```text
src\lib.rs       public library entry point
src\main.rs      binary entry point
src\model.rs     Course, Lesson, LessonSlug, Tag
src\parser.rs    text format parsing and ParseError
src\validate.rs  course-level validation and ValidationError
src\index.rs     BTreeMap-based tag index
src\cli.rs       argument parsing, file IO, output rendering
tests\public_api.rs
examples\course.txt
```
