use crate::{Course, LessonSlug};

pub trait CourseStore {
    type Error;

    fn save(&self, course: Course) -> Result<(), Self::Error>;

    fn load(&self, slug: &LessonSlug) -> Result<Option<Course>, Self::Error>;
}
