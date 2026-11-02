"use client";

import { formatDate } from "@/app/utils/formatDate";
import { useLogsStore } from "@/features/logs/logsStore";
import { Download, Eye, Filter, Search, Terminal, Trash2 } from "lucide-react";
import React, { useState } from "react";

const AdminLogsTab = () => {
  const logs = useLogsStore((state) => state.logs);

  const [logSearch, setLogSearch] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ip.includes(logSearch) ||
      log.id.toLowerCase().includes(logSearch.toLowerCase());
    const matchesLevel =
      logLevelFilter === "ALL" || log.level === logLevelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-500" />
            System Audit Logs
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track security alerts, admin actions, and backend system events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 transition">
            <Trash2 className="w-3.5 h-3.5" />
            Clear Logs
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium text-white shadow-lg transition">
            <Download className="w-3.5 h-3.5" />
            Export Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Total Events
          </p>
          <p className="text-2xl font-bold mt-1">{logs.length}</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Security Alerts
          </p>
          <p className="text-2xl font-bold mt-1 text-red-400">
            {logs.filter((l) => l.level === "SECURITY").length}
          </p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Errors
          </p>
          <p className="text-2xl font-bold mt-1 text-rose-500">
            {logs.filter((l) => l.level === "ERROR").length}
          </p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Warnings
          </p>
          <p className="text-2xl font-bold mt-1 text-amber-400">
            {logs.filter((l) => l.level === "WARNING")}
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, user, or IP address..."
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={logLevelFilter}
            onChange={(e) => setLogLevelFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50 cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="SECURITY">SECURITY</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Level</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor / IP</th>
                <th className="p-3">Action</th>
                <th className="p-3">Endpoint / Method</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
              {filteredLogs?.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold border text-[10px] ${
                          log.level === "SECURITY"
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : log.level === "ERROR"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : log.level === "WARNING"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400 font-sans">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="p-3 text-zinc-200">
                      <div>{log.username}</div>
                      <div className="text-[10px] text-zinc-500">{log.ip}</div>
                    </td>
                    <td className="p-3 text-zinc-300 font-sans">
                      {log.action}
                    </td>
                    <td className="p-3 text-zinc-400">{log.endpoint}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLogDetail(log)}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition font-sans text-xs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-zinc-500 text-sm"
                  >
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogsTab;
