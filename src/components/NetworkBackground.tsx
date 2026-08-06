"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Calm animated node network for the QA/SDET portfolio hero.
 * Canvas 2D, respects prefers-reduced-motion, scales node count on mobile.
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseTarget: number;
  status: "idle" | "pass" | "flag";
  statusTimer: number;
};

type Packet = {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
};

type NetworkColors = {
  node: string;
  nodeCore: string;
  lineRgb: string;
  lineAlpha: number;
  lineActive: string;
  pass: string;
  flag: string;
  packet: string;
};

function colorsForTheme(isDark: boolean): NetworkColors {
  if (isDark) {
    return {
      node: "rgba(255, 255, 255, 0.45)",
      nodeCore: "rgba(255, 255, 255, 0.95)",
      lineRgb: "255, 255, 255",
      lineAlpha: 0.07,
      lineActive: "rgba(255, 255, 255, 0.3)",
      pass: "rgba(255, 255, 255, 0.95)",
      flag: "rgba(255, 255, 255, 0.55)",
      packet: "rgba(255, 255, 255, 0.95)",
    };
  }

  return {
    node: "rgba(15, 23, 42, 0.35)",
    nodeCore: "rgba(15, 23, 42, 0.85)",
    lineRgb: "15, 23, 42",
    lineAlpha: 0.08,
    lineActive: "rgba(15, 23, 42, 0.28)",
    pass: "rgba(15, 23, 42, 0.9)",
    flag: "rgba(15, 23, 42, 0.5)",
    packet: "rgba(15, 23, 42, 0.9)",
  };
}

const CONFIG = {
  nodeCountDesktop: 110,
  nodeCountMobile: 45,
  connectDistance: 150,
  maxConnectionsPerNode: 4,
  nodeSpeed: 0.12,
  mouseRadius: 160,
  mouseForce: 0.35,
  packetSpawnChance: 0.01,
  statusChance: 0.0015,
};

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;

    const canvas = canvasEl;
    const ctx = ctxEl;
    let colors = colorsForTheme(
      document.documentElement.classList.contains("dark")
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let animationId = 0;

    function nodeCountForWidth(w: number) {
      if (w < 640) return CONFIG.nodeCountMobile;
      return CONFIG.nodeCountDesktop;
    }

    function initNodes() {
      const count = nodeCountForWidth(width);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.nodeSpeed,
        vy: (Math.random() - 0.5) * CONFIG.nodeSpeed,
        radius: Math.random() * 1.4 + 1.2,
        pulse: Math.random(),
        pulseTarget: Math.random(),
        status: "idle" as const,
        statusTimer: 0,
      }));
      packets = [];
    }

    function resize() {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }

    function onMouseLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function updateNodes() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;

        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.mouseRadius && dist > 0.01) {
            const force =
              ((CONFIG.mouseRadius - dist) / CONFIG.mouseRadius) *
              CONFIG.mouseForce;
            n.x += (dx / dist) * force;
            n.y += (dy / dist) * force;
          }
        }

        n.pulse += (n.pulseTarget - n.pulse) * 0.02;
        if (Math.abs(n.pulse - n.pulseTarget) < 0.02) {
          n.pulseTarget = Math.random();
        }

        if (n.status === "idle" && Math.random() < CONFIG.statusChance) {
          n.status = Math.random() < 0.75 ? "pass" : "flag";
          n.statusTimer = 60;
        } else if (n.status !== "idle") {
          n.statusTimer -= 1;
          if (n.statusTimer <= 0) n.status = "idle";
        }
      }
    }

    function drawConnections() {
      for (let i = 0; i < nodes.length; i++) {
        let connections = 0;
        for (let j = i + 1; j < nodes.length; j++) {
          if (connections >= CONFIG.maxConnectionsPerNode) break;
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.connectDistance) {
            connections++;
            const opacity = 1 - dist / CONFIG.connectDistance;
            ctx.strokeStyle = `rgba(${colors.lineRgb}, ${(colors.lineAlpha * opacity).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(mx, my, b.x, b.y);
            ctx.stroke();

            if (
              !prefersReducedMotion &&
              Math.random() < CONFIG.packetSpawnChance
            ) {
              packets.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: 0.006 + Math.random() * 0.01,
              });
            }
          }
        }
      }
    }

    function drawPackets() {
      packets = packets.filter((p) => p.progress < 1);
      for (const p of packets) {
        const a = nodes[p.fromIndex];
        const b = nodes[p.toIndex];
        if (!a || !b) continue;
        p.progress += p.speed;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const t = p.progress;
        const x =
          (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
        const y =
          (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;

        ctx.beginPath();
        ctx.fillStyle = colors.packet;
        ctx.shadowColor = colors.lineActive;
        ctx.shadowBlur = 6;
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function drawNodes() {
      for (const n of nodes) {
        const glow =
          n.status === "pass"
            ? colors.pass
            : n.status === "flag"
              ? colors.flag
              : colors.node;

        const glowStrength = n.status !== "idle" ? 1 : n.pulse;

        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.shadowColor = glow;
        ctx.shadowBlur = 4 + glowStrength * 8;
        ctx.globalAlpha = 0.5 + glowStrength * 0.5;
        ctx.arc(n.x, n.y, n.radius + glowStrength * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = colors.nodeCore;
        ctx.globalAlpha = 0.7;
        ctx.arc(n.x, n.y, n.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    function syncColors() {
      colors = colorsForTheme(
        document.documentElement.classList.contains("dark")
      );
    }

    function frame() {
      syncColors();
      ctx.clearRect(0, 0, width, height);
      updateNodes();
      drawConnections();
      drawPackets();
      drawNodes();
      animationId = requestAnimationFrame(frame);
    }

    function frameStatic() {
      syncColors();
      ctx.clearRect(0, 0, width, height);
      drawConnections();
      drawNodes();
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    if (prefersReducedMotion) {
      frameStatic();
    } else {
      frame();
    }

    setReady(true);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="h-full w-full"
        style={{ background: "transparent" }}
      />
    </motion.div>
  );
}
