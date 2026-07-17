import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import BarrelSvg from './Barrel';

interface Barrel3DProps {
  /** Фирменный цвет бренда — корпус бочки (плавный lerp) */
  color: string;
  /** Логотип-этикетка бренда */
  logo: string;
  logoAlt: string;
  /** Ключ смены бренда — полный оборот + подмена этикетки на «тёмной стороне» */
  spinKey: string;
}

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/** Рисует логотип бренда прямо на прозрачной текстуре (без плашки) */
function drawLabel(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  if (img) {
    const availW = w * 0.7;
    const availH = h * 0.7;
    const s = Math.min(availW / img.width, availH / img.height);
    const dw = img.width * s;
    const dh = img.height * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }
}

/**
 * Профиль стальной 200-литровой бочки для LatheGeometry: (radius, y).
 * Пропорции реальной бочки (H/D ≈ 1.5), почти прямой корпус,
 * два вальцованных обруча и завальцованные обода сверху/снизу.
 */
function barrelProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const half = 1.5;      // высота 3.0 при радиусе 1.0
  const bulge = 0.014;   // едва заметная бочкообразность
  const ribY = [-0.5, 0.5];
  const ribW = 0.075;
  const ribH = 0.055;

  // дно: утопленный диск → завальцованный обод
  pts.push(new THREE.Vector2(0.001, -half + 0.04));
  pts.push(new THREE.Vector2(0.90, -half + 0.04));
  pts.push(new THREE.Vector2(0.965, -half));
  pts.push(new THREE.Vector2(1.03, -half + 0.012));
  pts.push(new THREE.Vector2(1.035, -half + 0.05));
  pts.push(new THREE.Vector2(1.0, -half + 0.085));

  const steps = 96;
  for (let i = 0; i <= steps; i++) {
    const y = -half + 0.09 + (half * 2 - 0.18) * (i / steps);
    let r = 1 + bulge * Math.cos((y / half) * Math.PI * 0.5);
    for (const ry of ribY) {
      const d = Math.abs(y - ry);
      if (d < ribW) {
        // крутой профиль обруча — резче, чем плавный купол
        const t = 1 - d / ribW;
        r += ribH * Math.pow(Math.sin(t * Math.PI * 0.5), 1.4);
      }
    }
    pts.push(new THREE.Vector2(r, y));
  }

  // верх: обод → утопленная крышка
  pts.push(new THREE.Vector2(1.0, half - 0.085));
  pts.push(new THREE.Vector2(1.035, half - 0.05));
  pts.push(new THREE.Vector2(1.03, half - 0.012));
  pts.push(new THREE.Vector2(0.965, half));
  pts.push(new THREE.Vector2(0.90, half - 0.04));
  pts.push(new THREE.Vector2(0.001, half - 0.04));
  return pts;
}

/**
 * Настоящая 3D-бочка (как на lippini.com): Three.js, PBR-материал,
 * этикетка-декаль, вращение от прокрутки, полный оборот и плавная
 * перекраска при смене бренда. Фолбэк — SVG-версия без WebGL.
 */
