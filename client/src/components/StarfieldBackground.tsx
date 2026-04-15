import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js 기반 몽환적 별 유영 배경
 *
 * - 다양한 크기·색상의 별 파티클이 3D 공간에서 천천히 유영
 * - 은은한 성운(nebula) 효과로 깊이감 연출
 * - 마우스 움직임에 미세한 시차(parallax) 반응
 */
export default function StarfieldBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ── Scene, Camera, Renderer ──
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            2000,
        );
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // ── Check if Mobile ──
        const isMobile = window.innerWidth < 768;

        // ── Star Colors Palette ──
        const starColors = [
            new THREE.Color(0xffffff), // pure white
            new THREE.Color(0xfff8e7), // warm yellow-white
            new THREE.Color(0xe8e0ff), // cool lavender
            new THREE.Color(0xc8d8ff), // ice blue
            new THREE.Color(0xffd6e8), // soft pink
            new THREE.Color(0xb8d4ff), // sky blue
            new THREE.Color(0xffecd2), // peach
            new THREE.Color(0xd4f0ff), // pale cyan
        ];

        // ── Main Stars (small, many) ──
        const STAR_COUNT = isMobile ? 2400 : 3600; // Increased to 3x (from 800/1200)
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(STAR_COUNT * 3);
        const starColorData = new Float32Array(STAR_COUNT * 3);
        const starSizes = new Float32Array(STAR_COUNT);

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * 2000;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
            starPositions[i3 + 2] = (Math.random() - 0.5) * 1500;

            const color = starColors[Math.floor(Math.random() * starColors.length)];
            starColorData[i3] = color.r;
            starColorData[i3 + 1] = color.g;
            starColorData[i3 + 2] = color.b;

            // Stars size significantly increased (from 3.5/1.0 to 4.5/1.5)
            starSizes[i] = Math.random() * 4.5 + 1.5;
        }

        starGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(starPositions, 3),
        );
        starGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(starColorData, 3),
        );
        starGeometry.setAttribute(
            "size",
            new THREE.BufferAttribute(starSizes, 1),
        );

        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uConvergeScale: { value: 1.0 },
            },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uConvergeScale;

        void main() {
          vColor = color;

          // Gentle twinkle
          float twinkle = sin(uTime * 0.3 + position.x * 0.01 + position.y * 0.01) * 0.3 + 0.7;
          vAlpha = twinkle;

          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;
          // Further increased size factor, scaled by convergence
          gl_PointSize = size * uPixelRatio * (550.0 / -viewPosition.z) * uConvergeScale;
          gl_PointSize = max(gl_PointSize, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Soft circular point with glow
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
          float glow = exp(-dist * 6.0) * 0.5;

          gl_FragColor = vec4(vColor, alpha + glow);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // ── Bright Stars (larger, fewer, more prominent glow) ──
        const BRIGHT_STAR_COUNT = isMobile ? 90 : 120; // Increased to 3x (from 30/40)
        const brightGeometry = new THREE.BufferGeometry();
        const brightPositions = new Float32Array(BRIGHT_STAR_COUNT * 3);
        const brightColorData = new Float32Array(BRIGHT_STAR_COUNT * 3);
        const brightSizes = new Float32Array(BRIGHT_STAR_COUNT);

        for (let i = 0; i < BRIGHT_STAR_COUNT; i++) {
            const i3 = i * 3;
            brightPositions[i3] = (Math.random() - 0.5) * 1800;
            brightPositions[i3 + 1] = (Math.random() - 0.5) * 1800;
            brightPositions[i3 + 2] = (Math.random() - 0.5) * 800;

            const color = starColors[Math.floor(Math.random() * starColors.length)];
            brightColorData[i3] = color.r;
            brightColorData[i3 + 1] = color.g;
            brightColorData[i3 + 2] = color.b;

            // Bright stars size significantly increased (from 7/4 to 10/6)
            brightSizes[i] = Math.random() * 10 + 6;
        }

        brightGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(brightPositions, 3),
        );
        brightGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(brightColorData, 3),
        );
        brightGeometry.setAttribute(
            "size",
            new THREE.BufferAttribute(brightSizes, 1),
        );

        const brightMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uConvergeScale: { value: 1.0 },
            },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uConvergeScale;

        void main() {
          vColor = color;

          // Slow pulsing glow
          float pulse = sin(uTime * 0.5 + position.x * 0.005) * 0.3 + 0.7;
          vAlpha = pulse;

          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;
          // Further increased size factor, scaled by convergence
          gl_PointSize = size * uPixelRatio * (750.0 / -viewPosition.z) * uConvergeScale;
          gl_PointSize = max(gl_PointSize, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          // Brighter core with wider glow
          float core = smoothstep(0.5, 0.0, dist);
          float glow = exp(-dist * 4.0) * 0.8;
          float alpha = (core + glow) * vAlpha;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const brightStars = new THREE.Points(brightGeometry, brightMaterial);
        scene.add(brightStars);

        // ── Sparkle Particles (Newborn Star Dust) ──
        const SPARKLE_COUNT = isMobile ? 3000 : 5000;
        const sparkleGeometry = new THREE.BufferGeometry();
        const sparklePositions = new Float32Array(SPARKLE_COUNT * 3);
        const sparklePhases = new Float32Array(SPARKLE_COUNT);

        for (let i = 0; i < SPARKLE_COUNT; i++) {
            const i3 = i * 3;
            sparklePositions[i3] = (Math.random() - 0.5) * 2000;
            sparklePositions[i3 + 1] = (Math.random() - 0.5) * 2000;
            sparklePositions[i3 + 2] = (Math.random() - 0.5) * 1500;
            sparklePhases[i] = Math.random() * Math.PI * 2;
        }

        sparkleGeometry.setAttribute("position", new THREE.BufferAttribute(sparklePositions, 3));
        sparkleGeometry.setAttribute("phase", new THREE.BufferAttribute(sparklePhases, 1));

        const sparkleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSparkleIntensity: { value: 0.0 }, // controlled by sparkleEffect
            },
            vertexShader: `
        attribute float phase;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSparkleIntensity;

        void main() {
          // Fast twinkling
          float twinkle = sin(uTime * 10.0 + phase) * 0.5 + 0.5;
          vAlpha = twinkle * uSparkleIntensity;

          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          
          gl_Position = projectionMatrix * viewPosition;
          
          // Random slight variance in size based on phase
          float baseSize = 2.0 + sin(phase) * 1.5;
          gl_PointSize = baseSize * uPixelRatio * (600.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 1.0);
        }
      `,
            fragmentShader: `
        varying float vAlpha;
        void main() {
          if (vAlpha <= 0.0) discard;
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float core = smoothstep(0.5, 0.1, dist);
          // Sparkle color: light yellow/white
          gl_FragColor = vec4(1.0, 0.98, 0.85, core * vAlpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const sparklePoints = new THREE.Points(sparkleGeometry, sparkleMaterial);
        scene.add(sparklePoints);

        // ── Nebula Clouds (soft glowing sprites) ──
        const nebulaColors = [
            { color: 0x1a0a3e, opacity: 0.04 }, // deep purple
            { color: 0x0a1a3e, opacity: 0.03 }, // deep blue
            { color: 0x2a0a2e, opacity: 0.03 }, // dark magenta
            { color: 0x0a2a3e, opacity: 0.025 }, // teal
            { color: 0x1e0a2e, opacity: 0.03 }, // violet
        ];

        const nebulaGroup = new THREE.Group();

        for (let i = 0; i < 8; i++) {
            const nebulaConfig =
                nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            const nebulaGeometry = new THREE.PlaneGeometry(600, 600);
            const nebulaMaterial = new THREE.MeshBasicMaterial({
                color: nebulaConfig.color,
                transparent: true,
                opacity: nebulaConfig.opacity,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
            nebula.position.set(
                (Math.random() - 0.5) * 1200,
                (Math.random() - 0.5) * 1200,
                (Math.random() - 0.5) * 600 - 200,
            );
            nebula.rotation.z = Math.random() * Math.PI;
            nebula.scale.set(
                1 + Math.random() * 2,
                1 + Math.random() * 2,
                1,
            );

            nebulaGroup.add(nebula);
        }

        scene.add(nebulaGroup);

        // ── Meteors (shooting stars) ──
        interface Meteor {
            line: THREE.Line;
            head: THREE.Points;
            direction: THREE.Vector3;
            speed: number;
            life: number;
            maxLife: number;
            tailLength: number;
        }

        const activeMeteors: Meteor[] = [];
        let meteorTimer = 0;
        let nextMeteorDelay = Math.random() * 1 + 1; // 1~2 sec for first

        const meteorColors = [
            new THREE.Color(0xaaccff), // ice blue
            new THREE.Color(0xffeedd), // warm white
            new THREE.Color(0xddbbff), // soft purple
            new THREE.Color(0xffffff), // white
        ];
        function spawnMeteor() {
            const color = meteorColors[Math.floor(Math.random() * meteorColors.length)];
            const isMobile = window.innerWidth < 768;

            const aspect = window.innerWidth / window.innerHeight;

            // To ensure the meteor is ALWAYS visible regardless of how skinny the screen is,
            // we calculate the actual vertical and horizontal size of the visible frustum at Z=0.
            // Camera is at Z=500, FOV=60 degrees.
            const vFovRadian = 60 * (Math.PI / 180);
            const visibleHeight = 2 * Math.tan(vFovRadian / 2) * 500; // ~577.35
            const visibleWidth = visibleHeight * aspect;

            // Start just off the left edge (-visibleWidth / 2) with a small buffer.
            const startX = -(visibleWidth / 2) - 50;

            // Height must be constrained purely to the *visible* height.
            // Spawning too high or low on a narrow screen means the angle skips the screen entirely.
            // Keep it comfortably within the top 80% to cross the middle optimally.
            const maxY = visibleHeight * 0.4; // Top of the screen (approx 288)
            const minY = -visibleHeight * 0.1; // Slightly below middle

            const startY = minY + Math.random() * (maxY - minY);

            // Fly close to the background stars (Z=0 plane)
            const startZ = -50 - Math.random() * 100;

            const dir = new THREE.Vector3(
                1,
                -(0.15 + Math.random() * 0.15), // Mild slope downwards (0.15 to 0.3)
                (Math.random() - 0.5) * 0.1,
            ).normalize();

            // Length proportional to screen width, but bounded for extreme aspects (like ultra-wide PC)
            const tailLength = Math.min(visibleWidth * 0.6, 800) + 100;

            // DELTA-TIME: Use seconds (time) instead of frames for consistent UI speed
            // Target crossing time in Seconds (Made much slower per user request)
            const durationSeconds = isMobile ? (4.0 + Math.random() * 2.0) : (6.0 + Math.random() * 4.0);

            // TARGET: Distance it takes to fully cross the screen + buffer
            const distanceToCross = visibleWidth + Math.abs(startX) + tailLength + 200;
            const speed = distanceToCross / durationSeconds; // Units per second

            // Max life guarantees it completes the crossing + fully fades tail
            const maxLife = durationSeconds * 1.5;

            const TRAIL_SEGMENTS = 20;
            const trailPositions = new Float32Array(TRAIL_SEGMENTS * 3);
            const trailAlphas = new Float32Array(TRAIL_SEGMENTS);

            for (let i = 0; i < TRAIL_SEGMENTS; i++) {
                const t = i / (TRAIL_SEGMENTS - 1);
                trailPositions[i * 3] = startX - dir.x * t * tailLength;
                trailPositions[i * 3 + 1] = startY - dir.y * t * tailLength;
                trailPositions[i * 3 + 2] = startZ - dir.z * t * tailLength;
                trailAlphas[i] = 1.0 - t;
            }

            const trailGeometry = new THREE.BufferGeometry();
            trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
            trailGeometry.setAttribute("alpha", new THREE.BufferAttribute(trailAlphas, 1));

            const trailMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: color },
                    uOpacity: { value: 0.6 }, // Dimmer base opacity
                },
                vertexShader: `
                    attribute float alpha;
                    varying float vAlpha;
                    void main() {
                        vAlpha = alpha;
                        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    varying float vAlpha;
                    void main() {
                        // Max trail brightness is much softer
                        gl_FragColor = vec4(uColor, vAlpha * uOpacity * 0.15); 
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            const trail = new THREE.Line(trailGeometry, trailMaterial);
            trail.frustumCulled = false; // MUST disable because we manually update vertices
            scene.add(trail);

            const headGeometry = new THREE.BufferGeometry();
            headGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([startX, startY, startZ]), 3));

            const headMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: color },
                    uOpacity: { value: 0.5 }, // Dimmer head opacity
                },
                vertexShader: `
                    uniform float uOpacity;
                    void main() {
                        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                        gl_PointSize = ${isMobile ? "10.0" : "8.0"}; 
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    void main() {
                        // Circular shape
                        float dist = length(gl_PointCoord - vec2(0.5));
                        if (dist > 0.5) discard;
                        
                        // Softer core, fading edge
                        float core = smoothstep(0.5, 0.1, dist) * 0.7; // Toned down core
                        float glow = exp(-dist * 5.0) * 0.3; // Less intense glow
                        
                        gl_FragColor = vec4(uColor, (core + glow) * uOpacity);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending, // Kept for the ethereal glow, but colors are darker
            });

            const head = new THREE.Points(headGeometry, headMaterial);
            head.frustumCulled = false; // MUST disable because we manually update vertices
            scene.add(head);

            activeMeteors.push({
                line: trail,
                head,
                direction: dir,
                speed, // Units per second
                life: 0, // Time alive in seconds
                maxLife, // Max time alive in seconds
                tailLength,
            });
        }

        function updateEffects(delta: number) { // delta is in seconds
            meteorTimer += delta;

            if (meteorTimer >= nextMeteorDelay) {
                spawnMeteor();
                meteorTimer = 0;
                nextMeteorDelay = Math.random() * 2 + 1.5; // Spawn a new one every 1.5 - 3.5 seconds
            }

            // Update Meteors using delta time
            for (let m = activeMeteors.length - 1; m >= 0; m--) {
                const meteor = activeMeteors[m];
                meteor.life += delta; // Increase by elapsed time (seconds)

                const progress = meteor.life / meteor.maxLife;
                const fadeOut = progress > 0.6 ? 1.0 - (progress - 0.6) / 0.4 : 1.0;
                // Fade in quickly over first 0.2 seconds
                const fadeIn = Math.min(meteor.life / 0.2, 1.0);
                const opacity = Math.max(0, Math.min(1, fadeIn * fadeOut));

                const TRAIL_SEGMENTS = 20;
                const positions = meteor.line.geometry.attributes.position.array as Float32Array;
                const headPos = meteor.head.geometry.attributes.position.array as Float32Array;

                // Move head by speed (units/sec) * delta (sec)
                headPos[0] += meteor.direction.x * meteor.speed * delta;
                headPos[1] += meteor.direction.y * meteor.speed * delta;
                headPos[2] += meteor.direction.z * meteor.speed * delta;
                meteor.head.geometry.attributes.position.needsUpdate = true;

                for (let i = 0; i < TRAIL_SEGMENTS; i++) {
                    const t = i / (TRAIL_SEGMENTS - 1);
                    positions[i * 3] = headPos[0] - meteor.direction.x * t * meteor.tailLength;
                    positions[i * 3 + 1] = headPos[1] - meteor.direction.y * t * meteor.tailLength;
                    positions[i * 3 + 2] = headPos[2] - meteor.direction.z * t * meteor.tailLength;
                }
                meteor.line.geometry.attributes.position.needsUpdate = true;

                (meteor.line.material as THREE.ShaderMaterial).uniforms.uOpacity.value = opacity;
                (meteor.head.material as THREE.ShaderMaterial).uniforms.uOpacity.value = opacity;

                if (meteor.life >= meteor.maxLife) {
                    scene.remove(meteor.line);
                    scene.remove(meteor.head);
                    meteor.line.geometry.dispose();
                    (meteor.line.material as THREE.Material).dispose();
                    meteor.head.geometry.dispose();
                    (meteor.head.material as THREE.Material).dispose();
                    activeMeteors.splice(m, 1);
                }
            }
        }

        // ── Drift velocities for individual stars ──
        const driftVelocities = new Float32Array(STAR_COUNT * 3);
        const starCountTotal = STAR_COUNT;
        for (let i = 0; i < starCountTotal * 3; i++) {
            driftVelocities[i] = (Math.random() - 0.5) * 0.08;
        }

        const brightDriftVelocities = new Float32Array(BRIGHT_STAR_COUNT * 3);
        const brightStarCountTotal = BRIGHT_STAR_COUNT;
        for (let i = 0; i < brightStarCountTotal * 3; i++) {
            brightDriftVelocities[i] = (Math.random() - 0.5) * 0.05;
        }

        // ── Diamond Convergence State ──
        interface SavedMeteorData {
            headX: number; headY: number; headZ: number;
            direction: THREE.Vector3;
            tailLength: number;
        }

        const sparkleEffect = {
            active: false,
            timer: 0,
            delay: 1.2, // 1.2초 뒤부터 켜짐
            sustainDuration: 10.0,
            fadeDuration: 5.0,
        };

        const convergence = {
            active: false,
            phase: 'idle' as 'idle' | 'converging' | 'burst' | 'pause' | 'returning',
            targetX: 0,
            targetY: 0,
            targetZ: 0,
            timer: 0,
            convergeDuration: 2.5,
            burstDuration: 0.6,
            pauseDuration: 0.5,
            returnDuration: 2.0,
            savedStarPositions: null as Float32Array | null,
            savedBrightPositions: null as Float32Array | null,
            savedMeteorData: null as SavedMeteorData[] | null,
        };

        // Easing function: easeInOutCubic
        function easeInOutCubic(t: number): number {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        // Easing: easeOutQuart for return
        function easeOutQuart(t: number): number {
            return 1 - Math.pow(1 - t, 4);
        }

        // ── Glow burst sprite (hidden until burst phase) ──
        const burstTexture = (() => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            gradient.addColorStop(0, 'rgba(200, 180, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(150, 140, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(100, 120, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(50, 50, 150, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 256);
            return new THREE.CanvasTexture(canvas);
        })();

        const burstSpriteMaterial = new THREE.SpriteMaterial({
            map: burstTexture,
            color: 0xc8b4ff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const burstSprite = new THREE.Sprite(burstSpriteMaterial);
        burstSprite.scale.set(0, 0, 1);
        scene.add(burstSprite);

        // ── Handle diamond-click custom event ──
        const handleDiamondClick = (e: Event) => {
            if (convergence.active) return; // prevent re-trigger
            const detail = (e as CustomEvent).detail;
            const screenX = detail.x;
            const screenY = detail.y;

            // Convert screen coords to Three.js world coords
            const ndcX = (screenX / window.innerWidth) * 2 - 1;
            const ndcY = -(screenY / window.innerHeight) * 2 + 1;
            const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
            vec.unproject(camera);
            const dir = vec.sub(camera.position).normalize();
            const dist = -camera.position.z / dir.z;
            const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));

            convergence.targetX = worldPos.x;
            convergence.targetY = worldPos.y;
            convergence.targetZ = 0;
            convergence.active = true;
            convergence.phase = 'converging';
            convergence.timer = 0;

            // Save current positions
            const sp = starGeometry.attributes.position.array as Float32Array;
            convergence.savedStarPositions = new Float32Array(sp);
            const bp = brightGeometry.attributes.position.array as Float32Array;
            convergence.savedBrightPositions = new Float32Array(bp);

            // Save meteor positions
            convergence.savedMeteorData = activeMeteors.map(m => {
                const hp = m.head.geometry.attributes.position.array as Float32Array;
                return {
                    headX: hp[0], headY: hp[1], headZ: hp[2],
                    direction: m.direction.clone(),
                    tailLength: m.tailLength,
                };
            });

            // Position burst sprite at target
            burstSprite.position.set(convergence.targetX, convergence.targetY, convergence.targetZ + 1);
        };
        window.addEventListener('diamond-click', handleDiamondClick);

        // ── Mouse parallax ──
        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 30;
            mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 30;
        };

        window.addEventListener("mousemove", handleMouseMove);

        // ── Resize handler ──
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            starMaterial.uniforms.uPixelRatio.value = Math.min(
                window.devicePixelRatio,
                2,
            );
            brightMaterial.uniforms.uPixelRatio.value = Math.min(
                window.devicePixelRatio,
                2,
            );
        };

        window.addEventListener("resize", handleResize);

        // ── Animation loop ──
        let animId: number;
        let lastTime = performance.now();
        const startTime = lastTime;

        const animate = () => {
            animId = requestAnimationFrame(animate);
            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / 1000;
            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // Update shader time
            starMaterial.uniforms.uTime.value = elapsed;
            brightMaterial.uniforms.uTime.value = elapsed;

            // Update custom sparkle dust time
            sparkleMaterial.uniforms.uTime.value = elapsed;

            if (sparkleEffect.active) {
                sparkleEffect.timer += delta;
                let intensity = 0.0;

                if (sparkleEffect.timer > sparkleEffect.delay) {
                    const activeTime = sparkleEffect.timer - sparkleEffect.delay;
                    if (activeTime < sparkleEffect.sustainDuration) {
                        intensity = 1.0;
                    } else if (activeTime < sparkleEffect.sustainDuration + sparkleEffect.fadeDuration) {
                        const fadeRatio = (activeTime - sparkleEffect.sustainDuration) / sparkleEffect.fadeDuration;
                        intensity = 1.0 - fadeRatio;
                    } else {
                        intensity = 0.0;
                        sparkleEffect.active = false;
                    }
                }

                sparkleMaterial.uniforms.uSparkleIntensity.value = intensity;
            }

            const starPos = starGeometry.attributes.position.array as Float32Array;
            const brightPos = brightGeometry.attributes.position.array as Float32Array;

            // ── Convergence animation ──
            if (convergence.active) {
                convergence.timer += delta;
                const { phase, targetX, targetY, targetZ, savedStarPositions, savedBrightPositions } = convergence;

                if (phase === 'converging') {
                    const t = Math.min(convergence.timer / convergence.convergeDuration, 1);
                    const ease = easeInOutCubic(t);

                    // Shrink stars as they converge (1.0 → 0.08)
                    const sizeScale = 1.0 - ease * 0.92;
                    starMaterial.uniforms.uConvergeScale.value = sizeScale;
                    brightMaterial.uniforms.uConvergeScale.value = sizeScale;
                    // Move all stars toward target
                    for (let i = 0; i < starCountTotal; i++) {
                        const i3 = i * 3;
                        starPos[i3] = savedStarPositions![i3] + (targetX - savedStarPositions![i3]) * ease;
                        starPos[i3 + 1] = savedStarPositions![i3 + 1] + (targetY - savedStarPositions![i3 + 1]) * ease;
                        starPos[i3 + 2] = savedStarPositions![i3 + 2] + (targetZ - savedStarPositions![i3 + 2]) * ease;
                    }
                    for (let i = 0; i < brightStarCountTotal; i++) {
                        const i3 = i * 3;
                        brightPos[i3] = savedBrightPositions![i3] + (targetX - savedBrightPositions![i3]) * ease;
                        brightPos[i3 + 1] = savedBrightPositions![i3 + 1] + (targetY - savedBrightPositions![i3 + 1]) * ease;
                        brightPos[i3 + 2] = savedBrightPositions![i3 + 2] + (targetZ - savedBrightPositions![i3 + 2]) * ease;
                    }

                    // Move meteors toward target
                    const { savedMeteorData } = convergence;
                    if (savedMeteorData) {
                        for (let m = 0; m < activeMeteors.length; m++) {
                            const meteor = activeMeteors[m];
                            const saved = savedMeteorData[m];
                            const headPos = meteor.head.geometry.attributes.position.array as Float32Array;

                            // Lerp head position toward target
                            headPos[0] = saved.headX + (targetX - saved.headX) * ease;
                            headPos[1] = saved.headY + (targetY - saved.headY) * ease;
                            headPos[2] = saved.headZ + (targetZ - saved.headZ) * ease;
                            meteor.head.geometry.attributes.position.needsUpdate = true;

                            // Collapse trail as convergence progresses
                            const TRAIL_SEGMENTS = 20;
                            const positions = meteor.line.geometry.attributes.position.array as Float32Array;
                            const shrunkTail = saved.tailLength * (1 - ease);
                            for (let i = 0; i < TRAIL_SEGMENTS; i++) {
                                const tt = i / (TRAIL_SEGMENTS - 1);
                                positions[i * 3] = headPos[0] - saved.direction.x * tt * shrunkTail;
                                positions[i * 3 + 1] = headPos[1] - saved.direction.y * tt * shrunkTail;
                                positions[i * 3 + 2] = headPos[2] - saved.direction.z * tt * shrunkTail;
                            }
                            meteor.line.geometry.attributes.position.needsUpdate = true;

                            // Fade out meteor opacity
                            (meteor.line.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.6 * (1 - ease);
                            (meteor.head.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.5 * (1 - ease);
                        }
                    }

                    if (t >= 1) {
                        // Cleanup all meteors at convergence point
                        for (let m = activeMeteors.length - 1; m >= 0; m--) {
                            const meteor = activeMeteors[m];
                            scene.remove(meteor.line);
                            scene.remove(meteor.head);
                            meteor.line.geometry.dispose();
                            (meteor.line.material as THREE.Material).dispose();
                            meteor.head.geometry.dispose();
                            (meteor.head.material as THREE.Material).dispose();
                        }
                        activeMeteors.length = 0;
                        convergence.savedMeteorData = null;
                        meteorTimer = 0;

                        convergence.phase = 'pause';
                        convergence.timer = 0;
                    }
                } else if (phase === 'pause') {
                    // Hold for 0.5s after convergence before burst
                    if (convergence.timer >= convergence.pauseDuration) {
                        convergence.phase = 'burst';
                        convergence.timer = 0;
                        // Dispatch event so Home component can react
                        window.dispatchEvent(new CustomEvent('diamond-burst'));

                        // Activate sparkle effect timer (will delay for 1.0s before showing)
                        sparkleEffect.active = true;
                        sparkleEffect.timer = 0;
                    }
                } else if (phase === 'burst') {
                    const t = Math.min(convergence.timer / convergence.burstDuration, 1);
                    // Glow burst sprite expands and fades
                    const scale = t < 0.3 ? (t / 0.3) * 400 : 400 + (t - 0.3) * 600;
                    burstSprite.scale.set(scale, scale, 1);
                    burstSpriteMaterial.opacity = t < 0.3 ? t / 0.3 * 0.9 : 0.9 * (1 - (t - 0.3) / 0.7);

                    if (t >= 1) {
                        convergence.phase = 'returning';
                        convergence.timer = 0;
                        burstSpriteMaterial.opacity = 0;
                        burstSprite.scale.set(0, 0, 1);
                    }
                } else if (phase === 'returning') {
                    const t = Math.min(convergence.timer / convergence.returnDuration, 1);
                    const ease = easeOutQuart(t);

                    // Grow stars back (0.08 → 1.0)
                    const sizeScale = 0.08 + ease * 0.92;
                    starMaterial.uniforms.uConvergeScale.value = sizeScale;
                    brightMaterial.uniforms.uConvergeScale.value = sizeScale;

                    // Return stars from target back to saved positions
                    for (let i = 0; i < starCountTotal; i++) {
                        const i3 = i * 3;
                        starPos[i3] = targetX + (savedStarPositions![i3] - targetX) * ease;
                        starPos[i3 + 1] = targetY + (savedStarPositions![i3 + 1] - targetY) * ease;
                        starPos[i3 + 2] = targetZ + (savedStarPositions![i3 + 2] - targetZ) * ease;
                    }
                    for (let i = 0; i < brightStarCountTotal; i++) {
                        const i3 = i * 3;
                        brightPos[i3] = targetX + (savedBrightPositions![i3] - targetX) * ease;
                        brightPos[i3 + 1] = targetY + (savedBrightPositions![i3 + 1] - targetY) * ease;
                        brightPos[i3 + 2] = targetZ + (savedBrightPositions![i3 + 2] - targetZ) * ease;
                    }

                    if (t >= 1) {
                        convergence.active = false;
                        convergence.phase = 'idle';
                        convergence.savedStarPositions = null;
                        convergence.savedBrightPositions = null;

                        // Dispatch event so Home component resets
                        window.dispatchEvent(new CustomEvent('diamond-reset'));
                    }
                }

                starGeometry.attributes.position.needsUpdate = true;
                brightGeometry.attributes.position.needsUpdate = true;
            } else {
                // ── Normal drift (only when NOT converging) ──
                // Update effects (meteors & planets)
                updateEffects(delta);

                // Drift stars
                for (let i = 0; i < starCountTotal; i++) {
                    const i3 = i * 3;
                    starPos[i3] += driftVelocities[i3];
                    starPos[i3 + 1] += driftVelocities[i3 + 1];
                    starPos[i3 + 2] += driftVelocities[i3 + 2];
                    if (Math.abs(starPos[i3]) > 1000) driftVelocities[i3] *= -1;
                    if (Math.abs(starPos[i3 + 1]) > 1000) driftVelocities[i3 + 1] *= -1;
                    if (Math.abs(starPos[i3 + 2]) > 750) driftVelocities[i3 + 2] *= -1;
                }
                starGeometry.attributes.position.needsUpdate = true;

                // Drift bright stars
                for (let i = 0; i < brightStarCountTotal; i++) {
                    const i3 = i * 3;
                    brightPos[i3] += brightDriftVelocities[i3];
                    brightPos[i3 + 1] += brightDriftVelocities[i3 + 1];
                    brightPos[i3 + 2] += brightDriftVelocities[i3 + 2];
                    if (Math.abs(brightPos[i3]) > 900) brightDriftVelocities[i3] *= -1;
                    if (Math.abs(brightPos[i3 + 1]) > 900) brightDriftVelocities[i3 + 1] *= -1;
                    if (Math.abs(brightPos[i3 + 2]) > 400) brightDriftVelocities[i3 + 2] *= -1;
                }
                brightGeometry.attributes.position.needsUpdate = true;
            }

            // Rotate nebula very slowly
            nebulaGroup.rotation.z += 0.0001;

            // Mouse parallax (smooth lerp)
            mouse.x += (mouse.targetX - mouse.x) * 0.02;
            mouse.y += (mouse.targetY - mouse.y) * 0.02;
            camera.position.x = mouse.x;
            camera.position.y = -mouse.y;
            camera.lookAt(scene.position);

            // Very slow global rotation for depth
            stars.rotation.y += 0.00005;
            brightStars.rotation.y += 0.00003;
            sparklePoints.rotation.y += 0.00008; // slightly faster global spin

            renderer.render(scene, camera);
        };

        animate();

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener('diamond-click', handleDiamondClick);
            // Clean up meteors
            activeMeteors.forEach((meteor) => {
                scene.remove(meteor.line);
                scene.remove(meteor.head);
                meteor.line.geometry.dispose();
                (meteor.line.material as THREE.Material).dispose();
                meteor.head.geometry.dispose();
                (meteor.head.material as THREE.Material).dispose();
            });
            activeMeteors.length = 0;

            // Clean up burst sprite
            scene.remove(burstSprite);
            burstSpriteMaterial.dispose();
            burstTexture.dispose();

            renderer.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
            brightGeometry.dispose();
            brightMaterial.dispose();
            sparkleGeometry.dispose();
            sparkleMaterial.dispose();
            nebulaGroup.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    (child.material as THREE.Material).dispose();
                }
            });
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
                background:
                    "radial-gradient(ellipse at 50% 50%, #0a0a1a 0%, #050510 40%, #000000 100%)",
            }}
        />
    );
}
