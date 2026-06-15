use std::collections::BTreeMap;

use crate::{Course, LessonSlug, Tag};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LessonSummary {
    slug: LessonSlug,
    title: String,
}

impl LessonSummary {
    pub fn slug(&self) -> &LessonSlug {
        &self.slug
    }

    pub fn title(&self) -> &str {
        &self.title
    }
}

pub type TagIndex = BTreeMap<Tag, Vec<LessonSummary>>;

pub fn build_tag_index(course: &Course) -> TagIndex {
    course
        .lessons()
        .iter()
        .fold(BTreeMap::new(), |mut index, lesson| {
            for tag in lesson.tags() {
                index.entry(tag.clone()).or_default().push(LessonSummary {
                    slug: lesson.slug().clone(),
                    title: lesson.title().to_owned(),
                });
            }
            index
        })
}

pub fn lessons_for_tag<'a>(index: &'a TagIndex, tag: &Tag) -> &'a [LessonSummary] {
    index.get(tag).map(Vec::as_slice).unwrap_or(&[])
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{Course, Lesson};

    #[test]
    fn builds_index_by_tag() {
        let ownership = Tag::new("ownership").unwrap();
        let course = Course::new(
            "Rust".to_owned(),
            vec![Lesson::new(
                LessonSlug::new("borrowing").unwrap(),
                "Borrowing".to_owned(),
                vec![ownership.clone()],
            )],
        );

        let index = build_tag_index(&course);
        assert_eq!(lessons_for_tag(&index, &ownership)[0].title(), "Borrowing");
    }
}
