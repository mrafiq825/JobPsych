import React from "react";
import useToast from "@/hooks/useToast";

const DocumentQualityAnalyzer = () => {
  const { showSuccess } = useToast();

  const analyzerHighlights = [
    {
      title: "Signal Strength Scoring",
      description:
        "Measure clarity, relevance, and decision impact with weighted scoring.",
      tone: "from-cyan-400 to-emerald-400",
    },
    {
      title: "Gap Detection",
      description:
        "Pinpoint weak or missing sections before your document reaches reviewers.",
      tone: "from-emerald-400 to-lime-400",
    },
    {
      title: "Rewrite Direction",
      description:
        "Get tactical recommendations to improve narrative flow and readability.",
      tone: "from-teal-400 to-cyan-400",
    },
  ];

  const qualityChecklist = [
    "Prioritize outcomes over responsibilities",
    "Use concise, action-forward sentences",
    "Keep structure scannable and consistent",
    "Remove visual clutter and decorative elements",
  ];

  const handleStartAnalysis = () => {
    showSuccess("Redirecting to Document Analysis platform...");
    setTimeout(() => {
      window.open("https://ats-cracker.vercel.app/", "_blank");
    }, 1000);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden page-force-light"
      style={{
        pointerEvents: "auto",
        fontFamily: "Space Grotesk, Manrope, system-ui, sans-serif",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-20 h-[28rem] w-[28rem] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <header className="mb-6 rounded-2xl border border-slate-700/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => (window.location.href = "/")}
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-300 cursor-pointer"
              style={{
                pointerEvents: "auto",
                position: "relative",
                zIndex: 10,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </button>

            <div className="text-left lg:text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.3em]">
                Precision Writing Lab
              </p>
              <h1 className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">
                Document Quality Analyzer
              </h1>
            </div>

            <div className="rounded-xl border border-cyan-400/30  px-4 py-2 text-xs ">
              Optimize for real review behavior
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <section className="relative overflow-hidden rounded-3xl border border-slate-700/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-8 lg:p-10">
            <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full border border-cyan-300/20" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-56 w-56 rounded-full border border-emerald-300/20" />

            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30  px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                AI-Guided Optimization
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Turn good documents
                <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                  into interview magnets.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Launch the analysis engine to audit structure, tighten language,
                and elevate impact in one guided flow tailored for high-stakes
                applications.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleStartAnalysis}
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-2xl shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/25 cursor-pointer"
                  style={{
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative">Start Document Analysis</span>
                  <svg
                    className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>

                <p className="text-sm text-slate-400">
                  Opens in a new tab with full optimization toolkit.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {analyzerHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-700/70 p-4"
                >
                  <div
                    className={`h-1 w-14 rounded-full bg-gradie ${item.tone}`}
                  />
                  <h3 className="mt-3 text-sm font-extrabold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="flex flex-col gap-5 lg:col-span-4">
            <div className="rounded-3xl border border-slate-700/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em]">
                Quick Readiness Pulse
              </h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-3">
                  <p className="text-xs">Clarity Benchmark</p>
                  <p className="mt-1 text-2xl font-black text-white">97%</p>
                </div>
                <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3">
                  <p className="text-xs">Impact Presence</p>
                  <p className="mt-1 text-2xl font-black text-white">A+</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em]">
                Editing Checklist
              </h3>
              <ul className="mt-4 space-y-2">
                {qualityChecklist.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 rounded-xl border border-slate-700/70 px-3 py-2.5"
                  >
                    <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                    <span className="text-sm leading-relaxed text-slate-200">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-lime-400/25 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15  p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <p className="text-base font-bold text-white">
                Ready for final polish?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Analyze now and get practical suggestions that improve recruiter
                readability in minutes.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default DocumentQualityAnalyzer;
