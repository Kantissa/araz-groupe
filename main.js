/* ════════════════════════════════════════
   ARAZ GROUPE — Scripts principaux
   ════════════════════════════════════════ */

/* ── Header scroll ─────────────────────── */
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Navigation mobile ──────────────────── */
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ── Scroll reveal ──────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.service-card, .serenity-card, .value-item, .city-item, ' +
  '.problem-list li, .contact-info-item, .solution-card, ' +
  '.section-title, .section-subtitle, .section-label, ' +
  '.serenity-quote, .hero-content > *'
).forEach((el, i) => {
  el.setAttribute('data-reveal', '');
  if (i % 4 === 1) el.setAttribute('data-reveal-delay', '1');
  else if (i % 4 === 2) el.setAttribute('data-reveal-delay', '2');
  else if (i % 4 === 3) el.setAttribute('data-reveal-delay', '3');
  revealObserver.observe(el);
});

/* ── Formulaire de contact ──────────────── */
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value;
  const message = form.message.value.trim();

  if (!name || !email || !subject || !message) {
    showFormFeedback('Veuillez remplir tous les champs obligatoires.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormFeedback('Adresse email invalide.', 'error');
    return;
  }

  const btn = form.querySelector('[type=submit]');
  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;

  /* Construction du lien mailto de secours */
  const mailtoBody = encodeURIComponent(
    `Nom : ${name}\nEmail : ${email}\nTéléphone : ${form.phone.value}\n\n${message}`
  );
  const mailtoSubject = encodeURIComponent(`[ARAZ GROUPE] ${subject}`);

  setTimeout(() => {
    window.location.href =
      `mailto:contact@arazgroupe.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    btn.textContent = 'Envoyer la demande';
    btn.disabled = false;
    showFormFeedback('Votre messagerie s\'ouvre. Merci pour votre message !', 'success');
    form.reset();
  }, 600);
});

function showFormFeedback(msg, type) {
  let el = form.querySelector('.form-feedback');
  if (!el) {
    el = document.createElement('p');
    el.className = 'form-feedback';
    form.appendChild(el);
  }
  el.textContent = msg;
  el.style.cssText = `
    font-size:.82rem;
    text-align:center;
    padding:.75rem 1rem;
    border-radius:4px;
    margin-top:.5rem;
    background:${type === 'error' ? 'rgba(220,50,50,0.15)' : 'rgba(197,159,74,0.15)'};
    color:${type === 'error' ? '#ff7070' : '#D6B66B'};
    border:1px solid ${type === 'error' ? 'rgba(220,50,50,0.3)' : 'rgba(197,159,74,0.3)'};
  `;
  setTimeout(() => el.remove(), 5000);
}

/* ── Smooth scroll pour liens ancres ───── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = header.getBoundingClientRect().height + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
