use std::sync::mpsc::{sync_channel, Receiver, SyncSender, TrySendError};
use std::thread::{self, JoinHandle};

use course_core::{Course, CourseStore, LessonSlug};
use course_index::{build_tag_index, TagIndex};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum IndexJob {
    Viewed {
        request_id: String,
        slug: LessonSlug,
    },
}

#[derive(Debug)]
pub enum ServiceError<E> {
    Store(E),
    NotFound(LessonSlug),
    QueueFull(IndexJob),
    QueueClosed(IndexJob),
}

#[derive(Debug, Clone)]
pub struct CourseResponse {
    course: Course,
    index: TagIndex,
}

impl CourseResponse {
    pub fn course(&self) -> &Course {
        &self.course
    }

    pub fn index(&self) -> &TagIndex {
        &self.index
    }
}

pub struct CourseService<S> {
    store: S,
    jobs: SyncSender<IndexJob>,
}

impl<S> CourseService<S>
where
    S: CourseStore,
{
    pub fn new(store: S, jobs: SyncSender<IndexJob>) -> Self {
        Self { store, jobs }
    }

    pub fn view_course(
        &self,
        request_id: impl Into<String>,
        slug: LessonSlug,
    ) -> Result<CourseResponse, ServiceError<S::Error>> {
        let course = self
            .store
            .load(&slug)
            .map_err(ServiceError::Store)?
            .ok_or_else(|| ServiceError::NotFound(slug.clone()))?;
        let index = build_tag_index(&course);
        let job = IndexJob::Viewed {
            request_id: request_id.into(),
            slug,
        };
        self.jobs.try_send(job).map_err(|error| match error {
            TrySendError::Full(job) => ServiceError::QueueFull(job),
            TrySendError::Disconnected(job) => ServiceError::QueueClosed(job),
        })?;
        Ok(CourseResponse { course, index })
    }
}

pub fn start_index_worker(capacity: usize) -> (SyncSender<IndexJob>, JoinHandle<Vec<IndexJob>>) {
    let (tx, rx) = sync_channel(capacity);
    let handle = thread::spawn(move || collect_jobs(rx));
    (tx, handle)
}

fn collect_jobs(rx: Receiver<IndexJob>) -> Vec<IndexJob> {
    rx.into_iter().collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use course_core::{Course, CourseStore, Lesson, Tag};

    #[derive(Clone)]
    struct OneCourseStore(Course);

    impl CourseStore for OneCourseStore {
        type Error = ();

        fn save(&self, _course: Course) -> Result<(), Self::Error> {
            Ok(())
        }

        fn load(&self, slug: &LessonSlug) -> Result<Option<Course>, Self::Error> {
            Ok((self.0.slug() == slug).then_some(self.0.clone()))
        }
    }

    #[test]
    fn queues_view_job_after_loading_course() {
        let slug = LessonSlug::new("advanced").unwrap();
        let course = Course::new(
            slug.clone(),
            "Advanced Rust",
            vec![Lesson::new(
                LessonSlug::new("traits").unwrap(),
                "Traits",
                vec![Tag::new("api").unwrap()],
            )],
        );
        let (tx, rx) = sync_channel(1);
        let service = CourseService::new(OneCourseStore(course), tx);

        let response = service.view_course("req-1", slug.clone()).unwrap();
        let job = rx.try_recv().unwrap();

        assert_eq!(response.course().title(), "Advanced Rust");
        assert!(matches!(job, IndexJob::Viewed { slug: s, .. } if s == slug));
    }
}
