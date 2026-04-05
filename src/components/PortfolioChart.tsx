"use client";

import { useEffect, useRef } from "react";

interface PortfolioChartProps {
  color?: string;
  height?: number;
}

export function PortfolioChart({
  color = "var(--theme-primary)",
  height = 200,
}: PortfolioChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Generate smooth data points
    const points = 50;
    const data: number[] = [];
    let val = 0.3 + Math.random() * 0.2;
    for (let i = 0; i < points; i++) {
      val += (Math.random() - 0.45) * 0.08;
      val = Math.max(0.1, Math.min(0.9, val));
      data.push(val);
    }
    // Ensure upward trend at end
    for (let i = points - 10; i < points; i++) {
      data[i] = data[i] * 0.7 + 0.85 * 0.3;
    }

    // Animate
    let progress = 0;
    const duration = 60;

    function draw() {
      if (!ctx) return;
      progress++;
      const pct = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);

      ctx.clearRect(0, 0, w, h);

      let resolvedColor = color;
      if (color.startsWith("var(")) {
        const varMatch = color.match(/var\(([^)]+)\)/);
        if (varMatch && typeof window !== "undefined") {
          resolvedColor =
            window
              .getComputedStyle(document.documentElement)
              .getPropertyValue(varMatch[1])
              .trim() || color;
        }
      }

      const hexMatch = resolvedColor.match(/^#([a-f\d]{3}|[a-f\d]{6})$/i);
      const rgbFunctionMatch = resolvedColor.match(/^rgba?\(([^)]+)\)$/i);

      const withAlpha = (alpha: number) => {
        if (hexMatch) {
          const hexValue = hexMatch[1];
          const normalizedHex =
            hexValue.length === 3
              ? hexValue
                  .split("")
                  .map((char) => char + char)
                  .join("")
              : hexValue;

          const r = parseInt(normalizedHex.slice(0, 2), 16);
          const g = parseInt(normalizedHex.slice(2, 4), 16);
          const b = parseInt(normalizedHex.slice(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        if (rgbFunctionMatch) {
          const [r = "0", g = "0", b = "0"] = rgbFunctionMatch[1].split(",");
          return `rgba(${Number.parseFloat(r)}, ${Number.parseFloat(g)}, ${Number.parseFloat(b)}, ${alpha})`;
        }

        return alpha === 0 ? "rgba(0, 0, 0, 0)" : resolvedColor;
      };

      // Draw gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, withAlpha(0.22));
      grad.addColorStop(1, withAlpha(0));

      ctx.beginPath();
      ctx.moveTo(0, h);

      const visiblePoints = Math.floor(data.length * ease);
      for (let i = 0; i <= visiblePoints; i++) {
        const x = (i / (data.length - 1)) * w;
        const y = h - data[i] * h * 0.85;
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = ((i - 1) / (data.length - 1)) * w;
          const prevY = h - data[i - 1] * h * 0.85;
          const cpx = (prevX + x) / 2;
          ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
        }
      }

      // Fill area
      const lastX = (visiblePoints / (data.length - 1)) * w;
      const lastY = h - data[visiblePoints] * h * 0.85;
      ctx.lineTo(lastX, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      for (let i = 0; i <= visiblePoints; i++) {
        const x = (i / (data.length - 1)) * w;
        const y = h - data[i] * h * 0.85;
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = ((i - 1) / (data.length - 1)) * w;
          const prevY = h - data[i - 1] * h * 0.85;
          const cpx = (prevX + x) / 2;
          ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
        }
      }
      ctx.strokeStyle = resolvedColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Glowing dot at end
      if (ease > 0.1) {
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = resolvedColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(0.22);
        ctx.fill();
      }

      if (pct < 1) requestAnimationFrame(draw);
    }

    draw();
  }, [color, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height, display: "block" }}
    />
  );
}
