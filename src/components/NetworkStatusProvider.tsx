"use client";

import React, { useEffect } from "react";
import useNetwork from "@/hooks/useNetwork";

const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const isOnline = useNetwork();

  useEffect(() => {
    if (!isOnline) {
      console.log("Offline now");
    } else {
      console.log("Online now");
    }
  }, [isOnline]);

  return (
    <div className={`bg-blue-100 text-gray-800 dark:text-white`}>
      <main>{children}</main>
    </div>
  );
};

export default NetworkStatusProvider;
