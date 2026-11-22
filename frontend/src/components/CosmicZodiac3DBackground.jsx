import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

/**
 * Astrojit 3D Cosmic Celestial Astrolabe & Navagraha Sphere
 * Renders an authentic Vedic astrological 3D armillary sphere:
 * - 12-Rashi Bhachakra (Zodiac Wheel) ring
 * - Tilted Ecliptic & Celestial Equator golden rings
 * - 9 Navagraha planetary orbs orbiting on 3D elliptical trails
 * - 27 Nakshatra stardust constellations
 * - Real-time smooth 3D mouse parallax tracking
 * - Theme-adaptive (Light cream ether / Deep cosmic night)
 */
export default function CosmicZodiac3DBackground({ className = '' }) {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main 3D Armillary Group that tilts on mouse movement
    const armillaryGroup = new THREE.Group();
    scene.add(armillaryGroup);

    // --- Colors based on theme ---
    const ringGold = isDark ? 0xF59E0B : 0xD97706;
    const ringGlow = isDark ? 0xFDE68A : 0xB45309;
    const sunColor = isDark ? 0xFBBF24 : 0xD97706;

    // --- 1. Outer 12-Rashi Golden Zodiac Ring ---
    const zodiacRadius = 18;
    const zodiacRingGeo = new THREE.RingGeometry(zodiacRadius - 0.4, zodiacRadius + 0.4, 64);
    const zodiacRingMat = new THREE.MeshBasicMaterial({
      color: ringGold,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDark ? 0.85 : 0.65
    });
    const zodiacRing = new THREE.Mesh(zodiacRingGeo, zodiacRingMat);
    armillaryGroup.add(zodiacRing);

    // 12 Rashi Divider Spokes / Nodes
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const spokeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(Math.cos(angle) * (zodiacRadius - 1.2), Math.sin(angle) * (zodiacRadius - 1.2), 0),
        new THREE.Vector3(Math.cos(angle) * (zodiacRadius + 1.2), Math.sin(angle) * (zodiacRadius + 1.2), 0)
      ]);
      const spokeMat = new THREE.LineBasicMaterial({
        color: ringGlow,
        transparent: true,
        opacity: isDark ? 0.9 : 0.7
      });
      const spoke = new THREE.Line(spokeGeo, spokeMat);
      armillaryGroup.add(spoke);

      // Diamond Node at each Rashi cusp
      const nodeGeo = new THREE.OctahedronGeometry(0.35, 0);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: ringGold,
        wireframe: false
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * zodiacRadius, Math.sin(angle) * zodiacRadius, 0);
      armillaryGroup.add(node);
    }

    // --- 2. Inner Concentric Armillary Rings (Tilted Ecliptic & Equator) ---
    const innerRingRadii = [14, 10, 6.5];
    const innerRings = [];

    innerRingRadii.forEach((rad, idx) => {
      const ringGeo = new THREE.TorusGeometry(rad, 0.08, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? ringGold : ringGlow,
        transparent: true,
        opacity: isDark ? 0.75 : 0.55
      });
      const torus = new THREE.Mesh(ringGeo, ringMat);
      torus.rotation.x = (Math.PI / 4) * (idx + 1);
      torus.rotation.y = (Math.PI / 6) * (idx + 1);
      armillaryGroup.add(torus);
      innerRings.push(torus);
    });

    // --- 3. Central Golden Surya (Sun) Core ---
    const sunGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: sunColor,
      transparent: true,
      opacity: isDark ? 0.95 : 0.85
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    armillaryGroup.add(sun);

    // Sun Corona Halo Ring
    const coronaGeo = new THREE.RingGeometry(2.4, 3.2, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xFDE047,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDark ? 0.5 : 0.35
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    armillaryGroup.add(corona);

    // --- 4. 9 Navagraha Planetary Orbs on Elliptical Orbits ---
    const grahas = [
      { name: 'Budha (Mercury)', color: 0x10B981, size: 0.45, dist: 4.2, speed: 0.022, tilt: 0.2 },
      { name: 'Shukra (Venus)', color: 0xE2E8F0, size: 0.65, dist: 6.0, speed: 0.017, tilt: 0.4 },
      { name: 'Chandra (Moon)', color: 0xFEF08A, size: 0.55, dist: 7.8, speed: 0.025, tilt: 0.1 },
      { name: 'Mangala (Mars)', color: 0xEF4444, size: 0.50, dist: 9.8, speed: 0.013, tilt: 0.3 },
      { name: 'Guru (Jupiter)', color: 0xF59E0B, size: 1.10, dist: 12.2, speed: 0.009, tilt: 0.25 },
      { name: 'Shani (Saturn)', color: 0xD97706, size: 0.90, dist: 14.6, speed: 0.006, tilt: 0.5, hasRing: true },
      { name: 'Rahu (North Node)', color: 0xA855F7, size: 0.55, dist: 16.5, speed: -0.007, tilt: 0.6 },
      { name: 'Ketu (South Node)', color: 0xF97316, size: 0.55, dist: 16.5, speed: -0.007, tilt: 0.6, phaseOffset: Math.PI }
    ];

    const planetMeshes = [];

    grahas.forEach((g) => {
      // Orbit Path Line
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        g.dist, g.dist * 0.85,
        0, 2 * Math.PI,
        false, 0
      );
      const points = orbitCurve.getPoints(64);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: ringGold,
        transparent: true,
        opacity: isDark ? 0.25 : 0.15
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = g.tilt;
      orbitLine.rotation.y = g.tilt * 0.5;
      armillaryGroup.add(orbitLine);

      // Planet Sphere
      const pGeo = new THREE.SphereGeometry(g.size, 16, 16);
      const pMat = new THREE.MeshBasicMaterial({ color: g.color });
      const pMesh = new THREE.Mesh(pGeo, pMat);

      // Saturn's Ring
      if (g.hasRing) {
        const satRingGeo = new THREE.RingGeometry(g.size * 1.4, g.size * 2.2, 24);
        const satRingMat = new THREE.MeshBasicMaterial({
          color: 0xFDE68A,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const satRing = new THREE.Mesh(satRingGeo, satRingMat);
        satRing.rotation.x = Math.PI / 3;
        pMesh.add(satRing);
      }

      armillaryGroup.add(pMesh);
      planetMeshes.push({
        mesh: pMesh,
        dist: g.dist,
        speed: g.speed,
        tilt: g.tilt,
        angle: (g.phaseOffset || 0) + Math.random() * Math.PI * 2
      });
    });

    // --- 5. 27 Nakshatras & Floating Cosmic Stardust ---
    const starCount = isDark ? 450 : 250;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 20 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Warm Gold / Starlight Silver
      const isGold = Math.random() > 0.4;
      if (isGold) {
        starColors[i * 3] = 0.98;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.45;
      } else {
        starColors[i * 3] = 0.90;
        starColors[i * 3 + 1] = 0.92;
        starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: isDark ? 0.75 : 0.6,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.85 : 0.55
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- 6. Mouse Interaction & Responsive Parallax ---
    const targetRotation = { x: 0.15, y: -0.2 };
    const currentRotation = { x: 0.15, y: -0.2 };

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (e.clientX / innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / innerHeight - 0.5) * 2;
      targetRotation.y = mouseX * 0.4;
      targetRotation.x = 0.15 - mouseY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // --- 7. Animation Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse rotation damping (lerp)
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

      armillaryGroup.rotation.x = currentRotation.x;
      armillaryGroup.rotation.y = currentRotation.y + elapsedTime * 0.05;

      // Rotate Zodiac Wheel
      zodiacRing.rotation.z += 0.002;

      // Counter-rotate inner armillary rings
      innerRings.forEach((r, idx) => {
        r.rotation.z += (idx % 2 === 0 ? 0.004 : -0.003);
      });

      // Pulse Surya Corona
      const pulse = 1 + 0.08 * Math.sin(elapsedTime * 3);
      corona.scale.set(pulse, pulse, 1);

      // Animate Navagraha planetary positions
      planetMeshes.forEach((p) => {
        p.angle += p.speed;
        const x = Math.cos(p.angle) * p.dist;
        const y = Math.sin(p.angle) * (p.dist * 0.85);

        // Calculate 3D tilt coordinates
        const tiltedX = x;
        const tiltedY = y * Math.cos(p.tilt);
        const tiltedZ = y * Math.sin(p.tilt);

        p.mesh.position.set(tiltedX, tiltedY, tiltedZ);
      });

      // Slowly rotate background starfield
      starField.rotation.y = elapsedTime * 0.015;
      starField.rotation.x = elapsedTime * 0.008;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      zodiacRingGeo.dispose();
      zodiacRingMat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
