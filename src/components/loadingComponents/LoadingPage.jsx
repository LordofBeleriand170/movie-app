import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-red-500 border-opacity-50"></div>
    </div>
  );
};

export default LoadingPage;
