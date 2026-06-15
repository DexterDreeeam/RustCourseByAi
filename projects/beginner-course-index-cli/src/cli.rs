use std::{fs, io};

use crate::{
    build_tag_index, lessons_for_tag, parse_course, validate_course, ParseError, Tag,
    ValidationError,
};

#[derive(Debug)]
pub enum CliError {
    Usage(String),
    Io(io::Error),
    Parse(ParseError),
    Validation(ValidationError),
    InvalidTag(String),
}

impl From<io::Error> for CliError {
    fn from(error: io::Error) -> Self {
        Self::Io(error)
    }
}

impl From<ParseError> for CliError {
    fn from(error: ParseError) -> Self {
        Self::Parse(error)
    }
}

impl From<ValidationError> for CliError {
    fn from(error: ValidationError) -> Self {
        Self::Validation(error)
    }
}

enum Command {
    PrintIndex { path: String },
    ListTags { path: String },
    LessonsForTag { path: String, tag: Tag },
}

pub fn run<I>(args: I) -> Result<String, CliError>
where
    I: IntoIterator<Item = String>,
{
    let command = parse_args(args)?;
    let input = fs::read_to_string(command.path())?;
    let course = parse_course(&input)?;
    validate_course(&course)?;
    let index = build_tag_index(&course);

    Ok(match command {
        Command::PrintIndex { .. } => render_index(&index),
        Command::ListTags { .. } => index
            .keys()
            .map(|tag| tag.as_str())
            .collect::<Vec<_>>()
            .join("\n"),
        Command::LessonsForTag { tag, .. } => lessons_for_tag(&index, &tag)
            .iter()
            .map(|lesson| format!("{} - {}", lesson.slug().as_str(), lesson.title()))
            .collect::<Vec<_>>()
            .join("\n"),
    })
}

impl Command {
    fn path(&self) -> &str {
        match self {
            Self::PrintIndex { path }
            | Self::ListTags { path }
            | Self::LessonsForTag { path, .. } => path,
        }
    }
}

fn parse_args<I>(args: I) -> Result<Command, CliError>
where
    I: IntoIterator<Item = String>,
{
    let mut args = args.into_iter();
    let Some(path) = args.next() else {
        return Err(CliError::Usage(usage()));
    };

    match (args.next().as_deref(), args.next(), args.next()) {
        (None, None, None) => Ok(Command::PrintIndex { path }),
        (Some("--list-tags"), None, None) => Ok(Command::ListTags { path }),
        (Some("--tag"), Some(value), None) => {
            let tag = Tag::new(value.clone()).ok_or(CliError::InvalidTag(value))?;
            Ok(Command::LessonsForTag { path, tag })
        }
        _ => Err(CliError::Usage(usage())),
    }
}

fn render_index(index: &crate::TagIndex) -> String {
    index
        .iter()
        .map(|(tag, lessons)| {
            let lessons = lessons
                .iter()
                .map(|lesson| format!("  - {}: {}", lesson.slug().as_str(), lesson.title()))
                .collect::<Vec<_>>()
                .join("\n");
            format!("{}:\n{}", tag.as_str(), lessons)
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn usage() -> String {
    "usage: course-index <course-file> [--list-tags | --tag <tag>]".to_owned()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_invalid_args() {
        assert!(matches!(
            parse_args(Vec::<String>::new()),
            Err(CliError::Usage(_))
        ));
    }

    #[test]
    fn parses_tag_command() {
        let command = parse_args(["course.txt", "--tag", "ownership"].map(str::to_owned)).unwrap();
        assert!(matches!(command, Command::LessonsForTag { .. }));
    }
}
