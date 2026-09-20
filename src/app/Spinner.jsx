import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-500 border-opacity-50"></div>
    </div>
  );
};

export default Spinner;
