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
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-card-ivory page-force-light">
      {/* Animated background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ backgroundColor: "var(--card-sand)" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-18 animate-blob animation-delay-2000"
          style={{ backgroundColor: "var(--card-linen)" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-16 animate-blob animation-delay-4000"
          style={{ backgroundColor: "var(--card-clay)" }}
        ></div>
      </div>

      {/* Main loader container */}
      <div className="relative z-10 text-center rounded-[2rem] border border-border-subtle bg-card-primary p-8 shadow-xl shadow-black/5 max-w-md">
        {/* Animated concentric circles */}
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "var(--card-dark)",
              borderRightColor: "var(--card-sand)",
            }}
          ></div>

          {/* Middle rotating ring - slower */}
          <div
            className="absolute inset-8 rounded-full border-2 border-transparent animate-spin animation-reverse-slow"
            style={{
              borderBottomColor: "var(--card-linen)",
              borderLeftColor: "var(--card-clay)",
            }}
          ></div>

          {/* Inner pulsing circle */}
          <div
            className="absolute inset-16 rounded-full opacity-30 animate-pulse"
            style={{ backgroundColor: "var(--card-sand)" }}
          ></div>

          {/* Center glowing orb */}
          <div
            className="relative w-12 h-12 rounded-full animate-pulse"
            style={{
              backgroundColor: "var(--card-clay)",
              boxShadow: "0 0 24px rgba(200, 191, 170, 0.35)",
            }}
          ></div>
        </div>

        {/* Animated loading text */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-h2 animate-pulse">
            Preparing Your Experience
          </h3>
          <p className="text-secondary font-medium text-sm tracking-[0.35em] uppercase">
            LOADING<span className="inline-block w-12">{dotString}</span>
          </p>
        </div>

        {/* Animated progress indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: "var(--card-clay)",
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
