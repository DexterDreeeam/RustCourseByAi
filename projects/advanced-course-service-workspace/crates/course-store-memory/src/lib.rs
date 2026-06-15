use std::{
    collections::BTreeMap,
    sync::{Arc, RwLock},
};

use course_core::{Course, CourseStore, LessonSlug};

#[derive(Debug, Clone, Default)]
pub struct MemoryCourseStore {
    courses: Arc<RwLock<BTreeMap<LessonSlug, Course>>>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum MemoryStoreError {
    LockPoisoned,
}

impl CourseStore for MemoryCourseStore {
    type Error = MemoryStoreError;

    fn save(&self, course: Course) -> Result<(), Self::Error> {
        let mut courses = self
            .courses
            .write()
            .map_err(|_| MemoryStoreError::LockPoisoned)?;
        courses.insert(course.slug().clone(), course);
        Ok(())
    }

    fn load(&self, slug: &LessonSlug) -> Result<Option<Course>, Self::Error> {
        let courses = self
            .courses
            .read()
            .map_err(|_| MemoryStoreError::LockPoisoned)?;
        Ok(courses.get(slug).cloned())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use course_core::Lesson;

    #[test]
    fn saves_and_loads_course() {
        let store = MemoryCourseStore::default();
        let slug = LessonSlug::new("advanced").unwrap();
        let course = Course::new(slug.clone(), "Advanced Rust", Vec::<Lesson>::new());

        store.save(course).unwrap();

        assert_eq!(store.load(&slug).unwrap().unwrap().title(), "Advanced Rust");
    }
}
