import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden page-force-light bg-card-ivory">
      <div className="absolute inset-0 opacity-30 bg-card-ivory"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "rgba(214, 210, 196, 0.25)" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            backgroundColor: "rgba(245, 242, 234, 0.24)",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(200, 191, 170, 0.22)",
            animationDelay: "0.5s",
          }}
        ></div>
      </div>
      <div className="relative z-10 text-center px-6 py-12 max-w-4xl mx-auto">
        <div className="backdrop-blur-2xl rounded-3xl border border-border-subtle shadow-sm p-8 sm:p-12 bg-card-primary">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="relative bg-card-clay px-8 py-6 rounded-2xl shadow-sm border border-border-subtle">
                <div className="relative bg-card-dark px-8 py-6 rounded-2xl shadow-sm border border-border-subtle">
                  <p className="text-6xl sm:text-8xl font-black text-btn-light-text tracking-tight">
                    404
                  </p>
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-h2">
              <div className="block mb-2">Oops! Page Not Found</div>
            </h1>
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-lg sm:text-xl text-body leading-relaxed mb-4">
                The page you are looking for seems to have vanished into the
                digital void. Do not worry though - our AI-powered platform has
                plenty of amazing features waiting for you!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                to="/"
                className="relative overflow-hidden bg-card-dark px-8 py-4 font-bold rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-border-subtle inline-flex items-center gap-3"
                style={{ color: "var(--btn-light-text)" }}
              >
                <span className="font-black tracking-wide">Go to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
