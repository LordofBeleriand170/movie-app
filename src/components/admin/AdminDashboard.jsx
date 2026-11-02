import React, { useState } from "react";
import AdminOverviewTab from "./AdminOverviewTab";
import AdminUserTab from "./AdminUserTab";
import AdminLogsTab from "./AdminLogsTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      <main className="flex-1 px-8 py-6 w-[90%] mx-auto space-y-6">
        <div className="flex border-b border-zinc-800 gap-6">
          {["overview", "users", "logs"].map((tab) => (
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
              {tab === "logs" && "System Logs"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <AdminOverviewTab />}

        {activeTab === "users" && <AdminUserTab />}

        {activeTab === "logs" && <AdminLogsTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
