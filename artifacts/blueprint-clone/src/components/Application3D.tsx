import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

interface Application3DProps {
  /** id направления из data/applications.ts */
  appId: string;
  /** Картинка-фолбэк, если WebGL недоступен */
  image: string;
  alt: string;
}

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/* ── Фирменный градиент голограммы: navy → red (как в референсе) ──────── */
const HOLO_A = new THREE.Color(0x2e4fd6);
const HOLO_B = new THREE.Color(0x8a51c8);
const HOLO_C = new THREE.Color(0xe8282b);

const CAPTIONS: Record<string, [string, string]> = {
  passenger: ['ЛЕГКОВОЙ ТРАНСПОРТ', 'МАСЛА · ЖИДКОСТИ · АВТОХИМИЯ'],
  commercial: ['КОММЕРЧЕСКИЙ ТРАНСПОРТ', 'АВТОПАРКИ И МАГИСТРАЛЬНАЯ ТЕХНИКА'],
  industry: ['ПРОМЫШЛЕННОСТЬ', 'СОЖ И ИНДУСТРИАЛЬНЫЕ МАСЛА'],
  special: ['СПЕЦИАЛЬНАЯ ТЕХНИКА', 'СТРОИТЕЛЬНАЯ И ВНЕДОРОЖНАЯ'],
  equipment: ['ОБОРУДОВАНИЕ', 'ОСНАЩЕНИЕ ПРОИЗВОДСТВ И СТО'],
  service: ['СЕРВИС', 'ОБСЛУЖИВАНИЕ И ПОДДЕРЖКА'],
};

/* ── Помощники геометрии ───────────────────────────────────────────────── */

const rbox = (w: number, h: number, d: number, r: number, seg = 3) =>
  new RoundedBoxGeometry(w, h, d, seg, Math.min(r, Math.min(w, h, d) / 2 - 0.001));

function mesh(geo: THREE.BufferGeometry, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  return m;
}

/** Экструзия 2D-профиля с фаской, отцентрованная по Z.
    steps разбивает стенки вдоль глубины — сетка равномерная, без «жалюзи». */
function extruded(shape: THREE.Shape, depth: number, curveSegments = 12, bevel = 0.06): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    curveSegments,
    steps: Math.max(2, Math.round(depth / 0.2)),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.9,
    bevelSegments: 2,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** Колесо: шина-тор + диск с малым числом сегментов (рёбра читаются как спицы) */
function wheelParts(r: number, tube: number, x: number, y: number, z: number): THREE.Mesh[] {
  const tire = new THREE.TorusGeometry(r, tube, 9, 22);
  const disc = new THREE.CylinderGeometry(r * 0.62, r * 0.62, tube * 1.15, 10, 1);
  disc.rotateX(Math.PI / 2);
  return [mesh(tire, x, y, z), mesh(disc, x, y, z)];
}

/* ── Модели направлений: гладкие профили, а не наборы боксов ──────────── */

/** Легковой транспорт — седан: боковой силуэт с колёсными арками */
function buildCar(): THREE.Mesh[] {
  const s = new THREE.Shape();
  // нижняя точка заднего бампера → задок → крыша → капот → нос
  s.moveTo(-1.95, 0.36);
  s.lineTo(-2.06, 0.62);
  s.quadraticCurveTo(-2.06, 0.92, -1.78, 0.98);
  s.quadraticCurveTo(-1.16, 1.06, -0.9, 1.32);
  s.quadraticCurveTo(-0.45, 1.62, 0.18, 1.62);
  s.quadraticCurveTo(0.78, 1.6, 1.08, 1.2);
  s.quadraticCurveTo(1.55, 1.06, 1.9, 1.0);
  s.quadraticCurveTo(2.12, 0.94, 2.12, 0.66);
  s.lineTo(2.06, 0.36);
  // нижняя кромка с колёсными арками
  s.lineTo(1.68, 0.36);
  s.absarc(1.26, 0.36, 0.42, 0, Math.PI, false);
  s.lineTo(-0.84, 0.36);
  s.absarc(-1.26, 0.36, 0.42, 0, Math.PI, false);
  s.closePath();

  const parts: THREE.Mesh[] = [mesh(extruded(s, 1.32, 16, 0.1))];
  for (const [x, z] of [[1.26, 0.62], [1.26, -0.62], [-1.26, 0.62], [-1.26, -0.62]] as const) {
    parts.push(...wheelParts(0.3, 0.1, x, 0.36, z));
  }
  return parts;
}

