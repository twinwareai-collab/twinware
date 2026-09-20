/**
 * Typografischer Sog: mehrere Ringe tragen denselben Satz nach aussen, jeder
 * dreht langsamer als der innere. Der Zeiger druckt die Zeichen in seiner
 * Naehe aus der Bahn, ein Klick zieht den ganzen Satz kurz in die Mitte.
 *
 * Bewusst Canvas 2D statt WebGL: es sind einige hundert Glyphen, das traegt
 * die 2D-Pipeline ohne zusaetzliche Abhaengigkeit.
 */

type Options = {
  phrase: string;
  /** Grundtempo der Drehung; die Ringe staffeln sich davon ab. */
  speed: number;
  /** Faktor, um den jeder Ring groesser ist als der vorige. */
  ringGrowth: number;
  /** Radius um den Zeiger, in dem Zeichen ausweichen (in px). */
  dissolveRadius: number;
  /** Dauer der Sogbewegung nach einem Klick (ms). */
  suctionDuration: number;
};

type Ring = {
  radius: number;
  fontSize: number;
  direction: 1 | -1;
  speedFactor: number;
  angle: number;
  glyphs: { char: string; offset: number }[];
  accent: boolean;
};

const DEFAULTS: Options = {
  phrase: 'TWINWARE · IHR PARTNER FÜR DIGITALE PRODUKTE · ',
  speed: 1,
  ringGrowth: 1.34,
  dissolveRadius: 156,
  suctionDuration: 920,
};

export function createVortex(host: HTMLElement, canvas: HTMLCanvasElement, opts: Partial<Options> = {}) {
  const o: Options = { ...DEFAULTS, ...opts };
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let width = 0;
  let height = 0;
  let centreX = 0;
  let centreY = 0;
  let rings: Ring[] = [];
  let frame = 0;
  let last = performance.now();

  // Zeigerposition in Canvas-Koordinaten; ausserhalb = kein Einfluss.
  let pointerX = Number.NaN;
  let pointerY = Number.NaN;
  let suctionStart = -1;

  function buildRings() {
    rings = [];
    const shortest = Math.min(width, height);
    // Der innerste Ring haelt Abstand zur Mitte, sonst ueberlagern sich die Glyphen.
    let radius = shortest * 0.23;
    let fontSize = Math.max(11, shortest * 0.036);
    let index = 0;

    while (radius < shortest * 0.68 && index < 6) {
      const circumference = 2 * Math.PI * radius;
      // Zeichen so oft wiederholen, wie der Umfang hergibt.
      const perChar = fontSize * 0.62;
      const capacity = Math.max(8, Math.floor(circumference / perChar));
      const glyphs: { char: string; offset: number }[] = [];
      for (let i = 0; i < capacity; i++) {
        const char = o.phrase[i % o.phrase.length];
        glyphs.push({ char, offset: (i / capacity) * Math.PI * 2 });
      }
      rings.push({
        radius,
        fontSize,
        direction: index % 2 === 0 ? 1 : -1,
        speedFactor: 1 / (1 + index * 0.42),
        angle: index * 0.7,
        glyphs,
        accent: index === 1,
      });
      radius *= o.ringGrowth;
      fontSize *= 0.94;
      index++;
    }
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    centreX = width / 2;
    centreY = height / 2;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildRings();
  }

  function draw(now: number) {
    const delta = Math.min(now - last, 48) / 1000;
    last = now;

    ctx!.clearRect(0, 0, width, height);
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';

    // Sog: 0 = ruhig, 1 = ganz in der Mitte.
    let suction = 0;
    if (suctionStart >= 0) {
      const t = (now - suctionStart) / o.suctionDuration;
      if (t >= 1) {
        suctionStart = -1;
      } else {
        // Hin und zurueck, damit der Satz danach wieder steht.
        suction = Math.sin(t * Math.PI) ** 1.6;
      }
    }

    const hasPointer = !Number.isNaN(pointerX);

    for (const ring of rings) {
      if (!reduced) ring.angle += delta * 0.19 * o.speed * ring.speedFactor * ring.direction;

      const radius = ring.radius * (1 - suction * 0.82);
      ctx!.font = `600 ${ring.fontSize.toFixed(1)}px "Archivo Variable", system-ui, sans-serif`;

      for (const glyph of ring.glyphs) {
        const angle = ring.angle + glyph.offset;
        let x = centreX + Math.cos(angle) * radius;
        let y = centreY + Math.sin(angle) * radius;
        let alpha = ring.accent ? 0.9 : 0.46;
        let scale = 1;

        if (hasPointer) {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const dist = Math.hypot(dx, dy);
          if (dist < o.dissolveRadius) {
            // Je naeher am Zeiger, desto weiter weicht das Zeichen aus.
            const push = 1 - dist / o.dissolveRadius;
            const shove = push * push * 68;
            const len = dist || 1;
            x += (dx / len) * shove;
            y += (dy / len) * shove;
            alpha *= 1 - push * 0.85;
            scale = 1 + push * 0.5;
          }
        }

        if (alpha <= 0.02) continue;
        ctx!.save();
        ctx!.translate(x, y);
        ctx!.rotate(angle + Math.PI / 2);
        if (scale !== 1) ctx!.scale(scale, scale);
        ctx!.globalAlpha = alpha * (1 - suction * 0.35);
        ctx!.fillStyle = ring.accent ? '#e8532a' : '#ece5d8';
        ctx!.fillText(glyph.char, 0, 0);
        ctx!.restore();
      }
    }

    frame = requestAnimationFrame(draw);
  }

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
  };
  const onPointerLeave = () => { pointerX = Number.NaN; pointerY = Number.NaN; };
  const onPointerDown = () => { suctionStart = performance.now(); };

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  if (finePointer) {
    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave);
  }
  host.addEventListener('pointerdown', onPointerDown, { passive: true });

  frame = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    host.removeEventListener('pointermove', onPointerMove);
    host.removeEventListener('pointerleave', onPointerLeave);
    host.removeEventListener('pointerdown', onPointerDown);
  };
}
