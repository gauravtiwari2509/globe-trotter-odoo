import { AlertCircle } from "lucide-react";

export const ErrorMessage = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="flex items-start gap-3">
      <AlertCircle className="text-red-500 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="text-red-600 font-medium">Error</p>
        <p className="text-red-800 text-sm mt-1">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-red-600 hover:text-red-800 font-medium text-sm underline"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);
