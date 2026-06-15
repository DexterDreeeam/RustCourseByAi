use std::process::ExitCode;

use course_core::{Course, CourseStore, Lesson, LessonSlug, Tag};
use course_service::{start_index_worker, CourseService};
use course_store_memory::MemoryCourseStore;

fn main() -> ExitCode {
    let slug = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "advanced".to_owned());
    match run(&slug) {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("{error}");
            ExitCode::from(1)
        }
    }
}

fn run(slug: &str) -> Result<String, String> {
    let slug = LessonSlug::new(slug).ok_or_else(|| format!("invalid slug: {slug}"))?;
    let store = MemoryCourseStore::default();
    store
        .save(seed_course())
        .map_err(|error| format!("store error: {error:?}"))?;

    let (tx, handle) = start_index_worker(8);
    let service = CourseService::new(store, tx.clone());
    let response = service
        .view_course("cli", slug)
        .map_err(|error| format!("service error: {error:?}"))?;
    drop(service);
    drop(tx);
    let jobs = handle.join().map_err(|_| "worker panicked".to_owned())?;

    Ok(format!(
        "course: {}\nlessons: {}\nbackground jobs: {}",
        response.course().title(),
        response.course().lessons().len(),
        jobs.len()
    ))
}

fn seed_course() -> Course {
    Course::new(
        LessonSlug::new("advanced").unwrap(),
        "Advanced Rust",
        vec![
            Lesson::new(
                LessonSlug::new("workspace-layering").unwrap(),
                "Workspace layering",
                vec![Tag::new("architecture").unwrap()],
            ),
            Lesson::new(
                LessonSlug::new("future-task-cancellation").unwrap(),
                "Future, task, and cancellation",
                vec![Tag::new("async").unwrap()],
            ),
        ],
    )
}