/** Коммерческий транспорт — магистральный грузовик с фургоном */
function buildTruck(): THREE.Mesh[] {
  // кабина: скошенное лобовое стекло
  const cab = new THREE.Shape();
  cab.moveTo(1.06, 0.34);
  cab.lineTo(2.1, 0.34);
  cab.quadraticCurveTo(2.2, 0.7, 2.16, 1.0);
  cab.quadraticCurveTo(2.14, 1.1, 2.0, 1.12);
  cab.lineTo(1.82, 1.14);
  cab.quadraticCurveTo(1.65, 1.52, 1.55, 1.58);
  cab.quadraticCurveTo(1.1, 1.64, 1.08, 1.5);
  cab.closePath();

  const parts: THREE.Mesh[] = [mesh(extruded(cab, 1.16, 12, 0.07))];
  // фургон
  parts.push(mesh(rbox(2.72, 1.62, 1.34, 0.08, 4), -0.5, 1.14, 0));
  // рама
  parts.push(mesh(rbox(3.4, 0.12, 0.7, 0.04, 2), 0, 0.34, 0));
  // колёса: передняя ось + задняя тележка
  for (const [x, z] of [[1.68, 0.6], [1.68, -0.6], [-1.3, 0.6], [-1.3, -0.6], [-0.6, 0.6], [-0.6, -0.6]] as const) {
    parts.push(...wheelParts(0.3, 0.11, x, 0.32, z));
  }
  return parts;
}

/** Промышленность — шестерня на валу */
function buildGear(): THREE.Mesh[] {
  const teeth = 12;
  const rO = 0.95;
  const rR = 0.76;
  const step = (Math.PI * 2) / teeth;
  const shape = new THREE.Shape();
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners: Array<[number, number]> = [
      [rR, a + step * 0.02],
      [rO, a + step * 0.2],
      [rO, a + step * 0.44],
      [rR, a + step * 0.62],
    ];
    for (const [radius, ang] of corners) {
      const x = Math.cos(ang) * radius;
      const y = Math.sin(ang) * radius;
      if (i === 0 && ang === a + step * 0.02) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.28, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.32, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.045, bevelSegments: 2, curveSegments: 20,
  });
  geo.translate(0, 0, -0.16);

  const shaft = new THREE.CylinderGeometry(0.12, 0.12, 1.35, 14);
  shaft.rotateX(Math.PI / 2);
  const hub = new THREE.CylinderGeometry(0.34, 0.34, 0.5, 18);
  hub.rotateX(Math.PI / 2);

  const rx = -1.02, ry = 0.12;
  return [mesh(geo, 0, 0, 0, rx, ry, 0), mesh(shaft, 0, 0, 0, rx, ry, 0), mesh(hub, 0, 0, 0, rx, ry, 0)];
}

/** Специальная техника — гусеничный экскаватор */
function buildExcavator(): THREE.Mesh[] {
  const parts: THREE.Mesh[] = [];

  // гусеница-лента: капсула-обвод с внутренним вырезом
  const track = new THREE.Shape();
  const tl = 0.95, tr2 = 0.3; // полудлина и радиус скругления
  track.moveTo(-tl, 0);
  track.absarc(-tl, tr2, tr2, -Math.PI / 2, Math.PI / 2, false);
  track.lineTo(tl, tr2 * 2);
  track.absarc(tl, tr2, tr2, Math.PI / 2, -Math.PI / 2, false);
  track.closePath();
  const trackHole = new THREE.Path();
  trackHole.moveTo(-tl, 0.1);
  trackHole.absarc(-tl, tr2, tr2 - 0.1, -Math.PI / 2, Math.PI / 2, false);
  trackHole.lineTo(tl, tr2 * 2 - 0.1);
  trackHole.absarc(tl, tr2, tr2 - 0.1, Math.PI / 2, -Math.PI / 2, false);
  trackHole.closePath();
  track.holes.push(trackHole);
  for (const z of [0.52, -0.52] as const) {
    parts.push(mesh(extruded(track, 0.34, 14, 0.03), 0, 0, z));
    // катки внутри ленты
    for (const x of [-0.6, 0, 0.6] as const) {
      parts.push(mesh(new THREE.TorusGeometry(0.13, 0.05, 8, 14), x, 0.3, z));
    }
  }

  // платформа + корпус + кабина
  parts.push(mesh(rbox(1.5, 0.16, 1.2, 0.05, 2), 0.05, 0.7, 0));
  parts.push(mesh(rbox(1.1, 0.62, 0.8, 0.14, 3), 0.05, 1.1, -0.16));
  parts.push(mesh(rbox(0.52, 0.72, 0.5, 0.1, 3), -0.32, 1.2, 0.32));

  // стрела — изогнутый профиль одним куском (плечо + рукоять)
  const boom = new THREE.Shape();
  boom.moveTo(0.0, 0.0);
  boom.quadraticCurveTo(0.55, 0.75, 1.05, 1.0);
  boom.quadraticCurveTo(1.5, 1.16, 1.9, 0.6);
  boom.lineTo(2.1, 0.15);
  boom.lineTo(1.94, 0.1);
  boom.quadraticCurveTo(1.62, 0.82, 1.25, 0.78);
  boom.quadraticCurveTo(0.85, 0.72, 0.3, -0.12);
  boom.closePath();
  parts.push(mesh(extruded(boom, 0.16, 14, 0.03), 0.55, 1.05, 0.05));

  // ковш: изогнутый профиль
  const bucket = new THREE.Shape();
  bucket.moveTo(0, 0);
  bucket.lineTo(0.42, 0.06);
  bucket.quadraticCurveTo(0.5, -0.28, 0.18, -0.44);
  bucket.quadraticCurveTo(-0.06, -0.34, 0, 0);
  bucket.closePath();
  parts.push(mesh(extruded(bucket, 0.46, 12, 0.03), 2.5, 1.12, 0.05, 0, 0, -0.35));

  return parts;
}

