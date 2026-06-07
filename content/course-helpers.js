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

  const withMistakes = (example, mistakes) => ({
    ...example,
    mistakes
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

  window.Course = { t, block, sharedExample, localizedExample, withMistakes, lesson };
  window.RUST_COURSE_CHAPTERS = window.RUST_COURSE_CHAPTERS || { beginner: [], advanced: [] };
})();
