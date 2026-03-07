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
            },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          // Gentle twinkle
          float twinkle = sin(uTime * 0.3 + position.x * 0.01 + position.y * 0.01) * 0.3 + 0.7;
          vAlpha = twinkle;

          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;
          // Further increased size factor
          gl_PointSize = size * uPixelRatio * (550.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 2.0);
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
            },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          // Slow pulsing glow
          float pulse = sin(uTime * 0.5 + position.x * 0.005) * 0.3 + 0.7;
          vAlpha = pulse;

          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;
          // Further increased size factor
          gl_PointSize = size * uPixelRatio * (750.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 4.0);
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

            // Fix for resize: we capture the viewport AT THE TIME OF SPAWN.
            // Meteors don't care if the screen resizes while they are flying.
            const aspect = window.innerWidth / window.innerHeight;

            // Fixed logical height based on camera frustum at Z=500 -> Z=0 distance
            const logicalHeight = 600;
            const logicalWidth = logicalHeight * aspect;

            // Start firmly off the PRECISE left edge
            const startX = -(logicalWidth / 2) - 100 - Math.random() * 200;

            // Limit Y start to upper half mostly so trajectory moves down and across screen
            // If aspect < 1 (mobile), allow a bit wider vertical range
            const yRange = isMobile ? logicalHeight * 0.8 : logicalHeight * 0.6;
            const startY = (Math.random() - 0.5) * yRange + (logicalHeight * 0.2); // Bias slightly upwards

            // Meteors fly behind the UI but in front of distant stars
            const startZ = -50 - Math.random() * 150;

            const dir = new THREE.Vector3(
                1,
                -(Math.random() * 0.2 + 0.1), // Gentle downward slope
                (Math.random() - 0.5) * 0.1,
            ).normalize();

            // Length proportional to screen width, but bounded for extreme aspects (like ultra-wide PC)
            const tailLength = Math.min(logicalWidth * 0.6, 800) + 100;

            // DELTA-TIME: Use seconds (time) instead of frames for consistent UI speed
            // Target crossing time in Seconds
            const durationSeconds = isMobile ? (2.0 + Math.random() * 1.5) : (3.5 + Math.random() * 2.0);

            // Speed = Total distance to cross screen / Seconds
            // Distance is roughly logicalWidth + startX offset + some buffer
            const distanceToCross = logicalWidth + Math.abs(startX) + tailLength + 200;
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
                    uOpacity: { value: 1.0 },
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
                        gl_FragColor = vec4(uColor, vAlpha * uOpacity * 0.4);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            const trail = new THREE.Line(trailGeometry, trailMaterial);
            scene.add(trail);

            const headGeometry = new THREE.BufferGeometry();
            headGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([startX, startY, startZ]), 3));

            const headMaterial = new THREE.PointsMaterial({
                color: color,
                size: isMobile ? 8 : 6, // Increased head size slightly for better visibility
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            });

            const head = new THREE.Points(headGeometry, headMaterial);
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
                (meteor.head.material as THREE.PointsMaterial).opacity = opacity;

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

            // Update effects (meteors & planets)
            updateEffects(delta);

            // Drift stars
            const starPos = starGeometry.attributes.position
                .array as Float32Array;
            for (let i = 0; i < starCountTotal; i++) {
                const i3 = i * 3;
                starPos[i3] += driftVelocities[i3];
                starPos[i3 + 1] += driftVelocities[i3 + 1];
                starPos[i3 + 2] += driftVelocities[i3 + 2];

                // Wrap around bounds
                if (Math.abs(starPos[i3]) > 1000) driftVelocities[i3] *= -1;
                if (Math.abs(starPos[i3 + 1]) > 1000)
                    driftVelocities[i3 + 1] *= -1;
                if (Math.abs(starPos[i3 + 2]) > 750) driftVelocities[i3 + 2] *= -1;
            }
            starGeometry.attributes.position.needsUpdate = true;

            // Drift bright stars
            const brightPos = brightGeometry.attributes.position
                .array as Float32Array;
            for (let i = 0; i < brightStarCountTotal; i++) {
                const i3 = i * 3;
                brightPos[i3] += brightDriftVelocities[i3];
                brightPos[i3 + 1] += brightDriftVelocities[i3 + 1];
                brightPos[i3 + 2] += brightDriftVelocities[i3 + 2];

                if (Math.abs(brightPos[i3]) > 900)
                    brightDriftVelocities[i3] *= -1;
                if (Math.abs(brightPos[i3 + 1]) > 900)
                    brightDriftVelocities[i3 + 1] *= -1;
                if (Math.abs(brightPos[i3 + 2]) > 400)
                    brightDriftVelocities[i3 + 2] *= -1;
            }
            brightGeometry.attributes.position.needsUpdate = true;

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

            renderer.render(scene, camera);
        };

        animate();

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
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

            renderer.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
            brightGeometry.dispose();
            brightMaterial.dispose();
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
