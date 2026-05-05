import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import fallbackImage from '@/assets/images/product-1.png';

const PARTICLE_COUNT = 30;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  size: Math.random() * 3.5 + 1,
  top: Math.random() * 100,
  left: Math.random() * 55 + 45,
  duration: Math.random() * 5 + 4,
  delay: Math.random() * 4,
  opacity: Math.random() * 0.6 + 0.2,
}));

function ModelViewer({ onError }: { onError: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animId: number;
    let cleanupFns: (() => void)[] = [];

    (async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');

        const W = mount.clientWidth || 500;
        const H = mount.clientHeight || 600;

        // Check WebGL support first
        const testCanvas = document.createElement('canvas');
        const ctx = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!ctx) { onError(); return; }

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.2;
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = null;

        const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
        camera.position.set(0, 0.4, 7.5);

        // Lighting — bright gold sculptural look
        scene.add(new THREE.AmbientLight(0xffd080, 2.5));

        const keyLight = new THREE.DirectionalLight(0xfff0a0, 10);
        keyLight.position.set(3, 6, 4);
        keyLight.castShadow = true;
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0xffcc40, 14);
        rimLight.position.set(-5, 2, -4);
        scene.add(rimLight);

        const fillLight = new THREE.DirectionalLight(0xffe090, 6);
        fillLight.position.set(0, -1, 6);
        scene.add(fillLight);

        const topLight = new THREE.PointLight(0xfff0b0, 8, 18);
        topLight.position.set(0, 7, 2);
        scene.add(topLight);

        const frontLight = new THREE.PointLight(0xffd060, 5, 10);
        frontLight.position.set(0, 1, 5);
        scene.add(frontLight);

        // Gold dark metallic material — brighter
        const goldMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x2a1500),
          metalness: 1.0,
          roughness: 0.04,
          envMapIntensity: 4.5,
        });

        // Environment
        const pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
        scene.environment = envTexture;
        pmrem.dispose();

        // Load GLB
        const loader = new GLTFLoader();
        let mixer: THREE.AnimationMixer | null = null;
        loader.load(
          '/prinsora_model.glb',
          (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = goldMat;
                mesh.castShadow = true;
              }
            });
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3.0 / maxDim;
            model.scale.setScalar(scale);
            model.position.copy(center.multiplyScalar(-scale));
            model.position.y -= 0.2;
            scene.add(model);
            if (gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(model);
              gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
            }
          },
          undefined,
          () => {
            // Fallback: two spheres if GLB fails
            const geo = new THREE.SphereGeometry(0.7, 64, 64);
            const s1 = new THREE.Mesh(geo, goldMat);
            s1.position.set(-0.6, 0.3, 0);
            const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), goldMat);
            s2.position.set(0.7, -0.2, 0);
            scene.add(s1, s2);
          }
        );

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.6;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minPolarAngle = Math.PI / 3.5;
        controls.maxPolarAngle = Math.PI / 1.9;

        const clock = new THREE.Clock();
        const animate = () => {
          animId = requestAnimationFrame(animate);
          if (mixer) mixer.update(clock.getDelta());
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          const w = mount.clientWidth;
          const h = mount.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        cleanupFns.push(() => {
          cancelAnimationFrame(animId);
          window.removeEventListener('resize', onResize);
          controls.dispose();
          renderer.dispose();
          if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        });
      } catch (_err) {
        onError();
      }
    })();

    return () => cleanupFns.forEach((fn) => fn());
  }, [onError]);

  return <div ref={mountRef} className="w-full h-full" />;
}

