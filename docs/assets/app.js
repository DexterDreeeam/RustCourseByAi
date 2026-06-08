(function () {
  const data = window.RUST_COURSE_DATA;
  const root = document.getElementById("courseRoot");
  const nav = document.getElementById("sidebarNav");
  const languageToggle = document.getElementById("languageToggle");
  const brandSubtitle = document.getElementById("brandSubtitle");
  const header = document.querySelector(".site-header");

  if (!data || !root || !nav || !languageToggle) {
    return;
  }

  const labels = {
    zh: {
      syntax: "语法层面",
      engineering: "工程用法",
      comparison: "Rust 与 C++ 对照",
      examples: "代码示例",
      tables: "速查表",
      references: "参考项目",
      previous: "上一节",
      next: "下一节",
      part: "阶段",
      compilerError: "会触发的错误",
      whyWrong: "为什么不对",
      languageButton: "English",
      brandSubtitle: "面向 C++ 程序员的 Rust 教程"
    },
    en: {
      syntax: "Syntax view",
      engineering: "Engineering usage",
      comparison: "Rust vs C++",
      examples: "Code examples",
      tables: "Reference tables",
      references: "Reference projects",
      previous: "Previous",
      next: "Next",
      part: "Level",
      compilerError: "Compiler error",
      whyWrong: "Why this is wrong",
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

  function getCurrentItem() {
    return flatSections.find((item) => item.section.id === state.sectionId) || flatSections[0];
  }

  function getFirstSectionInPart(partId) {
    const item = flatSections.find((entry) => entry.part.id === partId);
    return item ? item.section.id : flatSections[0].section.id;
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

  const RUST_KEYWORDS = new Set([
    "as", "async", "await", "break", "const", "continue", "crate", "dyn", "else", "enum",
    "extern", "fn", "for", "if", "impl", "in", "let", "loop", "match", "mod", "move", "mut",
    "pub", "ref", "return", "self", "Self", "static", "struct", "super", "trait", "type",
    "union", "unsafe", "use", "where", "while", "box", "yield"
  ]);
  const RUST_LITERALS = new Set(["true", "false"]);
  const RUST_TYPES = new Set([
    "u8", "u16", "u32", "u64", "u128", "usize", "i8", "i16", "i32", "i64", "i128", "isize",
    "f32", "f64", "bool", "char", "str", "String", "Vec", "Option", "Result", "Box", "Rc",
    "Arc", "HashMap", "HashSet", "BTreeMap", "BTreeSet", "VecDeque", "BinaryHeap", "LinkedList",
    "Cell", "RefCell", "Cow", "Mutex", "RwLock"
  ]);

  function highlightCode(code, language) {
    if (language !== "rust") {
      return escapeHtml(code);
    }
    try {
      return highlightRust(code);
    } catch (error) {
      return escapeHtml(code);
    }
  }

  function highlightRust(code) {
    const n = code.length;
    const isIdentStart = (c) => c === "_" || (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
    const isIdentPart = (c) => isIdentStart(c) || (c >= "0" && c <= "9");
    const isDigit = (c) => c >= "0" && c <= "9";
    const isHex = (c) => isDigit(c) || (c >= "a" && c <= "f") || (c >= "A" && c <= "F");
    const span = (cls, text) => `<span class="${cls}">${escapeHtml(text)}</span>`;
    let out = "";
    let i = 0;

    while (i < n) {
      const c = code[i];

      if (c === "/" && code[i + 1] === "/") {
        let j = i + 2;
        while (j < n && code[j] !== "\n") j++;
        out += span("tok-comment", code.slice(i, j));
        i = j;
        continue;
      }

      if (c === "/" && code[i + 1] === "*") {
        let j = i + 2;
        let depth = 1;
        while (j < n && depth > 0) {
          if (code[j] === "/" && code[j + 1] === "*") { depth++; j += 2; }
          else if (code[j] === "*" && code[j + 1] === "/") { depth--; j += 2; }
          else j++;
        }
        out += span("tok-comment", code.slice(i, j));
        i = j;
        continue;
      }

      if (c === "r" && (code[i + 1] === '"' || code[i + 1] === "#")) {
        let j = i + 1;
        let hashes = 0;
        while (code[j] === "#") { hashes++; j++; }
        if (code[j] === '"') {
          j++;
          const closing = '"' + "#".repeat(hashes);
          const idx = code.indexOf(closing, j);
          const end = idx === -1 ? n : idx + closing.length;
          out += span("tok-string", code.slice(i, end));
          i = end;
          continue;
        }
      }

      if (c === '"') {
        let j = i + 1;
        while (j < n) {
          if (code[j] === "\\") { j += 2; continue; }
          if (code[j] === '"') { j++; break; }
          j++;
        }
        out += span("tok-string", code.slice(i, j));
        i = j;
        continue;
      }

      if (c === "'") {
        if (code[i + 1] === "\\") {
          let j = i + 2;
          while (j < n && code[j] !== "'") j++;
          j++;
          out += span("tok-string", code.slice(i, j));
          i = j;
          continue;
        }
        if (code[i + 2] === "'") {
          out += span("tok-string", code.slice(i, i + 3));
          i += 3;
          continue;
        }
        if (isIdentStart(code[i + 1])) {
          let j = i + 1;
          while (j < n && isIdentPart(code[j])) j++;
          out += span("tok-lifetime", code.slice(i, j));
          i = j;
          continue;
        }
        out += escapeHtml(c);
        i++;
        continue;
      }

      if (c === "#" && (code[i + 1] === "[" || (code[i + 1] === "!" && code[i + 2] === "["))) {
        let j = i;
        while (j < n && code[j] !== "[") j++;
        let depth = 0;
        while (j < n) {
          if (code[j] === "[") depth++;
          else if (code[j] === "]") { depth--; if (depth === 0) { j++; break; } }
          j++;
        }
        out += span("tok-attribute", code.slice(i, j));
        i = j;
        continue;
      }

      if (isDigit(c)) {
        let j = i + 1;
        if (c === "0" && (code[i + 1] === "x" || code[i + 1] === "X")) {
          j = i + 2;
          while (j < n && (isHex(code[j]) || code[j] === "_")) j++;
        } else if (c === "0" && "oObB".indexOf(code[i + 1]) !== -1) {
          j = i + 2;
          while (j < n && (isDigit(code[j]) || code[j] === "_")) j++;
        } else {
          while (j < n && (isDigit(code[j]) || code[j] === "_")) j++;
          if (code[j] === "." && isDigit(code[j + 1])) {
            j++;
            while (j < n && (isDigit(code[j]) || code[j] === "_")) j++;
          }
          if (code[j] === "e" || code[j] === "E") {
            j++;
            if (code[j] === "+" || code[j] === "-") j++;
            while (j < n && (isDigit(code[j]) || code[j] === "_")) j++;
          }
        }
        let k = j;
        while (k < n && isIdentPart(code[k])) k++;
        const suffix = code.slice(j, k);
        if (/^(u8|u16|u32|u64|u128|usize|i8|i16|i32|i64|i128|isize|f32|f64)$/.test(suffix)) {
          j = k;
        }
        out += span("tok-number", code.slice(i, j));
        i = j;
        continue;
      }

      if (isIdentStart(c)) {
        let j = i + 1;
        while (j < n && isIdentPart(code[j])) j++;
        const word = code.slice(i, j);
        if (code[j] === "!") {
          out += span("tok-macro", word + "!");
          i = j + 1;
          continue;
        }
        if (RUST_KEYWORDS.has(word)) {
          out += span("tok-keyword", word);
        } else if (RUST_LITERALS.has(word)) {
          out += span("tok-literal", word);
        } else if (RUST_TYPES.has(word) || (word[0] >= "A" && word[0] <= "Z")) {
          out += span("tok-type", word);
        } else if (code[j] === "(") {
          out += span("tok-fn", word);
        } else {
          out += escapeHtml(word);
        }
        i = j;
        continue;
      }

      out += escapeHtml(c);
      i++;
    }

    return out;
  }

  function renderParagraphs(items) {
    return (items || []).map((item) => `<p>${formatInline(item)}</p>`).join("");
  }

  function asArray(value) {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }

  function renderList(items) {
    return `<ul>${(items || []).map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`;
  }

  function renderNav() {
    const activePartId = getCurrentItem().part.id;
    const activePart = data.parts.find((part) => part.id === activePartId) || data.parts[0];

    brandSubtitle.textContent = labels[state.language].brandSubtitle;
    languageToggle.textContent = labels[state.language].languageButton;
    nav.innerHTML = `
      <div class="part-tabs" role="tablist" aria-label="${escapeHtml(labels[state.language].part)}">
        ${data.parts.map((part) => `
          <button
            class="part-tab ${part.id === activePartId ? "active" : ""}"
            type="button"
            role="tab"
            aria-selected="${part.id === activePartId ? "true" : "false"}"
            data-part="${escapeHtml(part.id)}"
          >
            ${escapeHtml(pick(part.title))}
          </button>
        `).join("")}
      </div>
      <div class="nav-part">
        ${activePart.chapters.map((chapter) => `
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
    `;

    nav.querySelectorAll("[data-part]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.part !== activePartId) {
          setSection(getFirstSectionInPart(button.dataset.part), true);
        }
      });
    });

    nav.querySelectorAll("[data-section]").forEach((button) => {
      button.addEventListener("click", () => setSection(button.dataset.section, true));
    });
  }

  function renderExamples(examples) {
    const heading = (examples || []).every((example) => example.kind === "table" || example.kind === "searchableTable")
      ? labels[state.language].tables
      : labels[state.language].examples;
    return `
      <section class="examples">
        <h2>${heading}</h2>
        <div class="examples-grid">
          ${(examples || []).map(renderExample).join("")}
        </div>
      </section>
    `;
  }

  function cellText(cell) {
    return pick(cell);
  }

  function renderExample(example) {
    if (example.kind === "text") {
      return `
        <div class="explanation-card">
          <h3>${escapeHtml(pick(example.title))}</h3>
          ${renderParagraphs(asArray(pick(example.paragraphs)))}
          ${example.diagram ? `<pre class="example-diagram">${escapeHtml(pick(example.diagram))}</pre>` : ""}
        </div>
      `;
    }

    if (example.kind === "table") {
      const renderCell = (cell, tag) => `<${tag}>${formatInline(pick(cell))}</${tag}>`;
      return `
        <div class="explanation-card table-card">
          <h3>${escapeHtml(pick(example.title))}</h3>
          <div class="table-scroll">
            <table class="compare-table">
              <thead><tr>${example.headers.map((header) => renderCell(header, "th")).join("")}</tr></thead>
              <tbody>${example.rows.map((row) => `<tr>${row.map((cell) => renderCell(cell, "td")).join("")}</tr>`).join("")}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (example.kind === "searchableTable") {
      const renderCell = (cell, tag) => `<${tag}>${formatInline(pick(cell))}</${tag}>`;
      return `
        <div class="explanation-card table-card searchable-table-card">
          <h3>${escapeHtml(pick(example.title))}</h3>
          <label class="table-search">
            <span>${escapeHtml(pick(example.searchPlaceholder))}</span>
            <input class="table-search-input" type="search" data-table-search placeholder="${escapeHtml(pick(example.searchPlaceholder))}">
          </label>
          <div class="table-scroll">
            <table class="compare-table searchable-table">
              <thead><tr>${example.headers.map((header) => renderCell(header, "th")).join("")}</tr></thead>
              <tbody>${example.rows.map((row) => {
                const searchText = row.map(cellText).join(" ").toLowerCase();
                return `<tr data-search="${escapeHtml(searchText)}">${row.map((cell) => renderCell(cell, "td")).join("")}</tr>`;
              }).join("")}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    return `
      <div class="code-card ${example.mistakes ? "has-mistakes" : ""}">
        <div class="code-header">
          <span>${escapeHtml(pick(example.title))}</span>
          <span>${escapeHtml(example.language)}</span>
        </div>
        <pre><code class="language-${escapeHtml(example.language)}">${highlightCode(pick(example.code), example.language)}</code></pre>
        ${renderMistakes(example)}
      </div>
    `;
  }

  function renderMistakes(example) {
    const mistakes = example.mistakes || [];
    if (mistakes.length === 0) {
      return "";
    }

    return `
      <div class="mistake-list">
        ${mistakes.map((mistake) => `
          <section class="mistake-card">
            <div class="mistake-title">${escapeHtml(pick(mistake.title))}</div>
            <pre class="mistake-code"><code class="language-${escapeHtml(mistake.language || example.language)}">${highlightCode(pick(mistake.code), mistake.language || example.language)}</code></pre>
            <div class="mistake-detail mistake-error">
              <strong>${labels[state.language].compilerError}</strong>
              ${renderParagraphs(asArray(pick(mistake.error)))}
            </div>
            <div class="mistake-detail">
              <strong>${labels[state.language].whyWrong}</strong>
              ${renderParagraphs(asArray(pick(mistake.explanation)))}
            </div>
          </section>
        `).join("")}
      </div>
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
    const current = getCurrentItem();
    const { section } = current;
    const previous = flatSections[index - 1];
    const next = flatSections[index + 1];

    document.documentElement.lang = state.language;
    document.title = `${pick(section.title)} - Rust Course By AI`;

    root.innerHTML = `
      <h1>${escapeHtml(pick(section.title))}</h1>
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
    root.querySelectorAll("[data-table-search]").forEach((input) => {
      input.addEventListener("input", () => {
        const card = input.closest(".searchable-table-card");
        const query = input.value.trim().toLowerCase();
        card.querySelectorAll("[data-search]").forEach((row) => {
          row.hidden = query && !row.dataset.search.includes(query);
        });
      });
    });
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

  function updateHeaderVisibility() {
    if (!header) {
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const shouldShow = scrollTop <= 12;
    document.body.classList.toggle("header-hidden", !shouldShow);
  }

  let headerTicking = false;
  window.addEventListener("scroll", () => {
    if (headerTicking) {
      return;
    }

    headerTicking = true;
    window.requestAnimationFrame(() => {
      updateHeaderVisibility();
      headerTicking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", updateHeaderVisibility);

  if (!window.location.hash) {
    history.replaceState(null, "", `#${encodeURIComponent(state.sectionId)}`);
  }

  render();
  updateHeaderVisibility();
})();
