import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className=" flex items-center justify-center min-h-screen z-50 absolute inset-0 bg-opacity-50 backdrop-blur-xs">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
    </div>
  );
};

export default Loader;
