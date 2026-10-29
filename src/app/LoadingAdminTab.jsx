import { Loader2 } from "lucide-react";
import React from "react";

const LoadingAdminTab = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-3">
      <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
      <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
        Loading...
      </p>
    </div>
  );
};

export default LoadingAdminTab;
