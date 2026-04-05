"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface BarChartDatum {
  label: string;
  income: number;
  expense: number;
}

interface BarChartProps {
  data?: BarChartDatum[];
  height?: number;
}

const defaultData: BarChartDatum[] = [
  { label: "Jun", income: 6200, expense: 3800 },
  { label: "Jul", income: 7100, expense: 4200 },
  { label: "Aug", income: 6800, expense: 3500 },
  { label: "Sep", income: 8200, expense: 4800 },
  { label: "Oct", income: 8500, expense: 5100 },
  { label: "Nov", income: 9200, expense: 4200 },
];

const chartPadding = { top: 10, bottom: 30, left: 10, right: 10 };

type HoverState = {
  index: number;
  left: number;
  top: number;
};

const resolveCssColor = (colorValue: string) => {
  if (!colorValue.startsWith("var(")) return colorValue;
  const match = colorValue.match(/var\(([^)]+)\)/);
  if (!match || typeof window === "undefined") return colorValue;

  const resolved = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(match[1])
    .trim();

  return resolved || colorValue;
};

export function BarChart({ data = defaultData, height = 200 }: BarChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = useMemo(
    () => Math.max(1, ...data.flatMap((datum) => [datum.income, datum.expense])),
    [data]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const totalHeight = rect.height;
    const chartWidth = width - chartPadding.left - chartPadding.right;
    const chartHeight = totalHeight - chartPadding.top - chartPadding.bottom;
    const barGroupWidth = chartWidth / data.length;
    const barWidth = barGroupWidth * 0.3;
    const gap = barGroupWidth * 0.05;

    let animationProgress = 0;
    const animationDuration = 40;
    let frameId: number | null = null;

    const draw = () => {
      animationProgress += 1;
      const progressRatio = Math.min(animationProgress / animationDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3);

      ctx.clearRect(0, 0, width, totalHeight);

      data.forEach((datum, index) => {
        const groupX =
          chartPadding.left + index * barGroupWidth + barGroupWidth * 0.15;

        const incomeHeight = (datum.income / maxValue) * chartHeight * easedProgress;
        const incomeGradient = ctx.createLinearGradient(
          0,
          chartPadding.top + chartHeight - incomeHeight,
          0,
          chartPadding.top + chartHeight
        );
        incomeGradient.addColorStop(0, resolveCssColor("var(--theme-primary)"));
        incomeGradient.addColorStop(
          1,
          resolveCssColor("var(--theme-primary-container)")
        );

        ctx.beginPath();
        ctx.roundRect(
          groupX,
          chartPadding.top + chartHeight - incomeHeight,
          barWidth,
          incomeHeight,
          [4, 4, 0, 0]
        );
        ctx.fillStyle = incomeGradient;
        ctx.fill();

        const expenseHeight =
          (datum.expense / maxValue) * chartHeight * easedProgress;
        const expenseGradient = ctx.createLinearGradient(
          0,
          chartPadding.top + chartHeight - expenseHeight,
          0,
          chartPadding.top + chartHeight
        );
        expenseGradient.addColorStop(0, resolveCssColor("var(--theme-secondary)"));
        expenseGradient.addColorStop(
          1,
          resolveCssColor("var(--theme-secondary-container)")
        );

        ctx.beginPath();
        ctx.roundRect(
          groupX + barWidth + gap,
          chartPadding.top + chartHeight - expenseHeight,
          barWidth,
          expenseHeight,
          [4, 4, 0, 0]
        );
        ctx.fillStyle = expenseGradient;
        ctx.fill();

        ctx.fillStyle = resolveCssColor("var(--theme-on-surface-variant)");
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          datum.label,
          groupX + barWidth + gap / 2,
          totalHeight - chartPadding.bottom + 18
        );
      });

      if (progressRatio < 1) {
        frameId = window.requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [data, height, maxValue]);

  const resolveHoverState = (clientX: number): HoverState | null => {
    const wrapper = wrapperRef.current;
    if (!wrapper || data.length === 0) return null;

    const rect = wrapper.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const pointerX = clientX - rect.left;
    const chartWidth = rect.width - chartPadding.left - chartPadding.right;
    const chartHeight = rect.height - chartPadding.top - chartPadding.bottom;
    const barGroupWidth = chartWidth / data.length;

    if (
      pointerX < chartPadding.left ||
      pointerX > rect.width - chartPadding.right
    ) {
      return null;
    }

    const rawIndex = Math.floor((pointerX - chartPadding.left) / barGroupWidth);
    const clampedIndex = Math.min(Math.max(rawIndex, 0), data.length - 1);
    const datum = data[clampedIndex];
    const peakHeight = (Math.max(datum.income, datum.expense) / maxValue) * chartHeight;
    const left = chartPadding.left + clampedIndex * barGroupWidth + barGroupWidth / 2;
    const top = Math.max(chartPadding.top + chartHeight - peakHeight - 12, 8);

    return { index: clampedIndex, left, top };
  };

  const [hoverState, setHoverState] = useState<HoverState | null>(null);

  const handlePointerMove = (clientX: number) => {
    const nextHoverState = resolveHoverState(clientX);
    setHoverState(nextHoverState);
    setHoveredIndex(nextHoverState ? nextHoverState.index : null);
  };

  const activeDatum = hoveredIndex === null ? null : data[hoveredIndex];

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", height }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        onMouseMove={(event) => handlePointerMove(event.clientX)}
        onMouseLeave={() => {
          setHoveredIndex(null);
          setHoverState(null);
        }}
        onTouchStart={(event) => {
          if (event.touches[0]) handlePointerMove(event.touches[0].clientX);
        }}
        onTouchMove={(event) => {
          if (event.touches[0]) handlePointerMove(event.touches[0].clientX);
        }}
        onTouchEnd={() => {
          setHoveredIndex(null);
          setHoverState(null);
        }}
      />

      {activeDatum && hoverState ? (
        <div
          style={{
            position: "absolute",
            left: hoverState.left,
            top: hoverState.top,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            minWidth: "8.5rem",
            borderRadius: "0.6rem",
            padding: "0.45rem 0.6rem",
            background:
              "color-mix(in srgb, var(--theme-surface-container-high) 92%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--theme-outline-variant) 88%, transparent)",
            boxShadow: "0 6px 14px rgba(2, 8, 23, 0.2)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 5,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.625rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--theme-on-surface-variant)",
              fontWeight: 700,
            }}
          >
            {activeDatum.label}
          </p>
          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "0.75rem",
              color: "var(--theme-on-surface)",
            }}
          >
            Income:{" "}
            <strong style={{ color: "var(--theme-primary)" }}>
              ${activeDatum.income.toLocaleString()}
            </strong>
          </p>
          <p
            style={{
              margin: "0.15rem 0 0",
              fontSize: "0.75rem",
              color: "var(--theme-on-surface)",
            }}
          >
            Expense:{" "}
            <strong style={{ color: "var(--theme-secondary)" }}>
              ${activeDatum.expense.toLocaleString()}
            </strong>
          </p>
        </div>
      ) : null}
    </div>
  );
}
