import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { analyzeIdea } from './project-estimator';

gsap.registerPlugin(ScrollTrigger);


const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

const header = document.querySelector<HTMLElement>('[data-header]');
const menu = document.querySelector<HTMLButtonElement>('[data-menu]');
const menuLabel = document.querySelector<HTMLElement>('[data-menu-label]');
const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');

window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 36), { passive: true });

let menuOpen = false;
function setMenu(open: boolean) {
  menuOpen = open;
  menu?.setAttribute('aria-expanded', String(open));
  menu?.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  menu?.classList.toggle('is-open', open);
  if (menuLabel) menuLabel.textContent = open ? 'Schließen' : 'Menü';
  header?.classList.toggle('has-menu-open', open);
  // Scroll-Lock, damit die Seite hinter dem Panel nicht mitwandert.
  document.documentElement.classList.toggle('is-menu-open', open);
  if (mobileMenu) {
    mobileMenu.classList.toggle('is-open', open);
    if (open) mobileMenu.removeAttribute('inert');
    else mobileMenu.setAttribute('inert', '');
  }
}

menu?.addEventListener('click', () => setMenu(!menuOpen));
mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuOpen) { setMenu(false); menu?.focus(); }
});
// Beim Wechsel auf Desktop-Breite schliessen, sonst haengt der Scroll-Lock fest.
window.matchMedia('(min-width: 981px)').addEventListener('change', (event) => {
  if (event.matches && menuOpen) setMenu(false);
});

