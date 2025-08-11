import React from "react";
import { Loader2 } from "lucide-react";

const LoaderWithText = ({ text }: { text: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex items-center text-orange-500">
        <Loader2 className="h-10 w-10 animate-spin mr-3" />
        <p className="text-lg font-tektur">{text}</p>
      </div>
    </div>
  );
};

export default LoaderWithText;
