import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

interface Particle {
  x: number;
  y: number;
  z: number; // 3D depth layer (0.6 to 1.8)
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
  isGlyph: boolean;
  glyph: string;
  energy: number; // 0 to 1 activation level
}

interface Stardust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  secondaryRadius: number;
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

// 3D Wireframe Polyhedron vertices (Octahedron / Icosahedron hybrid)
const POLY_VERTICES = [
  { x: 0, y: 1.1, z: 0 },
  { x: 1.1, y: 0, z: 0 },
  { x: 0, y: 0, z: 1.1 },
  { x: -1.1, y: 0, z: 0 },
  { x: 0, y: 0, z: -1.1 },
  { x: 0, y: -1.1, z: 0 },
  { x: 0.75, y: 0.75, z: 0.75 },
  { x: -0.75, y: 0.75, z: 0.75 },
  { x: 0.75, y: -0.75, z: 0.75 },
  { x: -0.75, y: -0.75, z: 0.75 },
  { x: 0.75, y: 0.75, z: -0.75 },
  { x: -0.75, y: 0.75, z: -0.75 },
];

const POLY_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [5, 1], [5, 2], [5, 3], [5, 4],
  [1, 2], [2, 3], [3, 4], [4, 1],
  [0, 6], [0, 7], [5, 8], [5, 9],
  [6, 8], [7, 9], [10, 11], [6, 10], [7, 11]
];

