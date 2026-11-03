"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  FileText,
  Server,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { useAdminStore } from "@/features/admin/adminStore";
import { useLogsStore } from "@/features/logs/logsStore";

const MetricCard = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm transition-all hover:border-neutral-700">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-400">{title}</span>
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-red-500">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="mt-4 flex items-baseline justify-between">
      <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
      {change && (
        <span
          className={`flex items-center text-xs font-semibold ${
            isPositive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          {change}
        </span>
      )}
    </div>
  </div>
);

const AdminOverviewTab = () => {
  const { users, fetchUsers } = useAdminStore();
  const logs = useLogsStore((state) => state.logs);

  const [interval, setInterval] = useState("year");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [chartData, setChartData] = useState([]);

  const errorRate = useMemo(() => {
    if (!logs || logs.length === 0) return "0.0%";
    const errors = logs.filter((l) => l.level === "ERROR").length;
    const rate = (errors / logs.length) * 100;
    return `${rate.toFixed(2)}%`;
  }, [logs]);

  useEffect(() => {
    async function fetchUsersFunction() {
      try {
        await fetchUsers();
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }
    fetchUsersFunction();
  }, [fetchUsers]);

  useEffect(() => {
    if (!users || users.length === 0) return;

    const now = new Date();
    let processedData = [];

    if (interval === "today") {
      const slots = Array.from({ length: 6 }, (_, i) => ({
        label: `${String(i * 4).padStart(2, "0")}:00`,
        count: 0,
        index: i,
      }));

      users.forEach((user) => {
        const date = new Date(user.createdAt);
        if (date.toDateString() === now.toDateString()) {
          const hour = date.getHours();
          const slotIndex = Math.floor(hour / 4);
          if (slots[slotIndex]) slots[slotIndex].count += 1;
        }
      });
      processedData = slots;
    } else if (interval === "week") {
      const days = [
        { label: "Mon", count: 0, index: 0 },
        { label: "Tue", count: 0, index: 1 },
        { label: "Wed", count: 0, index: 2 },
        { label: "Thu", count: 0, index: 3 },
        { label: "Fri", count: 0, index: 4 },
        { label: "Sat", count: 0, index: 5 },
        { label: "Sun", count: 0, index: 6 },
      ];

      users.forEach((user) => {
        const date = new Date(user.createdAt);
        const diffDays = Math.abs(now - date) / (1000 * 60 * 60 * 24);
        if (diffDays <= 7) {
          let dayIndex = date.getDay() - 1;
          if (dayIndex === -1) dayIndex = 6;
          if (days[dayIndex]) days[dayIndex].count += 1;
        }
      });
      processedData = days;
    } else if (interval === "year") {
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(0, i);
        return {
          label: d.toLocaleString("default", { month: "short" }),
          count: 0,
          index: i,
        };
      });

      users.forEach((user) => {
        const date = new Date(user.createdAt);
        if (date.getFullYear() === now.getFullYear()) {
          const mIndex = date.getMonth();
          months[mIndex].count += 1;
        }
      });
      processedData = months;
    } else if (interval === "alltime") {
      const countsByYear = {};
      users.forEach((user) => {
        const year = new Date(user.createdAt).getFullYear();
        if (!countsByYear[year]) {
          countsByYear[year] = { label: String(year), count: 0, index: year };
        }
        countsByYear[year].count += 1;
      });
      processedData = Object.values(countsByYear).sort(
        (a, b) => a.index - b.index,
      );
      if (processedData.length === 0) {
        processedData = [
          {
            label: String(now.getFullYear()),
            count: 0,
            index: now.getFullYear(),
          },
        ];
      }
    }

    setChartData(processedData);
  }, [users, interval]);

  const metrics = [
    {
      title: "Total Active Users",
      value: users?.length || 0,
      isPositive: true,
      icon: Users,
    },
    {
      title: "Published Content",
      value: "1,420",
      isPositive: true,
      icon: FileText,
    },
    {
      title: "Error Rate",
      value: errorRate,
      isPositive: false,
      icon: ShieldAlert,
    },
  ];

  const graphPoints =
    chartData.length > 0 ? chartData.map((d) => d.count) : [0, 0, 0, 0];
  const maxVal = Math.max(...graphPoints, 1);
  const minVal = Math.min(...graphPoints);
  const range = maxVal - minVal || 1;
  const width = 600;
  const height = 160;

  const coordinates = graphPoints.map((val, index) => {
    const x = (index / (graphPoints.length - 1 || 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 20) - 10;
    return { x, y, val };
  });

  const pointsString = coordinates.map((p) => `${p.x},${p.y}`).join(" ");
  const areaString = `0,${height} ${pointsString} ${width},${height}`;

  return (
    <div className="space-y-6 text-neutral-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <select
            value={interval}
            onChange={(e) => {
              setInterval(e.target.value);
              setHoveredIndex(null);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50 cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="year">This year</option>
            <option value="alltime">All time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      <div className="">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Number of users created
              </h3>
            </div>
            <span className="rounded-md bg-red-950/60 px-2.5 py-1 text-xs font-medium text-red-400 border border-red-800/40">
              Live Feed
            </span>
          </div>

          <div
            className="relative h-52 w-full pt-4"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex !== null && coordinates[hoveredIndex] && (
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] shadow-xl text-white pointer-events-none transition-all duration-75"
                style={{
                  left: `${(hoveredIndex / (graphPoints.length - 1 || 1)) * 100}%`,
                  top: `${(coordinates[hoveredIndex].y / height) * 100}%`,
                  marginTop: "-10px",
                }}
              >
                <span className="text-neutral-400 font-medium">
                  {chartData[hoveredIndex]?.label}:{" "}
                </span>
                <span className="text-red-400 font-bold">
                  {coordinates[hoveredIndex].val} users
                </span>
              </div>
            )}

            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <polygon points={areaString} fill="url(#lineGradient)" />

              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />

              {coordinates.map((coord, idx) => (
                <g key={idx}>
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="18"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                  />
                  {hoveredIndex === idx && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="5"
                      fill="#ffffff"
                      stroke="#ef4444"
                      strokeWidth="3"
                      className="transition-all duration-150 pointer-events-none"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex justify-between text-[11px] text-neutral-500 border-t border-neutral-800 pt-3">
            {chartData.length > 0 ? (
              chartData.map((item, i) => <span key={i}>{item.label}</span>)
            ) : (
              <span>No data available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
