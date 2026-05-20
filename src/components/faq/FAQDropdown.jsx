import React, { useState } from "react";

const FAQDropdown = ({ question, answer, type = "general" }) => {
  const [open, setOpen] = useState(false);

  const getTypeStyles = () => {
    switch (type) {
      case "career":
        return {
          label: "Career Path Exploration",
          badgeClasses:
            "bg-card-clay text-btn-dark-text border border-border-subtle",
        };
      case "document":
        return {
          label: "Professional Document Analysis",
          badgeClasses: "bg-card-sand text-h4 border border-border-subtle",
        };
      case "interview":
        return {
          label: "Interview Practice",
          badgeClasses: "bg-card-ivory text-h4 border border-border-subtle",
        };
      default:
        return {
          label: "General",
          badgeClasses: "bg-card-primary text-h4 border border-border-subtle",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="rounded-3xl card transition-all duration-300 hover:shadow-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-5 rounded-t-3xl focus:outline-none transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: open ? "var(--card-ivory)" : "var(--card-primary)",
          color: "var(--text-color)",
        }}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div className="flex items-center space-x-3 flex-1">
          <span className="text-lg font-semibold text-left leading-tight text-h2">
            {question}
          </span>
        </div>
        <div className="flex items-center space-x-3 ml-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.badgeClasses}`}
          >
            {styles.label}
          </span>
          <svg
            className={`h-6 w-6 ml-2 transform transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            style={{ color: "var(--caption)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        {open && (
          <div
            className="px-6 pb-6 leading-relaxed rounded-b-3xl border-t"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "var(--card-linen)",
              color: "var(--text-color)",
            }}
          >
            <div className="pt-4 space-y-4">
              {type === "interview" && (
                <div className="flex items-center gap-2 text-sm font-medium text-h4">
                  <span className="w-2 h-2 rounded-full bg-card-clay" />
                  <span>Interview Practice Feature</span>
                </div>
              )}
              <div className="prose prose-sm max-w-none text-body">
                {answer}
              </div>
              <div className="mt-4 rounded-2xl border border-border-subtle bg-card-primary p-4 text-sm text-body">
                <p className="font-semibold mb-1">Pro Tip:</p>
                {type === "career" && (
                  <p>
                    Use Career Path Exploration to discover AI-guided role
                    recommendations that match your skills, goals, and the next
                    step in your career journey.
                  </p>
                )}
                {type === "document" && (
                  <p>
                    Use Professional Document Analysis to refine your resume and
                    cover letter with expert guidance for stronger interview
                    readiness.
                  </p>
                )}
                {type === "interview" && (
                  <p>
                    Use AI-Assisted Interview Practice to simulate real
                    conversations, get feedback, and build confidence for every
                    stage of your career preparation.
                  </p>
                )}
                {type === "general" && (
                  <p>
                    Our AI-Based system combines role discovery, document
                    optimization, and interview practice to keep you ready for
                    every step of your career journey.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQDropdown;
