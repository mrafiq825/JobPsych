import React from "react";
import useToast from "@/hooks/useToast";
import useSEO from "@hooks/useSEO";

const InterviewPrepAI = () => {
  const { showSuccess } = useToast();

  useSEO({
    title: "AI Mock Interview Practice & Coaching | JobPsych",
    description:
      "Practice job interviews with AI that gives real-time feedback. Simulate behavioral and technical rounds, refine your answers, and build interview confidence with JobPsych's AI interview coach.",
    keywords:
      "AI interview practice, mock interview AI, interview coaching online, AI interview simulator, behavioral interview practice, technical interview practice, interview confidence building, interview preparation AI, job interview simulator, interview feedback AI",
    canonical: "/interview-prep",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://jobpsych.vercel.app/interview-prep",
      url: "https://jobpsych.vercel.app/interview-prep",
      name: "AI Mock Interview Practice & Coaching | JobPsych",
      isPartOf: { "@id": "https://jobpsych.vercel.app/#website" },
      description:
        "AI-powered interview practice platform with scenario simulation, live feedback, and response refinement. Practice behavioral and technical interviews with instant AI coaching.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://jobpsych.vercel.app/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "AI Interview Practice",
            item: "https://jobpsych.vercel.app/interview-prep",
          },
        ],
      },
    },
  });

  const interviewHighlights = [
    {
      title: "Scenario Simulation",
      description:
        "Practice in realistic interview formats with adaptive question depth.",
      color: "bg-card-clay",
    },
    {
      title: "Live Feedback Loop",
      description:
        "Get instant guidance on clarity, structure, and confidence signals.",
      color: "bg-card-sand",
    },
    {
      title: "Response Refinement",
      description:
        "Convert rough answers into precise, high-impact interview narratives.",
      color: "bg-card-linen",
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
    <div className="relative min-h-screen overflow-hidden page-force-light bg-card-ivory">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-card-sand/50 blur-3xl" />
        <div className="absolute right-[-8rem] top-20 h-[28rem] w-[28rem] rounded-full bg-card-linen/70 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-card-clay/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <header className="mb-6 rounded-2xl border border-border-subtle bg-card-primary p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => (window.location.href = "/")}
              className="group inline-flex w-fit items-center gap-2 btn btn-light rounded-full px-4 py-2 text-sm font-semibold text-h2 transition-all duration-300 hover:border-border-mid"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-h2 transition-transform duration-300 group-hover:-translate-x-1"
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
              <p className="text-caption uppercase tracking-[0.3em] text-h4">
                Precision Interview Lab
              </p>
              <h1 className="mt-1 text-2xl font-black leading-tight text-h1 sm:text-3xl">
                AI-Assisted Interview Practice
              </h1>
            </div>

            <div className="rounded-xl border border-border-subtle bg-card-sand px-4 py-2 text-xs text-h4">
              Train for real interview pressure
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-6 shadow-sm sm:p-8 lg:col-span-8 lg:p-10">
            <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full border border-border-subtle" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-56 w-56 rounded-full border border-border-subtle" />

            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-h4">
                AI-Guided Rehearsal
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight text-h1 sm:text-4xl lg:text-5xl">
                Rehearse smarter,
                <span className="block text-h2">answer with authority.</span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
                Launch guided interview practice to sharpen your stories,
                improve structure, and deliver confident responses across
                behavioral and technical rounds.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleStartInterview}
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl btn btn-primary px-6 py-3.5 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
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

                <p className="text-sm text-secondary">
                  Opens in a new tab with complete interview practice tools.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {interviewHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border-subtle bg-card-ivory p-4"
                >
                  <div className={`h-1 w-14 rounded-full ${item.color}`} />
                  <h3 className="mt-3 text-sm font-extrabold text-h2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-body">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="flex flex-col gap-5 lg:col-span-4">
            <div className="rounded-3xl border border-border-subtle bg-card-primary p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-h2">
                Quick Readiness Pulse
              </h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-border-subtle bg-card-sand px-4 py-3">
                  <p className="text-xs text-body">Answer Clarity</p>
                  <p className="mt-1 text-2xl font-black text-h1">94%</p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-card-linen px-4 py-3">
                  <p className="text-xs text-body">Confidence Signal</p>
                  <p className="mt-1 text-2xl font-black text-h1">A</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border-subtle bg-card-primary p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-h2">
                Response Checklist
              </h3>
              <ul className="mt-4 space-y-2">
                {prepChecklist.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 rounded-xl border border-border-subtle bg-card-sand px-3 py-2.5"
                  >
                    <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-card-clay" />
                    <span className="text-sm leading-relaxed text-body">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border-subtle bg-card-sand p-5 shadow-sm sm:p-6">
              <p className="text-base font-bold text-h1">
                Ready to perform under pressure?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-body">
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