export const AnimatedBackground: React.FC = () => {
  const { theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking & smooth parallax
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      hoverRadius: 200,
    };

    let camX = 0;
    let camY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    let polyRotX = 0;
    let polyRotY = 0;
    let polyRotZ = 0;

    const stardusts: Stardust[] = [];
    const shockwaves: Shockwave[] = [];
    const pulsePackets: PulsePacket[] = [];

    const isDark = theme === 'dark';

    const darkColors = [
      { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.7)' }, // Cyan
      { color: '#818cf8', glow: 'rgba(129, 140, 248, 0.7)' }, // Indigo
      { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.7)' }, // Violet
      { color: '#34d399', glow: 'rgba(52, 211, 153, 0.65)' }, // Emerald
      { color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.6)' },  // Rose
      { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.65)' }, // Amber
    ];

    const lightColors = [
      { color: '#2563eb', glow: 'rgba(37, 99, 235, 0.5)' }, // Blue
      { color: '#4f46e5', glow: 'rgba(79, 70, 229, 0.5)' }, // Indigo
      { color: '#7c3aed', glow: 'rgba(124, 58, 237, 0.5)' }, // Violet
      { color: '#0891b2', glow: 'rgba(8, 145, 178, 0.5)' }, // Cyan
      { color: '#059669', glow: 'rgba(5, 150, 105, 0.45)' }, // Emerald
    ];

    const colorPalette = isDark ? darkColors : lightColors;

    const glyphs = [
      'λ', 'Σ', 'π', '∫', 'Δ', 'Ω', 'f(x)', '∞', '√', 'β', 'ψ', '∇', '≈', '∂'
    ];

    // High-DPI Canvas Resize handler
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Well-balanced particle count: generous visual density without cluttering
    const totalParticles = Math.min(65, Math.max(35, Math.floor((width * height) / 28000)));

    const particles: Particle[] = [];
    for (let i = 0; i < totalParticles; i++) {
      const palette = colorPalette[i % colorPalette.length];
      const isGlyph = i % 5 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.6 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: isGlyph ? 10 : 2 + Math.random() * 2.2,
        baseAlpha: isDark ? 0.35 + Math.random() * 0.4 : 0.3 + Math.random() * 0.35,
        color: palette.color,
        glowColor: palette.glow,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
        isGlyph,
        glyph: glyphs[i % glyphs.length],
        energy: 0,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      if (mouse.x < 0) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }

      // Parallax shift based on cursor
      targetCamX = (e.clientX - width / 2) * 0.04;
      targetCamY = (e.clientY - height / 2) * 0.04;

      // Gentle stardust emission on movement
      if (stardusts.length < 35 && Math.random() < 0.3) {
        const pColor = colorPalette[Math.floor(Math.random() * colorPalette.length)].color;
        stardusts.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: 1.2 + Math.random() * 1.6,
          alpha: isDark ? 0.75 : 0.5,
          color: pColor,
          decay: 0.02 + Math.random() * 0.02,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      targetCamX = 0;
      targetCamY = 0;
    };

    const handleClick = (e: MouseEvent) => {
      // Dynamic dual expanding shockwave
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 12,
        maxRadius: Math.min(320, width * 0.35),
        alpha: isDark ? 0.85 : 0.65,
        color: isDark ? '#38bdf8' : '#4f46e5',
        secondaryRadius: 6,
      });

      // Energetic impulse outward from click center
      particles.forEach((p) => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < 260) {
          const push = ((260 - dist) / 260) * 4.5;
          p.vx += (dx / dist) * push;
          p.vy += (dy / dist) * push;
          p.energy = 1.0;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth camera interpolation
      camX += (targetCamX - camX) * 0.08;
      camY += (targetCamY - camY) * 0.08;

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.25;
        mouse.y += (mouse.targetY - mouse.y) * 0.25;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      }

      // Rotate 3D Polyhedron smoothly
      polyRotX += 0.0035;
      polyRotY += 0.0055;
      polyRotZ += 0.002;

      ctx.clearRect(0, 0, width, height);

      // 1. Cursor Glow Aura on Hover
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const auraRadius = mouse.hoverRadius * 1.05;
        const auraGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          auraRadius
        );

        if (isDark) {
          auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
          auraGrad.addColorStop(0.35, 'rgba(129, 140, 248, 0.1)');
          auraGrad.addColorStop(0.7, 'rgba(192, 132, 252, 0.04)');
          auraGrad.addColorStop(1, 'rgba(5, 8, 19, 0)');
        } else {
          auraGrad.addColorStop(0, 'rgba(79, 70, 229, 0.14)');
          auraGrad.addColorStop(0.4, 'rgba(37, 99, 235, 0.08)');
          auraGrad.addColorStop(0.7, 'rgba(124, 58, 237, 0.03)');
          auraGrad.addColorStop(1, 'rgba(241, 244, 249, 0)');
        }

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, auraRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render 3D Wireframe Polyhedron in Viewport Background
      // Positioned strategically on upper-right / responsive center with subtle perspective
      const polyCenter = {
        x: width * 0.76 + camX * 0.8,
        y: height * 0.32 + camY * 0.8,
        scale: Math.min(width, height) * 0.22,
      };

      // 3D Rotation Matrix projection
      const cosX = Math.cos(polyRotX);
      const sinX = Math.sin(polyRotX);
      const cosY = Math.cos(polyRotY);
      const sinY = Math.sin(polyRotY);
      const cosZ = Math.cos(polyRotZ);
      const sinZ = Math.sin(polyRotZ);

      const projectedVertices = POLY_VERTICES.map((v) => {
        // Rotate around X
        let y1 = v.y * cosX - v.z * sinX;
        let z1 = v.y * sinX + v.z * cosX;
        let x1 = v.x;

        // Rotate around Y
        let x2 = x1 * cosY + z1 * sinY;
        let z2 = -x1 * sinY + z1 * cosY;
        let y2 = y1;

        // Rotate around Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        // Perspective projection
        const depth = z3 + 2.8;
        const projScale = polyCenter.scale / depth;
        return {
          px: polyCenter.x + x3 * projScale,
          py: polyCenter.y + y3 * projScale,
          pz: z3,
        };
      });

      // Draw Polyhedron Wireframe Edges
      ctx.save();
      POLY_EDGES.forEach(([i, j]) => {
        const vA = projectedVertices[i];
        const vB = projectedVertices[j];
        const avgZ = (vA.pz + vB.pz) / 2;
        const edgeAlpha = Math.max(0.08, (avgZ + 1.2) / 2.4) * (isDark ? 0.38 : 0.28);

        ctx.strokeStyle = isDark ? '#818cf8' : '#4f46e5';
        ctx.globalAlpha = edgeAlpha;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(vA.px, vA.py);
        ctx.lineTo(vB.px, vB.py);
        ctx.stroke();
      });

      // Draw Polyhedron Vertices
      projectedVertices.forEach((v) => {
        const vAlpha = Math.max(0.15, (v.pz + 1.2) / 2.4) * (isDark ? 0.7 : 0.5);
        ctx.fillStyle = isDark ? '#38bdf8' : '#2563eb';
        ctx.shadowColor = isDark ? '#38bdf8' : '#4f46e5';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = vAlpha;
        ctx.beginPath();
        ctx.arc(v.px, v.py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Render Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 240 * dt;
        sw.secondaryRadius += 180 * dt;
        sw.alpha *= 0.94;

        if (sw.alpha <= 0.01 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha * 0.7;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = isDark ? '#c084fc' : '#7c3aed';
        ctx.globalAlpha = sw.alpha * 0.4;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.secondaryRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Render Stardust
      for (let i = stardusts.length - 1; i >= 0; i--) {
        const dust = stardusts[i];
        dust.x += dust.vx;
        dust.y += dust.vy;
        dust.alpha -= dust.decay;

        if (dust.alpha <= 0) {
          stardusts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = dust.color;
        ctx.globalAlpha = dust.alpha;
        ctx.shadowColor = dust.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Update Particles & Physics with ANTI-CLUSTERING GUARANTEES
      const closeParticlesToMouse: { index: number; dist: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulse calculation
        p.pulsePhase += p.pulseSpeed;
        p.energy = Math.max(0, p.energy - dt * 1.2);

        // Velocity damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Base drift
        p.x += p.vx;
        p.y += p.vy;

        // Soft screen border wrap
        if (p.x < -30) p.x = width + 30;
        else if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        else if (p.y > height + 30) p.y = -30;

        // Anti-clustering against Mouse:
        // NEVER suck particles into a dense clump! Instead, provide a soft protective bubble
        if (mouse.active && mouse.x > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.hoverRadius) {
            closeParticlesToMouse.push({ index: i, dist });
            p.energy = Math.min(1, p.energy + dt * 3);

            // Crucial Anti-Clustering rule:
            // If the particle gets within 90px of cursor, push it gently AWAY to prevent clumping!
            // When between 90px and 200px, give it a subtle circular orbit without collapsing!
            if (dist < 90) {
              const repelForce = ((90 - dist) / 90) * 1.6;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * repelForce * 0.4;
              p.vy += Math.sin(angle) * repelForce * 0.4;
            } else {
              // Gentle tangential swirl around cursor (no collapse into center)
              const angle = Math.atan2(dy, dx);
              const tangentX = -Math.sin(angle);
              const tangentY = Math.cos(angle);
              const swirlStrength = 0.25;
              p.vx += tangentX * swirlStrength * 0.15;
              p.vy += tangentY * swirlStrength * 0.15;
            }
          }
        }

        // Particle-to-Particle Anti-Clustering:
        // Ensure no two particles bunch together into an ugly cluster
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const sepX = p.x - p2.x;
          const sepY = p.y - p2.y;
          const sepDist = Math.hypot(sepX, sepY);
          const minSeparation = 48; // Minimum spacing buffer

          if (sepDist < minSeparation && sepDist > 0.001) {
            const push = ((minSeparation - sepDist) / minSeparation) * 0.35;
            const normX = sepX / sepDist;
            const normY = sepY / sepDist;
            p.vx += normX * push;
            p.vy += normY * push;
            p2.vx -= normX * push;
            p2.vy -= normY * push;
          }
        }
      }

      // 6. Draw Constellation Interconnection Filaments
      const maxConnectDist = 145;
      for (let i = 0; i < particles.length; i++) {
        const pA = particles[i];
        const pARenderX = pA.x + camX * pA.z;
        const pARenderY = pA.y + camY * pA.z;

        for (let j = i + 1; j < particles.length; j++) {
          const pB = particles[j];
          const pBRenderX = pB.x + camX * pB.z;
          const pBRenderY = pB.y + camY * pB.z;

          const dx = pARenderX - pBRenderX;
          const dy = pARenderY - pBRenderY;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const baseFactor = 1 - dist / maxConnectDist;
            const energyBoost = Math.max(pA.energy, pB.energy) * 0.4;
            const lineAlpha = (isDark ? 0.18 : 0.13) * baseFactor + energyBoost;

            ctx.save();
            ctx.strokeStyle = isDark ? '#818cf8' : '#4f46e5';
            ctx.globalAlpha = Math.min(0.65, lineAlpha);
            ctx.lineWidth = energyBoost > 0.1 ? 1.2 : 0.75;
            ctx.beginPath();
            ctx.moveTo(pARenderX, pARenderY);
            ctx.lineTo(pBRenderX, pBRenderY);
            ctx.stroke();
            ctx.restore();

            // Energy transfer chain reaction
            if (pA.energy > 0.5 && pB.energy < 0.2) {
              pB.energy = Math.min(1, pA.energy * 0.65);
            }

            // Seed traveling data packet pulses
            if (Math.random() < 0.0003 && pulsePackets.length < 10) {
              pulsePackets.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: 0.9 + Math.random() * 0.7,
                color: pA.color,
              });
            }
          }
        }
      }

      // 7. Render Traveling Data Packets
      for (let i = pulsePackets.length - 1; i >= 0; i--) {
        const packet = pulsePackets[i];
        packet.progress += packet.speed * dt;

        if (packet.progress >= 1) {
          pulsePackets.splice(i, 1);
          continue;
        }

        const pA = particles[packet.fromIndex];
        const pB = particles[packet.toIndex];
        if (!pA || !pB) {
          pulsePackets.splice(i, 1);
          continue;
        }

        const pARX = pA.x + camX * pA.z;
        const pARY = pA.y + camY * pA.z;
        const pBRX = pB.x + camX * pB.z;
        const pBRY = pB.y + camY * pB.z;

        const px = pARX + (pBRX - pARX) * packet.progress;
        const py = pARY + (pBRY - pARY) * packet.progress;

        ctx.save();
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 8. Dynamic Multi-Color Laser Filaments to Mouse Cursor on Hover
      // Cleanly connects to nearest 4 nodes WITHOUT clumping them
      if (mouse.active && mouse.x > 0 && closeParticlesToMouse.length > 0) {
        closeParticlesToMouse.sort((a, b) => a.dist - b.dist);
        const nearestNodes = closeParticlesToMouse.slice(0, 4);

        nearestNodes.forEach(({ index, dist }) => {
          const p = particles[index];
          const prx = p.x + camX * p.z;
          const pry = p.y + camY * p.z;
          const lineAlpha = (1 - dist / mouse.hoverRadius) * (isDark ? 0.6 : 0.45);

          ctx.save();
          const grad = ctx.createLinearGradient(mouse.x, mouse.y, prx, pry);
          if (isDark) {
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
            grad.addColorStop(0.5, 'rgba(192, 132, 252, 0.5)');
            grad.addColorStop(1, 'rgba(52, 211, 153, 0.3)');
          } else {
            grad.addColorStop(0, 'rgba(37, 99, 235, 0.75)');
            grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.45)');
            grad.addColorStop(1, 'rgba(5, 150, 105, 0.25)');
          }

          ctx.strokeStyle = grad;
          ctx.globalAlpha = lineAlpha;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(prx, pry);
          ctx.stroke();

          // Traveling photon bead along laser filament
          const timeOffset = (time * 0.0035) % 1;
          const photonX = mouse.x + (prx - mouse.x) * timeOffset;
          const photonY = mouse.y + (pry - mouse.y) * timeOffset;

          ctx.fillStyle = isDark ? '#ffffff' : '#2563eb';
          ctx.shadowColor = isDark ? '#38bdf8' : '#7c3aed';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(photonX, photonY, 1.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      }

      // 9. Draw Particles and Academic Glyphs
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const renderX = p.x + camX * p.z;
        const renderY = p.y + camY * p.z;

        const pulse = Math.sin(p.pulsePhase) * 0.3;
        const currentAlpha = Math.min(0.95, p.baseAlpha + pulse * 0.15 + p.energy * 0.35);

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 8 + p.energy * 10;

        if (p.isGlyph) {
          // Render Academic Math/Science Glyph Symbol
          ctx.font = `600 ${11 + p.energy * 3}px 'JetBrains Mono', monospace, sans-serif`;
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.glyph, renderX, renderY);
        } else {
          // Render Glowing Celestial Node
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.radius + p.energy * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Inner white nucleus when energized
          if (p.energy > 0.2) {
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = p.energy * (isDark ? 0.9 : 0.7);
            ctx.beginPath();
            ctx.arc(renderX, renderY, p.radius * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-700">
      {theme === 'dark' ? (
        <>
          {/* Deep Cosmic Obsidian Midnight Base Theme */}
          <div className="absolute inset-0 bg-[#050813] bg-gradient-to-br from-[#030610] via-[#070c1d] to-[#040713]" />

          {/* Animated Atmospheric Multi-Color Auroras */}
          <div className="absolute -top-40 left-1/4 w-[750px] h-[750px] bg-cyan-600/[0.13] rounded-full blur-[140px] pointer-events-none animate-aurora-1" />
          <div className="absolute top-1/3 -right-40 w-[800px] h-[800px] bg-indigo-600/[0.11] rounded-full blur-[150px] pointer-events-none animate-aurora-2" />
          <div className="absolute -bottom-40 left-1/3 w-[750px] h-[750px] bg-violet-600/[0.12] rounded-full blur-[160px] pointer-events-none animate-aurora-1" />
          <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-emerald-500/[0.05] rounded-full blur-[110px] pointer-events-none" />

          {/* Hairline High-Tech Geometry Grid */}
          <div
            className="absolute inset-0 opacity-[0.038] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        </>
      ) : (
        <>
          {/* Crystalline Airy Ice Pearl Base Theme */}
          <div className="absolute inset-0 bg-[#f1f4f9] bg-gradient-to-br from-[#f8fafc] via-[#edf2f9] to-[#f1f5fa]" />

          {/* Subtle Ambient Light Auroras */}
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-blue-500/[0.08] rounded-full blur-[130px] pointer-events-none animate-aurora-1" />
          <div className="absolute top-1/3 -right-40 w-[750px] h-[750px] bg-indigo-500/[0.07] rounded-full blur-[140px] pointer-events-none animate-aurora-2" />
          <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-violet-500/[0.06] rounded-full blur-[140px] pointer-events-none animate-aurora-1" />

          {/* Clean Subtle Grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        </>
      )}

      {/* Interactive HTML5 Graphics Canvas with Hover Animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
    </div>
  );
};
