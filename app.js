/* ==========================================================================
   Jack Johnston — Engineering Portfolio Shared Script
   Theme persistence, Dropdown Nav, Filters, Synced Photo Slots, Scroll-Spy
   ========================================================================== */

(function () {
  const THEME_KEY = 'jj_portfolio_theme';
  const PHOTO_PREFIX = 'jj_photo_slot_';

  // 1. Monochrome Theme Persistence
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.textContent = theme === 'light' ? 'Dark' : 'Light';
      btn.setAttribute('aria-label', 'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' monochrome theme');
    });
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    });

    // 2. Desktop Portfolio Dropdown Click Support
    document.querySelectorAll('.nav-dropdown').forEach((dd) => {
      const trigger = dd.querySelector('[data-dropdown-trigger]');
      if (!trigger) return;
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        dd.classList.toggle('open');
      });
    });

    document.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-dropdown.open').forEach((dd) => {
        if (!dd.contains(e.target)) dd.classList.remove('open');
      });
    });

    // 3. Mobile Drawer
    const mobileBtn = document.querySelector('[data-mobile-toggle]');
    const mobileDrawer = document.querySelector('[data-mobile-drawer]');
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileBtn.textContent = isOpen ? 'Close' : 'Menu';
      });
    }

    // 4. Interactive Synced Photo Slots (supports default repo images + local drag-and-drop)
    function loadSlotState(slotId) {
      try {
        const raw = localStorage.getItem(PHOTO_PREFIX + slotId);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function saveSlotState(slotId, state) {
      try {
        if (!state) {
          localStorage.removeItem(PHOTO_PREFIX + slotId);
        } else {
          localStorage.setItem(PHOTO_PREFIX + slotId, JSON.stringify(state));
        }
      } catch (e) {
        // Ignore quota exceeded for large local images; current view still updates.
      }
    }

    function syncResumeAvatar(src) {
      document.querySelectorAll('[data-resume-avatar]').forEach((box) => {
        if (src) {
          box.innerHTML = '<img src="' + src + '" alt="Jack Johnston portrait">';
        }
      });
    }

    function renderSlot(slotEl, customState) {
      const slotId = slotEl.getAttribute('data-photo-slot');
      const img = slotEl.querySelector('img.slot-img');
      const defaultSrc = slotEl.getAttribute('data-default-src') || '';
      const defaultBw = slotEl.getAttribute('data-default-bw') === 'true';
      const state = customState !== undefined ? customState : loadSlotState(slotId);

      const bwBtn = slotEl.querySelector('[data-slot-bw]');
      const fitBtn = slotEl.querySelector('[data-slot-fit]');

      function showPlaceholder() {
        slotEl.classList.remove('has-image', 'is-bw', 'fit-contain');
        img.removeAttribute('src');
      }

      if (state && state.src) {
        img.onerror = showPlaceholder;
        img.src = state.src;
        slotEl.classList.add('has-image');
        slotEl.classList.toggle('is-bw', !!state.bw);
        slotEl.classList.toggle('fit-contain', state.fit === 'contain');
        if (bwBtn) bwBtn.textContent = state.bw ? 'Color' : 'B&W';
        if (fitBtn) fitBtn.textContent = state.fit === 'contain' ? 'Fill' : 'Fit';
        if (slotId === 'portrait') syncResumeAvatar(state.src);
        return;
      }

      if (defaultSrc) {
        img.onload = () => {
          slotEl.classList.add('has-image');
          slotEl.classList.toggle('is-bw', defaultBw);
          if (bwBtn) bwBtn.textContent = defaultBw ? 'Color' : 'B&W';
          if (fitBtn) fitBtn.textContent = 'Fit';
        };
        img.onerror = showPlaceholder;
        img.src = defaultSrc;
        return;
      }

      showPlaceholder();
    }

    function broadcastSlot(slotId, state) {
      saveSlotState(slotId, state);
      document.querySelectorAll('[data-photo-slot="' + slotId + '"]').forEach((el) => {
        renderSlot(el, state);
      });
    }

    document.querySelectorAll('[data-photo-slot]').forEach((slotEl) => {
      const slotId = slotEl.getAttribute('data-photo-slot');
      const fileInput = slotEl.querySelector('input[type="file"]');
      const uploadBtns = slotEl.querySelectorAll('[data-slot-upload]');
      const bwBtn = slotEl.querySelector('[data-slot-bw]');
      const fitBtn = slotEl.querySelector('[data-slot-fit]');
      const clearBtn = slotEl.querySelector('[data-slot-clear]');

      renderSlot(slotEl);

      function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const prev = loadSlotState(slotId) || {
            bw: slotEl.getAttribute('data-default-bw') === 'true',
            fit: 'cover'
          };
          broadcastSlot(slotId, { src: ev.target.result, bw: prev.bw, fit: prev.fit });
        };
        reader.readAsDataURL(file);
      }

      uploadBtns.forEach((b) => {
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          if (fileInput) fileInput.click();
        });
      });

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
          e.target.value = '';
        });
      }

      slotEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotEl.classList.add('drag-over');
      });

      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('drag-over');
      });

      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      });

      if (bwBtn) {
        bwBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const currentImg = slotEl.querySelector('img.slot-img').src;
          const prev = loadSlotState(slotId) || { src: currentImg, bw: slotEl.classList.contains('is-bw'), fit: slotEl.classList.contains('fit-contain') ? 'contain' : 'cover' };
          prev.bw = !prev.bw;
          broadcastSlot(slotId, prev);
        });
      }

      if (fitBtn) {
        fitBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const currentImg = slotEl.querySelector('img.slot-img').src;
          const prev = loadSlotState(slotId) || { src: currentImg, bw: slotEl.classList.contains('is-bw'), fit: slotEl.classList.contains('fit-contain') ? 'contain' : 'cover' };
          prev.fit = prev.fit === 'contain' ? 'cover' : 'contain';
          broadcastSlot(slotId, prev);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          broadcastSlot(slotId, null);
        });
      }
    });

    // 5. Generic Category Filter Groups
    document.querySelectorAll('[data-filter-group]').forEach((group) => {
      const targetSelector = group.getAttribute('data-filter-group');
      const buttons = group.querySelectorAll('[data-filter]');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-filter');
          buttons.forEach((b) => b.classList.toggle('active', b === btn));
          document.querySelectorAll(targetSelector).forEach((item) => {
            const cats = (item.getAttribute('data-category') || '').split(',').map((s) => s.trim());
            const show = val === 'all' || cats.includes(val);
            item.classList.toggle('hidden', !show);
            item.style.display = show ? '' : 'none';
          });
        });
      });
    });

    // 6. Copy-to-Clipboard Buttons
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        const original = btn.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'Copied';
          setTimeout(() => { btn.textContent = original; }, 1600);
        });
      });
    });

    // 7. Scroll-Spy for Tilt Table Jump Bar
    const jumpLinks = document.querySelectorAll('.jump-link[href^="#"]');
    if (jumpLinks.length) {
      const sections = Array.from(jumpLinks)
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

      const onScroll = () => {
        const y = window.scrollY + 150;
        let currentId = sections[0] ? sections[0].id : '';
        sections.forEach((sec) => {
          if (sec.offsetTop <= y) currentId = sec.id;
        });
        jumpLinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // 8. Contact Composer
    const composeForm = document.querySelector('[data-contact-form]');
    if (composeForm) {
      const openBtn = composeForm.querySelector('[data-mailto-btn]');
      const copyBtn = composeForm.querySelector('[data-copy-msg-btn]');
      const getFields = () => ({
        name: (composeForm.querySelector('#c-name').value || '').trim(),
        email: (composeForm.querySelector('#c-email').value || '').trim(),
        subject: (composeForm.querySelector('#c-subject').value || 'Engineering Portfolio Inquiry').trim(),
        message: (composeForm.querySelector('#c-message').value || '').trim(),
      });

      if (openBtn) {
        openBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const f = getFields();
          const body = (f.message || '') + (f.name ? '\n\n— ' + f.name + (f.email ? ' (' + f.email + ')' : '') : '');
          window.location.href = 'mailto:jjackjohnston05@gmail.com?subject=' + encodeURIComponent(f.subject) + '&body=' + encodeURIComponent(body);
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const f = getFields();
          const txt = 'To: jjackjohnston05@gmail.com\nSubject: ' + f.subject + '\n\n' + f.message + (f.name ? '\n\n— ' + f.name + (f.email ? ' (' + f.email + ')' : '') : '');
          navigator.clipboard.writeText(txt).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied';
            setTimeout(() => { copyBtn.textContent = orig; }, 1600);
          });
        });
      }
    }
  });
})();
