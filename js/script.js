/*
  GYBRIELLE PORTFOLIO — Script
  EmailJS setup (free, 200 emails/month):
  1. Sign up at emailjs.com
  2. Connect Gmail → copy Service ID
  3. Create template with: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
  4. Copy Template ID and Public Key
  5. Replace the three values below
*/

const EJS_KEY      = 'mUp-zDkpZiKtC-s8m';
const EJS_SERVICE  = 'service_9klmj0t';
const EJS_TEMPLATE = 'template_ohap81z';

(function () {
  'use strict';

  if (typeof emailjs !== 'undefined' && EJS_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EJS_KEY });
  }

  /* ── THEME ── */
  const themeBtn  = document.getElementById('themeToggle');
  const darkVideo = document.querySelector('.dark-video');

  // When video finishes, hold on the last frame — do nothing (no loop, no reset)
  if (darkVideo) {
    darkVideo.addEventListener('ended', () => {
      // stay on last frame — browser keeps the final frame visible automatically
    });
  }

  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeBtn.setAttribute('aria-checked', dark ? 'true' : 'false');
    localStorage.setItem('theme', dark ? 'dark' : 'light');

    if (darkVideo) {
      if (dark) {
        // play from beginning every time user switches to dark
        darkVideo.currentTime = 0;
        darkVideo.play().catch(() => {});
      } else {
        // pause and reset so next dark toggle replays from start
        darkVideo.pause();
        darkVideo.currentTime = 0;
      }
    }
  }

  setTheme(localStorage.getItem('theme') === 'dark');
  themeBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));

  /* ── TABS ── */
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = {
    home:    document.getElementById('home-content'),
    resume:  document.getElementById('resume-content'),
    work:    document.getElementById('work-content'),
    contact: document.getElementById('contact-content'),
  };

  function activateTab(id) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    Object.entries(sections).forEach(([k, el]) => {
      if (el) el.classList.toggle('active-content', k === id);
    });
    setTimeout(runReveal, 60);
  }

  tabs.forEach(t => t.addEventListener('click', e => {
    e.preventDefault();
    if (t.dataset.tab) activateTab(t.dataset.tab);
  }));

  activateTab('home');

  /* ── DOWNLOAD ── */
  document.getElementById('downloadResumeBtn').addEventListener('click', () => {
    const a = Object.assign(document.createElement('a'), {
      href: 'resume/Gybrielle Gacilo.pdf',
      download: 'Gybrielle_Gacilo_Resume.pdf',
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  /* ── CERTS TOGGLE ── */
  const certBtn = document.getElementById('viewAllCerts');
  if (certBtn) {
    certBtn.addEventListener('click', function () {
      const container = document.querySelector('.certifications-container');
      const open = container.classList.toggle('expanded');
      this.classList.toggle('expanded', open);
      this.querySelector('.btn-text').textContent = open ? 'Show Less' : 'View All Certifications';
    });
  }

  /* ── CONTACT FORM ── */
  const form    = document.getElementById('contactForm');
  const msgEl   = document.getElementById('formMessage');
  const sendBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;

      const label   = sendBtn.querySelector('.btn-label');
      const spinner = sendBtn.querySelector('.btn-sending');

      sendBtn.disabled     = true;
      label.style.display  = 'none';
      spinner.style.display = 'inline-flex';
      hideMsg();

      const params = {
        from_name:  form.from_name.value.trim(),
        from_email: form.from_email.value.trim(),
        subject:    form.subject.value.trim(),
        message:    form.message.value.trim(),
        reply_to:   form.from_email.value.trim(),
      };

      try {
        if (typeof emailjs !== 'undefined' && EJS_SERVICE !== 'YOUR_SERVICE_ID') {
          await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, params);
          showMsg('success', '✓ Message sent! I\'ll get back to you soon.');
        } else {
          const body = encodeURIComponent(
            `Hi Gybrielle,\n\nMy name is ${params.from_name} (${params.from_email}).\n\n${params.message}`
          );
          window.location.href = `mailto:nicole.gybrielle3@gmail.com?subject=${encodeURIComponent(params.subject)}&body=${body}`;
          await new Promise(r => setTimeout(r, 900));
          showMsg('success', '✓ Your mail app should open. You can also email nicole.gybrielle3@gmail.com directly.');
        }
        form.reset();
      } catch (err) {
        console.error(err);
        showMsg('error', '✗ Could not send. Please email nicole.gybrielle3@gmail.com directly.');
      } finally {
        sendBtn.disabled     = false;
        label.style.display  = '';
        spinner.style.display = 'none';
      }
    });

    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => clearErr(el));
    });
  }

  function validate() {
    let ok = true;
    [
      { id: 'cf-name',    msg: 'Please enter your name.' },
      { id: 'cf-email',   msg: 'Please enter a valid email.', email: true },
      { id: 'cf-subject', msg: 'Please enter a subject.' },
      { id: 'cf-message', msg: 'Please enter your message.' },
    ].forEach(({ id, msg, email }) => {
      const el = document.getElementById(id);
      const v  = el.value.trim();
      if (!v || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) {
        setErr(el, msg); ok = false;
      } else {
        clearErr(el);
      }
    });
    return ok;
  }

  function setErr(el, msg) {
    el.classList.add('field-error');
    const span = el.parentElement.querySelector('.field-err');
    if (span) { span.textContent = msg; span.classList.add('show'); }
  }

  function clearErr(el) {
    el.classList.remove('field-error');
    const span = el.parentElement.querySelector('.field-err');
    if (span) { span.textContent = ''; span.classList.remove('show'); }
  }

  function showMsg(type, text) {
    if (!msgEl) return;
    msgEl.innerHTML = text;
    msgEl.className = `form-message ${type}`;
    setTimeout(hideMsg, 7000);
  }

  function hideMsg() {
    if (msgEl) { msgEl.className = 'form-message'; msgEl.style.display = ''; }
  }

  /* ── SCROLL REVEAL ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });

  function runReveal() {
    document.querySelectorAll(
      '.service-card, .hobby-card, .interest-card, .summary-card, ' +
      '.tech-module, .timeline-module, .edu-item, .cert-item, ' +
      '.exp-item, .soft-skill-tag, .project-card'
    ).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 10) * 0.04 + 's';
      }
      observer.observe(el);
    });
  }

  runReveal();
})();
