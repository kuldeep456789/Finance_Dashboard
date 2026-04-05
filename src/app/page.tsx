"use client";

import { useRef, useState } from "react";
import { useNotification } from "@/context/NotificationContext";

const activities = [
  {
    icon: "shopping_bag",
    iconColor: "var(--theme-secondary)",
    title: "Apple Store Purchase",
    subtitle: "2 hours ago • Electronic",
    amount: "-$1,299.00",
    amountColor: "var(--theme-on-surface)",
  },
  {
    icon: "account_balance",
    iconColor: "var(--theme-tertiary)",
    title: "Dividend Payout",
    subtitle: "Yesterday • Investment",
    amount: "+$450.25",
    amountColor: "var(--theme-tertiary)",
  },
  {
    icon: "restaurant",
    iconColor: "var(--theme-primary)",
    title: "The Gourmet Kitchen",
    subtitle: "Mar 24 • Dining",
    amount: "-$84.50",
    amountColor: "var(--theme-on-surface)",
  },
];

const categories = [
  { label: "Housing", value: 45, color: "var(--theme-primary)" },
  { label: "Food", value: 25, color: "var(--theme-secondary)" },
  { label: "Entertainment", value: 15, color: "var(--theme-tertiary)" },
  { label: "Transport", value: 15, color: "var(--theme-primary-dim)" },
];

const categoryTotal = categories.reduce((sum, category) => sum + category.value, 0);
const categoryOffsets = categories.map((_, index) =>
  categories.slice(0, index).reduce((sum, category) => sum + category.value, 0)
);

const trendData = [
  { month: "Jan", value: 36120, x: 0, y: 180 },
  { month: "Feb", value: 38440, x: 140, y: 152 },
  { month: "Mar", value: 41880, x: 280, y: 120 },
  { month: "Apr", value: 43420, x: 420, y: 106 },
  { month: "May", value: 46210, x: 580, y: 58 },
  { month: "Jun", value: 48920, x: 800, y: 24 },
];

const trendChartWidth = 800;
const trendChartHeight = 200;

const trendLinePath = trendData
  .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
  .join(" ");

const trendAreaPath = `${trendLinePath} L${trendData[trendData.length - 1].x},${trendChartHeight} L${trendData[0].x},${trendChartHeight} Z`;

