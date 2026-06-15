mod model;
mod store;

pub use model::{Course, Lesson, LessonSlug, Tag};
pub use store::CourseStore;

mod sealed {
    pub trait Sealed {}
}

pub trait CourseEvent: sealed::Sealed {
    fn name(&self) -> &'static str;
}

#[derive(Debug, Clone, Copy)]
pub struct CourseViewed;

impl sealed::Sealed for CourseViewed {}

impl CourseEvent for CourseViewed {
    fn name(&self) -> &'static str {
        "course.viewed"
    }
}
