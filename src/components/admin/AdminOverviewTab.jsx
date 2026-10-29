"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Film,
  MoreVertical,
  Search,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const AdminOverviewTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([
    {
      id: 1,
      name: "User0",
      email: "test0@gmail.com",
      role: "ADMIN",
      status: "Active",
      joined: "May 12, 2026",
      lastActive: "2 mins ago",
      reviewsCount: 142,
      listsCount: 12,
    },
    {
      id: 2,
      name: "Marko Petrović",
      email: "marko@example.com",
      role: "MODERATOR",
      status: "Active",
      joined: "Jun 1, 2026",
      lastActive: "1 hour ago",
      reviewsCount: 89,
      listsCount: 5,
    },
    {
      id: 3,
      name: "Ana Jovanović",
      email: "ana@example.com",
      role: "USER",
      status: "Active",
      joined: "Jul 15, 2026",
      lastActive: "Yesterday",
      reviewsCount: 24,
      listsCount: 3,
    },
    {
      id: 4,
      name: "Nikola Milić",
      email: "nikola@example.com",
      role: "USER",
      status: "Suspended",
      joined: "Aug 20, 2026",
      lastActive: "5 days ago",
      reviewsCount: 2,
      listsCount: 0,
    },
    {
      id: 5,
      name: "Elena Popović",
      email: "elena@example.com",
      role: "USER",
      status: "Active",
      joined: "Sep 5, 2026",
      lastActive: "3 hours ago",
      reviewsCount: 61,
      listsCount: 8,
    },
  ]);
  const [activeTab, setActiveTab] = useState("overview");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const stats = [
    {
      title: "Total Users",
      value: "12,450",
      change: "+12%",
      isPositive: true,
      icon: Users,
    },
    {
      title: "Active Sessions",
      value: "1,205",
      change: "+5%",
      isPositive: true,
      icon: Activity,
    },
    {
      title: "Movies & TV Shows",
      value: "8,920",
      change: "+180 this week",
      isPositive: true,
      icon: Film,
    },
    {
      title: "Reported Reviews",
      value: "14",
      change: "+3 new",
      isPositive: false,
      icon: AlertTriangle,
    },
  ];

  const recentLogs = [
    {
      id: 1,
      user: "User0",
      action: "Changed role for marko@example.com to MODERATOR",
      time: "10 minutes ago",
    },
    {
      id: 2,
      user: "System",
      action: "Automated database backup completed successfully",
      time: "1 hour ago",
    },
    {
      id: 3,
      user: "Marko Petrović",
      action: "Removed reported review #482",
      time: "3 hours ago",
    },
  ];

  const filteredUsers = usersData.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-medium uppercase tracking-wider">
                  {stat.title}
                </span>
                <Icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-medium ${
                    stat.isPositive ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* USERS PREVIEW TABLE */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">User Accounts</h2>
            <p className="text-xs text-zinc-400">
              View and manage registered users
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-red-500/50 w-64"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MODERATOR">MODERATOR</option>
              <option value="USER">USER</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Join Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.slice(0, 3).map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-red-500">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-200">
                        {user.name}
                      </div>
                      <div className="text-xs text-zinc-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        user.role === "ADMIN"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : user.role === "MODERATOR"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.status === "Active"
                          ? "text-emerald-400"
                          : "text-zinc-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-400"
                            : "bg-zinc-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400 text-xs">{user.joined}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveTab("users")}
                      className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT ADMIN ACTIVITY LOGS */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Admin Activity</h2>
          <button
            onClick={() => setActiveTab("logs")}
            className="text-xs text-red-500 hover:underline flex items-center gap-1"
          >
            View All Logs <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between text-xs p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-semibold text-zinc-200">{log.user}:</span>
                <span className="text-zinc-400">{log.action}</span>
              </div>
              <span className="text-zinc-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminOverviewTab;
