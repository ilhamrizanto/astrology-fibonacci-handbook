/**
 * ============================================================================
 * ASTRONACCI — EDITORIAL MONOGRAPH ENGINE & INTERACTIVE CONTROLLER (app.js)
 * Complete Curriculum Navigation, Math-Safe Markdown Parser, Section Outline,
 * Full-Text Search Indexer, Dual-Theme Switcher, Typography Scaler & Lightbox
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. CONSTANTS & STORAGE KEYS
   * -------------------------------------------------------------------------- */
  const STORAGE_KEYS = {
    LAST_CHAPTER: 'astronacci_last_chapter',
    THEME: 'astronacci_theme',
    FONT_SIZE: 'astronacci_font_size',
    FOCUS_MODE: 'astronacci_focus_mode'
  };

  const FONT_SCALE = {
    MIN: 0.95,
    MAX: 1.45,
    STEP: 0.06,
    DEFAULT: 1.125
  };

  const WORDS_PER_MINUTE = 220;

  /* --------------------------------------------------------------------------
   * 2. APPLICATION STATE
   * -------------------------------------------------------------------------- */
  const state = {
    bookData: null,
    flatChapters: [],
    searchIndex: [],
    currentChapterId: null,
    fontSizeRem: FONT_SCALE.DEFAULT,
    theme: 'theme-broadsheet',
    focusMode: false,
    outlineObserver: null,
    activeSearchIdx: -1
  };

  /* --------------------------------------------------------------------------
   * 3. DOM ELEMENT CACHE
   * -------------------------------------------------------------------------- */
  const dom = {};

  function cacheDom() {
    dom.body = document.body;
    dom.root = document.documentElement;

    // Reading progress
    dom.progressBar = document.getElementById('reading-progress-bar');

    // Masthead controls
    dom.sidebarToggle = document.getElementById('sidebar-toggle');
    dom.searchModalBtn = document.getElementById('search-modal-btn');
    dom.fontDecBtn = document.getElementById('font-dec');
    dom.fontIncBtn = document.getElementById('font-inc');
    dom.themeToggleBtn = document.getElementById('theme-toggle');
    dom.themeLabel = dom.themeToggleBtn ? dom.themeToggleBtn.querySelector('.theme-label') : null;
    dom.simDrawerToggle = document.getElementById('sim-drawer-toggle');

    // Observatory Lab Drawer
    dom.simDrawer = document.getElementById('sim-drawer');
    dom.simCloseBtn = document.getElementById('sim-close-btn');
    dom.simTabBtns = Array.from(document.querySelectorAll('.sim-tab-btn'));
    dom.simPanels = {
      lunar: document.getElementById('sim-lunar'),
      fibonacci: document.getElementById('sim-fibonacci')
    };

    // Left Sidebar & TOC
    dom.sidebar = document.getElementById('sidebar');
    dom.tocFilterInput = document.getElementById('toc-filter-input');
    dom.tocNav = document.getElementById('toc-nav');

    // Center Reading Column
    dom.chapterPartLabel = document.getElementById('chapter-part-label');
    dom.chapterReadTime = document.getElementById('chapter-read-time');
    dom.chapterWordCount = document.getElementById('chapter-word-count');
    dom.focusModeBtn = document.getElementById('focus-mode-btn');
    dom.chapterContent = document.getElementById('chapter-content');

    // Pagination Footer
    dom.prevChapterBtn = document.getElementById('prev-chapter-btn');
    dom.prevChapterTitle = document.getElementById('prev-chapter-title');
    dom.nextChapterBtn = document.getElementById('next-chapter-btn');
    dom.nextChapterTitle = document.getElementById('next-chapter-title');

    // Right Section Outline Rail
    dom.outlineRail = document.getElementById('outline-rail');
    dom.sectionOutline = document.getElementById('section-outline');
    dom.backToTopBtn = document.getElementById('back-to-top');

    // Search Modal
    dom.searchModal = document.getElementById('search-modal');
    dom.searchBackdrop = dom.searchModal ? dom.searchModal.querySelector('.search-modal-backdrop') : null;
    dom.globalSearchInput = document.getElementById('global-search-input');
    dom.searchCloseBtn = document.getElementById('search-close');
    dom.searchResults = document.getElementById('search-results');

    // Lightbox Modal
    dom.lightboxModal = document.getElementById('lightbox-modal');
    dom.lightboxBackdrop = dom.lightboxModal ? dom.lightboxModal.querySelector('.lightbox-backdrop') : null;
    dom.lightboxCloseBtn = document.getElementById('lightbox-close');
    dom.lightboxImg = document.getElementById('lightbox-img');
    dom.lightboxCaption = document.getElementById('lightbox-caption');
  }

  /* --------------------------------------------------------------------------
   * 4. SAFE LOCALSTORAGE UTILITIES
   * -------------------------------------------------------------------------- */
  function getStorage(key, fallback) {
    try {
      const val = window.localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function setStorage(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch (_) {
      // Ignore private browsing quota errors
    }
  }

  /* --------------------------------------------------------------------------
   * 5. DATA FLATTENING & FULL-TEXT SEARCH INDEXING
   * -------------------------------------------------------------------------- */
  function buildBookCatalog() {
    const data = window.ASTRONACCI_BOOK_DATA;
    if (!data || !Array.isArray(data.toc) || !data.content) {
      console.error('ASTRONACCI_BOOK_DATA tidak ditemukan atau tidak valid.');
      return false;
    }

    state.bookData = data;
    state.flatChapters = [];
    state.searchIndex = [];

    data.toc.forEach((group) => {
      const partName = group.part || '';
      if (!Array.isArray(group.chapters)) return;

      group.chapters.forEach((ch) => {
        const chapterRecord = {
          id: ch.id,
          num: ch.num,
          title: ch.title,
          status: ch.status || 'available',
          time: ch.time || '15 min',
          part: partName
        };
        state.flatChapters.push(chapterRecord);

        const rawContent = data.content[ch.id] || '';
        const plainText = stripMarkdownAndHtml(rawContent);
        const wordCount = countWords(plainText);
        const computedMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

        chapterRecord.wordCount = wordCount;
        chapterRecord.computedMinutes = computedMinutes;

        state.searchIndex.push({
          id: ch.id,
          num: ch.num,
          title: ch.title,
          part: partName,
          plainText: plainText,
          lowerTitle: ch.title.toLowerCase(),
          lowerPart: partName.toLowerCase(),
          lowerText: plainText.toLowerCase()
        });
      });
    });

    return state.flatChapters.length > 0;
  }

  /**
   * Strips embedded SVG/HTML tags and Markdown formatting to produce clean prose
   * for accurate word counting and full-text search indexing.
   */
  function stripMarkdownAndHtml(raw) {
    if (!raw) return '';
    return raw
      // Remove embedded <svg>...</svg> graphics completely so SVG coordinates aren't indexed as words
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      // Remove HTML tags while keeping inner text (like figcaption or callout body)
      .replace(/<[^>]+>/g, ' ')
      // Remove display math delimiters
      .replace(/\$\$/g, ' ')
      // Remove markdown headings, blockquotes, list markers, table pipes, emphasis
      .replace(/^[#>*\-\d.|]+/gm, ' ')
      .replace(/[*_`~[\]()]/g, ' ')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  function countWords(cleanText) {
    if (!cleanText) return 0;
    const tokens = cleanText.trim().split(/\s+/);
    return tokens.filter(Boolean).length;
  }

  function formatNumber(num) {
    return Number(num || 0).toLocaleString('id-ID');
  }

  /* --------------------------------------------------------------------------
   * 6. CURRICULUM SIDEBAR TOC & LIVE FILTERING
   * -------------------------------------------------------------------------- */
  function renderToc(filterQuery = '') {
    if (!dom.tocNav || !state.bookData) return;

    const query = filterQuery.trim().toLowerCase();
    dom.tocNav.innerHTML = '';

    let totalMatches = 0;

    state.bookData.toc.forEach((group) => {
      const matchingChapters = (group.chapters || []).filter((ch) => {
        if (!query) return true;
        const numStr = `bab ${ch.num} ${String(ch.num).padStart(2, '0')}`;
        return (
          ch.title.toLowerCase().includes(query) ||
          group.part.toLowerCase().includes(query) ||
          numStr.includes(query)
        );
      });

      if (matchingChapters.length === 0) return;
      totalMatches += matchingChapters.length;

      const partSection = document.createElement('div');
      partSection.className = 'toc-part-group toc-part';

      const partHeader = document.createElement('div');
      partHeader.className = 'toc-part-header toc-part-title';
      partHeader.textContent = group.part;
      partSection.appendChild(partHeader);

      const listEl = document.createElement('div');
      listEl.className = 'toc-chapter-list toc-list';

      matchingChapters.forEach((ch) => {
        const isActive = ch.id === state.currentChapterId;
        const itemBtn = document.createElement('button');
        itemBtn.type = 'button';
        itemBtn.className = `toc-item toc-chapter-btn${isActive ? ' active' : ''}`;
        itemBtn.dataset.chapterId = ch.id;
        itemBtn.setAttribute('aria-current', isActive ? 'page' : 'false');

        const numBadge = String(ch.num).padStart(2, '0');

        itemBtn.innerHTML = `
          <span class="toc-item-num toc-num">BAB ${numBadge}</span>
          <span class="toc-item-body">
            <span class="toc-item-title toc-title">${escapeHtml(ch.title)}</span>
          </span>
        `;

        itemBtn.addEventListener('click', () => {
          loadChapter(ch.id, { updateHash: true, scrollToTop: true });
          // Close mobile sidebar drawer on selection
          if (window.innerWidth <= 1024 && dom.sidebar) {
            dom.sidebar.classList.remove('open');
          }
        });

        listEl.appendChild(itemBtn);
      });

      partSection.appendChild(listEl);
      dom.tocNav.appendChild(partSection);
    });

    if (totalMatches === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'toc-empty-state';
      emptyEl.style.padding = '1.25rem 1rem';
      emptyEl.style.fontSize = '0.82rem';
      emptyEl.style.opacity = '0.7';
      emptyEl.textContent = `Tidak ada bab yang cocok dengan "${filterQuery}".`;
      dom.tocNav.appendChild(emptyEl);
    }
  }

  function updateTocActiveState(chapterId) {
    if (!dom.tocNav) return;
    const buttons = dom.tocNav.querySelectorAll('.toc-item');
    buttons.forEach((btn) => {
      const isMatch = btn.dataset.chapterId === chapterId;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-current', isMatch ? 'page' : 'false');
      if (isMatch) {
        // Keep active TOC item in view inside sidebar without jumping main window
        btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 7. MATH-SAFE MARKDOWN PARSER & CHAPTER RENDERER
   * -------------------------------------------------------------------------- */
  /**
   * Protects LaTeX math blocks ($$...$$ and $...$) from Marked.js emphasis/underscore
   * parsing, runs Marked.js, and restores exact LaTeX strings for KaTeX auto-render.
   */
  function parseMarkdownWithMathProtection(rawMarkdown) {
    if (!rawMarkdown) return '';

    const mathStore = [];
    const storeToken = (match) => {
      const idx = mathStore.length;
      mathStore.push(match);
      return `@@ASTRONACCI_MATH_${idx}@@`;
    };

    // 1. Protect display math $$...$$ across lines
    let protectedMd = rawMarkdown.replace(/\$\$[\s\S]+?\$\$/g, storeToken);

    // 2. Protect inline math $...$ within a single line
    protectedMd = protectedMd.replace(/\$(?!\s)([^$\n]+?)(?<!\s)\$/g, storeToken);

    // 3. Parse Markdown via Marked.js
    let html = '';
    if (window.marked && typeof window.marked.parse === 'function') {
      html = window.marked.parse(protectedMd, {
        gfm: true,
        breaks: false
      });
    } else {
      html = protectedMd;
    }

    // 4. Restore LaTeX expressions verbatim
    html = html.replace(/@@ASTRONACCI_MATH_(\d+)@@/g, (_, idxStr) => {
      const index = Number(idxStr);
      return mathStore[index] !== undefined ? mathStore[index] : '';
    });

    return html;
  }

  /**
   * Loads and renders a specific chapter by ID.
   */
  function loadChapter(chapterId, options = {}) {
    const { updateHash = true, scrollToTop = true, targetHeadingId = null } = options;

    if (!state.bookData) return;

    const chapterIndex = state.flatChapters.findIndex((c) => c.id === chapterId);
    const resolvedIndex = chapterIndex >= 0 ? chapterIndex : 0;
    const chapterMeta = state.flatChapters[resolvedIndex];
    if (!chapterMeta) return;

    const resolvedId = chapterMeta.id;
    state.currentChapterId = resolvedId;
    setStorage(STORAGE_KEYS.LAST_CHAPTER, resolvedId);

    if (updateHash) {
      const desiredHash = targetHeadingId ? `#${targetHeadingId}` : `#${resolvedId}`;
      if (window.location.hash !== desiredHash) {
        history.pushState({ chapterId: resolvedId }, '', desiredHash);
      }
    }

    // Update top Kicker & Metadata strip
    if (dom.chapterPartLabel) {
      dom.chapterPartLabel.textContent = chapterMeta.part;
    }
    if (dom.chapterReadTime) {
      dom.chapterReadTime.textContent = `${chapterMeta.computedMinutes} mnt baca`;
    }
    if (dom.chapterWordCount) {
      dom.chapterWordCount.textContent = `${formatNumber(chapterMeta.wordCount)} kata`;
    }

    // Render Markdown & HTML into #chapter-content
    const rawMarkdown = state.bookData.content[resolvedId] || '';
    if (dom.chapterContent) {
      dom.chapterContent.innerHTML = parseMarkdownWithMathProtection(rawMarkdown);
      enhanceRenderedArticle(dom.chapterContent);
      typesetMath(dom.chapterContent);
    }

    // Highlight active chapter in TOC
    updateTocActiveState(resolvedId);

    // Update Prev / Next Chapter Footer Navigation
    updateChapterPagination(resolvedIndex);

    // Build Right-Hand Sticky Section Outline
    buildSectionOutline();

    // Update document title for editorial polish
    document.title = `Bab ${chapterMeta.num}: ${chapterMeta.title} — ASTRONACCI`;

    // Scroll handling
    if (targetHeadingId) {
      requestAnimationFrame(() => {
        scrollToHeading(targetHeadingId);
      });
    } else if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateReadingProgress();
  }

  /**
   * Post-processes rendered chapter DOM:
   * - Tags the first genuine body paragraph with `.lead-para` for Drop Cap styling
   * - Wraps `<table>` elements in `<div class="table-scroll-wrap">` for mobile responsiveness
   * - Binds Lightbox zoom handlers on diagrams & images
   */
  function enhanceRenderedArticle(articleEl) {
    if (!articleEl) return;

    // 0. Remove redundant opening "# BAGIAN ..." H1 (already shown in kicker bar)
    const firstH1 = articleEl.querySelector(':scope > h1');
    if (firstH1 && /^BAGIAN\s+/i.test(firstH1.textContent.trim())) {
      firstH1.remove();
    }

    // Also format opening chapter title (first H1/H2) into clean editorial Title Case if ALL CAPS
    const leadTitle = articleEl.querySelector(':scope > h1, :scope > h2');
    if (leadTitle) {
      leadTitle.classList.add('chapter-main-title');
      const txt = leadTitle.textContent.trim();
      if (txt === txt.toUpperCase() && txt.length > 15) {
        const keepUpper = new Set(['OTE', 'IHSG', 'BEI', 'S&P', 'USD', 'BTC', 'WTI', 'VS', 'II', 'III', 'IV', 'VI', 'XAU']);
        const lowerWords = new Set(['di', 'ke', 'dari', 'dan', 'yang', 'atau', 'untuk', 'pada', 'dalam', 'terhadap', 'oleh', 'sebagai']);
        leadTitle.textContent = txt
          .split(/\s+/)
          .map((w, i) => {
            const clean = w.replace(/[^A-Z0-9&]/g, '');
            if (i === 0 && clean === 'BAB') return 'Bab';
            if (keepUpper.has(clean)) return w;
            if (/^[0-9]+[:.]?$/.test(w)) return w;
            const wLower = w.toLowerCase();
            if (i > 0 && lowerWords.has(wLower)) return wLower;
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
          })
          .join(' ');
      }
    }

    // 1. Tag first genuine body paragraph with .lead-para
    const paragraphs = Array.from(articleEl.querySelectorAll(':scope > p'));
    for (const p of paragraphs) {
      const hasMediaChild = p.querySelector('img, svg, figure, iframe');
      const textLen = (p.textContent || '').trim().length;
      if (!hasMediaChild && textLen >= 50) {
        p.classList.add('lead-para');
        break;
      }
    }

    // 2. Wrap tables in .table-scroll-wrap so wide tables scroll cleanly
    const tables = Array.from(articleEl.querySelectorAll('table'));
    tables.forEach((table) => {
      if (
        table.parentElement &&
        table.parentElement.classList.contains('table-scroll-wrap')
      ) {
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll-wrap';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // 3. Bind Lightbox Modal to images (.zoomable-img or any figure img)
    const images = Array.from(articleEl.querySelectorAll('img'));
    images.forEach((img) => {
      img.classList.add('zoomable-img');
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const figure = img.closest('figure');
        const captionEl = figure ? figure.querySelector('figcaption') : null;
        const captionText = captionEl
          ? captionEl.textContent.trim()
          : img.getAttribute('alt') || '';
        openLightbox(img.src, img.alt || 'Diagram Teknis', captionText);
      });
    });
  }

  /**
   * Renders LaTeX equations via KaTeX auto-render (`renderMathInElement`).
   * Automatically retries if deferred KaTeX scripts are still loading.
   */
  function typesetMath(containerEl, attempt = 0) {
    if (!containerEl) return;

    if (typeof window.renderMathInElement === 'function') {
      try {
        window.renderMathInElement(containerEl, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false,
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        });
      } catch (err) {
        console.warn('KaTeX rendering notice:', err);
      }
    } else if (attempt < 25) {
      setTimeout(() => typesetMath(containerEl, attempt + 1), 120);
    }
  }

  /**
   * Updates the Previous & Next Chapter buttons at the bottom of the reading column.
   */
  function updateChapterPagination(currentIndex) {
    const prevChapter = currentIndex > 0 ? state.flatChapters[currentIndex - 1] : null;
    const nextChapter =
      currentIndex < state.flatChapters.length - 1
        ? state.flatChapters[currentIndex + 1]
        : null;

    if (dom.prevChapterBtn && dom.prevChapterTitle) {
      if (prevChapter) {
        dom.prevChapterBtn.disabled = false;
        dom.prevChapterBtn.classList.remove('disabled');
        dom.prevChapterTitle.textContent = `Bab ${prevChapter.num}: ${prevChapter.title}`;
        dom.prevChapterBtn.onclick = () =>
          loadChapter(prevChapter.id, { updateHash: true, scrollToTop: true });
      } else {
        dom.prevChapterBtn.disabled = true;
        dom.prevChapterBtn.classList.add('disabled');
        dom.prevChapterTitle.textContent = 'Awal Monografi';
        dom.prevChapterBtn.onclick = null;
      }
    }

    if (dom.nextChapterBtn && dom.nextChapterTitle) {
      if (nextChapter) {
        dom.nextChapterBtn.disabled = false;
        dom.nextChapterBtn.classList.remove('disabled');
        dom.nextChapterTitle.textContent = `Bab ${nextChapter.num}: ${nextChapter.title}`;
        dom.nextChapterBtn.onclick = () =>
          loadChapter(nextChapter.id, { updateHash: true, scrollToTop: true });
      } else {
        dom.nextChapterBtn.disabled = true;
        dom.nextChapterBtn.classList.add('disabled');
        dom.nextChapterTitle.textContent = 'Akhir Monografi';
        dom.nextChapterBtn.onclick = null;
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 8. STICKY ON-PAGE SECTION OUTLINE & SCROLL SPY
   * -------------------------------------------------------------------------- */
  function slugifyHeading(text, index) {
    const base = (text || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 64);
    return `sec-${index}-${base || 'sub'}`;
  }

  function buildSectionOutline() {
    if (!dom.sectionOutline || !dom.chapterContent) return;

    if (state.outlineObserver) {
      state.outlineObserver.disconnect();
      state.outlineObserver = null;
    }

    dom.sectionOutline.innerHTML = '';

    const headings = Array.from(
      dom.chapterContent.querySelectorAll('h2, h3, h4')
    ).filter((h) => !h.closest('.callout-box') && !h.classList.contains('chapter-main-title'));

    if (headings.length === 0) {
      const emptyNote = document.createElement('div');
      emptyNote.className = 'outline-empty';
      emptyNote.textContent = 'Tidak ada sub-bagian pada bab ini.';
      dom.sectionOutline.appendChild(emptyNote);
      return;
    }

    const linkMap = new Map();

    headings.forEach((heading, idx) => {
      if (!heading.id) {
        heading.id = slugifyHeading(heading.textContent, idx);
      }

      const tagLevel = heading.tagName.toLowerCase(); // h2, h3, h4
      const levelNum = tagLevel.replace('h', ''); // 2, 3, 4

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.className = `outline-link level-${levelNum}`;
      link.dataset.targetId = heading.id;
      link.textContent = heading.textContent.replace(/\s+/g, ' ').trim();

      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToHeading(heading.id);
        setActiveOutlineLink(heading.id);
      });

      dom.sectionOutline.appendChild(link);
      linkMap.set(heading.id, link);
    });

    // Set initial active link
    if (headings[0]) {
      setActiveOutlineLink(headings[0].id);
    }

    // Setup IntersectionObserver for real-time scroll spy
    if ('IntersectionObserver' in window) {
      state.outlineObserver = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (visibleEntries.length > 0) {
            const topHeadingId = visibleEntries[0].target.id;
            setActiveOutlineLink(topHeadingId);
          }
        },
        {
          root: null,
          rootMargin: '-88px 0px -68% 0px',
          threshold: [0, 1]
        }
      );

      headings.forEach((h) => state.outlineObserver.observe(h));
    }
  }

  function setActiveOutlineLink(headingId) {
    if (!dom.sectionOutline) return;
    const links = dom.sectionOutline.querySelectorAll('.outline-link');
    links.forEach((link) => {
      const isActive = link.dataset.targetId === headingId;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  function scrollToHeading(headingId) {
    const target = document.getElementById(headingId);
    if (!target) return;

    const mastheadHeight = 84;
    const elementTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, elementTop - mastheadHeight),
      behavior: 'smooth'
    });
  }

  /* --------------------------------------------------------------------------
   * 9. READING PROGRESS HAIRLINE
   * -------------------------------------------------------------------------- */
  function updateReadingProgress() {
    if (!dom.progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    dom.progressBar.style.width = `${pct.toFixed(2)}%`;
  }

  /* --------------------------------------------------------------------------
   * 10. THEME SWITCHER, TYPOGRAPHY SCALER & FOCUS MODE
   * -------------------------------------------------------------------------- */
  function applyTheme(themeName) {
    const resolvedTheme =
      themeName === 'theme-midnight' ? 'theme-midnight' : 'theme-broadsheet';
    state.theme = resolvedTheme;

    dom.body.classList.remove('theme-broadsheet', 'theme-midnight');
    dom.body.classList.add(resolvedTheme);

    if (dom.themeLabel) {
      dom.themeLabel.textContent =
        resolvedTheme === 'theme-midnight' ? 'Kertas Klasik' : 'Mode Malam';
    }

    setStorage(STORAGE_KEYS.THEME, resolvedTheme);

    // Trigger canvas redraw in Observatory Lab so colors adapt immediately
    if (window.AstronacciSim && typeof window.AstronacciSim.redraw === 'function') {
      requestAnimationFrame(() => window.AstronacciSim.redraw());
    }
  }

  function toggleTheme() {
    const nextTheme =
      state.theme === 'theme-midnight' ? 'theme-broadsheet' : 'theme-midnight';
    applyTheme(nextTheme);
  }

  function applyFontSize(sizeRem) {
    const clamped = Math.min(
      FONT_SCALE.MAX,
      Math.max(FONT_SCALE.MIN, Number(sizeRem) || FONT_SCALE.DEFAULT)
    );
    state.fontSizeRem = Number(clamped.toFixed(3));
    dom.root.style.setProperty('--article-font-size', `${state.fontSizeRem}rem`);
    setStorage(STORAGE_KEYS.FONT_SIZE, state.fontSizeRem);

    if (dom.fontDecBtn) {
      dom.fontDecBtn.disabled = state.fontSizeRem <= FONT_SCALE.MIN + 0.005;
    }
    if (dom.fontIncBtn) {
      dom.fontIncBtn.disabled = state.fontSizeRem >= FONT_SCALE.MAX - 0.005;
    }
  }

  function applyFocusMode(enabled) {
    state.focusMode = Boolean(enabled);
    dom.body.classList.toggle('focus-mode', state.focusMode);
    if (dom.focusModeBtn) {
      dom.focusModeBtn.classList.toggle('active', state.focusMode);
      dom.focusModeBtn.setAttribute('aria-pressed', String(state.focusMode));
      dom.focusModeBtn.textContent = state.focusMode ? 'Keluar Fokus' : 'Mode Fokus';
    }
    setStorage(STORAGE_KEYS.FOCUS_MODE, state.focusMode ? 'true' : 'false');
  }

  function toggleSidebar() {
    if (window.innerWidth <= 1024) {
      if (dom.sidebar) {
        dom.sidebar.classList.toggle('open');
      }
    } else {
      dom.body.classList.toggle('sidebar-collapsed');
      if (dom.sidebar) {
        dom.sidebar.classList.toggle('collapsed');
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 11. OBSERVATORY LAB DRAWER CONTROLLER
   * -------------------------------------------------------------------------- */
  function toggleSimDrawer(forceOpen) {
    if (!dom.simDrawer) return;
    const isCurrentlyCollapsed = dom.simDrawer.classList.contains('collapsed');
    const shouldOpen =
      typeof forceOpen === 'boolean' ? forceOpen : isCurrentlyCollapsed;

    dom.simDrawer.classList.toggle('collapsed', !shouldOpen);
    if (dom.simDrawerToggle) {
      dom.simDrawerToggle.classList.toggle('active', shouldOpen);
      dom.simDrawerToggle.setAttribute('aria-expanded', String(shouldOpen));
    }

    if (shouldOpen) {
      typesetMath(dom.simDrawer);
      if (window.AstronacciSim && typeof window.AstronacciSim.redraw === 'function') {
        requestAnimationFrame(() => window.AstronacciSim.redraw());
      }
    }
  }

  function switchSimTab(targetSimKey) {
    dom.simTabBtns.forEach((btn) => {
      const isMatch = btn.dataset.sim === targetSimKey;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
    });

    Object.entries(dom.simPanels).forEach(([key, panel]) => {
      if (!panel) return;
      panel.classList.toggle('active', key === targetSimKey);
    });

    if (window.AstronacciSim && typeof window.AstronacciSim.redraw === 'function') {
      requestAnimationFrame(() => window.AstronacciSim.redraw());
    }
  }

  /* --------------------------------------------------------------------------
   * 12. GLOBAL FULL-TEXT SEARCH MODAL (⌘K / Ctrl+K)
   * -------------------------------------------------------------------------- */
  function openSearchModal() {
    if (!dom.searchModal) return;
    dom.searchModal.classList.remove('hidden');
    state.activeSearchIdx = -1;

    if (dom.globalSearchInput) {
      dom.globalSearchInput.focus();
      dom.globalSearchInput.select();
      performGlobalSearch(dom.globalSearchInput.value);
    }
  }

  function closeSearchModal() {
    if (!dom.searchModal) return;
    dom.searchModal.classList.add('hidden');
    state.activeSearchIdx = -1;
  }

  function performGlobalSearch(rawQuery) {
    if (!dom.searchResults) return;
    const query = (rawQuery || '').trim();
    dom.searchResults.innerHTML = '';
    state.activeSearchIdx = -1;

    // When input is empty, show curated quick-access chapters & key topics
    if (query.length < 2) {
      const hintWrap = document.createElement('div');
      hintWrap.className = 'search-empty-state';
      hintWrap.style.padding = '1rem 1.25rem';
      hintWrap.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.65; margin-bottom: 0.65rem;">
          TOPIK POPULER &amp; INDEKS CEPAT
        </div>
        <div class="quick-search-chips" style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 1rem;">
          <button type="button" class="btn-chip search-suggest-chip" data-q="Golden Pocket">Golden Pocket (0.618–0.65)</button>
          <button type="button" class="btn-chip search-suggest-chip" data-q="Sinodik Bulan">Siklus Sinodik Bulan</button>
          <button type="button" class="btn-chip search-suggest-chip" data-q="Gann Square of Nine">Gann Square of Nine</button>
          <button type="button" class="btn-chip search-suggest-chip" data-q="Mercury Retrograde">Mercury Retrograde</button>
          <button type="button" class="btn-chip search-suggest-chip" data-q="Elliott Wave">Elliott Wave</button>
          <button type="button" class="btn-chip search-suggest-chip" data-q="IHSG">Studi Kasus IHSG</button>
          <button type="button" class="btn-chip search-suggest-chip" data-q="Bitcoin">Siklus Halving Bitcoin</button>
        </div>
      `;

      hintWrap.querySelectorAll('.search-suggest-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const suggested = chip.dataset.q || '';
          if (dom.globalSearchInput) {
            dom.globalSearchInput.value = suggested;
            dom.globalSearchInput.focus();
          }
          performGlobalSearch(suggested);
        });
      });

      dom.searchResults.appendChild(hintWrap);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const terms = lowerQuery.split(/\s+/).filter(Boolean);

    const results = [];

    state.searchIndex.forEach((entry) => {
      let score = 0;
      let firstMatchPos = -1;

      if (entry.lowerTitle.includes(lowerQuery)) {
        score += 100;
      }

      terms.forEach((term) => {
        if (entry.lowerTitle.includes(term)) score += 35;
        if (entry.lowerPart.includes(term)) score += 10;

        const pos = entry.lowerText.indexOf(term);
        if (pos !== -1) {
          score += 15;
          if (firstMatchPos === -1 || pos < firstMatchPos) {
            firstMatchPos = pos;
          }
        }
      });

      if (score > 0) {
        const snippet = buildHighlightedSnippet(entry.plainText, terms, firstMatchPos);
        results.push({
          id: entry.id,
          num: entry.num,
          title: entry.title,
          part: entry.part,
          score,
          snippet
        });
      }
    });

    results.sort((a, b) => b.score - a.score || a.num - b.num);

    if (results.length === 0) {
      const noRes = document.createElement('div');
      noRes.className = 'search-no-results';
      noRes.style.padding = '2rem 1.25rem';
      noRes.style.textAlign = 'center';
      noRes.style.opacity = '0.75';
      noRes.innerHTML = `Tidak ditemukan hasil untuk <strong>"${escapeHtml(query)}"</strong> di seluruh 17 bab.`;
      dom.searchResults.appendChild(noRes);
      return;
    }

    results.forEach((item, idx) => {
      const resultBtn = document.createElement('button');
      resultBtn.type = 'button';
      resultBtn.className = 'search-result-item';
      resultBtn.dataset.chapterId = item.id;
      resultBtn.dataset.index = String(idx);

      const numBadge = String(item.num).padStart(2, '0');
      const highlightedTitle = highlightTermsInHtml(item.title, terms);

      resultBtn.innerHTML = `
        <div class="search-result-meta">
          <span class="search-result-badge">BAB ${numBadge}</span>
          <span class="search-result-part">${escapeHtml(item.part)}</span>
        </div>
        <div class="search-result-title">${highlightedTitle}</div>
        <div class="search-result-snippet">${item.snippet}</div>
      `;

      resultBtn.addEventListener('click', () => {
        closeSearchModal();
        loadChapter(item.id, { updateHash: true, scrollToTop: true });
      });

      dom.searchResults.appendChild(resultBtn);
    });
  }

  function buildHighlightedSnippet(plainText, terms, matchPos) {
    if (!plainText) return '';
    const radius = 95;
    const start = matchPos > radius ? matchPos - radius : 0;
    const end = Math.min(plainText.length, start + radius * 2.4);

    let excerpt = plainText.slice(start, end).trim();
    if (start > 0) excerpt = '…' + excerpt;
    if (end < plainText.length) excerpt = excerpt + '…';

    return highlightTermsInHtml(excerpt, terms);
  }

  function highlightTermsInHtml(text, terms) {
    let safe = escapeHtml(text);
    if (!terms || terms.length === 0) return safe;

    const escapedTerms = terms
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter((t) => t.length >= 2);

    if (escapedTerms.length === 0) return safe;

    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    return safe.replace(regex, '<mark>$1</mark>');
  }

  function navigateSearchResults(direction) {
    if (!dom.searchResults) return;
    const items = Array.from(dom.searchResults.querySelectorAll('.search-result-item'));
    if (items.length === 0) return;

    state.activeSearchIdx += direction;
    if (state.activeSearchIdx < 0) state.activeSearchIdx = items.length - 1;
    if (state.activeSearchIdx >= items.length) state.activeSearchIdx = 0;

    items.forEach((el, idx) => {
      const isSelected = idx === state.activeSearchIdx;
      el.classList.toggle('active', isSelected);
      if (isSelected) {
        el.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 13. LIGHTBOX DIAGRAM MODAL
   * -------------------------------------------------------------------------- */
  function openLightbox(src, alt, caption) {
    if (!dom.lightboxModal || !dom.lightboxImg) return;
    dom.lightboxImg.src = src;
    dom.lightboxImg.alt = alt || 'Diagram Teknis';
    if (dom.lightboxCaption) {
      dom.lightboxCaption.textContent = caption || alt || '';
    }
    dom.lightboxModal.classList.remove('hidden');
  }

  function closeLightbox() {
    if (!dom.lightboxModal) return;
    dom.lightboxModal.classList.add('hidden');
    if (dom.lightboxImg) {
      dom.lightboxImg.src = '';
    }
  }

  /* --------------------------------------------------------------------------
   * 14. UTILITY HELPERS
   * -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolveInitialChapterFromHashOrStorage() {
    const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
    if (rawHash) {
      const matchedChapter = state.flatChapters.find((c) => c.id === rawHash);
      if (matchedChapter) {
        return { chapterId: matchedChapter.id, headingId: null };
      }
    }

    const storedChapter = getStorage(STORAGE_KEYS.LAST_CHAPTER, 'bab-01');
    const validStored = state.flatChapters.find((c) => c.id === storedChapter);
    return {
      chapterId: validStored ? validStored.id : state.flatChapters[0].id,
      headingId: null
    };
  }

  /* --------------------------------------------------------------------------
   * 15. EVENT LISTENERS BINDING
   * -------------------------------------------------------------------------- */
  function bindEvents() {
    // 1. Sidebar Toggle
    if (dom.sidebarToggle) {
      dom.sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // 2. TOC Live Filter
    if (dom.tocFilterInput) {
      dom.tocFilterInput.addEventListener('input', (e) => {
        renderToc(e.target.value);
      });
    }

    // 3. Theme Toggle
    if (dom.themeToggleBtn) {
      dom.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // 4. Typography Scaler (A- / A+)
    if (dom.fontDecBtn) {
      dom.fontDecBtn.addEventListener('click', () => {
        applyFontSize(state.fontSizeRem - FONT_SCALE.STEP);
      });
    }
    if (dom.fontIncBtn) {
      dom.fontIncBtn.addEventListener('click', () => {
        applyFontSize(state.fontSizeRem + FONT_SCALE.STEP);
      });
    }

    // 5. Focus Mode Button
    if (dom.focusModeBtn) {
      dom.focusModeBtn.addEventListener('click', () => {
        applyFocusMode(!state.focusMode);
      });
    }

    // 6. Observatory Lab Drawer Controls
    if (dom.simDrawerToggle) {
      dom.simDrawerToggle.addEventListener('click', () => toggleSimDrawer());
    }
    if (dom.simCloseBtn) {
      dom.simCloseBtn.addEventListener('click', () => toggleSimDrawer(false));
    }
    dom.simTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const simType = btn.dataset.sim;
        if (simType) switchSimTab(simType);
      });
    });

    // 7. Back to Top Button
    if (dom.backToTopBtn) {
      dom.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 8. Search Modal Controls
    if (dom.searchModalBtn) {
      dom.searchModalBtn.addEventListener('click', openSearchModal);
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform);
      const kbd = dom.searchModalBtn.querySelector('.kbd-hint');
      if (kbd && !isMac) {
        kbd.textContent = 'Ctrl+K';
      }
    }
    if (dom.searchCloseBtn) {
      dom.searchCloseBtn.addEventListener('click', closeSearchModal);
    }
    if (dom.searchBackdrop) {
      dom.searchBackdrop.addEventListener('click', closeSearchModal);
    }
    if (dom.globalSearchInput) {
      dom.globalSearchInput.addEventListener('input', (e) => {
        performGlobalSearch(e.target.value);
      });
      dom.globalSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          navigateSearchResults(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          navigateSearchResults(-1);
        } else if (e.key === 'Enter' && state.activeSearchIdx >= 0 && dom.searchResults) {
          const items = dom.searchResults.querySelectorAll('.search-result-item');
          const activeItem = items[state.activeSearchIdx];
          if (activeItem) {
            e.preventDefault();
            activeItem.click();
          }
        }
      });
    }

    // 9. Lightbox Modal Controls
    if (dom.lightboxCloseBtn) {
      dom.lightboxCloseBtn.addEventListener('click', closeLightbox);
    }
    if (dom.lightboxBackdrop) {
      dom.lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    // 10. Global Keyboard Shortcuts (⌘K / Ctrl+K & Escape)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dom.searchModal && !dom.searchModal.classList.contains('hidden')) {
          closeSearchModal();
        } else {
          openSearchModal();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (dom.lightboxModal && !dom.lightboxModal.classList.contains('hidden')) {
          closeLightbox();
          return;
        }
        if (dom.searchModal && !dom.searchModal.classList.contains('hidden')) {
          closeSearchModal();
          return;
        }
        if (dom.simDrawer && !dom.simDrawer.classList.contains('collapsed')) {
          toggleSimDrawer(false);
        }
      }
    });

    // 11. Scroll & Hashchange Listeners
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress, { passive: true });

    window.addEventListener('hashchange', () => {
      const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
      if (!rawHash) return;

      const matchedChapter = state.flatChapters.find((c) => c.id === rawHash);
      if (matchedChapter && matchedChapter.id !== state.currentChapterId) {
        loadChapter(matchedChapter.id, { updateHash: false, scrollToTop: true });
      } else {
        const headingEl = document.getElementById(rawHash);
        if (headingEl) {
          scrollToHeading(rawHash);
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 16. INITIALIZATION BOOTSTRAP
   * -------------------------------------------------------------------------- */
  function initApp() {
    cacheDom();

    if (!buildBookCatalog()) {
      return;
    }

    // Restore persisted user preferences
    const savedTheme = getStorage(STORAGE_KEYS.THEME, 'theme-broadsheet');
    applyTheme(savedTheme);

    const savedFontSize = parseFloat(
      getStorage(STORAGE_KEYS.FONT_SIZE, String(FONT_SCALE.DEFAULT))
    );
    applyFontSize(savedFontSize);

    const savedFocusMode = getStorage(STORAGE_KEYS.FOCUS_MODE, 'false') === 'true';
    applyFocusMode(savedFocusMode);

    // Render full TOC in sidebar
    renderToc('');

    // Determine initial chapter from URL hash or localStorage
    const { chapterId, headingId } = resolveInitialChapterFromHashOrStorage();
    loadChapter(chapterId, {
      updateHash: Boolean(window.location.hash),
      scrollToTop: !headingId,
      targetHeadingId: headingId
    });

    // Typeset math in Observatory Lab Drawer
    if (dom.simDrawer) {
      typesetMath(dom.simDrawer);
    }

    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();