use crate::{Course, Lesson, LessonSlug, Tag};

#[derive(Debug, PartialEq, Eq)]
pub enum ParseError {
    MissingTitle,
    UnknownKey { line: usize, key: String },
    BadLessonLine { line: usize },
    InvalidSlug { line: usize, value: String },
    InvalidTag { line: usize, value: String },
}

pub fn parse_course(input: &str) -> Result<Course, ParseError> {
    let mut title = None;
    let mut lessons = Vec::new();

    for (index, raw_line) in input.lines().enumerate() {
        let line_number = index + 1;
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }

        let Some((key, rest)) = line.split_once(':') else {
            return Err(ParseError::UnknownKey {
                line: line_number,
                key: line.to_owned(),
            });
        };

        match key.trim() {
            "title" => title = Some(rest.trim().to_owned()),
            "lesson" => lessons.push(parse_lesson(line_number, rest)?),
            other => {
                return Err(ParseError::UnknownKey {
                    line: line_number,
                    key: other.to_owned(),
                })
            }
        }
    }

    let Some(title) = title else {
        return Err(ParseError::MissingTitle);
    };

    Ok(Course::new(title, lessons))
}

fn parse_lesson(line: usize, rest: &str) -> Result<Lesson, ParseError> {
    let parts: Vec<_> = rest.split('|').map(str::trim).collect();
    if parts.len() != 3 {
        return Err(ParseError::BadLessonLine { line });
    }

    let slug = LessonSlug::new(parts[0]).ok_or_else(|| ParseError::InvalidSlug {
        line,
        value: parts[0].to_owned(),
    })?;

    let tags = parts[2]
        .split(',')
        .map(str::trim)
        .map(|value| {
            Tag::new(value).ok_or_else(|| ParseError::InvalidTag {
                line,
                value: value.to_owned(),
            })
        })
        .collect::<Result<Vec<_>, _>>()?;

    Ok(Lesson::new(slug, parts[1].to_owned(), tags))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_course_with_lessons() {
        let course =
            parse_course("title: Rust Course\nlesson: ownership | Ownership | rust, memory\n")
                .unwrap();

        assert_eq!(course.title(), "Rust Course");
        assert_eq!(course.lessons().len(), 1);
        assert_eq!(course.lessons()[0].slug().as_str(), "ownership");
    }
}
