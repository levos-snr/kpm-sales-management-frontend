import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-[#4680ff]" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#4680ff] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-[#4680ff] animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;


