import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Layout = 'desktop' | 'tablet' | 'phone';

/**
 * Zeichnet eine schematische Benutzeroberfläche als Textur.
 * Alle drei Geräte zeigen dasselbe Layout in der jeweils passenden Aufteilung –
 * die Hero-Szene spielt damit direkt auf responsives Arbeiten an.
 */
function makeScreenTexture(layout: Layout) {
  const size = { desktop: [1024, 640], tablet: [768, 1024], phone: [540, 1080] }[layout];
  const canvas = document.createElement('canvas');
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const W = canvas.width;
  const H = canvas.height;
  const scale = W / 1024;
  const paper = '#fbfaf8';
  const line = '#dedad2';
  const block = '#eeebe5';
  const orange = '#e8532a';

  // Kleiner Fallback für Browser ohne CanvasRenderingContext2D.roundRect
  const roundPath = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    const rad = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  };

  const rect = (x: number, y: number, w: number, h: number, r: number, fill: string) => {
    roundPath(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  };

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);

  const pad = 46 * scale;
  const barH = 66 * scale;

  // Topbar mit Markenpunkt und Navigation
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, barH);
  ctx.fillStyle = line;
  ctx.fillRect(0, barH - 2 * scale, W, 2 * scale);
  rect(pad, barH / 2 - 9 * scale, 18 * scale, 18 * scale, 5 * scale, orange);
  if (layout === 'phone') {
    for (let i = 0; i < 3; i++) rect(W - pad - 46 * scale, barH / 2 - 11 * scale + i * 10 * scale, 46 * scale, 4 * scale, 2 * scale, block);
  } else {
    const items = layout === 'desktop' ? 4 : 3;
    for (let i = 0; i < items; i++) rect(W - pad - (i + 1) * 92 * scale + 14 * scale, barH / 2 - 5 * scale, 66 * scale, 10 * scale, 5 * scale, block);
  }

  let top = barH + pad;
  let contentX = pad;
  let contentW = W - pad * 2;

  // Sidebar nur auf dem großen Bildschirm
  if (layout === 'desktop') {
    const sideW = 190 * scale;
    rect(pad, top, sideW, H - top - pad, 14 * scale, block);
    for (let i = 0; i < 5; i++) {
      rect(pad + 22 * scale, top + 26 * scale + i * 34 * scale, (sideW - 60 * scale) * (i === 1 ? 1 : 0.76), 9 * scale, 5 * scale, i === 1 ? orange : '#d9d4cb');
    }
    contentX = pad + sideW + 26 * scale;
    contentW = W - contentX - pad;
  }

  // Headline-Zeilen
  rect(contentX, top, contentW * 0.58, 22 * scale, 6 * scale, '#c9c4ba');
  rect(contentX, top + 36 * scale, contentW * 0.38, 12 * scale, 6 * scale, '#e0dcd4');
  top += 76 * scale;

  // Karten-Raster: 3 / 2 / 1 Spalten
  const cols = layout === 'desktop' ? 3 : layout === 'tablet' ? 2 : 1;
  const gap = 20 * scale;
  const cardW = (contentW - gap * (cols - 1)) / cols;
  const rows = layout === 'phone' ? 4 : 2;
  const cardH = Math.min(220 * scale, (H - top - pad - gap * (rows - 1)) / rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = contentX + c * (cardW + gap);
      const y = top + r * (cardH + gap);
      if (y + cardH > H - pad * 0.4) continue;
      const accent = r === 0 && c === 0;
      rect(x, y, cardW, cardH, 14 * scale, accent ? orange : '#ffffff');
      if (!accent) {
        ctx.strokeStyle = line;
        ctx.lineWidth = 2 * scale;
        roundPath(x, y, cardW, cardH, 14 * scale);
        ctx.stroke();
        rect(x + 18 * scale, y + 18 * scale, cardW * 0.42, 10 * scale, 5 * scale, '#d5d0c7');
        rect(x + 18 * scale, y + 42 * scale, cardW - 36 * scale, 8 * scale, 4 * scale, block);
        rect(x + 18 * scale, y + 60 * scale, (cardW - 36 * scale) * 0.7, 8 * scale, 4 * scale, block);
      } else {
        rect(x + 18 * scale, y + 18 * scale, cardW * 0.4, 10 * scale, 5 * scale, 'rgba(255,255,255,.85)');
        rect(x + 18 * scale, y + 42 * scale, cardW - 36 * scale, 8 * scale, 4 * scale, 'rgba(255,255,255,.45)');
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Abgerundetes Rechteck als extrudierte Geometrie – für die Gerätegehäuse. */
function roundedBoxGeometry(width: number, height: number, depth: number, radius: number) {
  const shape = new THREE.Shape();
  const w = width / 2 - radius;
  const h = height / 2 - radius;
  shape.absarc(w, h, radius, 0, Math.PI / 2, false);
  shape.absarc(-w, h, radius, Math.PI / 2, Math.PI, false);
  shape.absarc(-w, -h, radius, Math.PI, Math.PI * 1.5, false);
  shape.absarc(w, -h, radius, Math.PI * 1.5, Math.PI * 2, false);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth * 0.82,
    bevelEnabled: true,
    bevelThickness: depth * 0.09,
    bevelSize: depth * 0.09,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geo.center();
  return geo;
}

export function initHeroScene() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-webgl]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!canvas || !hero) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return () => {};
  // Unter 900px füllt die Textspalte den Hero fast vollständig – dort trägt die
  // CSS-Ebene den Hintergrund allein, statt die Geräte hinter den Text zu legen.
  if (window.innerWidth < 900) return () => {};

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0.1, 0.05, 9.6);

  const group = new THREE.Group();
  group.rotation.set(0.04, -0.2, 0);
  scene.add(group);

  // Helles, ruhiges Studio-Licht statt der früheren dunklen Stimmung
  const ambient = new THREE.AmbientLight(0xffffff, 1.55);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xe6e1d8, 1.1);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(-3.4, 4.6, 6.2);
  scene.add(key);
  const rim = new THREE.PointLight(0xff7a45, 26, 22, 2);
  rim.position.set(4.6, -1.4, 3.4);
  scene.add(rim);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x262523, roughness: 0.34, metalness: 0.68, clearcoat: 0.85, clearcoatRoughness: 0.22 });
  const standMat = new THREE.MeshPhysicalMaterial({ color: 0x31302c, roughness: 0.4, metalness: 0.6 });
  materials.push(bodyMat, standMat);

  type Device = { pivot: THREE.Group; float: number; spread: THREE.Vector3 };
  const devices: Device[] = [];

  const makeDevice = (
    layout: Layout,
    width: number,
    height: number,
    position: [number, number, number],
    rotation: [number, number, number],
    spread: [number, number, number],
    floatOffset: number,
  ) => {
    const pivot = new THREE.Group();
    pivot.position.set(...position);
    pivot.rotation.set(...rotation);
    group.add(pivot);

    const depth = layout === 'desktop' ? 0.17 : 0.11;
    const bodyGeo = roundedBoxGeometry(width, height, depth, layout === 'phone' ? 0.09 : 0.11);
    geometries.push(bodyGeo);
    pivot.add(new THREE.Mesh(bodyGeo, bodyMat));

    const bezel = layout === 'desktop' ? 0.1 : layout === 'tablet' ? 0.085 : 0.06;
    const screenTex = makeScreenTexture(layout);
    textures.push(screenTex);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
    materials.push(screenMat);
    const screenGeo = new THREE.PlaneGeometry(width - bezel * 2, height - bezel * 2);
    geometries.push(screenGeo);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = depth / 2 + 0.005;
    pivot.add(screen);

    if (layout === 'desktop') {
      const neckGeo = new THREE.BoxGeometry(0.22, 0.62, 0.16);
      const baseGeo = new THREE.BoxGeometry(1.15, 0.07, 0.42);
      geometries.push(neckGeo, baseGeo);
      const neck = new THREE.Mesh(neckGeo, standMat);
      neck.position.set(0, -height / 2 - 0.29, -0.06);
      pivot.add(neck);
      const base = new THREE.Mesh(baseGeo, standMat);
      base.position.set(0, -height / 2 - 0.62, -0.02);
      pivot.add(base);
    }

    devices.push({ pivot, float: floatOffset, spread: new THREE.Vector3(...spread) });
    return pivot;
  };

  // Bildschirm, Tablet, Handy – ein Layout, drei Formate
  makeDevice('desktop', 3.45, 2.14, [0.15, 0.62, -0.5], [0.02, -0.07, 0], [0, 0.3, -0.5], 0);
  makeDevice('tablet', 1.42, 1.92, [-1.72, -0.62, 0.85], [0.03, 0.26, 0.06], [-0.75, -0.12, 0.3], 1.9);
  makeDevice('phone', 0.72, 1.48, [1.6, -0.86, 1.15], [0.03, -0.3, -0.05], [0.8, -0.18, 0.35], 3.6);

  // Sehr dezenter Brand-Ring hinter den Geräten
  const ringGeo = new THREE.TorusGeometry(2.85, 0.006, 8, 120);
  geometries.push(ringGeo);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8532a, transparent: true, opacity: 0.22 });
  materials.push(ringMat);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(0.2, 0.15, -1.9);
  ring.rotation.set(0.42, -0.2, 0.1);
  group.add(ring);

  const dustGeo = new THREE.BufferGeometry();
  const count = window.innerWidth < 700 ? 90 : 190;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 11;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometries.push(dustGeo);
  const dustMat = new THREE.PointsMaterial({ color: 0x8a7161, size: 0.019, transparent: true, opacity: 0.3 });
  materials.push(dustMat);
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  const start = { groupX: 2.45, groupY: -0.12, groupZ: 0, cameraZ: camera.position.z };

  // Die Gruppe folgt dem Seitenverhältnis, damit das Handy rechts nie aus dem Bild läuft.
  const layout = () => {
    const aspect = window.innerWidth / window.innerHeight;
    start.groupX = THREE.MathUtils.clamp(aspect * 1.45 - 0.2, 1.5, 2.5);
    start.groupY = -0.12;
    group.scale.setScalar(THREE.MathUtils.clamp(aspect / 1.75, 0.74, 1));
    group.position.set(start.groupX, start.groupY, start.groupZ);
  };
  layout();
  const basePositions = devices.map((d) => d.pivot.position.clone());
  let spreadAmount = 0;

  const scrollTrigger = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate(self) {
      const p = self.progress;
      group.rotation.y = -0.2 + p * 0.78;
      group.rotation.x = 0.04 + p * 0.14;
      group.position.x = start.groupX - p * 0.8;
      group.position.y = start.groupY + p * 0.22;
      group.position.z = start.groupZ + p * 0.5;
      camera.position.z = start.cameraZ - p * 1.3;
      // Die Geräte fächern sich auf – das Layout „verteilt" sich auf die Formate.
      spreadAmount = p;
      ring.rotation.z = p * 0.9;
      ringMat.opacity = 0.22 - p * 0.14;
      rim.position.x = 4.6 - p * 2.6;
    },
  });

  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 0.3;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 0.18;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let raf = 0;
  let visible = true;
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
  observer.observe(hero);

  const clock = new THREE.Clock();
  const render = () => {
    raf = requestAnimationFrame(render);
    if (!visible) return;
    const t = clock.getElapsedTime();

    group.rotation.y += (pointer.x - group.rotation.y * 0.02) * 0.002;
    group.rotation.x += (-pointer.y - group.rotation.x * 0.02) * 0.002;

    devices.forEach((device, i) => {
      const base = basePositions[i];
      const bob = Math.sin(t * 0.5 + device.float) * (i === 0 ? 0.045 : 0.075);
      device.pivot.position.set(
        base.x + device.spread.x * spreadAmount,
        base.y + device.spread.y * spreadAmount + bob,
        base.z + device.spread.z * spreadAmount,
      );
      device.pivot.rotation.z = Math.sin(t * 0.34 + device.float) * 0.016;
    });

    ring.rotation.x += 0.0004;
    dust.rotation.y = t * 0.006;
    renderer.render(scene, camera);
  };
  render();

  const onResize = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    layout();
    ScrollTrigger.refresh();
  };
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    cancelAnimationFrame(raf);
    observer.disconnect();
    scrollTrigger.kill();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointer);
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((tex) => tex.dispose());
    renderer.dispose();
  };
}
