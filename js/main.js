/* ===================================================
   RESALEHOME.COM — main.js
   =================================================== */

(function () {
  'use strict';

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- Mobile hamburger ---------- */
  var hamburger  = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    /* close when a link is tapped */
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Registration Modal ---------- */
  var overlay      = document.getElementById('modal-overlay');
  var modalCard    = document.getElementById('modal-card');
  var modalClose   = document.getElementById('modal-close');
  var regForm      = document.getElementById('reg-form');
  var successPane  = document.getElementById('modal-success');
  var triggers     = document.querySelectorAll('[data-modal="register"]');

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    /* focus the first focusable field */
    var first = modalCard.querySelector('input, select, textarea, button');
    if (first) { setTimeout(function () { first.focus(); }, 50); }
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (overlay && triggers.length) {
    triggers.forEach(function (btn) {
      btn.addEventListener('click', openModal);
    });

    /* click outside card */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeModal(); }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  /* Escape key closes */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeModal();
    }
  });

  /* Focus trap */
  if (modalCard) {
    modalCard.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') { return; }
      var focusable = Array.from(
        modalCard.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(function (el) { return !el.closest('.modal-success') || el.closest('.modal-success.visible'); });

      if (!focusable.length) { return; }
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* Form submission */
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ref = 'RH-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('success-ref').textContent = 'Reference: ' + ref;
      regForm.style.display = 'none';
      successPane.classList.add('visible');
      /* focus success message for accessibility */
      successPane.setAttribute('tabindex', '-1');
      successPane.focus();
      /* reset for next open */
      setTimeout(function () {
        overlay.addEventListener('click', function resetOnClose() {
          regForm.reset();
          regForm.style.display = '';
          successPane.classList.remove('visible');
          overlay.removeEventListener('click', resetOnClose);
        });
      }, 0);
    });
  }

  /* ---------- Intersection Observer — scroll animations ---------- */
  var IO_OPTIONS = { threshold: 0.15 };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      var el = entry.target;
      el.classList.add('visible');
      observer.unobserve(el);
    });
  }, IO_OPTIONS);

  /* Stagger cards within a parent by adding delay via inline style */
  function observeWithDelay(elements, baseDelay, step) {
    elements.forEach(function (el, i) {
      el.style.transitionDelay = (baseDelay + i * step) + 's';
      observer.observe(el);
    });
  }

  /* Section labels */
  document.querySelectorAll('.anim-label').forEach(function (el) {
    observer.observe(el);
  });

  /* H2 headings — delay after label */
  document.querySelectorAll('.anim-heading').forEach(function (el) {
    el.style.transitionDelay = '0.1s';
    observer.observe(el);
  });

  /* Cards / pills — staggered */
  document.querySelectorAll('.anim-group').forEach(function (group) {
    var cards = group.querySelectorAll('.anim-card');
    observeWithDelay(Array.from(cards), 0.1, 0.08);
  });

  /* Single cards not in groups */
  document.querySelectorAll('.anim-card:not(.anim-group .anim-card)').forEach(function (el) {
    observer.observe(el);
  });

})();