/** Производственное оборудование — станок с ЧПУ */
function buildMachine(): THREE.Mesh[] {
  const parts: THREE.Mesh[] = [];
  parts.push(mesh(rbox(2.3, 0.48, 1.28, 0.1, 3), 0, 0.24, 0));
  parts.push(mesh(rbox(2.1, 1.5, 1.1, 0.14, 4), 0, 1.2, 0));
  parts.push(mesh(rbox(0.62, 0.76, 0.14, 0.08, 2), 0.66, 1.28, 0.56));
  parts.push(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 12), -0.28, 2.15, 0));
  parts.push(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), 0.85, 2.15, -0.3));
  parts.push(mesh(new THREE.SphereGeometry(0.08, 10, 8), 0.85, 2.32, -0.3));
  return parts;
}

/** Сервисное обслуживание — комбинированный ключ */
function buildWrench(): THREE.Mesh[] {
  const wrap = new THREE.Group();

  const shape = new THREE.Shape();
  const hx = -0.3, hw = 1.4, hh = 0.2, r = 0.09;
  shape.moveTo(hx + r, -hh / 2);
  shape.lineTo(hx + hw - r, -hh / 2);
  shape.absarc(hx + hw - r, -hh / 2 + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hx + hw, hh / 2 - r);
  shape.absarc(hx + hw - r, hh / 2 - r, r, 0, Math.PI / 2, false);
  shape.lineTo(hx + r, hh / 2);
  shape.absarc(hx + r, hh / 2 - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(hx, -hh / 2 + r);
  shape.absarc(hx + r, -hh / 2 + r, r, Math.PI, Math.PI * 1.5, false);
  const handleGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 2, curveSegments: 14,
  });
  handleGeo.translate(0, 0, -0.05);
  const handle = mesh(handleGeo);
  wrap.add(handle);

  const gap = Math.PI * 2 - 4.4;
  const jaw = mesh(new THREE.TorusGeometry(0.33, 0.1, 10, 26, 4.4), -0.55, 0, 0, 0, 0, Math.PI + gap / 2);
  wrap.add(jaw);
  const ring = mesh(new THREE.TorusGeometry(0.2, 0.09, 10, 24), 1.3, 0, 0);
  wrap.add(ring);

  wrap.rotation.set(-0.55, 0, -0.5);
  wrap.updateMatrixWorld(true);
  return [handle, jaw, ring];
}

const BUILDERS: Record<string, () => THREE.Mesh[]> = {
  passenger: buildCar,
  commercial: buildTruck,
  industry: buildGear,
  special: buildExcavator,
  equipment: buildMachine,
  service: buildWrench,
};

/* ── Сборка голограммы ─────────────────────────────────────────────────── */