export default function Barrel3D({ color, logo, logoAlt, spinKey }: Barrel3DProps) {
  const [webgl] = useState(hasWebGL);
  const mountRef = useRef<HTMLDivElement>(null);

  // мутируемые цели для rAF-цикла (без пересоздания сцены)
  const targetColor = useRef(new THREE.Color(color));
  const pendingLogo = useRef<string | null>(null);
  const spinTarget = useRef(0);
  const firstKey = useRef(true);

  useEffect(() => {
    targetColor.current.set(color);
  }, [color]);

  useEffect(() => {
    if (firstKey.current) {
      firstKey.current = false;
      pendingLogo.current = logo; // первичная загрузка этикетки
      return;
    }
    spinTarget.current += Math.PI * 2; // полный оборот на смену бренда
    pendingLogo.current = logo;        // подменится, когда этикетка уйдёт за корпус
  }, [spinKey, logo]);

  useEffect(() => {
    if (!webgl || !mountRef.current) return;
    const mount = mountRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Сцена ────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 30);
    // запас по кадру: бочка с наклоном и «дыханием» никогда не касается краёв
    camera.position.set(0, 1.05, 9.4);
    camera.lookAt(0, 0, 0);

    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3.5, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe8eeff, 0.35);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    // ── Бочка ────────────────────────────────────────────────────────
    const group = new THREE.Group();
    // художественный наклон, как у lippini
    group.rotation.z = 0.10;
    group.rotation.x = 0.05;
    scene.add(group);

    // крашеная сталь: диэлектрическая краска поверх металла + лак
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: targetColor.current.clone(),
      metalness: 0.12,
      roughness: 0.42,
      clearcoat: 0.55,
      clearcoatRoughness: 0.32,
      envMapIntensity: 0.9,
    });
    const body = new THREE.Mesh(new THREE.LatheGeometry(barrelProfile(), 128), bodyMat);
    group.add(body);

    // заливные горловины на крышке — почти вровень
    const capMat = new THREE.MeshStandardMaterial({ color: 0x24262a, metalness: 0.7, roughness: 0.3 });
    const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.028, 40), capMat);
    cap1.position.set(0.52, 1.468, 0);
    group.add(cap1);
    const cap2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.078, 0.028, 40), capMat);
    cap2.position.set(-0.5, 1.468, -0.16);
    group.add(cap2);

    // этикетка: изогнутый сегмент цилиндра с CanvasTexture
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 640;
    const labelCtx = labelCanvas.getContext('2d')!;
    drawLabel(labelCtx, null);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    labelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const labelArc = 1.7; // радианы дуги этикетки
    // тот же лаковый отклик, что у корпуса — логотип выглядит нанесённым краской
    const labelMat = new THREE.MeshPhysicalMaterial({
      map: labelTex,
      metalness: 0.12,
      roughness: 0.42,
      clearcoat: 0.55,
      clearcoatRoughness: 0.32,
      envMapIntensity: 0.9,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const label = new THREE.Mesh(
      // вплотную к корпусу; сегмент центрирован на +Z — «лицом» к камере
      new THREE.CylinderGeometry(1.017, 1.017, 0.84, 64, 1, true, -labelArc / 2, labelArc),
      labelMat,
    );
    label.position.y = 0;
    body.add(label);

    // загрузка логотипа на этикетку
    let disposed = false;
    const loadLogo = (src: string) => {
      const img = new Image();
      img.onload = () => {
        if (disposed) return;
        drawLabel(labelCtx, img);
        labelTex.needsUpdate = true;
      };
      img.src = src;
    };
    if (pendingLogo.current) {
      loadLogo(pendingLogo.current);
      pendingLogo.current = null;
    }

    // мягкая тень-подставка (radial gradient на плоскости)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 126);
    grad.addColorStop(0, 'rgba(15,26,62,0.34)');
    grad.addColorStop(1, 'rgba(15,26,62,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 3.4),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.62;
    scene.add(shadow);

    // ── Размер ───────────────────────────────────────────────────────
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Анимация: один rAF-цикл ──────────────────────────────────────
    let raf = 0;
    let spinCurrent = 0;

    const tick = (t: number) => {
      // доводка оборота при смене бренда
      const diff = spinTarget.current - spinCurrent;
      if (Math.abs(diff) > 0.001) {
        spinCurrent += diff * 0.06;
        // этикетка ушла за корпус — подменяем логотип незаметно
        if (pendingLogo.current && diff < Math.PI) {
          loadLogo(pendingLogo.current);
          pendingLogo.current = null;
        }
      } else if (pendingLogo.current) {
        loadLogo(pendingLogo.current);
        pendingLogo.current = null;
      }

      const scrollSpin = reduced ? 0 : window.scrollY * 0.0035;
      body.rotation.y = scrollSpin + spinCurrent;

      // дыхание: едва заметное покачивание
      if (!reduced) {
        group.position.y = Math.sin(t / 1600) * 0.035;
        group.rotation.z = 0.10 + Math.sin(t / 2300) * 0.012;
      }

      // плавная перекраска корпуса
      bodyMat.color.lerp(targetColor.current, 0.055);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      pmrem.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      labelTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // сцена создаётся один раз; цвет/лого/обороты приходят через refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webgl]);

  if (!webgl) {
    return <BarrelSvg color={color} logo={logo} logoAlt={logoAlt} spinKey={spinKey} />;
  }

  return <div ref={mountRef} className="barrel3d" role="img" aria-label={logoAlt} />;
}
