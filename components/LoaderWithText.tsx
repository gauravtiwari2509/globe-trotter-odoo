import React from "react";
import { Loader2 } from "lucide-react";

const LoaderWithText = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen text-orange-500 ">
      <Loader2 className="h-10 w-10 animate-spin mr-3" />
      <p className="text-lg font-tektur">{text}</p>
    </div>
  );
};

export default LoaderWithText;
