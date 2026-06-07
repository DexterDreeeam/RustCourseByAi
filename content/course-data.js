(function () {
  const { t } = window.Course;
  const chapters = window.RUST_COURSE_CHAPTERS || { beginner: [], advanced: [] };
  const references = window.RUST_COURSE_REFERENCES || [];

  if (chapters.beginner.length !== 10 || chapters.advanced.length !== 11) {
    console.error("Unexpected course chapter count", {
      beginner: chapters.beginner.length,
      advanced: chapters.advanced.length
    });
  }

  const ids = new Set();
  for (const partChapters of [chapters.beginner, chapters.advanced]) {
    for (const chapter of partChapters) {
      for (const section of chapter.sections) {
        if (ids.has(section.id)) {
          console.error(`Duplicate course section id: ${section.id}`);
        }
        ids.add(section.id);
      }
    }
  }

  window.RUST_COURSE_DATA = {
    references,
    parts: [
      { id: "beginner", title: t("入门", "Beginner"), chapters: chapters.beginner },
      { id: "advanced", title: t("进阶", "Advanced"), chapters: chapters.advanced }
    ]
  };
})();