const gradientAt = (t: number, out: THREE.Color): THREE.Color => {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  if (c < 0.5) return out.lerpColors(HOLO_A, HOLO_B, c * 2);
  return out.lerpColors(HOLO_B, HOLO_C, (c - 0.5) * 2);
};

/** Круглый спрайт с мягким краем — точки выглядят партиклами, а не квадратами */
let cachedSprite: THREE.CanvasTexture | null = null;
function particleSprite(): THREE.CanvasTexture {
  if (cachedSprite) return cachedSprite;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  cachedSprite = new THREE.CanvasTexture(c);
  return cachedSprite;
}

interface HoloGroup {
  root: THREE.Group;
  /** Размер модели до вписывания в кадр — для пересчёта при resize */
  size: THREE.Vector3;
  bottomY: number;
  pointsMat: THREE.PointsMaterial;
  linesMat: THREE.LineBasicMaterial;
  geoms: THREE.BufferGeometry[];
}

/**
 * Голограмма в технике референса: точки — В ВЕРШИНАХ триангулированной
 * сетки, линии — рёбра этой же сетки (WireframeGeometry). Оба слоя
 * окрашены по X фирменным градиентом navy → red.
 */
function buildHolo(parts: THREE.Mesh[]): HoloGroup {
  const bounds = new THREE.Box3();
  parts.forEach((p) => {
    p.updateMatrixWorld(true);
    bounds.expandByObject(p);
  });
  const minX = bounds.min.x;
  const spanX = Math.max(0.001, bounds.max.x - bounds.min.x);

  const pointPositions: number[] = [];
  const pointColors: number[] = [];
  const linePositions: number[] = [];
  const lineColors: number[] = [];
  const tmp = new THREE.Vector3();
  const tmpColor = new THREE.Color();

  const pushColored = (arrPos: number[], arrCol: number[]) => {
    arrPos.push(tmp.x, tmp.y, tmp.z);
    gradientAt((tmp.x - minX) / spanX, tmpColor);
    arrCol.push(tmpColor.r, tmpColor.g, tmpColor.b);
  };

  for (const p of parts) {
    // дедупликация вершин: точки встают в узлы сетки по одному разу
    const merged = mergeVertices(p.geometry, 1e-4);
    const pos = merged.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i);
      p.localToWorld(tmp);
      pushColored(pointPositions, pointColors);
    }
    // рёбра триангуляции — «сетка» как на референсе
    const wf = new THREE.WireframeGeometry(merged);
    const wfPos = wf.getAttribute('position');
    for (let i = 0; i < wfPos.count; i++) {
      tmp.fromBufferAttribute(wfPos, i);
      p.localToWorld(tmp);
      pushColored(linePositions, lineColors);
    }
    wf.dispose();
    merged.dispose();
    p.geometry.dispose();
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
  pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));
  const pointsMat = new THREE.PointsMaterial({
    size: 0.05,
    map: particleSprite(),
    vertexColors: true,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);

  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  linesGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
  const linesMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(linesGeo, linesMat);

  // центрируем модель вокруг нуля; масштаб под кадр применяет вызывающий код
  const box = new THREE.Box3().setFromBufferAttribute(
    pointsGeo.getAttribute('position') as THREE.BufferAttribute,
  );
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const inner = new THREE.Group();
  inner.add(points, lines);
  inner.position.set(-center.x, -center.y, -center.z);
  const root = new THREE.Group();
  root.add(inner);

  return {
    root,
    size,
    bottomY: box.min.y - center.y,
    pointsMat,
    linesMat,
    geoms: [pointsGeo, linesGeo],
  };
}

