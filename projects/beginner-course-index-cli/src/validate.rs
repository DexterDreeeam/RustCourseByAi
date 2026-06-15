use std::collections::BTreeSet;

use crate::{Course, LessonSlug, Tag};

#[derive(Debug, PartialEq, Eq)]
pub enum ValidationError {
    EmptyTitle,
    NoLessons,
    EmptyLessonTitle { slug: LessonSlug },
    DuplicateSlug { slug: LessonSlug },
    DuplicateTagInLesson { slug: LessonSlug, tag: Tag },
}

pub fn validate_course(course: &Course) -> Result<(), ValidationError> {
    if course.title().trim().is_empty() {
        return Err(ValidationError::EmptyTitle);
    }
    if course.lessons().is_empty() {
        return Err(ValidationError::NoLessons);
    }

    let mut seen_slugs = BTreeSet::new();
    for lesson in course.lessons() {
        if lesson.title().trim().is_empty() {
            return Err(ValidationError::EmptyLessonTitle {
                slug: lesson.slug().clone(),
            });
        }

        if !seen_slugs.insert(lesson.slug().clone()) {
            return Err(ValidationError::DuplicateSlug {
                slug: lesson.slug().clone(),
            });
        }

        let mut seen_tags = BTreeSet::new();
        for tag in lesson.tags() {
            if !seen_tags.insert(tag.clone()) {
                return Err(ValidationError::DuplicateTagInLesson {
                    slug: lesson.slug().clone(),
                    tag: tag.clone(),
                });
            }
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{Course, Lesson};

    #[test]
    fn rejects_duplicate_slugs() {
        let slug = LessonSlug::new("ownership").unwrap();
        let tag = Tag::new("rust").unwrap();
        let course = Course::new(
            "Rust".to_owned(),
            vec![
                Lesson::new(slug.clone(), "One".to_owned(), vec![tag.clone()]),
                Lesson::new(slug, "Two".to_owned(), vec![tag]),
            ],
        );

        assert!(matches!(
            validate_course(&course),
            Err(ValidationError::DuplicateSlug { .. })
        ));
    }
}
