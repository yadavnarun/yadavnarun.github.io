"use client";
import { useEffect, useRef } from "react";

type GridStyle = "wave" | "pulse" | "vortex" | "glitch" | "hex" | "circuit" | "noise" | "radial" | "floor";
type HoverEffect = "glow" | "repel" | "attract" | "ripple" | "warp";

interface WorkshopBackgroundProps {
  style?: GridStyle;
  intensity?: number; // 0-100
  hoverEffect?: HoverEffect;
  hoverRadius?: number; // pixels
  hoverStrength?: number; // 0-100
  glowEnabled?: boolean;
  glowIntensity?: number; // 0-100
}

const WorkshopBackground = ({
  style = "wave",
  intensity = 50,
  hoverEffect = "repel",
  hoverRadius = 150,
  hoverStrength = 50,
  glowEnabled = true,
  glowIntensity = 50,
}: WorkshopBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rippleRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleClick = (e: MouseEvent) => {
      if (hoverEffect === "ripple") {
        rippleRef.current.push({ x: e.clientX, y: e.clientY, time: 0 });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [hoverEffect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const intensityScale = intensity / 50; // 1 = normal, 0-2 range

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getColors = () => {
      const isDark = document.body.classList.contains("mode-dark") ||
                     !document.body.classList.contains("mode-light");
      return {
        line: isDark ? "rgba(0, 255, 136, 0.12)" : "rgba(0, 180, 100, 0.15)",
        dot: isDark ? "rgba(0, 255, 136, 0.5)" : "rgba(0, 180, 100, 0.6)",
        glow: isDark ? "rgba(0, 255, 136, 0.3)" : "rgba(0, 180, 100, 0.4)",
        highlight: isDark ? "#00ff88" : "#00cc66",
      };
    };

    // Get glow style for a point based on proximity and glow settings
    const getGlowStyle = (
      proximity: number,
      baseAlpha: number,
      colors: ReturnType<typeof getColors>
    ): { color: string; alpha: number; isGlowing: boolean } => {
      const glowScale = glowIntensity / 50; // 0-2 range
      const threshold = 0.3;

      if (glowEnabled && proximity > threshold) {
        return {
          color: colors.highlight,
          alpha: Math.min(1, (0.5 + proximity * 0.5) * glowScale),
          isGlowing: true,
        };
      }

      return {
        color: colors.dot,
        alpha: baseAlpha,
        isGlowing: false,
      };
    };

    // Simple pass-through for non-perspective grids
    const applyPerspective = (x: number, y: number): { x: number; y: number; scale: number } => {
      return { x, y, scale: 1 };
    };

    // Get grid bounds for standard grids
    const getGridBounds = (gridSize: number) => {
      return {
        startRow: -1,
        endRow: Math.ceil(canvas.height / gridSize) + 2,
        startCol: -1,
        endCol: Math.ceil(canvas.width / gridSize) + 2,
        cols: Math.ceil(canvas.width / gridSize) + 3,
        rows: Math.ceil(canvas.height / gridSize) + 3,
      };
    };

    // Calculate mouse interaction offset for a point
    const getMouseOffset = (x: number, y: number): { dx: number; dy: number; proximity: number } => {
      const mouse = mouseRef.current;
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / hoverRadius);
      const strength = (hoverStrength / 50) * 30;

      if (proximity === 0) return { dx: 0, dy: 0, proximity: 0 };

      const angle = Math.atan2(dy, dx);
      let offsetX = 0;
      let offsetY = 0;

      switch (hoverEffect) {
        case "repel":
          offsetX = Math.cos(angle) * proximity * proximity * strength;
          offsetY = Math.sin(angle) * proximity * proximity * strength;
          break;
        case "attract":
          offsetX = -Math.cos(angle) * proximity * proximity * strength;
          offsetY = -Math.sin(angle) * proximity * proximity * strength;
          break;
        case "warp":
          // Swirl effect
          const swirl = proximity * proximity * Math.PI * 0.5;
          const newAngle = angle + swirl;
          const warpDist = proximity * strength * 0.5;
          offsetX = Math.cos(newAngle) * warpDist - dx * proximity * 0.1;
          offsetY = Math.sin(newAngle) * warpDist - dy * proximity * 0.1;
          break;
        case "ripple":
          // Handled separately with click ripples
          break;
        case "glow":
        default:
          // No grid displacement, just glow
          break;
      }

      return { dx: offsetX, dy: offsetY, proximity };
    };

    // Calculate ripple offset
    const getRippleOffset = (x: number, y: number): { dx: number; dy: number } => {
      let totalDx = 0;
      let totalDy = 0;

      for (const ripple of rippleRef.current) {
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const rippleRadius = ripple.time * 200;
        const rippleWidth = 100;

        if (Math.abs(dist - rippleRadius) < rippleWidth) {
          const rippleStrength = Math.sin((dist - rippleRadius) / rippleWidth * Math.PI);
          const fade = Math.max(0, 1 - ripple.time / 3);
          const angle = Math.atan2(dy, dx);
          totalDx += Math.cos(angle) * rippleStrength * fade * 15;
          totalDy += Math.sin(angle) * rippleStrength * fade * 15;
        }
      }

      return { dx: totalDx, dy: totalDy };
    };

    // Calculate final point position with all effects
    const getPoint = (baseX: number, baseY: number, waveOffsetX: number, waveOffsetY: number) => {
      // Apply wave animation with intensity
      let x = baseX + waveOffsetX * intensityScale;
      let y = baseY + waveOffsetY * intensityScale;

      // Apply mouse interaction
      const mouseOffset = getMouseOffset(x, y);
      x += mouseOffset.dx;
      y += mouseOffset.dy;

      // Apply ripple effect
      const rippleOffset = getRippleOffset(x, y);
      x += rippleOffset.dx;
      y += rippleOffset.dy;

      // Apply perspective
      const perspectivePoint = applyPerspective(x, y);

      return { ...perspectivePoint, proximity: mouseOffset.proximity };
    };

    // Wave morph - smooth sine waves
    const drawWave = (colors: ReturnType<typeof getColors>) => {
      const gridSize = 50;
      const bounds = getGridBounds(gridSize);

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      // Pre-calculate all points
      const points: Map<string, { x: number; y: number; scale: number; proximity: number }> = new Map();
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const baseX = i * gridSize;
          const baseY = j * gridSize;
          const waveX = Math.sin(time * 0.4 + baseY * 0.015) * 8;
          const waveY = Math.cos(time * 0.3 + baseX * 0.01) * 4;
          points.set(`${i},${j}`, getPoint(baseX, baseY, waveX, waveY));
        }
      }

      // Vertical lines
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        ctx.beginPath();
        let started = false;
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let j = bounds.startRow; j <= bounds.endRow; j++) {
        ctx.beginPath();
        let started = false;
        for (let i = bounds.startCol; i <= bounds.endCol; i++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Dots at intersections
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          const pulse = Math.sin(time * 2 + i * 0.3 + j * 0.2) * 0.5 + 0.5;
          const size = (1.5 + pulse * 1.5) * p.scale;

          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

          // Highlight dots near mouse
          const glow = getGlowStyle(p.proximity, 0.4 + pulse * 0.4, colors);
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    // Pulse morph - concentric ripples from center
    const drawPulse = (colors: ReturnType<typeof getColors>) => {
      const gridSize = 50;
      const bounds = getGridBounds(gridSize);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      // Pre-calculate all points
      const points: Map<string, { x: number; y: number; scale: number; proximity: number; pulse: number }> = new Map();
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const baseX = i * gridSize;
          const baseY = j * gridSize;
          const dist = Math.sqrt((baseX - centerX) ** 2 + (baseY - centerY) ** 2);
          const ripple = Math.sin(dist * 0.02 - time * 2) * 6;
          const angle = Math.atan2(baseY - centerY, baseX - centerX);
          const offsetX = Math.cos(angle) * ripple;
          const offsetY = Math.sin(angle) * ripple;
          const pulse = (Math.sin(dist * 0.02 - time * 2) + 1) / 2;
          points.set(`${i},${j}`, { ...getPoint(baseX, baseY, offsetX, offsetY), pulse });
        }
      }

      // Vertical lines
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        ctx.beginPath();
        let started = false;
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let j = bounds.startRow; j <= bounds.endRow; j++) {
        ctx.beginPath();
        let started = false;
        for (let i = bounds.startCol; i <= bounds.endCol; i++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Pulsing dots
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          const size = (1 + p.pulse * 2) * p.scale;

          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

          const glow = getGlowStyle(p.proximity, 0.3 + p.pulse * 0.5, colors);
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    // Vortex morph - spiral distortion
    const drawVortex = (colors: ReturnType<typeof getColors>) => {
      const gridSize = 50;
      const bounds = getGridBounds(gridSize);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      // Pre-calculate all points
      const points: Map<string, { x: number; y: number; scale: number; proximity: number; pulse: number }> = new Map();
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const baseX = i * gridSize;
          const baseY = j * gridSize;
          const dist = Math.sqrt((baseX - centerX) ** 2 + (baseY - centerY) ** 2);
          const angle = Math.atan2(baseY - centerY, baseX - centerX);
          const twist = Math.sin(time * 0.5) * 0.003 * Math.max(0, 400 - dist);
          const newAngle = angle + twist;
          const offsetX = Math.cos(newAngle) * dist - (baseX - centerX);
          const offsetY = Math.sin(newAngle) * dist - (baseY - centerY);
          const pulse = Math.sin(time * 3 - dist * 0.01) * 0.5 + 0.5;
          points.set(`${i},${j}`, { ...getPoint(baseX, baseY, offsetX, offsetY), pulse });
        }
      }

      // Vertical lines
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        ctx.beginPath();
        let started = false;
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let j = bounds.startRow; j <= bounds.endRow; j++) {
        ctx.beginPath();
        let started = false;
        for (let i = bounds.startCol; i <= bounds.endCol; i++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Dots
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          const size = (1.5 + p.pulse) * p.scale;

          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

          const glow = getGlowStyle(p.proximity, 0.4 + p.pulse * 0.4, colors);
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    // Glitch morph - random displacement
    const drawGlitch = (colors: ReturnType<typeof getColors>) => {
      const gridSize = 50;
      const bounds = getGridBounds(gridSize);

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      // Determine glitch rows (persistent per frame)
      const glitchRows = new Set<number>();
      if (Math.random() < 0.1 * intensityScale) {
        glitchRows.add(Math.floor(Math.random() * bounds.rows) + bounds.startRow);
      }

      // Pre-calculate glitch offsets per row
      const rowGlitchOffsets: Map<number, number> = new Map();
      for (let j = bounds.startRow; j <= bounds.endRow; j++) {
        rowGlitchOffsets.set(j, glitchRows.has(j) ? (Math.random() - 0.5) * 20 * intensityScale : 0);
      }

      // Pre-calculate all points
      const points: Map<string, { x: number; y: number; scale: number; proximity: number; isGlitched: boolean }> = new Map();
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const baseX = i * gridSize;
          const baseY = j * gridSize;
          const glitchX = rowGlitchOffsets.get(j) || 0;
          const jitter = Math.sin(time * 10 + i + j) * 0.5 * intensityScale;
          points.set(`${i},${j}`, { ...getPoint(baseX, baseY, glitchX + jitter, 0), isGlitched: glitchRows.has(j) });
        }
      }

      // Vertical lines
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        ctx.beginPath();
        let started = false;
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let j = bounds.startRow; j <= bounds.endRow; j++) {
        ctx.beginPath();
        let started = false;
        for (let i = bounds.startCol; i <= bounds.endCol; i++) {
          const p = points.get(`${i},${j}`)!;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Dots with occasional color shift
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const p = points.get(`${i},${j}`)!;
          const size = 2 * p.scale;

          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

          const glow = getGlowStyle(p.proximity, 0.6, colors);
          if (glow.isGlowing) {
            ctx.fillStyle = glow.color;
            ctx.globalAlpha = glow.alpha;
          } else if (p.isGlitched) {
            ctx.fillStyle = "#ff3366";
            ctx.globalAlpha = 0.8;
          } else {
            ctx.fillStyle = glow.color;
            ctx.globalAlpha = glow.alpha;
          }
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    // Hex/Honeycomb pattern
    const drawHex = (colors: ReturnType<typeof getColors>) => {
      const hexSize = 40;
      const hexHeight = hexSize * Math.sqrt(3);
      const bounds = getGridBounds(hexSize);

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      const hexPoints: Array<{ x: number; y: number; scale: number; proximity: number }> = [];

      for (let row = bounds.startRow; row <= bounds.endRow; row++) {
        for (let col = bounds.startCol; col <= bounds.endCol; col++) {
          const offset = row % 2 === 0 ? 0 : hexSize * 1.5;
          const baseX = col * hexSize * 3 + offset;
          const baseY = row * hexHeight * 0.5;

          // Breathing animation
          const breathe = Math.sin(time * 0.8 + row * 0.2 + col * 0.3) * 3;
          const point = getPoint(baseX, baseY, breathe, breathe * 0.5);
          hexPoints.push(point);

          // Draw hexagon
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + Math.PI / 6;
            const hx = point.x + Math.cos(angle) * hexSize * point.scale * (0.9 + Math.sin(time + col) * 0.1 * intensityScale);
            const hy = point.y + Math.sin(angle) * hexSize * point.scale * (0.9 + Math.sin(time + col) * 0.1 * intensityScale);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Center dots
      for (const p of hexPoints) {
        const pulse = Math.sin(time * 2) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (2 + pulse) * p.scale, 0, Math.PI * 2);

        const glow = getGlowStyle(p.proximity, 0.5, colors);
        ctx.fillStyle = glow.color;
        ctx.globalAlpha = glow.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    // Circuit board pattern
    const drawCircuit = (colors: ReturnType<typeof getColors>) => {
      const gridSize = 60;
      const bounds = getGridBounds(gridSize);

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1.5;

      // Create circuit nodes
      const nodes: Map<string, { x: number; y: number; scale: number; proximity: number; type: string }> = new Map();

      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const baseX = i * gridSize + gridSize / 2;
          const baseY = j * gridSize + gridSize / 2;

          // Subtle movement
          const shift = Math.sin(time * 0.5 + i * 0.5 + j * 0.3) * 2;
          const point = getPoint(baseX, baseY, shift, 0);

          // Determine node type based on position (deterministic)
          const hash = (i * 31 + j * 17) % 100;
          const type = hash < 20 ? "chip" : hash < 50 ? "junction" : "trace";
          nodes.set(`${i},${j}`, { ...point, type });
        }
      }

      // Draw traces (connections)
      for (let i = bounds.startCol; i <= bounds.endCol; i++) {
        for (let j = bounds.startRow; j <= bounds.endRow; j++) {
          const node = nodes.get(`${i},${j}`);
          if (!node) continue;

          // Connect to right
          const rightNode = nodes.get(`${i + 1},${j}`);
          if (rightNode) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            // Add 90-degree bend for circuit look
            const midX = (node.x + rightNode.x) / 2;
            const bend = Math.sin(time * 0.3 + i + j) * 5 * intensityScale;
            ctx.lineTo(midX, node.y + bend);
            ctx.lineTo(midX, rightNode.y + bend);
            ctx.lineTo(rightNode.x, rightNode.y);
            ctx.stroke();
          }

          // Connect down
          const downNode = nodes.get(`${i},${j + 1}`);
          if (downNode) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(downNode.x, downNode.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const [, node] of nodes) {
        const pulse = Math.sin(time * 3 + node.x * 0.01) * 0.3 + 0.7;

        const glow = getGlowStyle(node.proximity, node.type === "chip" ? 0.7 : node.type === "junction" ? 0.6 : 0.4, colors);

        if (node.type === "chip") {
          // Square chip
          const size = 8 * node.scale;
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.isGlowing ? glow.alpha : 0.7;
          ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
        } else if (node.type === "junction") {
          // Circle junction
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4 * node.scale * pulse, 0, Math.PI * 2);
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.alpha;
          ctx.fill();
        } else {
          // Small trace point
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2 * node.scale, 0, Math.PI * 2);
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.alpha;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    };

    // Noise/Perlin-like flowing pattern
    const drawNoise = (colors: ReturnType<typeof getColors>) => {
      const gridSize = 30;
      const bounds = getGridBounds(gridSize);

      // Simple noise function
      const noise = (x: number, y: number, t: number) => {
        return Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t * 0.7) +
               Math.sin(x * 0.03 - y * 0.02 + t * 0.5) * 0.5;
      };

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      // Draw flow lines
      const lines = 40;
      const steps = 50;

      for (let l = 0; l < lines; l++) {
        const startX = (l / lines) * canvas.width * 1.5 - canvas.width * 0.25;
        const startY = -50;

        ctx.beginPath();
        let x = startX;
        let y = startY;

        for (let s = 0; s < steps; s++) {
          const n = noise(x, y, time * 0.5);
          const angle = n * Math.PI * intensityScale;

          // Apply mouse interaction
          const mouseOffset = getMouseOffset(x, y);
          x += Math.cos(angle) * gridSize + mouseOffset.dx * 0.5;
          y += gridSize * 0.8 + Math.sin(angle) * 5 + mouseOffset.dy * 0.5;

          // Apply perspective
          const p = applyPerspective(x, y);

          if (s === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);

          if (y > canvas.height + 100) break;
        }
        ctx.stroke();
      }

      // Add floating particles
      for (let i = bounds.startCol; i <= bounds.endCol; i += 2) {
        for (let j = bounds.startRow; j <= bounds.endRow; j += 2) {
          const baseX = i * gridSize;
          const baseY = j * gridSize;
          const n = noise(baseX, baseY, time);
          const offsetX = Math.cos(n * Math.PI) * 10 * intensityScale;
          const offsetY = Math.sin(n * Math.PI) * 10 * intensityScale;

          const point = getPoint(baseX, baseY, offsetX, offsetY);
          const size = (1.5 + Math.abs(n)) * point.scale;

          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          const glow = getGlowStyle(point.proximity, 0.3 + Math.abs(n) * 0.3, colors);
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    // Radial lines from center
    const drawRadial = (colors: ReturnType<typeof getColors>) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 1.5;

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      // Radial lines
      const numLines = 36;
      for (let i = 0; i < numLines; i++) {
        const baseAngle = (i / numLines) * Math.PI * 2;
        const wobble = Math.sin(time * 0.5 + i * 0.5) * 0.05 * intensityScale;
        const angle = baseAngle + wobble;

        ctx.beginPath();

        const steps = 30;
        for (let s = 0; s <= steps; s++) {
          const r = (s / steps) * maxRadius;
          const pulse = Math.sin(time * 2 - r * 0.01 + i * 0.2) * 5 * intensityScale;
          const x = centerX + Math.cos(angle) * (r + pulse);
          const y = centerY + Math.sin(angle) * (r + pulse);

          const mouseOffset = getMouseOffset(x, y);
          const px = x + mouseOffset.dx;
          const py = y + mouseOffset.dy;
          const point = applyPerspective(px, py);

          if (s === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }

      // Concentric circles
      const numCircles = 12;
      for (let c = 1; c <= numCircles; c++) {
        const baseRadius = (c / numCircles) * maxRadius * 0.8;
        const pulse = Math.sin(time * 1.5 - c * 0.5) * 10 * intensityScale;
        const radius = baseRadius + pulse;

        ctx.beginPath();
        const circleSteps = 60;
        for (let s = 0; s <= circleSteps; s++) {
          const angle = (s / circleSteps) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          const mouseOffset = getMouseOffset(x, y);
          const px = x + mouseOffset.dx;
          const py = y + mouseOffset.dy;
          const point = applyPerspective(px, py);

          if (s === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }

      // Intersection dots
      for (let i = 0; i < numLines; i++) {
        const baseAngle = (i / numLines) * Math.PI * 2;
        const wobble = Math.sin(time * 0.5 + i * 0.5) * 0.05 * intensityScale;
        const angle = baseAngle + wobble;

        for (let c = 1; c <= numCircles; c++) {
          const baseRadius = (c / numCircles) * maxRadius * 0.8;
          const pulse = Math.sin(time * 1.5 - c * 0.5) * 10 * intensityScale;
          const radius = baseRadius + pulse;

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          const mouseOffset = getMouseOffset(x, y);
          const px = x + mouseOffset.dx;
          const py = y + mouseOffset.dy;
          const point = applyPerspective(px, py);

          const dotPulse = Math.sin(time * 3 + i + c) * 0.5 + 0.5;
          const size = (1.5 + dotPulse) * point.scale;

          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);

          const glow = getGlowStyle(mouseOffset.proximity, 0.4 + dotPulse * 0.3, colors);
          ctx.fillStyle = glow.color;
          ctx.globalAlpha = glow.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    // Floor grid - proper 3D perspective grid
    const drawFloor = (colors: ReturnType<typeof getColors>) => {
      const centerX = canvas.width / 2;
      const horizonY = canvas.height * 0.15; // Horizon line (lower = more floor visible)
      const gridSpacing = 80; // Spacing between grid lines in world space
      const numHorizontalLines = 25;
      const numVerticalLines = 20;

      // Camera settings
      const cameraHeight = 200;
      const fov = canvas.width * 0.8;

      // Calculate ripple displacement in screen space
      const getScreenRippleOffset = (x: number, y: number): { dx: number; dy: number } => {
        let totalDx = 0;
        let totalDy = 0;

        for (const ripple of rippleRef.current) {
          const dx = x - ripple.x;
          const dy = y - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const rippleRadius = ripple.time * 250; // Expanding speed
          const rippleWidth = 120;

          if (Math.abs(dist - rippleRadius) < rippleWidth) {
            const rippleStrength = Math.sin((dist - rippleRadius) / rippleWidth * Math.PI);
            const fade = Math.max(0, 1 - ripple.time / 2.5);
            const angle = Math.atan2(dy, dx);
            const power = rippleStrength * fade * 20 * (hoverStrength / 50);
            totalDx += Math.cos(angle) * power;
            totalDy += Math.sin(angle) * power;
          }
        }

        return { dx: totalDx, dy: totalDy };
      };

      // Apply hover effect in screen space
      const applyScreenHover = (x: number, y: number): { x: number; y: number; proximity: number } => {
        const mouse = mouseRef.current;
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / hoverRadius);
        const strength = (hoverStrength / 50) * 25;

        let offsetX = 0;
        let offsetY = 0;

        // Apply ripple effect (works alongside other effects)
        if (hoverEffect === "ripple") {
          const rippleOffset = getScreenRippleOffset(x, y);
          offsetX += rippleOffset.dx;
          offsetY += rippleOffset.dy;
        }

        if (proximity > 0) {
          const angle = Math.atan2(dy, dx);

          switch (hoverEffect) {
            case "repel":
              offsetX += Math.cos(angle) * proximity * proximity * strength;
              offsetY += Math.sin(angle) * proximity * proximity * strength;
              break;
            case "attract":
              offsetX += -Math.cos(angle) * proximity * proximity * strength;
              offsetY += -Math.sin(angle) * proximity * proximity * strength;
              break;
            case "warp":
              const swirl = proximity * proximity * Math.PI * 0.5;
              const newAngle = angle + swirl;
              offsetX += Math.cos(newAngle) * proximity * strength * 0.5;
              offsetY += Math.sin(newAngle) * proximity * strength * 0.5;
              break;
            case "ripple":
              // Ripple also has a subtle glow/highlight effect on hover
              break;
            case "glow":
            default:
              break;
          }
        }

        return { x: x + offsetX, y: y + offsetY, proximity };
      };

      // Project a 3D point to 2D screen with hover effect
      const project = (worldX: number, worldZ: number, applyHover: boolean = false): { x: number; y: number; scale: number; proximity: number } | null => {
        if (worldZ <= 0) return null; // Behind camera

        const scale = fov / worldZ;
        let screenX = centerX + worldX * scale;
        let screenY = horizonY + cameraHeight * scale;

        // Off screen check
        if (screenY > canvas.height + 100 || screenY < horizonY - 10) return null;

        let proximity = 0;
        if (applyHover) {
          const hovered = applyScreenHover(screenX, screenY);
          screenX = hovered.x;
          screenY = hovered.y;
          proximity = hovered.proximity;
        }

        return { x: screenX, y: screenY, scale: Math.min(scale / 5, 2), proximity };
      };

      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      // Animation offset
      const zOffset = (time * 50 * intensityScale) % gridSpacing;

      // Draw horizontal lines (going into distance)
      for (let i = 0; i < numHorizontalLines; i++) {
        const worldZ = i * gridSpacing + 50 - zOffset;
        if (worldZ <= 0) continue;

        ctx.beginPath();
        let started = false;

        // Draw line with multiple segments for hover effect
        const numSegments = 40;
        for (let s = 0; s <= numSegments; s++) {
          const t = s / numSegments;
          const worldX = (t - 0.5) * canvas.width * 2;
          const point = project(worldX, worldZ, true);

          if (point) {
            const wave = Math.sin(time * 0.5 + i * 0.3 + s * 0.1) * 3 * intensityScale;

            if (!started) {
              ctx.moveTo(point.x, point.y + wave);
              started = true;
            } else {
              ctx.lineTo(point.x, point.y + wave);
            }
          }
        }

        if (started) {
          ctx.globalAlpha = Math.max(0.05, 0.4 - i * 0.015);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Draw vertical lines (converging to horizon)
      const halfLines = Math.floor(numVerticalLines / 2);
      for (let i = -halfLines; i <= halfLines; i++) {
        const worldX = i * gridSpacing;

        ctx.beginPath();
        let started = false;

        // Draw line from near to far
        for (let z = 50; z < numHorizontalLines * gridSpacing; z += gridSpacing / 2) {
          const adjustedZ = z - zOffset;
          if (adjustedZ <= 0) continue;

          const point = project(worldX, adjustedZ, true);
          if (point) {
            const wave = Math.sin(time * 0.3 + i * 0.2 + z * 0.01) * 2 * intensityScale;

            if (!started) {
              ctx.moveTo(point.x + wave, point.y);
              started = true;
            } else {
              ctx.lineTo(point.x + wave, point.y);
            }
          }
        }

        if (started) {
          const edgeFade = 1 - Math.abs(i) / halfLines * 0.5;
          ctx.globalAlpha = 0.3 * edgeFade;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Draw dots at intersections
      for (let i = 0; i < numHorizontalLines; i++) {
        const worldZ = i * gridSpacing + 50 - zOffset;
        if (worldZ <= 0) continue;

        for (let j = -halfLines; j <= halfLines; j++) {
          const worldX = j * gridSpacing;
          const point = project(worldX, worldZ, true);

          if (point) {
            const pulse = Math.sin(time * 2 + i * 0.3 + j * 0.2) * 0.5 + 0.5;
            const size = Math.max(1, (1.5 + pulse) * point.scale);

            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);

            const glow = getGlowStyle(point.proximity, Math.max(0.1, 0.5 - i * 0.02), colors);
            ctx.fillStyle = glow.color;
            ctx.globalAlpha = glow.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Draw horizon glow line
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(0, horizonY, 0, horizonY + 5);
      gradient.addColorStop(0, colors.highlight);
      gradient.addColorStop(1, "transparent");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.moveTo(0, horizonY);
      ctx.lineTo(canvas.width, horizonY);
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = getColors();

      switch (style) {
        case "pulse":
          drawPulse(colors);
          break;
        case "vortex":
          drawVortex(colors);
          break;
        case "glitch":
          drawGlitch(colors);
          break;
        case "hex":
          drawHex(colors);
          break;
        case "circuit":
          drawCircuit(colors);
          break;
        case "noise":
          drawNoise(colors);
          break;
        case "radial":
          drawRadial(colors);
          break;
        case "floor":
          drawFloor(colors);
          break;
        case "wave":
        default:
          drawWave(colors);
      }

      // Update ripples
      rippleRef.current = rippleRef.current
        .map(r => ({ ...r, time: r.time + 0.016 }))
        .filter(r => r.time < 3);

      time += 0.016;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [style, intensity, hoverEffect, hoverRadius, hoverStrength, glowEnabled, glowIntensity]);

  return (
    <>
      <canvas ref={canvasRef} className="grid-canvas" />
    </>
  );
};

export default WorkshopBackground;
