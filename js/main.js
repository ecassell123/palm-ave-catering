/* =============================================================
   PALM AVE CATERING — main.js
   Handles:
     - Smooth scrolling for nav links
     - Navbar shadow on scroll
     - Active nav link highlighting
     - Mobile nav auto-close on link click
     - Contact form placeholder behavior
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {


  /* -----------------------------------------------------------
     1. SMOOTH SCROLL — all anchor links pointing to #sections
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('mainNav')
        ? document.getElementById('mainNav').offsetHeight
        : 78;

      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* -----------------------------------------------------------
     2. NAVBAR — add shadow + scrolled class on scroll
  ----------------------------------------------------------- */
  const nav = document.getElementById('mainNav');

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* -----------------------------------------------------------
     3. ACTIVE NAV LINK — highlight link for visible section
  ----------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function setActiveLink() {
    const navHeight = nav ? nav.offsetHeight : 78;
    let currentId = '';

    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= navHeight + 60) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* -----------------------------------------------------------
     4. MOBILE NAV — close collapsed menu on link click
  ----------------------------------------------------------- */
  const navbarCollapse = document.getElementById('navMenu');
  const navToggler = document.querySelector('.navbar-toggler');

  if (navbarCollapse) {
    navbarCollapse.querySelectorAll('.nav-link, .btn-inquire').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navbarCollapse.classList.contains('show')) {
          // Use Bootstrap's collapse API if available, otherwise toggle manually
          if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.hide();
          } else if (navToggler) {
            navToggler.click();
          }
        }
      });
    });
  }


  /* -----------------------------------------------------------
     5. CONTACT FORM — Web3Forms submission
     Submits to https://api.web3forms.com/submit via fetch.
     Replace YOUR_ACCESS_KEY_HERE in index.html with the key
     from web3forms.com to activate email delivery.
  ----------------------------------------------------------- */
  const form = document.getElementById('cateringInquiryForm');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Bootstrap validation check
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          showFormMessage('success', '✓ Thanks for reaching out! Your inquiry has been received and we’ll be in touch within 1–2 business days.');
          form.reset();
          form.classList.remove('was-validated');
        } else {
          showFormMessage('error', 'Something went wrong — please try emailing us directly at <a href="mailto:info@palmavecatering.com">info@palmavecatering.com</a>.');
        }
      } catch (err) {
        showFormMessage('error', 'Could not send your message. Please email us at <a href="mailto:info@palmavecatering.com">info@palmavecatering.com</a>.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Submit Catering Inquiry';
        }
      }
    });
  }

  function showFormMessage(type, html) {
    const existing = document.querySelector('.form-status-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'form-status-message form-status-' + type;
    msg.innerHTML = html;

    if (form) {
      form.parentNode.insertBefore(msg, form.nextSibling);
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }


  /* -----------------------------------------------------------
     6. IMAGE LOAD FALLBACK — swap hero to solid bg if img fails
  ----------------------------------------------------------- */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const testImg = new Image();
    testImg.onerror = function () {
      heroSection.style.backgroundImage = 'none';
      heroSection.style.backgroundColor = '#3a2222';
    };
    testImg.src = 'assets/images/grazing-table-full.jpg';
  }

});
