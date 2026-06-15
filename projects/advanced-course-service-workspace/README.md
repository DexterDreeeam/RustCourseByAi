# Advanced Course Service Workspace

A complete advanced Rust workspace for the Rust Course advanced capstone.

It demonstrates crate boundaries, public APIs, traits with associated error types, in-memory adapters, bounded background jobs, and a thin CLI composition root.

## Test

```powershell
cargo test
```

## Run

```powershell
cargo run -p course-cli -- ownership
```

## Layout

```text
crates/course-core          domain model and storage traits
crates/course-index         tag index and query helpers
crates/course-store-memory  in-memory storage adapter
crates/course-service       service orchestration and bounded jobs
crates/course-cli           binary composition root
```
