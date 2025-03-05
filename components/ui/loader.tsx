import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin ease-linear rounded-full w-12 h-12 border-t-4 border-b-4 border-indigo-500 ml-3"></div>
    </div>
  );
};

export default Loader;
