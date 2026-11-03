"use client";

import LoadingAdminTab from "@/components/loadingComponents/LoadingAdminTab";
import { formatDate } from "@/app/utils/formatDate";
import { useAdminStore } from "@/features/admin/adminStore";
import {
  CheckCircle2,
  Download,
  Eye,
  Filter,
  Mail,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminUserTab = () => {
  const { users, fetchUsers, loading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeUserDetail, setActiveUserDetail] = useState(null);
  const router = useRouter();
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

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

  useEffect(() => {
    async function fetchUsersFunction() {
      try {
        await fetchUsers();
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }

    fetchUsersFunction();
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <LoadingAdminTab />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                User Management Dashboard
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Full control over user accounts, roles, statuses, and
                permissions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Total Registered
              </p>
              <p className="text-2xl font-bold mt-1">{users.length}</p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Active Users
              </p>
              <p className="text-2xl font-bold mt-1 text-emerald-400">
                {users.filter((u) => u.status === "Active").length}
              </p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Suspended
              </p>
              <p className="text-2xl font-bold mt-1 text-amber-500">
                {users.filter((u) => u.status === "Suspended").length}
              </p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Admins / Mods
              </p>
              <p className="text-2xl font-bold mt-1 text-red-400">
                {
                  users.filter(
                    (u) => u.role === "ADMIN" || u.role === "MODERATOR",
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50 cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="USER">USER</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="bg-red-950/30 border border-red-500/30 px-4 py-2.5 rounded-lg flex items-center justify-between text-xs">
              <span className="text-zinc-300">
                Selected{" "}
                <strong className="text-red-400">{selectedUsers.length}</strong>{" "}
                user(s)
              </span>
              <button
                onClick={() => {
                  setUsersData((prev) =>
                    prev.filter((u) => !selectedUsers.includes(u.id)),
                  );
                  setSelectedUsers([]);
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          )}

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="accent-red-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3">Join Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="accent-red-600 rounded cursor-pointer"
                        />
                      </td>

                      <td className="p-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-red-500 text-xs shadow-inner">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-200 group-hover:text-red-400 transition-colors">
                            {user.name}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            {user.email}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className={`text-xs font-semibold px-2 py-1 rounded border bg-zinc-950 focus:outline-none cursor-pointer transition ${
                            user.role === "ADMIN"
                              ? "text-red-400 border-red-500/40 bg-red-500/10"
                              : user.role === "MODERATOR"
                                ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                                : "text-zinc-400 border-zinc-700 bg-zinc-900"
                          }`}
                        >
                          <option value="USER">USER</option>
                          <option value="MODERATOR">MODERATOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => handleStatusToggle(user.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                          }`}
                        >
                          {user.status === "ACTIVE" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {user.status}
                        </button>
                      </td>

                      <td className="p-3 text-xs text-zinc-400">
                        {user.lastActive}
                      </td>
                      <td className="p-3 text-xs text-zinc-400">
                        {formatDate(user?.createdAt)}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setActiveUserDetail(user);
                              router.push(`/user/${user?.email}`);
                            }}
                            title="View Details"
                            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserTab;
