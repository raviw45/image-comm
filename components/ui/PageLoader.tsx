import React from "react";

const PageLoader = () => {
  return (
    <div className="w-32 h-32 relative flex items-center justify-center">
      <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl animate-pulse"></div>

      <div className="w-full h-full relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d64e9d] via-blue-500 to-purple-500 animate-spin blur-sm"></div>

        <div className="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
          <div className="flex gap-1 items-center">
            <div className="w-1.5 h-12 bg-[#d64e9d] rounded-full animate-[bounce_1s_ease-in-out_infinite]"></div>
            <div className="w-1.5 h-12 bg-white rounded-full animate-[bounce_1s_ease-in-out_infinite_0.1s]"></div>
            <div className="w-1.5 h-12 bg-[#d64e9d] rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]"></div>
            <div className="w-1.5 h-12 bg-white rounded-full animate-[bounce_1s_ease-in-out_infinite_0.3s]"></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
