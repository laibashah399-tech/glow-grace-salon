// ===== EDIT THESE =====
const CONFIG = {
  salon: 'Glow & Grace Salon',
  whatsapp: '923001234567',   // digits only, with country code
  formEndpoint: '',           // e.g. https://formspree.io/f/YOUR_ID  (empty = form shows a setup message)
  ga4Id: ''                   // e.g. G-XXXXXXXXXX (empty = analytics disabled)
};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wa = (svc, custom) => `https://wa.me/${CONFIG.whatsapp}?text=` + encodeURIComponent(custom ||
  (svc ? `Assalam-o-Alaikum! I would like to book ${svc} at ${CONFIG.salon}. Please share your available dates and timings.`
       : `Assalam-o-Alaikum! I would like to book an appointment at ${CONFIG.salon}. Please share your available dates and timings.`));
$$('[data-wa]').forEach(a => { a.href = wa(a.dataset.service, a.dataset.msg); a.addEventListener('click', () => track('whatsapp_click', { service: a.dataset.service || 'general' })); });
$('#year') && ($('#year').textContent = new Date().getFullYear());

// Mobile menu
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); menu.classList.toggle('hidden', !o); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { burger.click(); burger.focus(); } });

// Scroll reveal (staggered)
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
} else $$('.reveal').forEach(el => el.classList.add('in'));

// Category filters (services + gallery)
$$('[data-filter]').forEach(bar => {
  const list = document.getElementById(bar.dataset.filter);
  bar.addEventListener('click', e => {
    const b = e.target.closest('.fbtn'); if (!b) return;
    $$('.fbtn', bar).forEach(x => x.setAttribute('aria-pressed', x === b));
    const all = /^All/.test(b.dataset.f);
    $$('[data-cat]', list).forEach(li => { li.hidden = !(all || li.dataset.cat === b.dataset.f); li.classList.add('in'); });
  });
});

// Lightbox
const lb = $('#lb');
if (lb) {
  let idx = 0;
  const tiles = () => $$('.gtile').filter(t => !t.closest('li').hidden);
  const show = i => { const t = tiles(); idx = (i + t.length) % t.length; $('#lb-art').style.cssText = t[idx].dataset.bg; $('#lb-art').setAttribute('aria-label', t[idx].dataset.cap + ' (placeholder for a portfolio photo)'); $('#lb-cap').textContent = t[idx].dataset.cap; };
  document.addEventListener('click', e => { const t = e.target.closest('.gtile'); if (t) { show(tiles().indexOf(t)); lb.showModal(); } });
  $('#lb-close').onclick = () => lb.close(); $('#lb-prev').onclick = () => show(idx - 1); $('#lb-next').onclick = () => show(idx + 1);
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });  // Escape closes natively
}

// Contact form
const cf = $('#cf');
if (cf) {
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your full name.',
    phone: v => /^[+\d][\d\s-]{8,17}$/.test(v.trim()) || 'Enter a valid phone number.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    message: v => v.trim().length >= 10 || 'Write at least 10 characters.'
  };
  const status = $('#cf-status'), btn = $('#cf-btn');
  cf.addEventListener('submit', async e => {
    e.preventDefault();
    if (btn.disabled) return;
    let ok = true;
    for (const k in rules) { const r = rules[k](cf.elements[k].value), el = $('#' + k + '-err'); el.textContent = r === true ? '' : r; cf.elements[k].setAttribute('aria-invalid', r !== true); if (r !== true) ok = false; }
    if (!ok) { status.textContent = 'Please fix the highlighted fields.'; return; }
    if (cf.elements._gotcha.value) return;                       // honeypot
    const endpoint = CONFIG.formEndpoint || cf.dataset.endpoint;
    if (!endpoint) { status.textContent = 'This form is not connected yet (no form service configured). Please use the WhatsApp button instead.'; return; }
    btn.disabled = true; btn.textContent = 'Sending...'; status.textContent = '';
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(cf) });
      if (res.ok) { status.textContent = 'Thank you. Your inquiry was sent. The salon will reply to confirm availability.'; cf.reset(); track('form_submit_success', {}); }
      else status.textContent = 'The message could not be sent. Please try again or use WhatsApp.';
    } catch { status.textContent = 'Network error. Please try again or use WhatsApp.'; }
    btn.disabled = false; btn.textContent = 'Send inquiry';
  });
}

// Google Analytics 4 (only with a configured ID and the visitor's consent; no personal data is sent)
function track(name, params) { if (window.gtag) window.gtag('event', name, params); }
function loadGA() {
  if (window.gtag || !CONFIG.ga4Id) return;
  const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4Id; document.head.appendChild(s);
  window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', CONFIG.ga4Id, { anonymize_ip: true });
}
if (CONFIG.ga4Id) {
  const c = localStorage.getItem('ga-consent');
  if (c === 'yes') loadGA();
  else if (!c) {
    const bar = document.createElement('div');
    bar.className = 'fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-ink p-4 text-sm text-ivory';
    bar.innerHTML = '<p>We use analytics cookies to see which pages are useful. <a class="underline" href="privacy-policy.html">Privacy Policy</a></p><div class="flex gap-2"><button class="btn bg-gold text-ink" data-c="yes">Accept</button><button class="btn border border-ivory" data-c="no">Decline</button></div>';
    bar.addEventListener('click', e => { const v = e.target.dataset.c; if (!v) return; localStorage.setItem('ga-consent', v); bar.remove(); if (v === 'yes') loadGA(); });
    document.body.appendChild(bar);
  }
}
