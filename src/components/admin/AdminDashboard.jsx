import React, { useState } from "react";
import {
  Users,
  Film,
  Tv,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  ShieldAlert,
  UserCheck,
  UserX,
  Activity,
  Database,
  ArrowUpRight,
  RefreshCw,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Plus,
  X,
  Eye,
  Star,
  Tag,
  Terminal,
  Info,
  AlertOctagon,
  FileText,
  Server,
  Globe,
} from "lucide-react";
import AdminOverviewTab from "./AdminOverviewTab";
import AdminUserTab from "./AdminUserTab";
import AdminContentTab from "./AdminContentTab";
import AdminLogsTab from "./AdminLogsTab";

/*{selectedLogDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full p-6 space-y-6 flex flex-col justify-between overflow-y-auto font-sans">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-zinc-200">
                    Log Entry Inspection
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLogDetail(null)}
                  className="p-1 text-zinc-400 hover:text-white rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Log ID</span>
                  <span className="font-mono text-xs text-zinc-200">
                    {selectedLogDetail.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Severity</span>
                  <span className="font-mono text-xs text-red-400 font-bold">
                    {selectedLogDetail.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Timestamp</span>
                  <span className="text-xs text-zinc-200">
                    {selectedLogDetail.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">IP Address</span>
                  <span className="font-mono text-xs text-zinc-200">
                    {selectedLogDetail.ip}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-medium">
                  Event Description
                </label>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200">
                  {selectedLogDetail.action}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-medium">
                  Execution Payload / Details
                </label>
                <pre className="p-3 bg-black border border-zinc-800 rounded-lg text-xs text-zinc-400 font-mono whitespace-pre-wrap">
                  {selectedLogDetail.details}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setSelectedLogDetail(null)}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold transition"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}
      {isAddContentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-semibold text-zinc-200">
                Add New Media Item
              </h3>
              <button
                onClick={() => setIsAddContentModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interstellar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-medium">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-medium">
                    Release Year
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2026"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">
                  Genre
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sci-Fi, Drama"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddContentModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-semibold text-white shadow-lg transition"
                >
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeUserDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full p-6 space-y-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="font-semibold text-zinc-200">User Details</h3>
                <button
                  onClick={() => setActiveUserDetail(null)}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-red-500 text-xl">
                  {activeUserDetail.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">
                    {activeUserDetail.name}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {activeUserDetail.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                      {activeUserDetail.role}
                    </span>
                    <span className="text-xs text-zinc-500">
                      • Joined {activeUserDetail.joined}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
                  <p className="text-[10px] text-zinc-500 uppercase font-medium">
                    Reviews Posted
                  </p>
                  <p className="text-lg font-bold text-zinc-200 mt-1">
                    {activeUserDetail.reviewsCount}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
                  <p className="text-[10px] text-zinc-500 uppercase font-medium">
                    Custom Lists
                  </p>
                  <p className="text-lg font-bold text-zinc-200 mt-1">
                    {activeUserDetail.listsCount}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-zinc-300">
                  Account Control
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Account Status</span>
                  <button
                    onClick={() => handleStatusToggle(activeUserDetail.id)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-200 transition font-medium"
                  >
                    Toggle Status ({activeUserDetail.status})
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
              <button
                onClick={() => handleDeleteUser(activeUserDetail.id)}
                className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded-lg text-xs font-semibold transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      // Overview & Users Tab States
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeUserDetail, setActiveUserDetail] = useState(null);

  // Content Tab States
  const [contentSearch, setContentSearch] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("ALL");
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Movie");
  const [newGenre, setNewGenre] = useState("");
  const [newYear, setNewYear] = useState("");

  // System Logs Tab States
  const [logSearch, setLogSearch] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState("ALL");
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  // Sample statistics data

  // Sample users data table
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

  // Sample Content Catalog Data (Movies and TV Shows)
  const [contentData, setContentData] = useState([
    {
      id: 1,
      title: "Inception",
      type: "Movie",
      genre: "Sci-Fi",
      year: 2010,
      rating: 4.8,
      addedBy: "User0",
    },
    {
      id: 2,
      title: "Breaking Bad",
      type: "TV Show",
      genre: "Crime / Drama",
      year: 2008,
      rating: 4.9,
      addedBy: "Marko Petrović",
    },
    {
      id: 3,
      title: "Interstellar",
      type: "Movie",
      genre: "Sci-Fi",
      year: 2014,
      rating: 4.9,
      addedBy: "User0",
    },
    {
      id: 4,
      title: "Stranger Things",
      type: "TV Show",
      genre: "Sci-Fi / Horror",
      year: 2016,
      rating: 4.7,
      addedBy: "Ana Jovanović",
    },
    {
      id: 5,
      title: "Dune: Part Two",
      type: "Movie",
      genre: "Action",
      year: 2024,
      rating: 4.9,
      addedBy: "User0",
    },
  ]);

  // Sample System Logs Data
  const [logsData, setLogsData] = useState([
    {
      id: "LOG-9021",
      timestamp: "Oct 29, 2026 10:02:14",
      level: "INFO",
      actor: "User0",
      action: "Updated user role for marko@example.com to MODERATOR",
      ip: "192.168.1.45",
      method: "POST /api/admin/roles",
      details: "Request executed with HTTP 200. Role elevated successfully.",
    },
    {
      id: "LOG-9020",
      timestamp: "Oct 29, 2026 09:45:30",
      level: "SECURITY",
      actor: "185.220.101.4",
      action: "Failed login attempt (3 consecutive failures)",
      ip: "185.220.101.4",
      method: "POST /api/auth/signin",
      details: "Rate limit triggered. IP blocked for 15 minutes.",
    },
    {
      id: "LOG-9019",
      timestamp: "Oct 29, 2026 09:12:05",
      level: "INFO",
      actor: "System",
      action: "Automated database backup completed successfully",
      ip: "127.0.0.1",
      method: "CRON /jobs/backup",
      details: "Database size: 1.2GB. Snapshot uploaded to cloud storage.",
    },
    {
      id: "LOG-9018",
      timestamp: "Oct 29, 2026 08:30:11",
      level: "WARNING",
      actor: "Ana Jovanović",
      action: "High API query frequency threshold warning",
      ip: "79.101.24.12",
      method: "GET /api/catalog/search",
      details: "Client issued 120 requests/min. Standard quota is 100/min.",
    },
    {
      id: "LOG-9017",
      timestamp: "Oct 29, 2026 07:15:44",
      level: "ERROR",
      actor: "System",
      action: "TMDB API Integration Timeout",
      ip: "127.0.0.1",
      method: "FETCH /api/external/tmdb",
      details: "HTTP 504 Gateway Timeout when synchronizing movie metadata.",
    },
  ]);

  // Sample recent activity logs for Overview tab

  // Filters
  const filteredUsers = usersData.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredContent = contentData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
      item.genre.toLowerCase().includes(contentSearch.toLowerCase());
    const matchesType =
      contentTypeFilter === "ALL" || item.type === contentTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredLogs = logsData.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ip.includes(logSearch) ||
      log.id.toLowerCase().includes(logSearch.toLowerCase());
    const matchesLevel =
      logLevelFilter === "ALL" || log.level === logLevelFilter;
    return matchesSearch && matchesLevel;
  });

  // Action Handlers
  const handleAddContent = (e) => {
    e.preventDefault();
    if (!newTitle || !newGenre || !newYear) return;

    const newItem = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      genre: newGenre,
      year: parseInt(newYear) || 2026,
      rating: 5.0,
      addedBy: "User0",
    };

    setContentData([newItem, ...contentData]);
    setNewTitle("");
    setNewGenre("");
    setNewYear("");
    setIsAddContentModalOpen(false);
  };

  const handleDeleteContent = (id) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      setContentData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const handleStatusToggle = (id) => {
    setUsersData((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "Active" ? "Suspended" : "Active";
          const updatedUser = { ...u, status: newStatus };
          if (activeUserDetail?.id === id) setActiveUserDetail(updatedUser);
          return updatedUser;
        }
        return u;
      }),
    );
  };

  activeUserDetail

  const handleRoleChange = (id, newRole) => {
    setUsersData((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updatedUser = { ...u, role: newRole };
          if (activeUserDetail?.id === id) setActiveUserDetail(updatedUser);
          return updatedUser;
        }
        return u;
      }),
    );
  };

  const handleDeleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsersData((prev) => prev.filter((u) => u.id !== id));
      setSelectedUsers((prev) => prev.filter((userId) => userId !== id));
      if (activeUserDetail?.id === id) setActiveUserDetail(null);
    }
  };

      */

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold">
            A
          </div>
          <div>
            <h1 className="text-base font-semibold leading-none">
              Admin Dashboard
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              System and User Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition">
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300 text-xs">System Stable</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800 gap-6">
          {["overview", "users", "content", "logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "users" && "Users"}
              {tab === "content" && "Content"}
              {tab === "logs" && "System Logs"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <AdminOverviewTab />}

        {activeTab === "users" && <AdminUserTab />}

        {activeTab === "content" && <AdminContentTab />}

        {activeTab === "logs" && <AdminLogsTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
