import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { analyzeIdea } from './project-estimator';

gsap.registerPlugin(ScrollTrigger);


const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

const header = document.querySelector<HTMLElement>('[data-header]');
const menu = document.querySelector<HTMLButtonElement>('[data-menu]');
const nav = document.querySelector<HTMLElement>('[data-nav]');

window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 36), { passive: true });
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  nav?.classList.remove('is-open');
  menu?.setAttribute('aria-expanded', 'false');
}));

let lenis: Lenis | undefined;
if (!reducedMotion && !coarsePointer && window.innerWidth > 760) {
  lenis = new Lenis({ duration: 0.95, smoothWheel: true, wheelMultiplier: 0.92, touchMultiplier: 1.15 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

if (!reducedMotion) {
  if (window.innerWidth >= 900) import('./three-scene').then(({ initHeroScene }) => initHeroScene()).catch(() => {});

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    const heroTl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1.15 } });
    heroTl
      .to('[data-hero-copy]', { yPercent: -34, opacity: .04, scale: .93, ease: 'none' }, 0)
      .to('.hero-ghost-panel--one', { xPercent: 26, yPercent: -12, rotateY: 4, scale: 1.14, opacity: .1, ease: 'none' }, 0)
      .to('.hero-ghost-panel--two', { xPercent: -28, yPercent: -48, rotateZ: -4, opacity: .12, ease: 'none' }, 0)
      .to('.hero-vignette', { opacity: .5, ease: 'none' }, 0);
  }

  // Scroll-driven story: one visual card replaces the previous one, similar to a cinematic deck.
  const story = document.querySelector<HTMLElement>('[data-story]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-story-card]'));
  const progress = document.querySelector<HTMLElement>('[data-story-progress]');
  if (story && cards.length) {
    ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate(self) {
        const p = self.progress;
        const idx = Math.min(cards.length - 1, Math.floor(p * cards.length));
        cards.forEach((card, i) => {
          const distance = i - idx;
          gsap.to(card, {
            opacity: i === idx ? 1 : Math.abs(distance) === 1 ? .11 : 0,
            y: i === idx ? 0 : distance * 90,
            z: i === idx ? 0 : -160,
            rotateX: i === idx ? 0 : distance * 5,
            duration: .55,
            ease: 'power2.out',
            overwrite: true,
          });
          card.classList.toggle('is-active', i === idx);
        });
        if (progress) progress.style.transform = `scaleX(${Math.max(.02, p)})`;
      }
    });
  }


  // Reel: filmische Blende statt Drehung. Der Rahmen faehrt aus einem Letterbox-Spalt auf,
  // das Bild laeuft gegenlaeufig heraus (Anamorph-Look), ein Lichtstreifen zieht einmal durch.
  const reel = document.querySelector<HTMLElement>('[data-reel]');
  const reelCard = document.querySelector<HTMLElement>('[data-reel-card]');
  const reelStage = document.querySelector<HTMLElement>('[data-reel-stage]');
  if (reel && reelCard && reelStage) {
    const shut = 'inset(44% 0% 44% 0%)';
    const open = 'inset(0% 0% 0% 0%)';

    const reelTl = gsap.timeline({ scrollTrigger: { trigger: reel, start: 'top top', end: 'bottom bottom', scrub: 1 } });
    reelTl
      .fromTo(reelCard, { clipPath: shut }, { clipPath: open, duration: .46, ease: 'power2.inOut' }, 0)
      .fromTo(reelStage, { scale: 1.12, yPercent: 4 }, { scale: 1, yPercent: 0, duration: .5, ease: 'power1.out' }, 0)
      .fromTo('.reel-visual img', { scale: 1.3, yPercent: 5 }, { scale: 1.04, yPercent: 0, duration: .56, ease: 'none' }, 0)
      .fromTo('[data-reel-grade]', { opacity: 1 }, { opacity: 0, duration: .34, ease: 'power2.out' }, .08)
      .fromTo('[data-reel-sheen]', { xPercent: -130, opacity: 0 }, { xPercent: 0, opacity: .6, duration: .16, ease: 'none' }, .2)
      .to('[data-reel-sheen]', { xPercent: 130, opacity: 0, duration: .2, ease: 'none' }, .36)
      .fromTo('.reel-copy > *', { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: .035, duration: .18, ease: 'power2.out' }, .34)
      // Ausklang: der Spalt schliesst sich wieder, das Bild zieht leicht nach.
      .to(reelStage, { scale: .97, yPercent: -3, duration: .38, ease: 'power1.in' }, .62)
      .to('[data-reel-grade]', { opacity: .72, duration: .38, ease: 'none' }, .62)
      .to(reelCard, { clipPath: shut, duration: .34, ease: 'power2.in' }, .66)
      .to('.reel-marquee', { xPercent: -12, duration: 1, ease: 'none' }, 0);
  }

  // Manifest: Der Fliesstext tintet beim Scrollen Wort fuer Wort ein.
  const manifest = document.querySelector<HTMLElement>('[data-manifest-text]');
  if (manifest) {
    const wrapWords = (node: Node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || '';
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach((part) => {
            if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.appendChild(span);
          });
          child.parentNode?.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapWords(child);
        }
      });
    };
    wrapWords(manifest);
    const words = manifest.querySelectorAll<HTMLElement>('.w');
    if (words.length) {
      gsap.to(words, {
        opacity: 1,
        ease: 'none',
        stagger: 1,
        scrollTrigger: { trigger: manifest, start: 'top 72%', end: 'bottom 62%', scrub: .5 },
      });
    }
  }

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 42, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Leistungen: In die hohlen Buchstaben laeuft die Tinte von links ein,
  // erst danach erscheint der Text darunter. Jede Zeile hat ihren eigenen Trigger.
  document.querySelectorAll<HTMLElement>('[data-ink]').forEach((row) => {
    const fill = row.querySelector<HTMLElement>('[data-ink-fill]');
    const body = row.querySelector<HTMLElement>('[data-ink-body]');
    if (!fill || !body) return;
    gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 84%', end: 'top 42%', scrub: .55 } })
      .fromTo(fill, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none' }, 0)
      .fromTo(row, { '--ink-rule': 0 }, { '--ink-rule': 1, ease: 'none' }, 0)
      .fromTo(body, { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: 'none' }, .5);
  });

  gsap.from('.process-line article', {
    y: 28, opacity: 0, stagger: .11, duration: .65, ease: 'power2.out',
    scrollTrigger: { trigger: '[data-process-line]', start: 'top 82%', once: true }
  });

  const agencyImage = document.querySelector<HTMLElement>('.agency-media img');
  if (agencyImage) gsap.to(agencyImage, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.agency', start: 'top bottom', end: 'bottom top', scrub: true } });
  const ctaImage = document.querySelector<HTMLElement>('.contact-backdrop img');
  if (ctaImage) gsap.to(ctaImage, { yPercent: 8, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });

}

const idea = document.querySelector<HTMLTextAreaElement>('[data-idea]');
const charCount = document.querySelector<HTMLElement>('[data-char-count]');
idea?.addEventListener('input', () => { if (charCount && idea) charCount.textContent = String(idea.value.length); });
document.querySelectorAll<HTMLButtonElement>('[data-example]').forEach((btn) => btn.addEventListener('click', () => {
  if (!idea) return;
  idea.value = btn.dataset.example || '';
  if (charCount) charCount.textContent = String(idea.value.length);
  idea.focus();
}));

const analyzeBtn = document.querySelector<HTMLButtonElement>('[data-analyze]');
const estimatorStatus = document.querySelector<HTMLElement>('[data-estimator-status]');
analyzeBtn?.addEventListener('click', () => {
  const text = idea?.value.trim() || '';
  if (text.length < 25) {
    if (estimatorStatus) estimatorStatus.textContent = 'Beschreiben Sie die Idee bitte mit mindestens einem kurzen Satz.';
    idea?.focus();
    return;
  }
  if (estimatorStatus) estimatorStatus.textContent = '';
  const r = analyzeIdea(text);
  document.querySelector<HTMLElement>('[data-result-empty]')?.setAttribute('hidden', '');
  const result = document.querySelector<HTMLElement>('[data-result]');
  result?.removeAttribute('hidden');
  const set = (selector:string,value:string) => { const el = document.querySelector<HTMLElement>(selector); if(el) el.textContent = value; };
  set('[data-result-type]', r.label); set('[data-result-title]', r.title); set('[data-result-size]', r.sizeLabel); set('[data-result-time]', r.timeframe); set('[data-result-budget]', r.budget);
  const list = document.querySelector<HTMLUListElement>('[data-result-features]');
  if (list) list.innerHTML = r.features.map((feature) => `<li>${feature}</li>`).join('');
  const preview = document.querySelector<HTMLElement>('[data-mockup] .preview-body');
  if (preview) {
    const patterns: Record<string,string> = {
      website:'<span></span><b></b><b></b><b></b>',
      webapp:'<span></span><b></b><b></b><b></b><b></b>',
      internal:'<span></span><b></b><b></b><b></b><b></b>',
      software:'<span></span><b></b><b></b><b></b><b></b>',
      app:'<span></span><b></b><b></b><b></b>'
    };
    preview.innerHTML = patterns[r.category] || patterns.webapp;
  }
  if (!reducedMotion && result) gsap.fromTo(result, { opacity:0, y:12 }, { opacity:1, y:0, duration:.45, ease:'power2.out' });
});

const contactForm = document.querySelector<HTMLFormElement>('[data-contact-form]');
const formStatus = document.querySelector<HTMLElement>('[data-form-status]');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    if (formStatus) formStatus.textContent = 'Bitte prüfen Sie die Pflichtfelder.';
    return;
  }
  const button = contactForm.querySelector<HTMLButtonElement>('button[type="submit"]');
  button?.setAttribute('disabled','');
  if (formStatus) formStatus.textContent = 'Anfrage wird gesendet …';
  try {
    const response = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(Object.fromEntries(new FormData(contactForm))) });
    const data = await response.json().catch(() => ({})) as { message?: string };
    if (!response.ok) throw new Error(data?.message || 'Versand fehlgeschlagen');
    contactForm.reset();
    if (formStatus) formStatus.textContent = 'Danke. Ihre Anfrage wurde erfolgreich versendet.';
  } catch (error) {
    if (formStatus) formStatus.textContent = error instanceof Error && error.message ? error.message : 'Die Anfrage konnte gerade nicht gesendet werden.';
  } finally {
    button?.removeAttribute('disabled');
  }
});
