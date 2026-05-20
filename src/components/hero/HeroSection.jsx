import React, { useState, useEffect } from "react";
import {
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

const HeroSection = ({ resumeData }) => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden page-force-light"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "rgba(244, 219, 177, 0.24)" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            backgroundColor: "rgba(222, 201, 169, 0.22)",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-60 h-60 rounded-full blur-3xl animate-pulse"
          style={{
            backgroundColor: "rgba(233, 220, 201, 0.28)",
            animationDelay: "2s",
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-8 sm:pt-24 sm:pb-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border-subtle bg-card-sand text-h4 text-xs font-semibold tracking-[0.28em] uppercase text-opacity-90 transition-colors duration-300 hover:border-border-mid hover:bg-card-ivory">
            <SparklesIcon
              className="h-4 w-4 text-h2 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span>Career Readiness & Interview Success</span>
            <SparklesIcon
              className="h-4 w-4 text-h2 animate-spin"
              style={{ animationDuration: "3s", animationDirection: "reverse" }}
            />
          </div>

          <h1 className="relative mb-8 text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-tight text-h1">
            <div className="relative inline-block">
              <span className="text-h2">AI-Based</span>
            </div>
            <div className="mt-4 text-left">
              <span className="block text-4xl sm:text-5xl md:text-6xl font-black">
                Career Readiness and Interview Preparation
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl font-black text-h1">
                System
              </span>
              <div className="mt-4 h-1 w-24 rounded-full opacity-90 bg-card-clay"></div>
            </div>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-body max-w-3xl mx-auto leading-relaxed tracking-wide">
            Our comprehensive AI system helps you discover better roles, elevate
            your documents, and build the confidence to own every interview.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Career Path Exploration Module",
                description:
                  "Prepare for your career transition with AI-guided role discovery that matches your skills and aspirations",
                accentStyle: { backgroundColor: "rgba(209, 189, 152, 0.18)" },
                index: 0,
              },
              {
                title:
                  "Professional Document Structure and Content Analysis Module",
                description:
                  "Ensure interview readiness with resume optimization that identifies gaps and enhances content for maximum impact",
                accentStyle: { backgroundColor: "rgba(196, 186, 164, 0.16)" },
                index: 1,
              },
              {
                title: "AI-Assisted Interview Practice Module",
                description:
                  "Build complete interview readiness through AI-powered practice, intelligent feedback, and confidence-building preparation",
                accentStyle: { backgroundColor: "rgba(221, 206, 229, 0.18)" },
                index: 2,
              },
            ].map((card) => {
              return (
                <div
                  key={card.title}
                  className={`group relative overflow-hidden rounded-[2rem] section-surface p-8 transition-all duration-300 ${
                    activeCard === card.index
                      ? "section-surface-strong scale-[1.03] shadow-2xl"
                      : "hover:border-border-mid hover:shadow-xl"
                  }`}
                  onMouseEnter={() => setActiveCard(card.index)}
                >
                  <div
                    className="relative z-10 mb-4 inline-flex items-center gap-3 rounded-full px-4 py-2 text-h4 font-semibold transition-all duration-300"
                    style={card.accentStyle}
                  >
                    <span className="text-xs uppercase tracking-[0.24em] text-h2">
                      {card.index === 0
                        ? "Explore"
                        : card.index === 1
                          ? "Review"
                          : "Practice"}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-3 text-h1 group-hover:text-h2 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-body group-hover:text-h4 transition-colors duration-300">
                      {card.description}
                    </p>
                  </div>
                  <div
                    className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 rounded-full blur-3xl -z-10 transition-opacity duration-300"
                    style={card.accentStyle}
                  ></div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            {[
              {
                label: "Discover Your Ideal Roles",
                href: "/role-suggestions",
                icon: RocketLaunchIcon,
              },
              {
                label: "Improve Document Clarity",
                href: "/ats-analyzer",
                icon: DocumentCheckIcon,
              },
              {
                label: "Ace Your Interview",
                href: "/interview-prep",
                icon: SparklesIcon,
              },
            ].map((btn) => {
              const BtnIcon = btn.icon;
              return (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => (window.location.href = btn.href)}
                  className="group btn btn-accent btn-hero rounded-[1.5rem] font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <BtnIcon className="h-5 w-5 text-h2 transition-transform duration-300 group-hover:scale-110" />
                    <span>{btn.label}</span>
                    <ArrowRightIcon className="h-4 w-4 text-h2 transition-transform duration-300 ml-1 group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>

          {resumeData?.roleRecommendations?.length > 0 && (
            <div className="mt-24 space-y-8">
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-h1 mb-4 text-center">
                  <span className="text-h2">Roles You're Ready For</span>
                  <br />
                  Career Opportunities Matched to Your Profile
                </h2>
                <p className="text-center text-body mt-4 text-lg max-w-2xl mx-auto">
                  AI-analyzed career paths aligned with your skills, experience,
                  and readiness level
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resumeData.roleRecommendations
                  .slice(0, 3)
                  .map((role, index) => (
                    <div
                      key={index}
                      className="group relative p-8 bg-card-primary rounded-[1.75rem] border border-border-subtle hover:border-border-mid hover:shadow-xl hover:scale-[1.02] overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute top-4 right-4">
                        <div
                          className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${
                            role.matchPercentage >= 80
                              ? "bg-card-dark text-btn-dark-text"
                              : role.matchPercentage >= 60
                                ? "bg-card-clay text-h1"
                                : "bg-card-sand text-h1"
                          }`}
                        >
                          <span>{role.matchPercentage}</span>
                          <span className="text-xs absolute bottom-0 right-0 translate-x-1 translate-y-1">
                            %
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold text-h1 mb-3 pr-20 group-hover:text-h2 transition-colors duration-300">
                          {role.roleName}
                        </h3>
                        <p className="text-body text-sm leading-relaxed group-hover:text-h4 mb-5 transition-colors duration-300">
                          {role.reasoning}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-6">
                          <span className="px-3 py-1 bg-card-sand text-h2 rounded-full text-xs font-medium border border-border-subtle group-hover:border-border-mid transition-colors duration-300">
                            {role.careerLevel}
                          </span>
                          <span className="px-3 py-1 bg-card-sand text-h2 rounded-full text-xs font-medium border border-border-subtle group-hover:border-border-mid transition-colors duration-300">
                            {role.industryFit} Fit
                          </span>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl -z-10 transition-opacity duration-300"
                        style={{ backgroundColor: "rgba(255, 235, 179, 0.14)" }}
                      ></div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
