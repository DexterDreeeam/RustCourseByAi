(function () {
  const { t } = window.Course;
  const chapters = window.RUST_COURSE_CHAPTERS || { beginner: [], advanced: [] };
  const references = window.RUST_COURSE_REFERENCES || [];

  const beginnerGroups = [
    {
      id: "cpp-to-rust-and-toolchain",
      title: t("从 C++ 到 Rust：迁移地图与工具链", "From C++ to Rust: migration map and toolchain"),
      members: ["cpp-to-rust-map", "toolchain-project-shape"]
    },
    {
      id: "syntax-values-types",
      title: t("基础语法、控制流与类型", "Syntax, control flow, and types"),
      members: ["syntax-values-types", "control-flow-patterns"],
      sectionOrder: [
        "scalar-compound-types",
        "bindings-mutability-shadowing",
        "strings-slices-collections",
        "macros-vs-functions",
        "control-flow-expressions",
        "match-patterns",
        "common-method-vocabulary"
      ]
    },
    {
      id: "data-modeling-and-errors",
      title: t("数据建模与错误处理", "Data modeling and error handling"),
      members: ["data-modeling", "error-boundaries"]
    },
    { id: "ownership-borrowing-lifetimes", members: ["ownership-borrowing-lifetimes"] },
    {
      id: "traits-generics-collections",
      title: t("trait、泛型、集合与迭代器", "Traits, generics, collections, and iterators"),
      members: ["traits-generics-basic", "collections-iterators-closures"]
    },
    {
      id: "project-foundations",
      title: t("工程化与综合项目", "Project foundations and capstone"),
      members: ["modules-tests-docs", "beginner-capstone"]
    }
  ];

  const advancedGroups = [
    {
      id: "architecture-api-abstraction",
      title: t("架构、对外 API 与高级抽象", "Architecture, public APIs, and advanced abstraction"),
      members: ["workspace-architecture", "public-api-semver", "advanced-traits-generics"]
    },
    {
      id: "async-concurrency",
      title: t("异步与并发", "Async and concurrency"),
      members: ["async-runtime-boundaries", "concurrency-communication"]
    },
    {
      id: "observability-performance",
      title: t("可观测性与性能", "Observability and performance"),
      members: ["observability-errors", "performance-engineering"]
    },
    {
      id: "unsafe-macros",
      title: t("底层与元编程：unsafe、FFI 与宏", "Low-level and metaprogramming: unsafe, FFI, and macros"),
      members: ["unsafe-ffi", "macros-codegen"]
    },
    {
      id: "testing-release-capstone",
      title: t("测试、发布与综合项目", "Testing, release, and capstone"),
      members: ["testing-ci-release", "advanced-capstone"]
    }
  ];

  function mergeChapters(originalChapters, groups, partName) {
    const byId = new Map(originalChapters.map((chapter) => [chapter.id, chapter]));
    const used = new Set();
    const merged = groups.map((group) => {
      const members = group.members
        .map((memberId) => {
          const chapter = byId.get(memberId);
          if (!chapter) {
            console.error(`Missing ${partName} chapter for merge: ${memberId}`);
            return null;
          }
          used.add(memberId);
          return chapter;
        })
        .filter(Boolean);
      const sections = members.flatMap((chapter) => chapter.sections);
      const orderedSections = group.sectionOrder
        ? [
            ...group.sectionOrder
              .map((sectionId) => sections.find((section) => section.id === sectionId))
              .filter(Boolean),
            ...sections.filter((section) => !group.sectionOrder.includes(section.id))
          ]
        : sections;
      return {
        id: group.id,
        title: group.title || (members[0] && members[0].title),
        sections: orderedSections
      };
    });
    for (const chapter of originalChapters) {
      if (!used.has(chapter.id)) {
        console.error(`${partName} chapter not assigned to any group: ${chapter.id}`);
      }
    }
    return merged;
  }

  const beginnerChapters = mergeChapters(chapters.beginner, beginnerGroups, "beginner");
  const advancedChapters = mergeChapters(chapters.advanced, advancedGroups, "advanced");

  const ids = new Set();
  for (const partChapters of [beginnerChapters, advancedChapters]) {
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
      { id: "beginner", title: t("入门", "Beginner"), chapters: beginnerChapters },
      { id: "advanced", title: t("进阶", "Advanced"), chapters: advancedChapters }
    ]
  };
})();
