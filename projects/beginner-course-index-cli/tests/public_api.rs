use beginner_course_index_cli::{lessons_for_tag, load_and_index, Tag};

#[test]
fn builds_index_through_public_api() {
    let input = "\
title: Rust Course
lesson: ownership | Ownership and borrowing | ownership, memory
lesson: errors | Result and panic boundaries | errors
";

    let index = load_and_index(input).unwrap();
    let ownership = Tag::new("ownership").unwrap();

    assert_eq!(
        lessons_for_tag(&index, &ownership)[0].title(),
        "Ownership and borrowing"
    );
}
