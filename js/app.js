/* ==========================================================================
   ASTRONACCI MASTER APPLICATION LOGIC
   RizaCorp Financial Intelligence
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const data = window.ASTRONACCI_BOOK_DATA;
  if (!data) {
    console.error("Master chapter data not found.");
    return;
  }

  let currentChapterId = "bab-01";

  // Elements
  const tocNav = document.getElementById('toc-nav');
  const chapterContentEl = document.getElementById('chapter-content');
  const chapterPartLabel = document.getElementById('chapter-part-label');
  const chapterReadTime = document.getElementById('chapter-read-time');
  const prevBtn = document.getElementById('prev-chapter-btn');
  const nextBtn = document.getElementById('next-chapter-btn');
  const prevTitle = document.getElementById('prev-chapter-title');
  const nextTitle = document.getElementById('next-chapter-title');
  const progressBar = document.getElementById('reading-progress-bar');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const simDrawerToggle = document.getElementById('sim-drawer-toggle');
  const simDrawer = document.getElementById('sim-drawer');
  const simCloseBtn = document.getElementById('sim-close-btn');

  // Build Table of Contents
  function buildTOC() {
    tocNav.innerHTML = '';
    data.toc.forEach((section, sIdx) => {
      const partHeader = document.createElement('div');
      partHeader.className = 'toc-part-header';
      partHeader.textContent = section.part;
      tocNav.appendChild(partHeader);

      section.chapters.forEach(ch => {
        const item = document.createElement('div');
        item.className = `toc-chapter-item ${ch.id === currentChapterId ? 'active' : ''} ${ch.status === 'locked' ? 'locked' : ''}`;
        item.dataset.id = ch.id;

        const numSpan = document.createElement('span');
        numSpan.className = 'toc-num';
        numSpan.textContent = String(ch.num).padStart(2, '0');

        const titleSpan = document.createElement('span');
        titleSpan.className = 'toc-chapter-title';
        titleSpan.textContent = ch.title;

        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'toc-badge';
        badgeSpan.textContent = ch.time;

        item.appendChild(numSpan);
        item.appendChild(titleSpan);
        item.appendChild(badgeSpan);

        if (ch.status === 'available') {
          item.addEventListener('click', () => loadChapter(ch.id));
        } else {
          item.title = "Akan hadir pada sprint berikutnya.";
        }

        tocNav.appendChild(item);
      });
    });
  }

  // Find chapter metadata
  function getChapterMeta(id) {
    for (let sec of data.toc) {
      for (let ch of sec.chapters) {
        if (ch.id === id) {
          return { part: sec.part, chapter: ch };
        }
      }
    }
    return null;
  }

  // Load and Render Chapter
  function loadChapter(id) {
    const rawMarkdown = data.content[id];
    if (!rawMarkdown) {
      chapterContentEl.innerHTML = `
        <div style="padding: 3rem 0; text-align: center; color: var(--text-muted);">
          <h2>Materi Sedang Disusun</h2>
          <p>Bab ini dijadwalkan untuk dirilis pada Sprint berikutnya sesuai kalender kurikulum.</p>
        </div>
      `;
      return;
    }

    currentChapterId = id;

    // Update Meta Bar
    const meta = getChapterMeta(id);
    if (meta) {
      chapterPartLabel.textContent = meta.part.split(':')[0];
      chapterReadTime.textContent = `Estimasi Baca: ${meta.chapter.time}`;
      document.title = `Bab ${meta.chapter.num}: ${meta.chapter.title} | ASTRONACCI`;
    }

    // Parse Markdown
    if (window.marked) {
      chapterContentEl.innerHTML = marked.parse(rawMarkdown);
    } else {
      chapterContentEl.innerHTML = rawMarkdown;
    }

    // Auto-render KaTeX
    if (window.renderMathInElement) {
      try {
        renderMathInElement(chapterContentEl, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn("KaTeX rendering warning:", err);
      }
    }

    // Highlight active in TOC
    document.querySelectorAll('.toc-chapter-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === id);
    });

    // Update Pagination
    updatePagination(id);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Pagination Handler (Dynamic from available chapters in TOC)
  function updatePagination(id) {
    const available = [];
    data.toc.forEach(sec => {
      sec.chapters.forEach(ch => {
        if (ch.status === 'available') available.push(ch.id);
      });
    });
    const currIdx = available.indexOf(id);

    if (currIdx > 0) {
      prevBtn.disabled = false;
      const prevMeta = getChapterMeta(available[currIdx - 1]);
      prevTitle.textContent = prevMeta ? `Bab ${prevMeta.chapter.num}: ${prevMeta.chapter.title}` : "Sebelumnya";
      prevBtn.onclick = () => loadChapter(available[currIdx - 1]);
    } else {
      prevBtn.disabled = true;
      prevTitle.textContent = "-";
      prevBtn.onclick = null;
    }

    if (currIdx < available.length - 1) {
      nextBtn.disabled = false;
      const nextMeta = getChapterMeta(available[currIdx + 1]);
      nextTitle.textContent = nextMeta ? `Bab ${nextMeta.chapter.num}: ${nextMeta.chapter.title}` : "Selanjutnya";
      nextBtn.onclick = () => loadChapter(available[currIdx + 1]);
    } else {
      nextBtn.disabled = true;
      nextTitle.textContent = "Sprint 3 (Segera Hadir)";
      nextBtn.onclick = null;
    }
  }

  // Reading Progress Bar
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH > 0) {
      const scrolled = (window.scrollY / docH) * 100;
      progressBar.style.width = `${scrolled}%`;
    }
  });

  // Sidebar Mobile Toggle
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      sidebar.classList.toggle('open');
    });
  }

  // Simulator Drawer Toggle
  if (simDrawerToggle && simDrawer) {
    simDrawerToggle.addEventListener('click', () => {
      simDrawer.classList.toggle('collapsed');
      if (!simDrawer.classList.contains('collapsed')) {
        simDrawer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (simCloseBtn && simDrawer) {
    simCloseBtn.addEventListener('click', () => {
      simDrawer.classList.add('collapsed');
    });
  }

  // Simulation Tabs
  document.querySelectorAll('.sim-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabTarget = e.currentTarget.getAttribute('data-sim');
      document.querySelectorAll('.sim-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.sim-panel').forEach(p => p.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const targetPanel = document.getElementById(`sim-${tabTarget}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Lightbox Modal Logic
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (chapterContentEl && lightboxModal) {
    chapterContentEl.addEventListener('click', (e) => {
      const img = e.target.closest('.zoomable-img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      const fig = img.closest('figure');
      const cap = fig ? fig.querySelector('figcaption') : null;
      lightboxCaption.innerHTML = cap ? cap.innerHTML : (img.alt || '');
      lightboxModal.classList.remove('hidden');
    });

    const closeLB = () => lightboxModal.classList.add('hidden');
    if (lightboxClose) lightboxClose.addEventListener('click', closeLB);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLB();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightboxModal.classList.contains('hidden')) closeLB();
    });
  }

  // Init App
  buildTOC();
  loadChapter("bab-01");

  // Init Interactive Simulator
  if (window.AstronacciSim) {
    window.AstronacciSim.init();
  }
});
