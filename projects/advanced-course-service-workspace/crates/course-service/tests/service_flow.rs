use course_core::{Course, CourseStore, Lesson, LessonSlug, Tag};
use course_service::{start_index_worker, CourseService, IndexJob};

#[derive(Clone)]
struct FixtureStore(Course);

impl CourseStore for FixtureStore {
    type Error = ();

    fn save(&self, _course: Course) -> Result<(), Self::Error> {
        Ok(())
    }

    fn load(&self, slug: &LessonSlug) -> Result<Option<Course>, Self::Error> {
        Ok((self.0.slug() == slug).then_some(self.0.clone()))
    }
}

#[test]
fn service_returns_course_and_background_job() {
    let slug = LessonSlug::new("advanced").unwrap();
    let course = Course::new(
        slug.clone(),
        "Advanced Rust",
        vec![Lesson::new(
            LessonSlug::new("observability").unwrap(),
            "Observability",
            vec![Tag::new("tracing").unwrap()],
        )],
    );
    let (tx, handle) = start_index_worker(4);
    let service = CourseService::new(FixtureStore(course), tx.clone());

    let response = service.view_course("req-42", slug.clone()).unwrap();
    drop(service);
    drop(tx);
    let jobs = handle.join().unwrap();

    assert_eq!(response.course().title(), "Advanced Rust");
    assert!(matches!(
        jobs.as_slice(),
        [IndexJob::Viewed { request_id, slug: job_slug }]
            if request_id == "req-42" && job_slug == &slug
    ));
}
