import React from "react";

const LoadingSpinner = () => {
  return (
    <div className={`flex h-[100dvh] w-screen items-center justify-center bg-neutral-800`}>
      <span className={`w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60 text-white`}></span>
    </div>
  );
};

export default LoadingSpinner;