let lenis: Lenis | undefined;
if (!reducedMotion && !coarsePointer && window.innerWidth > 760) {
  lenis = new Lenis({ duration: 0.95, smoothWheel: true, wheelMultiplier: 0.92, touchMultiplier: 1.15 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Unterhalb dieser Breite sind Hero, Story und Reel als normale Sektionen
// gesetzt - die Scroll-Choreografien wuerden dort ins Leere laufen.
const isDesktop = window.innerWidth > 980;

if (!reducedMotion) {
  if (isDesktop) import('./three-scene').then(({ initHeroScene }) => initHeroScene()).catch(() => {});

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero && isDesktop) {
    const heroTl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1.15 } });
    heroTl
      .to('[data-hero-copy]', { yPercent: -28, opacity: .06, ease: 'none' }, 0)
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
        // Auf dem Desktop deutet die Nachbarkarte Tiefe an. Ohne Perspektive
        // liegt sie exakt hinter der aktiven und wuerde nur den Text stoeren.
        const neighbour = isDesktop ? .11 : 0;
        cards.forEach((card, i) => {
          const distance = i - idx;
          gsap.to(card, {
            opacity: i === idx ? 1 : Math.abs(distance) === 1 ? neighbour : 0,
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
  if (reel && reelCard && reelStage && isDesktop) {
    const shut = 'inset(44% 0% 44% 0%)';
    const open = 'inset(0% 0% 0% 0%)';

    const reelTl = gsap.timeline({ scrollTrigger: { trigger: reel, start: 'top top', end: 'bottom bottom', scrub: 1 } });
    reelTl
      .fromTo(reelCard, { clipPath: shut }, { clipPath: open, duration: .46, ease: 'power2.inOut' }, 0)
      .fromTo(reelStage, { scale: 1.12, yPercent: 4 }, { scale: 1, yPercent: 0, duration: .5, ease: 'power1.out' }, 0)
      .fromTo('.reel-visual img', { scale: 1.16, yPercent: 4 }, { scale: 1.02, yPercent: 0, duration: .56, ease: 'none' }, 0)
      .fromTo('.reel-copy > *', { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: .035, duration: .18, ease: 'power2.out' }, .34)
      // Ausklang: der Spalt schliesst sich wieder, das Bild zieht leicht nach.
      .to(reelStage, { scale: .97, yPercent: -3, duration: .38, ease: 'power1.in' }, .62)
      .to(reelCard, { clipPath: shut, duration: .34, ease: 'power2.in' }, .66);
  }

  // Manifest: Der Fliesstext tintet beim Scrollen Wort fuer Wort ein, und der
  // Wendesatz setzt sich aus versprengten Lettern zusammen - waehrend sie
  // einrasten, laufen die Farbkanaele wieder ineinander.
  const manifest = document.querySelector<HTMLElement>('[data-manifest-text]');
  if (manifest) {
    const beat = manifest.querySelector<HTMLElement>('[data-manifest-beat]');

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

    // Der Wendesatz wird Buchstabe fuer Buchstabe gesetzt, nicht Wort fuer Wort.
    if (beat) beat.remove();
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

    if (beat) {
      // Wieder an seinen Platz, jetzt in Einzelletter zerlegt.
      const anchor = manifest.children[1] || null;
      manifest.insertBefore(beat, anchor);

      const source = beat.textContent || '';
      beat.textContent = '';
      const glyphs: HTMLElement[] = [];
      // Wortweise gruppiert: Einzelletter sind inline-block, sonst duerfte die
      // Zeile mitten im Wort umbrechen - auf schmalen Displays landet sonst
      // der Schlusspunkt allein auf der naechsten Zeile.
      source.split(' ').forEach((word, wi, all) => {
        const holder = document.createElement('span');
        holder.className = 'gw';
        for (const ch of word) {
          const sp = document.createElement('span');
          sp.className = 'g';
          sp.textContent = ch;
          holder.appendChild(sp);
          glyphs.push(sp);
        }
        beat.appendChild(holder);
        if (wi < all.length - 1) beat.appendChild(document.createTextNode(' '));
      });

      // Deterministischer Streuwinkel je Letter - gleicher Aufbau bei jedem Besuch.
      const seeded = (s0: number) => {
        let a = s0 >>> 0;
        return () => {
          a += 0x6d2b79f5;
          let t = a;
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      };
      const rand = seeded(7719);
      const jitter = glyphs.map(() => [rand() * 2 - 1, rand() * 2 - 1, rand()] as const);

      const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      // Der Farbversatz bleibt dem Desktop vorbehalten: zwei zusaetzliche
      // Schattenebenen je Letter sind auf schwachen Geraeten zu teuer.
      const chromatic = isDesktop && !coarsePointer;

      const paint = (p: number) => {
        for (let i = 0; i < glyphs.length; i++) {
          const [jx, jy, jd] = jitter[i];
          const a = easeOut(clamp01(p * 1.5 - jd * 0.5));
          const g = glyphs[i];
          g.style.transform =
            `translate(${(jx * 54 * (1 - a)).toFixed(1)}px,${(jy * 30 * (1 - a)).toFixed(1)}px)` +
            ` scale(${(1 + 0.22 * (1 - a)).toFixed(3)})`;
          g.style.opacity = Math.min(1, a * 1.6).toFixed(3);
          if (!chromatic) continue;
          const sep = (1 - a) * 9;
          g.style.textShadow = sep > 0.4
            ? `${(-sep).toFixed(1)}px 0 rgba(255,64,72,.85),${sep.toFixed(1)}px 0 rgba(64,255,190,.8)`
            : 'none';
          g.style.filter = sep > 0.7 ? `blur(${(sep * 0.26).toFixed(2)}px)` : 'none';
        }
      };

      paint(0);
      ScrollTrigger.create({
        trigger: beat,
        start: 'top 86%',
        end: 'top 46%',
        scrub: 0.6,
        onUpdate: (self) => paint(self.progress),
      });
    }
  }

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, { y: 42, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Leistungen: In die hohlen Buchstaben laeuft die Tinte von links ein,
  // erst danach erscheint der Text darunter. Jede Zeile hat ihren eigenen Trigger.
  if (isDesktop) document.querySelectorAll<HTMLElement>('[data-ink]').forEach((row) => {
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

/* ── Zeiger und Maus-Parallaxe ────────────────────────────────────────────
   Beides haengt an einem gemeinsamen Frame-Loop: zwei getrennte Schleifen
   wuerden sich auf schwaecheren Geraeten gegenseitig ausbremsen.          */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer && !reducedMotion) {
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  document.documentElement.classList.add('has-custom-cursor');

  // Ziel- und Istwerte getrennt: der Ring zieht der Maus weich hinterher.
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let hasMoved = false;

  const parallaxTargets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-parallax]')
  ).map((el) => ({
    el,
    depth: Number(el.dataset.parallax) || 1,
    x: 0,
    y: 0,
  }));

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!hasMoved) { hasMoved = true; ring.classList.add('is-on'); ringX = targetX; ringY = targetY; }
  }, { passive: true });

  window.addEventListener('pointerdown', () => ring.classList.add('is-down'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => ring.classList.remove('is-on'));

  // Was sich anklicken laesst, laesst den Ring aufgehen.
  const INTERACTIVE = 'a,button,input,textarea,select,label,summary,[role="button"],[tabindex]:not([tabindex="-1"])';
  document.addEventListener('pointerover', (event) => {
    const target = event.target as Element | null;
    ring.classList.toggle('is-active', !!target?.closest?.(INTERACTIVE));
  }, { passive: true });

  let frame = 0;
  const tick = () => {
    ringX += (targetX - ringX) * 0.19;
    ringY += (targetY - ringY) * 0.19;
    ring.style.transform = `translate3d(${ringX.toFixed(1)}px,${ringY.toFixed(1)}px,0)`;

    if (parallaxTargets.length) {
      // Ausschlag relativ zur Bildschirmmitte, gedaempft nach Tiefe.
      const nx = (targetX / window.innerWidth - 0.5) * 2;
      const ny = (targetY / window.innerHeight - 0.5) * 2;
      for (const item of parallaxTargets) {
        item.x += (nx * item.depth * 13 - item.x) * 0.07;
        item.y += (ny * item.depth * 9 - item.y) * 0.07;
        item.el.style.transform = `translate3d(${item.x.toFixed(2)}px,${item.y.toFixed(2)}px,0)`;
      }
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
}

// Der Sog wird erst geladen, wenn die Sektion in Sichtweite kommt - er
// liegt weit unten und soll den ersten Seitenaufbau nicht belasten.
const vortexHost = document.querySelector<HTMLElement>('[data-vortex-host]');
const vortexCanvas = document.querySelector<HTMLCanvasElement>('[data-vortex-canvas]');
if (vortexHost && vortexCanvas) {
  const vio = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    vio.disconnect();
    import('./vortex')
      .then(({ createVortex }) => createVortex(vortexHost, vortexCanvas))
      .catch(() => {});
  }, { rootMargin: '300px' });
  vio.observe(vortexHost);
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
