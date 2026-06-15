#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Course {
    slug: LessonSlug,
    title: String,
    lessons: Vec<Lesson>,
}

impl Course {
    pub fn new(slug: LessonSlug, title: impl Into<String>, lessons: Vec<Lesson>) -> Self {
        Self {
            slug,
            title: title.into(),
            lessons,
        }
    }

    pub fn slug(&self) -> &LessonSlug {
        &self.slug
    }

    pub fn title(&self) -> &str {
        &self.title
    }

    pub fn lessons(&self) -> &[Lesson] {
        &self.lessons
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Lesson {
    slug: LessonSlug,
    title: String,
    tags: Vec<Tag>,
}

impl Lesson {
    pub fn new(slug: LessonSlug, title: impl Into<String>, tags: Vec<Tag>) -> Self {
        Self {
            slug,
            title: title.into(),
            tags,
        }
    }

    pub fn slug(&self) -> &LessonSlug {
        &self.slug
    }

    pub fn title(&self) -> &str {
        &self.title
    }

    pub fn tags(&self) -> &[Tag] {
        &self.tags
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct LessonSlug(String);

impl LessonSlug {
    pub fn new(value: impl Into<String>) -> Option<Self> {
        let value = value.into();
        let valid = !value.is_empty()
            && value
                .chars()
                .all(|ch| ch.is_ascii_lowercase() || ch.is_ascii_digit() || ch == '-');
        valid.then_some(Self(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Tag(String);

impl Tag {
    pub fn new(value: impl Into<String>) -> Option<Self> {
        let value = value.into();
        let valid = !value.is_empty()
            && value
                .chars()
                .all(|ch| ch.is_ascii_lowercase() || ch.is_ascii_digit() || ch == '-');
        valid.then_some(Self(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}