export default function DashboardPage() {
  const { showToast } = useNotification();
  const trendChartRef = useRef<HTMLDivElement | null>(null);
  const [activeTrendIndex, setActiveTrendIndex] = useState(trendData.length - 1);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  const activeTrendPoint = trendData[activeTrendIndex];
  const activeCategory = activeCategoryIndex === null ? null : categories[activeCategoryIndex];

  const setNearestTrendPoint = (clientX: number) => {
    const container = trendChartRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;

    const clampedRatio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const pointerX = clampedRatio * trendChartWidth;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < trendData.length; i += 1) {
      const distance = Math.abs(trendData[i].x - pointerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    setActiveTrendIndex(nearestIndex);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Summary Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Total Balance */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            borderRadius: "0.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              opacity: 0.1,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "4rem" }}
            >
              account_balance_wallet
            </span>
          </div>
          <p
            style={{
              color: "var(--theme-on-surface-variant)",
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            Total Balance
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "var(--theme-primary)",
            }}
          >
            $45,230.12
          </h2>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--theme-tertiary)",
              fontSize: "0.875rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "0.875rem" }}
            >
              trending_up
            </span>
            <span style={{ fontWeight: 500 }}>+12.5% from last month</span>
          </div>
        </div>

        {/* Monthly Income */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            borderRadius: "0.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <p
            style={{
              color: "var(--theme-on-surface-variant)",
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            Monthly Income
          </p>
          <h2
            className="emissive-positive"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "var(--theme-on-surface)",
            }}
          >
            $8,420.00
          </h2>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--theme-on-surface-variant)",
              fontSize: "0.875rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "0.875rem" }}
            >
              calendar_today
            </span>
            <span style={{ fontWeight: 500 }}>Expected: $9,000.00</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            borderRadius: "0.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <p
            style={{
              color: "var(--theme-on-surface-variant)",
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            Monthly Expenses
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "var(--theme-secondary)",
            }}
          >
            $3,150.45
          </h2>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--theme-error)",
              fontSize: "0.875rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "0.875rem" }}
            >
              trending_down
            </span>
            <span style={{ fontWeight: 500 }}>8% higher than average</span>
          </div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="grid grid-cols-1 gap-8">
        <div className="dashboard-grid">
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Balance Trend Chart */}
            <div
              style={{
                background: "var(--theme-surface-container-low)",
                padding: "2rem",
                borderRadius: "0.75rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--theme-on-surface)",
                    }}
                  >
                    Balance Trend
                  </h3>
                  <p style={{ color: "var(--theme-on-surface-variant)", fontSize: "0.875rem" }}>
                    Net worth progression over the last 6 months
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["6M", "1Y", "ALL"].map((period) => (
                    <button
                      key={period}
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background:
                          period === "6M" ? "#152c4e" : "transparent",
                        color: period === "6M" ? "var(--theme-primary)" : "var(--theme-on-surface-variant)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Line Chart */}
              <div
                ref={trendChartRef}
                style={{ position: "relative", height: "16rem", width: "100%", touchAction: "pan-y" }}
                onMouseMove={(event) => setNearestTrendPoint(event.clientX)}
                onMouseLeave={() => setActiveTrendIndex(trendData.length - 1)}
                onTouchStart={(event) => {
                  if (event.touches[0]) {
                    setNearestTrendPoint(event.touches[0].clientX);
                  }
                }}
                onTouchMove={(event) => {
                  if (event.touches[0]) {
                    setNearestTrendPoint(event.touches[0].clientX);
                  }
                }}
              >
                <svg
                  viewBox={`0 0 ${trendChartWidth} ${trendChartHeight}`}
                  preserveAspectRatio="none"
                  style={{ width: "100%", height: "100%" }}
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--theme-primary)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--theme-primary)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={trendAreaPath}
                    fill="url(#chartGradient)"
                  />
                  <path
                    d={trendLinePath}
                    fill="none"
                    stroke="var(--theme-primary)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {trendData.map((point, index) => {
                    const isActive = activeTrendIndex === index;
                    return (
                      <circle
                        key={point.month}
                        cx={point.x}
                        cy={point.y}
                        r={isActive ? 6 : 4.5}
                        fill="var(--theme-primary)"
                        stroke="var(--theme-surface)"
                        strokeWidth={isActive ? 2.5 : 1.5}
                        onMouseEnter={() => setActiveTrendIndex(index)}
                        onClick={() => setActiveTrendIndex(index)}
                        style={{
                          cursor: "pointer",
                          filter: isActive ? "drop-shadow(0 0 8px var(--theme-primary))" : "none",
                          transition: "r 0.2s ease",
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Tooltip */}
                <div
                  className="glass-card"
                  style={{
                    position: "absolute",
                    top: `${Math.max((activeTrendPoint.y / trendChartHeight) * 100, 16)}%`,
                    left: `${(activeTrendPoint.x / trendChartWidth) * 100}%`,
                    transform: "translate(-50%, -120%)",
                    border: "1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    textAlign: "center",
                    pointerEvents: "none",
                    minWidth: "8.6rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.625rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--theme-on-surface-variant)",
                    }}
                  >
                    {activeTrendPoint.month} Balance
                  </p>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--theme-on-surface)",
                    }}
                  >
                    ${activeTrendPoint.value.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* X-axis labels */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                  fontSize: "0.625rem",
                  color: "var(--theme-on-surface-variant)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {trendData.map((point, index) => (
                  <span
                    key={point.month}
                    onMouseEnter={() => setActiveTrendIndex(index)}
                    style={{
                      cursor: "pointer",
                      color:
                        activeTrendIndex === index
                          ? "var(--theme-primary)"
                          : "var(--theme-on-surface-variant)",
                    }}
                  >
                    {point.month}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--theme-on-surface)",
                  }}
                >
                  Recent Activities
                </h3>
                <button
                  onClick={() => showToast("Navigation", "Navigating to full transaction history...", "info")}
                  style={{
                    color: "var(--theme-primary)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View All
                </button>
              </div>
              <div
                style={{
                  background: "var(--theme-surface-container-high)",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                }}
              >
                {activities.map((act, i) => (
                  <div
                    key={i}
                    onClick={() => showToast("Transaction Selected", `Viewing details for ${act.title}`, "info")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      borderBottom:
                        i < activities.length - 1
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "none",
                    }}
                    className="activity-row"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "var(--theme-surface-container-high)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: act.iconColor,
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span className="material-symbols-outlined">
                          {act.icon}
                        </span>
                      </div>
                      <div>
                        <p
                          style={{
                            color: "var(--theme-on-surface)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                          }}
                        >
                          {act.title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--theme-on-surface-variant)",
                          }}
                        >
                          {act.subtitle}
                        </p>
                      </div>
                    </div>
                    <p
                      style={{
                        color: act.amountColor,
                        fontWeight: 700,
                        fontSize: "0.875rem",
                      }}
                    >
                      {act.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Category Breakdown */}
            <div
              style={{
                background: "var(--theme-surface-container-high)",
                padding: "2rem",
                borderRadius: "0.75rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--theme-on-surface)",
                  marginBottom: "1.5rem",
                }}
              >
                Category Breakdown
              </h3>

              {/* Doughnut Chart */}
              <div
                style={{
                  position: "relative",
                  width: 192,
                  height: 192,
                  margin: "0 auto 2rem",
                }}
              >
                <svg
                  viewBox="0 0 36 36"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: "rotate(-90deg)",
                  }}
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="transparent"
                    stroke="#152c4e"
                    strokeWidth="4"
                  />
                  {categories.map((category, index) => {
                    const segmentLength = (category.value / categoryTotal) * 100;
                    const isActive = activeCategoryIndex === index;
                    const isDimmed = activeCategoryIndex !== null && !isActive;

                    return (
                      <circle
                        key={category.label}
                        cx="18"
                        cy="18"
                        r="16"
                        fill="transparent"
                        stroke={category.color}
                        strokeWidth={isActive ? "4.6" : "4"}
                        strokeDasharray={`${segmentLength} 100`}
                        strokeDashoffset={-categoryOffsets[index]}
                        strokeLinecap="round"
                        onMouseEnter={() => setActiveCategoryIndex(index)}
                        onMouseLeave={() => setActiveCategoryIndex(null)}
                        onTouchStart={() => setActiveCategoryIndex(index)}
                        style={{
                          cursor: "pointer",
                          opacity: isDimmed ? 0.45 : 1,
                          filter: isActive ? `drop-shadow(0 0 6px ${category.color})` : "none",
                          transition: "opacity 0.2s ease, filter 0.2s ease, stroke-width 0.2s ease",
                        }}
                      />
                    );
                  })}
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: activeCategory ? activeCategory.color : "var(--theme-on-surface)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {activeCategory ? `${activeCategory.value}%` : "64%"}
                  </p>
                  <p
                    style={{
                      fontSize: "0.625rem",
                      color: "var(--theme-on-surface-variant)",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      textAlign: "center",
                      maxWidth: "8.5rem",
                    }}
                  >
                    {activeCategory ? activeCategory.label : "Limit"}
                  </p>
                </div>
              </div>

              {/* Legend */}
              <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {categories.map((cat, i) => {
                  const isActive = activeCategoryIndex === i;
                  const isDimmed = activeCategoryIndex !== null && !isActive;

                  return (
                    <li
                      key={i}
                      onMouseEnter={() => setActiveCategoryIndex(i)}
                      onMouseLeave={() => setActiveCategoryIndex(null)}
                      onTouchStart={() => setActiveCategoryIndex(i)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        borderRadius: "0.5rem",
                        padding: "0.2rem 0.35rem",
                        background: isActive
                          ? "color-mix(in srgb, var(--theme-primary) 8%, transparent)"
                          : "transparent",
                        opacity: isDimmed ? 0.55 : 1,
                        transition: "opacity 0.2s ease, background 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: cat.color,
                          }}
                        />
                        <span
                          style={{ fontSize: "0.875rem", color: "#cbd5e1" }}
                        >
                          {cat.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: isActive ? cat.color : "var(--theme-on-surface)",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {cat.value}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Market Pulse */}
            <div
              style={{
                background: "var(--theme-surface-container-low)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
              className="market-pulse"
            >
              {/* BG Glow Effect */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 30% 50%, rgba(88,245,209,0.08), transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 10 }}>
                <h4
                  style={{
                    fontWeight: 700,
                    color: "var(--theme-tertiary)",
                    marginBottom: "0.25rem",
                    fontSize: "1rem",
                  }}
                >
                  Market Pulse
                </h4>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#cbd5e1",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  Tech stocks are showing bullish patterns in early trading.
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--theme-on-surface)",
                    }}
                  >
                    NASDAQ
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--theme-tertiary)",
                      textShadow: "0 0 12px rgba(184, 255, 187, 0.3)",
                    }}
                  >
                    +1.42%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