function disposeHolo(h: HoloGroup) {
  h.geoms.forEach((g) => g.dispose());
  h.pointsMat.dispose();
  h.linesMat.dispose();
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Голографическая 3D-витрина блока «По направлениям»: узнаваемые силуэты
 * из гладких профилей, отрисованные как точки в узлах сетки + рёбра
 * триангуляции с градиентом navy → red. Медленный поворот, плавная
 * смена модели. Без WebGL — картинка-фолбэк.
 */
export default function Application3D({ appId, image, alt }: Application3DProps) {
  const [webgl] = useState(hasWebGL);
  const mountRef = useRef<HTMLDivElement>(null);
  const pendingId = useRef(appId);

  useEffect(() => {
    pendingId.current = appId;
  }, [appId]);

  useEffect(() => {
    if (!webgl || !mountRef.current) return;
    const mount = mountRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Сцена ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const CAM_DIST = 9.4;
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
    camera.position.set(0, 0.7, CAM_DIST);
    camera.lookAt(0, 0, 0);

    const holder = new THREE.Group();
    holder.rotation.x = -0.06;
    scene.add(holder);

    // ── Вписывание модели в кадр с учётом фактического aspect ─────
    const fit = (h: HoloGroup) => {
      const availH = 2 * CAM_DIST * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.64;
      const availW = availH * camera.aspect * 0.92;
      // при вращении по Y ширина проекции доходит до диагонали в плане
      const planDiag = Math.hypot(h.size.x, h.size.z);
      const s = Math.min(availW / planDiag, availH / h.size.y);
      h.root.scale.setScalar(s);
      // модель по центру кадра с лёгким смещением вниз
      h.root.position.y = -0.25;
    };

    // ── Смена моделей ──────────────────────────────────────────────
    const OUT_MS = 260;
    const IN_MS = 700;
    let current: { id: string; holo: HoloGroup } | null = null;
    let trans: { phase: 'out' | 'in'; t0: number } | null = null;

    const swapTo = (id: string) => {
      const build = BUILDERS[id] ?? BUILDERS.passenger;
      const holo = buildHolo(build());
      fit(holo);
      holder.add(holo.root);
      current = { id, holo };
      return current;
    };

    // ── Размер ─────────────────────────────────────────────────────
    let dirty = true;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (current) fit(current.holo);
      dirty = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Анимация ───────────────────────────────────────────────────
    let raf = 0;
    let angle = 0.45; // стартовый полубоковой ракурс — силуэт читается сразу
    let last = 0;
    const POINTS_OPACITY = 0.95;
    const LINES_OPACITY = 0.13;

    const removeCurrent = () => {
      if (!current) return;
      holder.remove(current.holo.root);
      disposeHolo(current.holo);
      current = null;
    };

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0);
      last = t;
      const target = pendingId.current;

      if (reduced) {
        if (current && current.id !== target) removeCurrent();
        if (!current) {
          const created = swapTo(target);
          created.holo.pointsMat.opacity = POINTS_OPACITY;
          created.holo.linesMat.opacity = LINES_OPACITY;
          dirty = true;
        }
        if (!dirty) { raf = requestAnimationFrame(tick); return; }
        dirty = false;
      } else {
        if (!trans && (!current || current.id !== target)) {
          if (current) trans = { phase: 'out', t0: t };
          else { swapTo(target); trans = { phase: 'in', t0: t }; }
        }

        if (trans && current) {
          if (trans.phase === 'out') {
            const k = clamp01((t - trans.t0) / OUT_MS);
            const e = k * k;
            current.holo.pointsMat.opacity = POINTS_OPACITY * (1 - e);
            current.holo.linesMat.opacity = LINES_OPACITY * (1 - e);
            if (k >= 1) {
              removeCurrent();
              swapTo(target);
              trans = { phase: 'in', t0: t };
            }
          } else {
            const k = clamp01((t - trans.t0) / IN_MS);
            const e = easeOutCubic(k);
            current.holo.pointsMat.opacity = POINTS_OPACITY * e;
            current.holo.linesMat.opacity = LINES_OPACITY * e;
            if (k >= 1) {
              trans = null;
              current.holo.pointsMat.opacity = POINTS_OPACITY;
              current.holo.linesMat.opacity = LINES_OPACITY;
            }
          }
        }

        const speed = 0.3 + (trans ? 2.4 : 0);
        angle += dt * speed;
        holder.rotation.y = angle;
        holder.position.y = Math.sin(t / 1700) * 0.04;
      }

      try {
        renderer.render(scene, camera);
      } catch (err) {
        console.error('[app3d] render failed:', err);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeCurrent();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // сцена создаётся один раз; смена модели — через pendingId ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webgl]);

  const caption = CAPTIONS[appId];

  if (!webgl) {
    return (
      <div className="app3d app3d--static">
        <img src={image} alt={alt} decoding="async" />
        {caption && (
          <div className="app3d-caption" key={appId}>
            <span className="app3d-caption-title">{caption[0]}</span>
            <span className="app3d-caption-sub">{caption[1]}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app3d">
      <div ref={mountRef} className="app3d-mount" role="img" aria-label={alt} />
      {caption && (
        <div className="app3d-caption" key={appId}>
          <span className="app3d-caption-title">{caption[0]}</span>
          <span className="app3d-caption-sub">{caption[1]}</span>
        </div>
      )}
    </div>
  );
}