function HeroVisual() {
  const [webglFailed, setWebglFailed] = useState(false);

  return (
    <div className="relative w-full h-full">
      {webglFailed ? (
        // Fallback: reference image with matching visual effects
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-[540px] h-full overflow-hidden">
            <AppImage
              src={fallbackImage}
              alt="Prinsora — Style That Defines You"
              fill
              className="object-cover object-center"
              data-testid="img-hero-fallback"
              style={{ filter: 'drop-shadow(0 0 40px hsl(38 80% 45% / 0.25))' }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/80 pointer-events-none" />
          </div>
        </div>
      ) : (
        <ModelViewer onError={() => setWebglFailed(true)} />
      )}
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-background pt-16">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_65%_50%,hsl(20_42%_11%),hsl(20_45%_5%))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_70%_55%,hsl(38_65%_38%_/_0.06),transparent)] pointer-events-none" />

      {/* Gold dust particles — right half */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary"
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              top: p.top + '%',
              left: p.left + '%',
              opacity: p.opacity,
              animation: `heroFloat ${p.duration}s ease-in-out infinite alternate`,
              animationDelay: p.delay + 's',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 min-h-[calc(100vh-4rem)]">
        <div className="grid md:grid-cols-[45%_55%] items-center h-full min-h-[calc(100vh-4rem)]">

          {/* ── LEFT CONTENT ── */}
          <motion.div
            className="flex flex-col items-start gap-5 py-16 md:py-0 pr-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.16 } },
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase rounded-full border"
                style={{
                  color: 'hsl(45 70% 55%)',
                  borderColor: 'hsl(45 70% 55% / 0.35)',
                  background: 'hsl(45 70% 55% / 0.06)',
                }}
              >
                <span style={{ color: 'hsl(38 80% 50%)' }}>✦</span> New Collection 2026
              </span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
              className="text-5xl md:text-6xl lg:text-[5.5rem] font-sans font-extralight leading-[1.05] text-foreground"
            >
              Style That
              <span
                className="font-serif italic font-semibold block mt-1"
                style={{
                  fontSize: '1.1em',
                  background: 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 25%, #FFE57A 50%, #C8881E 75%, #8B5E1A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px hsl(45 70% 55% / 0.5))',
                }}
              >
                Defines You
              </span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="text-muted-foreground text-base md:text-[1.05rem] max-w-[390px] font-light leading-relaxed"
            >
              Discover Prinsora's{' '}
              <span className="text-foreground/85 underline underline-offset-4 decoration-primary/40">curated collection</span>{' '}
              — where every thread carries{' '}
              <span className="text-foreground/85 underline underline-offset-4 decoration-primary/40">grace</span>{' '}
              and every silhouette tells your{' '}
              <span className="text-foreground/85 underline underline-offset-4 decoration-primary/40">story</span>.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <motion.button
                data-testid="button-shop-now"
                onClick={() => router.push('/shop')}
                className="px-7 py-3 font-medium rounded-full text-sm tracking-wide bg-foreground text-background"
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px hsl(45 50% 88% / 0.2)' }}
                whileTap={{ scale: 0.97 }}
              >
                Shop Now &rarr;
              </motion.button>
              <motion.button
                data-testid="button-explore"
                onClick={() => router.push('/shop')}
                className="px-7 py-3 border font-medium rounded-full text-sm tracking-wide text-foreground"
                style={{ borderColor: 'hsl(0 0% 100% / 0.3)' }}
                whileHover={{ scale: 1.04, borderColor: 'hsl(45 70% 55%)', color: 'hsl(45 70% 55%)' }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Collection &rsaquo;&rsaquo;
              </motion.button>
            </motion.div>

            {/* Stats pill bar */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}
              className="mt-5 w-full"
            >
              <div
                className="flex flex-wrap gap-x-0 rounded-full border overflow-hidden backdrop-blur-sm divide-x"
                style={{
                  borderColor: 'hsl(38 40% 25% / 0.5)',
                  background: 'hsl(20 40% 10% / 0.7)',
                  divideColor: 'hsl(38 40% 25% / 0.4)',
                }}
                data-testid="stats-bar"
              >
                {[
                  { icon: '🛍', value: '2,000+', label: 'STYLES AVAILABLE' },
                  { icon: '👥', value: '50,000+', label: 'HAPPY CUSTOMERS' },
                  { icon: '⭐', value: '4.9★', label: 'AVERAGE RATING' },
                  { icon: '📦', value: 'Free', label: 'SHIPPING ₹999+' },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 px-4 py-3 flex-1 min-w-[110px]"
                    style={{ borderColor: 'hsl(38 40% 25% / 0.4)' }}
                  >
                    <span className="text-base leading-none">{s.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-serif font-semibold text-foreground text-sm leading-tight">{s.value}</span>
                      <span className="text-[9px] tracking-widest text-muted-foreground uppercase">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT — 3D MODEL + RINGS ── */}
          <motion.div
            className="relative flex items-center justify-center h-[500px] md:h-screen max-h-[700px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.15 }}
          >
            {/* Orbital rings — SVG */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <svg
                className="absolute w-full h-full"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
              >
                {/* Main sweeping arc */}
                <ellipse
                  cx="250" cy="270" rx="230" ry="90"
                  stroke="url(#gr1)"
                  strokeWidth="1.8"
                  strokeDasharray="700 300"
                  style={{ animation: 'orbitDash 7s linear infinite' }}
                />
                {/* Secondary arc */}
                <ellipse
                  cx="250" cy="250" rx="210" ry="75"
                  stroke="url(#gr2)"
                  strokeWidth="0.9"
                  strokeDasharray="400 500"
                  style={{ animation: 'orbitDash 11s linear infinite reverse' }}
                />
                {/* Diagonal ring */}
                <ellipse
                  cx="250" cy="250" rx="75" ry="230"
                  stroke="url(#gr3)"
                  strokeWidth="0.8"
                  strokeDasharray="350 550"
                  style={{ animation: 'orbitDash 15s linear infinite' }}
                />
                <defs>
                  <linearGradient id="gr1" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="hsl(38 90% 55%)" stopOpacity="0" />
                    <stop offset="25%" stopColor="hsl(45 95% 70%)" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="hsl(50 100% 82%)" stopOpacity="1" />
                    <stop offset="75%" stopColor="hsl(45 90% 68%)" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="hsl(38 90% 55%)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gr2" x1="500" y1="0" x2="0" y2="500" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="hsl(38 85% 55%)" stopOpacity="0" />
                    <stop offset="40%" stopColor="hsl(45 90% 72%)" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="hsl(38 85% 55%)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gr3" x1="0" y1="500" x2="500" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="hsl(45 90% 65%)" stopOpacity="0" />
                    <stop offset="50%" stopColor="hsl(45 95% 78%)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="hsl(45 90% 65%)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Radial glow behind model */}
            <div
              className="absolute pointer-events-none z-0"
              style={{
                width: '65%', height: '65%',
                background: 'radial-gradient(circle, hsl(38 75% 42% / 0.14) 0%, transparent 70%)',
                borderRadius: '50%',
              }}
            />

            {/* 3D canvas / fallback image */}
            <div className="relative z-10 w-full h-full">
              <HeroVisual />
            </div>

            {/* Sparkle accents */}
            <div
              className="absolute bottom-10 right-6 text-3xl pointer-events-none select-none z-30"
              style={{
                color: 'hsl(45 70% 55%)',
                opacity: 0.65,
                textShadow: '0 0 18px hsl(45 70% 55%)',
                animation: 'sparkPulse 2.8s ease-in-out infinite',
              }}
            >
              ✦
            </div>
            <div
              className="absolute top-16 right-16 text-lg pointer-events-none select-none z-30"
              style={{
                color: 'hsl(45 70% 55%)',
                opacity: 0.35,
                animation: 'sparkPulse 3.5s ease-in-out infinite 1s',
              }}
            >
              ✦
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%   { transform: translateY(0px) scale(1);   opacity: 0.25; }
          100% { transform: translateY(-24px) scale(1.3); opacity: 0.85; }
        }
        @keyframes orbitDash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -1000; }
        }
        @keyframes sparkPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
}
