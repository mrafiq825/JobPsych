import React, { useState, useEffect } from "react";
import "./PageLoader.css";

const PageLoader = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dotString = ".".repeat(dots);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative page-force-light">
      {/* Animated background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main loader container */}
      <div className="relative z-10 text-center">
        {/* Animated concentric circles */}
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-r-cyan-400 animate-spin"></div>

          {/* Middle rotating ring - slower */}
          <div className="absolute inset-8 rounded-full border-2 border-transparent border-b-purple-400 border-l-indigo-300 animate-spin animation-reverse-slow"></div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 animate-pulse"></div>

          {/* Center glowing orb */}
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-lg shadow-indigo-500/50 animate-pulse"></div>
        </div>

        {/* Animated loading text */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 animate-pulse">
            Preparing Your Experience
          </h3>
          <p className="text-gray-400 font-medium text-sm tracking-widest">
            LOADING<span className="inline-block w-12">{dotString}</span>
          </p>
        </div>

        {/* Animated progress indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
