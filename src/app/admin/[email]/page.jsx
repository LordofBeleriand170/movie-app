"use client";

import AdminDashboard from "@/components/admin/AdminDashboard";
import Navbar from "@/components/Navbar";
import { useLogsStore } from "@/features/logs/logsStore";
import React, { useEffect } from "react";

const AdminDashboardPage = () => {
  const fetchLogs = useLogsStore((state) => state.fetchLogs);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <>
      <Navbar />
      <AdminDashboard />
    </>
  );
};

export default AdminDashboardPage;
