import React from "react";
import useToast from "@/hooks/useToast";

const InterviewPrepAI = () => {
  const { showSuccess } = useToast();

  const interviewHighlights = [
    {
      title: "Scenario Simulation",
      description:
        "Practice in realistic interview formats with adaptive question depth.",
      tone: "from-cyan-400 to-emerald-400",
    },
    {
      title: "Live Feedback Loop",
      description:
        "Get instant guidance on clarity, structure, and confidence signals.",
      tone: "from-emerald-400 to-lime-400",
    },
    {
      title: "Response Refinement",
      description:
        "Convert rough answers into precise, high-impact interview narratives.",
      tone: "from-teal-400 to-cyan-400",
    },
  ];

  const prepChecklist = [
    "Frame answers using outcomes and measurable impact",
    "Use concise stories with clear beginning and resolution",
    "Balance technical detail with business context",
    "Close responses with confidence and ownership",
  ];

  const handleStartInterview = () => {
    showSuccess("Redirecting to AI Interview in a new tab...");
    setTimeout(() => {
      window.open(
        "https://ai-mock-interview-preparation-seven.vercel.app",
        "_blank",
      );
    }, 1000);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100"
      style={{
        pointerEvents: "auto",
        fontFamily: "Space Grotesk, Manrope, system-ui, sans-serif",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-20 h-[28rem] w-[28rem] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(34,211,238,0.14),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#020617_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <header className="mb-6 rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => (window.location.href = "/")}
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-600 bg-slate-800/90 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-300 hover:bg-slate-700 cursor-pointer"
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
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cyan-300/80">
                Precision Interview Lab
              </p>
              <h1 className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">
                AI-Assisted Interview Practice
              </h1>
            </div>

            <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-100">
              Train for real interview pressure
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <section className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-8 lg:p-10">
            <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full border border-cyan-300/20" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-56 w-56 rounded-full border border-emerald-300/20" />

            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                AI-Guided Rehearsal
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Rehearse smarter,
                <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                  answer with authority.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Launch guided interview practice to sharpen your stories,
                improve structure, and deliver confident responses across
                behavioral and technical rounds.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleStartInterview}
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-2xl shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/25 cursor-pointer"
                  style={{
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-lime-500 via-emerald-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative">Start AI Interview</span>
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
                  Opens in a new tab with complete interview practice tools.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {interviewHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4"
                >
                  <div
                    className={`h-1 w-14 rounded-full bg-gradient-to-r ${item.tone}`}
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
            <div className="rounded-3xl border border-slate-700/80 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">
                Quick Readiness Pulse
              </h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-3">
                  <p className="text-xs text-cyan-100">Answer Clarity</p>
                  <p className="mt-1 text-2xl font-black text-white">94%</p>
                </div>
                <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3">
                  <p className="text-xs text-emerald-100">Confidence Signal</p>
                  <p className="mt-1 text-2xl font-black text-white">A</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/80 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">
                Response Checklist
              </h3>
              <ul className="mt-4 space-y-2">
                {prepChecklist.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2.5"
                  >
                    <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" />
                    <span className="text-sm leading-relaxed text-slate-200">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-lime-400/25 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-slate-900/70 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <p className="text-base font-bold text-white">
                Ready to perform under pressure?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Practice now and step into interviews with sharper stories,
                cleaner structure, and stronger delivery.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default InterviewPrepAI;
