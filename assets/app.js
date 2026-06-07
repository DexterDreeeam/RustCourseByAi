(function () {
  const data = window.RUST_COURSE_DATA;
  const root = document.getElementById("courseRoot");
  const nav = document.getElementById("sidebarNav");
  const hero = document.getElementById("hero");
  const languageToggle = document.getElementById("languageToggle");
  const tocTitle = document.getElementById("tocTitle");
  const brandSubtitle = document.getElementById("brandSubtitle");

  if (!data || !root || !nav || !hero || !languageToggle) {
    return;
  }

  const labels = {
    zh: {
      toc: "目录",
      syntax: "语法层面",
      engineering: "工程用法",
      comparison: "Rust 与 C++ 对照",
      examples: "代码示例",
      references: "参考项目",
      previous: "上一节",
      next: "下一节",
      part: "篇",
      chapter: "章",
      languageButton: "English",
      brandSubtitle: "面向 C++ 程序员的 Rust 教程"
    },
    en: {
      toc: "Contents",
      syntax: "Syntax view",
      engineering: "Engineering usage",
      comparison: "Rust vs C++",
      examples: "Code examples",
      references: "Reference projects",
      previous: "Previous",
      next: "Next",
      part: "Part",
      chapter: "Chapter",
      languageButton: "中文",
      brandSubtitle: "Rust for C++ Engineers"
    }
  };

  const languageKey = "rust-course-language";
  const initialLanguage = localStorage.getItem(languageKey) === "en" ? "en" : "zh";
  const flatSections = flattenSections(data.parts);
  const state = {
    language: initialLanguage,
    sectionId: getSectionIdFromHash() || flatSections[0].section.id
  };

  function flattenSections(parts) {
    return parts.flatMap((part) =>
      part.chapters.flatMap((chapter) =>
        chapter.sections.map((section) => ({ part, chapter, section }))
      )
    );
  }

  function getSectionIdFromHash() {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    return flatSections.some((item) => item.section.id === id) ? id : null;
  }

  function pick(value) {
    if (typeof value === "string") {
      return value;
    }
    if (!value) {
      return "";
    }
    return value[state.language] || value.zh || value.en || "";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatInline(value) {
    return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function renderParagraphs(items) {
    return (items || []).map((item) => `<p>${formatInline(item)}</p>`).join("");
  }

  function renderList(items) {
    return `<ul>${(items || []).map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`;
  }

  function renderHero() {
    const text = data.hero[state.language];
    hero.innerHTML = `
      <div class="eyebrow">${escapeHtml(text.eyebrow)}</div>
      <h1>${escapeHtml(text.title)}</h1>
      <p>${escapeHtml(text.description)}</p>
      <div class="hero-grid">
        ${text.cards.map((card) => `
          <div class="hero-card">
            <strong>${escapeHtml(card.title)}</strong>
            <span>${escapeHtml(card.text)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderNav() {
    tocTitle.textContent = labels[state.language].toc;
    brandSubtitle.textContent = labels[state.language].brandSubtitle;
    languageToggle.textContent = labels[state.language].languageButton;
    nav.innerHTML = data.parts.map((part) => `
      <div class="nav-part">
        <p class="nav-part-title">${escapeHtml(pick(part.title))}</p>
        ${part.chapters.map((chapter) => `
          <div class="nav-chapter">
            <p class="nav-chapter-title">${escapeHtml(pick(chapter.title))}</p>
            ${chapter.sections.map((section) => `
              <button class="nav-section ${section.id === state.sectionId ? "active" : ""}" type="button" data-section="${escapeHtml(section.id)}">
                ${escapeHtml(pick(section.title))}
              </button>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `).join("");

    nav.querySelectorAll("[data-section]").forEach((button) => {
      button.addEventListener("click", () => setSection(button.dataset.section, true));
    });
  }

  function renderExamples(examples) {
    return `
      <section class="examples">
        <h2>${labels[state.language].examples}</h2>
        <div class="examples-grid">
          ${(examples || []).map((example) => `
            <div class="code-card">
              <div class="code-header">
                <span>${escapeHtml(pick(example.title))}</span>
                <span>${escapeHtml(example.language)}</span>
              </div>
              <pre><code class="language-${escapeHtml(example.language)}">${escapeHtml(example.code)}</code></pre>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderReferences(section) {
    const references = (section.references || [])
      .map((name) => data.references.find((reference) => reference.name === name))
      .filter(Boolean);

    if (references.length === 0) {
      return "";
    }

    return `
      <section class="references">
        <h2>${labels[state.language].references}</h2>
        <ul>
          ${references.map((reference) => `
            <li><a href="${escapeHtml(reference.url)}" target="_blank" rel="noreferrer">${escapeHtml(reference.name)}</a> - ${escapeHtml(pick(reference.lesson))}</li>
          `).join("")}
        </ul>
      </section>
    `;
  }

  function renderLesson() {
    const index = flatSections.findIndex((item) => item.section.id === state.sectionId);
    const current = flatSections[index] || flatSections[0];
    const { part, chapter, section } = current;
    const previous = flatSections[index - 1];
    const next = flatSections[index + 1];

    document.documentElement.lang = state.language;
    document.title = `${pick(section.title)} - RustCourseByAi`;

    root.innerHTML = `
      <div class="breadcrumb">
        <span>${escapeHtml(pick(part.title))}</span>
        <span>/</span>
        <span>${escapeHtml(pick(chapter.title))}</span>
      </div>
      <h1>${escapeHtml(pick(section.title))}</h1>
      <div class="lesson-meta">
        <span class="pill">${labels[state.language].part}: ${escapeHtml(pick(part.title))}</span>
        <span class="pill">${labels[state.language].chapter}: ${escapeHtml(pick(chapter.title))}</span>
      </div>
      ${renderList(pick(section.goals))}
      <div class="lesson-grid">
        <section class="content-card syntax">
          <h2>${labels[state.language].syntax}</h2>
          ${renderParagraphs(pick(section.syntax))}
        </section>
        <section class="content-card engineering">
          <h2>${labels[state.language].engineering}</h2>
          ${renderParagraphs(pick(section.engineering))}
        </section>
      </div>
      <section class="comparison-card">
        <h2>${labels[state.language].comparison}</h2>
        ${renderParagraphs(pick(section.cppComparison))}
      </section>
      ${renderExamples(section.examples)}
      ${renderReferences(section)}
      <footer class="lesson-footer">
        <button class="nav-button" type="button" data-previous ${previous ? "" : "disabled"}>${labels[state.language].previous}</button>
        <button class="nav-button" type="button" data-next ${next ? "" : "disabled"}>${labels[state.language].next}</button>
      </footer>
    `;

    const previousButton = root.querySelector("[data-previous]");
    const nextButton = root.querySelector("[data-next]");
    if (previous) {
      previousButton.addEventListener("click", () => setSection(previous.section.id, true));
    }
    if (next) {
      nextButton.addEventListener("click", () => setSection(next.section.id, true));
    }
  }

  function setSection(id, updateHash) {
    if (!flatSections.some((item) => item.section.id === id)) {
      return;
    }
    state.sectionId = id;
    if (updateHash) {
      history.pushState(null, "", `#${encodeURIComponent(id)}`);
    }
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    renderHero();
    renderNav();
    renderLesson();
  }

  languageToggle.addEventListener("click", () => {
    state.language = state.language === "zh" ? "en" : "zh";
    localStorage.setItem(languageKey, state.language);
    render();
  });

  window.addEventListener("hashchange", () => {
    const id = getSectionIdFromHash();
    if (id) {
      state.sectionId = id;
      render();
    }
  });

  if (!window.location.hash) {
    history.replaceState(null, "", `#${encodeURIComponent(state.sectionId)}`);
  }

  render();
})();
