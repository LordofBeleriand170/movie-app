import Navbar from "@/components/Navbar";
import NotificationsComponent from "@/components/NotificationsComponent";
import React from "react";

const NotificationsPage = () => {
  return (
    <div className="flex flex-col gap-5 h-full bg-black">
      <Navbar />
      <NotificationsComponent />
    </div>
  );
};

export default NotificationsPage;
