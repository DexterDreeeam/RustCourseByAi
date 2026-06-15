mod index;
mod model;
mod parser;
mod validate;

pub mod cli;

pub use index::{build_tag_index, lessons_for_tag, LessonSummary, TagIndex};
pub use model::{Course, Lesson, LessonSlug, Tag};
pub use parser::{parse_course, ParseError};
pub use validate::{validate_course, ValidationError};

#[derive(Debug)]
pub enum CourseError {
    Parse(ParseError),
    Validation(ValidationError),
}

impl From<ParseError> for CourseError {
    fn from(error: ParseError) -> Self {
        Self::Parse(error)
    }
}

impl From<ValidationError> for CourseError {
    fn from(error: ValidationError) -> Self {
        Self::Validation(error)
    }
}

pub fn load_and_index(input: &str) -> Result<TagIndex, CourseError> {
    let course = parse_course(input)?;
    validate_course(&course)?;
    Ok(build_tag_index(&course))
}
