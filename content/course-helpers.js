(function () {
  const t = (zh, en) => ({ zh, en });
  const block = (value) => value.trim();

  const sharedExample = (zhTitle, enTitle, language, code) => ({
    title: t(zhTitle, enTitle),
    language,
    code: block(code)
  });

  const localizedExample = (zhTitle, enTitle, language, zhCode, enCode) => ({
    title: t(zhTitle, enTitle),
    language,
    code: {
      zh: block(zhCode),
      en: block(enCode)
    }
  });

  const textExample = (zhTitle, enTitle, zhParagraphs, enParagraphs, diagram = null) => ({
    kind: "text",
    title: t(zhTitle, enTitle),
    paragraphs: t(zhParagraphs, enParagraphs),
    diagram: diagram ? block(diagram) : null
  });

  const withMistakes = (example, mistakes) => ({
    ...example,
    mistakes
  });

  const tableExample = (zhTitle, enTitle, headers, rows) => ({
    kind: "table",
    title: t(zhTitle, enTitle),
    headers,
    rows
  });

  const searchableTableExample = (zhTitle, enTitle, headers, rows, zhPlaceholder, enPlaceholder) => ({
    kind: "searchableTable",
    title: t(zhTitle, enTitle),
    headers,
    rows,
    searchPlaceholder: t(zhPlaceholder, enPlaceholder)
  });

  const lesson = ({
    id,
    title,
    goals,
    syntax,
    engineering,
    cppComparison,
    examples,
    references
  }) => ({
    id,
    title: t(title[0], title[1]),
    goals: t(goals[0], goals[1]),
    syntax: t(syntax[0], syntax[1]),
    engineering: t(engineering[0], engineering[1]),
    cppComparison: t(cppComparison[0], cppComparison[1]),
    examples,
    references
  });

  window.Course = { t, block, sharedExample, localizedExample, textExample, tableExample, searchableTableExample, withMistakes, lesson };
  window.RUST_COURSE_CHAPTERS = window.RUST_COURSE_CHAPTERS || { beginner: [], advanced: [] };
})();
