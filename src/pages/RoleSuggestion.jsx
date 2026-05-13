import React, { useState, useEffect, useContext } from "react";
import { formatErrorMessage, getErrorCategory } from "@utils/errorHandler";
import { generalTips } from "@data/candidateTips";
import ResumeUpload from "@components/resume/ResumeUpload";
import NetworkError from "@components/error/NetworkError";
import LoadingError from "@components/error/LoadingError";
import { ToastContext } from "@components/toast/ToastContext";
import { ROLE_SUGGESTION } from "../utils/api";

const RoleSuggestion = () => {
  const [resumeData, setResumeData] = useState(null);
  const [roleRecommendations, setRoleRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState({
    show: false,
    message: "",
    type: "error",
    category: null,
    originalError: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const { showWarning, showInfo } = useContext(ToastContext);

  // Load persisted data on component mount
  useEffect(() => {
    const persistedData = localStorage.getItem("roleSuggestionData");
    if (persistedData) {
      try {
        const {
          resumeData: savedResumeData,
          roleRecommendations: savedRecommendations,
          targetRole: savedTargetRole,
          jobDescription: savedJobDescription,
        } = JSON.parse(persistedData);
        if (savedResumeData) {
          setResumeData(savedResumeData);
          setRoleRecommendations(savedRecommendations || []);
          setTargetRole(savedTargetRole || "");
          setJobDescription(savedJobDescription || "");
        }
      } catch (error) {
        console.warn("Failed to load persisted data:", error);
      }
    }
  }, []);

  const persistData = (data) => {
    try {
      localStorage.setItem("roleSuggestionData", JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to persist data:", error);
    }
  };

  const clearPersistedData = () => {
    try {
      localStorage.removeItem("roleSuggestionData");
    } catch (error) {
      console.warn("Failed to clear persisted data:", error);
    }
  };

  const handleFileUpload = async (file) => {
    setResumeData(null);
    setRoleRecommendations([]);
    clearPersistedData();

    setUploadedFile(file);
    setAlertMessage(
      "Resume uploaded successfully! Click 'Analyze Role Fit' to start the analysis.",
    );
    setAlertType("success");

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const analyzeResume = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setLoadingStage("Preparing your profile for role analysis...");
    setLoadingProgress(10);
    setError({
      show: false,
      message: "",
      type: "error",
      category: null,
      originalError: null,
    });

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (uploadedFile.size > MAX_FILE_SIZE) {
      setError({
        show: true,
        message:
          "The file is too large (max 5MB). Please upload a smaller file or compress the current one.",
        type: "warning",
        category: "file",
        originalError: "File too large",
      });
      setIsLoading(false);
      setLoadingStage("");
      setLoadingProgress(0);
      return;
    }

    try {
      // Stage 1: Preparing data
      setLoadingStage("Scanning experience and skills...");
      setLoadingProgress(20);

      const formData = new FormData();
      formData.append("file", uploadedFile);

      if (targetRole.trim()) {
        formData.append("target_role", targetRole.trim());
      }
      if (jobDescription.trim()) {
        formData.append("job_description", jobDescription.trim());
      }

      // Stage 2: AI Analysis begins
      setLoadingStage("AI is analyzing your skills and experience...");
      setLoadingProgress(40);

      const response = await fetch(ROLE_SUGGESTION, {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      // Stage 3: Processing response
      setLoadingStage("Processing career insights and recommendations...");
      setLoadingProgress(60);

      if (!response.ok) {
        const errorText = await response.text();

        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText || "Unknown error occurred" };
        }

        // Special handling for rate limit errors (server-side)
        if (response.status === 429) {
          showWarning(
            "You've reached your daily limit of 5 role analyses. This helps us maintain quality service for everyone.",
            {
              title: "Daily Limit Reached",
              duration: 8000,
              actions: [
                {
                  label: "Learn More",
                  action: () => {
                    showInfo(
                      "Our daily limits ensure fair access for all users and help maintain our AI processing quality. Limits reset at midnight UTC (7 PM EST).",
                      {
                        title: "Why Daily Limits?",
                        duration: 10000,
                        actions: [
                          {
                            label: "Check Reset Time",
                            action: () => {
                              const now = new Date();
                              const utcMidnight = new Date(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate() + 1,
                                0,
                                0,
                                0,
                              );
                              const timeLeft =
                                utcMidnight.getTime() - now.getTime();
                              const hoursLeft = Math.ceil(
                                timeLeft / (1000 * 60 * 60),
                              );
                              showInfo(
                                `Your limit will reset in approximately ${hoursLeft} hours. Meanwhile, you can use our AI chatbot for career advice!`,
                                {
                                  title: "Time Until Reset",
                                  duration: 6000,
                                },
                              );
                            },
                          },
                        ],
                      },
                    );
                  },
                },
              ],
            },
          );

          setError({
            show: true,
            message: "Daily limit reached. Please try again tomorrow.",
            type: "error",
            category: "rate_limit",
            originalError: error,
          });
          setIsLoading(false);
          setLoadingStage("");
          setLoadingProgress(0);
          return;
        }

        throw new Error(error.message || "Failed to analyze role fit");
      }

      // Stage 4: Finalizing results
      setLoadingStage("Finalizing your personalized career roadmap...");
      setLoadingProgress(80);

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        throw new Error(
          "Failed to parse API response. The server may have returned invalid data.",
          jsonError,
        );
      }

      if (!responseData) {
        throw new Error("No data returned from API");
      }

      // Stage 5: Completing analysis
      setLoadingStage("Generating role matches and success strategies...");
      setLoadingProgress(95);

      const resumeDataFromResponse = {
        ...(responseData.resumeData || responseData),
        // Flatten preparationPlan nested fields to top level for easier access
        ...(responseData.preparationPlan && {
          interview_preparation:
            responseData.preparationPlan.interview_preparation,
          resume_improvements: responseData.preparationPlan.resume_improvements,
          success_metrics: responseData.preparationPlan.success_metrics,
        }),
      };
      const roleRecommendationsFromResponse =
        responseData.roleRecommendations || [];

      // Final stage: Success
      setLoadingStage("Analysis complete! Preparing your results...");
      setLoadingProgress(100);

      const successMessage = targetRole
        ? `Role fit analysis for ${targetRole} is complete! Scroll down to see your matches and recommendations.`
        : "Profile analysis complete! Scroll down to see your role matches and insights.";

      // Small delay to show completion message
      setTimeout(() => {
        setAlertMessage(successMessage);
        setAlertType("success");
        setIsLoading(false);
        setLoadingStage("");
        setLoadingProgress(0);
      }, 800);

      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 5000);

      setResumeData(resumeDataFromResponse);
      setRoleRecommendations(roleRecommendationsFromResponse);

      persistData({
        resumeData: resumeDataFromResponse,
        roleRecommendations: roleRecommendationsFromResponse,
        targetRole,
        jobDescription,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const errorCategory = getErrorCategory(error);

      if (errorCategory === "network" || errorCategory === "loading") {
        setError({
          show: true,
          message: formatErrorMessage(error),
          type: "error",
          category: errorCategory || "unknown",
          originalError: error,
        });
        setIsLoading(false);
        setLoadingStage("");
        setLoadingProgress(0);
        return;
      }

      setError({
        show: true,
        message: formatErrorMessage(error),
        type: "error",
        category: errorCategory || "unknown",
        originalError: error,
      });
      setAlertMessage(formatErrorMessage(error));
      setAlertType("error");
      setIsLoading(false);
      setLoadingStage("");
      setLoadingProgress(0);
    }
  };

  const renderSpecialError = () => {
    if (error.show && error.category === "network") {
      return <NetworkError onClose={handleErrorClose} />;
    }
    if (error.show && error.category === "loading") {
      return <LoadingError onClose={handleErrorClose} />;
    }
    return null;
  };

  const handleErrorClose = () => {
    setError({ ...error, show: false });
    setAlertMessage("");
    setAlertType("");
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden page-force-light">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(251,113,133,0.15),transparent_34%),radial-gradient(circle_at_40%_90%,rgba(129,140,248,0.14),transparent_36%)]"></div>
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-400/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-10"></div>
      </div>

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
              AI-Powered Role Fit Analysis
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">
              Role Match Studio
            </h1>
          </div>

          <div className="rounded-xl border border-cyan-400/30  px-4 py-2 text-xs ">
            Upload your resume to get AI-powered role fit insights and
            personalized career recommendations
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4">
        <div className="container mx-auto space-y-12 py-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/60  p-8 shadow-2xl md:p-12">
            <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl"></div>
            <div className="absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-rose-500/20 blur-3xl"></div>
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30  px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ">
                  Role Match Studio
                </p>
                <h1
                  className="text-4xl font-black leading-[0.95] text-white sm:text-5xl md:text-7xl"
                  style={{ fontFamily: "'Tinos', serif" }}
                >
                  Reimagine Your
                  <span className="block bg-gradient-to-r from-cyan-300 via-indigo-300 to-rose-300 bg-clip-text text-transparent">
                    Next Career Move
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-body md:text-xl">
                  Upload once, then get an AI-guided role map with fit scores,
                  gap signals, and a roadmap that feels like a personal career
                  strategist built into your workflow.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-700/70 p-6 backdrop-blur-xl">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-secondary">
                  What You Unlock
                </p>
                <div className="space-y-3">
                  {[
                    "Precision role-fit scoring",
                    "Personalized growth priorities",
                    "Interview-ready prep insights",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-slate-700/70  p-3"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-xs font-black text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm text-secondary">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl border border-slate-700/60  p-8 shadow-2xl backdrop-blur-xl">
              <div className="text-center mb-8">
                <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-cyan-300/30 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 p-3">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <h2 className="text-2xl font-bold text-white">
                    Career Exploration Tips
                  </h2>
                </div>
                <p className="text-body text-lg max-w-2xl mx-auto">
                  Boost your role discovery with proven strategies from top
                  career experts
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generalTips.map((tip, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-slate-600/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/45 hover:shadow-xl hover:shadow-cyan-500/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-body leading-relaxed group-hover:text-white transition-colors duration-300">
                          {tip}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 origin-left scale-x-0 transform bg-gradient-to-r from-cyan-500 to-rose-500 transition-transform duration-300 group-hover:scale-x-100"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0  rounded-3xl blur-xl"></div>
            <div className="relative backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
              {resumeData ? (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-2xl mb-4">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h2 className="text-2xl font-bold text-white">
                        Analysis Complete
                      </h2>
                    </div>
                    <div className="flex justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 md:p-16 text-center">
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-violet-600 to-cyan-600 p-6 rounded-3xl inline-block">
                        <svg
                          className="h-20 w-20 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Discover Your
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                          Career Potential
                        </span>
                      </h3>

                      <p className="text-xl text-body max-w-2xl mx-auto leading-relaxed">
                        Upload your resume and unlock personalized career
                        insights powered by advanced AI analysis
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {resumeData?.resumeScore && (
            <div className="relative">
              <div className="relative  backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl mb-4">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h2 className="text-3xl font-bold text-white">
                      Career Readiness Score
                    </h2>
                  </div>
                  <p className="text-body text-lg">
                    Your role fit readiness breakdown
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                  {[
                    {
                      label: "Overall",
                      value: resumeData.resumeScore.overall_score,
                      color: "from-violet-600 to-purple-600",
                    },
                    {
                      label: "Technical",
                      value: resumeData.resumeScore.technical_score,
                      color: "from-cyan-600 to-blue-600",
                    },
                    {
                      label: "Experience",
                      value: resumeData.resumeScore.experience_score,
                      color: "from-emerald-600 to-teal-600",
                    },
                    {
                      label: "Education",
                      value: resumeData.resumeScore.education_score,
                      color: "from-rose-600 to-pink-600",
                    },
                    {
                      label: "Communication",
                      value: resumeData.resumeScore.communication_score,
                      color: "from-amber-600 to-orange-600",
                    },
                  ].map((score, idx) => (
                    <div key={idx} className="text-center">
                      <div
                        className={`relative w-24 h-24 mx-auto mb-4 bg-gradient-to-r ${score.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <div className="text-3xl font-black text-white">
                          {Math.round(score.value)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-secondary">
                        {score.label}
                      </div>
                    </div>
                  ))}
                </div>

                {resumeData.resumeScore.reasoning && (
                  <div className="rounded-xl p-4 border border-slate-600/30 mb-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">
                      Analysis
                    </h4>
                    <p className="text-body text-sm leading-relaxed">
                      {resumeData.resumeScore.reasoning}
                    </p>
                  </div>
                )}

                {resumeData.resumeScore.strengths &&
                  resumeData.resumeScore.strengths.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {resumeData.resumeScore.strengths.map(
                          (strength, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="text-emerald-400 flex-shrink-0">
                                ✓
                              </span>
                              <span>{strength}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {resumeData.resumeScore.weaknesses &&
                  resumeData.resumeScore.weaknesses.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        Areas to Improve
                      </h4>
                      <ul className="space-y-2">
                        {resumeData.resumeScore.weaknesses.map(
                          (weakness, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="text-amber-400 flex-shrink-0">
                                ⚠
                              </span>
                              <span>{weakness}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {resumeData.resumeScore.improvement_suggestions &&
                  resumeData.resumeScore.improvement_suggestions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        Improvement Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {resumeData.resumeScore.improvement_suggestions.map(
                          (suggestion, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="text-cyan-400 flex-shrink-0">
                                →
                              </span>
                              <span>{suggestion}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}

          {resumeData?.personalityInsights && (
            <div className="relative">
              <div className="relative backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-600 to-rose-600 p-3 rounded-2xl mb-4">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h2 className="text-3xl font-bold text-white">
                      Personality Profile
                    </h2>
                  </div>
                  <p className="text-body text-lg">
                    Your work style and professional traits
                  </p>
                </div>

                {resumeData.personalityInsights.traits && (
                  <div className="space-y-4 mb-8">
                    {Object.entries(resumeData.personalityInsights.traits).map(
                      ([trait, score]) => (
                        <div key={trait}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-secondary capitalize">
                              {trait}
                            </span>
                            <span className="text-xs font-bold text-cyan-400">
                              {Math.round(score)}%
                            </span>
                          </div>
                          <div className="w-full rounded-full h-2 border border-slate-600/30">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {resumeData.personalityInsights.work_style && (
                  <div className="rounded-xl p-4 border border-slate-600/30 mb-4">
                    <h4 className="text-sm font-semibold text-pink-400 mb-2">
                      Work Style
                    </h4>
                    <p className="text-body text-sm">
                      {resumeData.personalityInsights.work_style}
                    </p>
                  </div>
                )}

                {(resumeData.personalityInsights.leadership_potential !==
                  undefined ||
                  resumeData.personalityInsights.team_player_score !==
                    undefined) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {resumeData.personalityInsights.leadership_potential !==
                      undefined && (
                      <div className="rounded-xl p-4 border border-slate-600/30">
                        <h4 className="text-sm font-semibold text-amber-400 mb-3">
                          Leadership Potential
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-amber-400">
                            {Math.round(
                              resumeData.personalityInsights
                                .leadership_potential,
                            )}
                            %
                          </div>
                          <div className="flex-1">
                            <div className="w-full rounded-full h-2 border border-slate-600/30">
                              <div
                                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${resumeData.personalityInsights.leadership_potential}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {resumeData.personalityInsights.team_player_score !==
                      undefined && (
                      <div className="rounded-xl p-4 border border-slate-600/30">
                        <h4 className="text-sm font-semibold text-teal-400 mb-3">
                          Team Player Score
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-teal-400">
                            {Math.round(
                              resumeData.personalityInsights.team_player_score,
                            )}
                            %
                          </div>
                          <div className="flex-1">
                            <div className="w-full rounded-full h-2 border border-slate-600/30">
                              <div
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${resumeData.personalityInsights.team_player_score}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {resumeData.personalityInsights.analysis && (
                  <div className="rounded-xl p-4 border border-slate-600/30">
                    <h4 className="text-sm font-semibold text-rose-400 mb-2">
                      Analysis
                    </h4>
                    <p className="text-body text-sm leading-relaxed">
                      {resumeData.personalityInsights.analysis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {roleRecommendations.length > 0 && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-10 top-20 h-52 w-52 rounded-full bg-cyan-500/12 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-rose-500/12 blur-3xl"></div>

                <div className="relative mb-12 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <p className="mb-3 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] ">
                      Role Dossier
                    </p>
                    <h2 className="text-3xl font-black text-white md:text-4xl">
                      Career Matches
                    </h2>
                    <p className="mt-3 max-w-2xl text-body">
                      Ranked opportunities with contextual fit and growth
                      signals tailored to your profile.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700/60 px-4 py-3 text-sm text-secondary">
                    {roleRecommendations.length} roles shortlisted
                  </div>
                </div>

                <div className="relative space-y-5">
                  {roleRecommendations.map((role, index) => {
                    const isBestMatch = index === 0;
                    const gradientSet = [
                      "from-cyan-500 via-blue-500 to-indigo-500",
                      "from-emerald-500 via-teal-500 to-cyan-500",
                      "from-rose-500 via-orange-500 to-amber-500",
                      "from-violet-500 via-fuchsia-500 to-rose-500",
                    ];
                    const gradient = gradientSet[index % gradientSet.length];
                    const matchScore = Math.max(
                      0,
                      Math.min(100, Math.round(role.matchPercentage || 0)),
                    );

                    return (
                      <article
                        key={index}
                        className={`group relative overflow-hidden rounded-2xl border  p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl md:p-7 ${
                          isBestMatch
                            ? "border-emerald-400/45 shadow-xl shadow-emerald-500/15"
                            : "border-slate-700/70"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${gradient}`}
                        ></div>

                        {isBestMatch && (
                          <div className="absolute right-4 top-4 rounded-full border border-emerald-300/45 bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
                            Top Recommendation
                          </div>
                        )}

                        <div className="mb-5 flex items-start justify-between gap-4 pr-2 sm:pr-0">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                              Candidate Match #{index + 1}
                            </p>
                            <h3 className="text-xl font-bold text-white sm:text-2xl">
                              {role.roleName}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-3xl font-black ${
                                matchScore >= 85
                                  ? "text-emerald-300"
                                  : matchScore >= 70
                                    ? "text-cyan-300"
                                    : "text-amber-300"
                              }`}
                            >
                              {matchScore}%
                            </p>
                            <p className="text-xs uppercase tracking-[0.14em] text-secondary">
                              Fit Score
                            </p>
                          </div>
                        </div>

                        <div className="mb-5 h-2 overflow-hidden rounded-full">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                            style={{ width: `${matchScore}%` }}
                          ></div>
                        </div>

                        <div className="mb-5 flex flex-wrap gap-2">
                          <span className="rounded-lg border border-slate-600/70 px-3 py-1 text-xs font-semibold text-secondary">
                            {role.careerLevel}
                          </span>
                          <span className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold">
                            {role.industryFit}
                          </span>
                        </div>

                        <div className="mb-5 rounded-xl border border-slate-700/70 p-4">
                          <p className="text-sm leading-relaxed text-body">
                            {role.reasoning}
                          </p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em]">
                              Matching Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {role.requiredSkills &&
                              role.requiredSkills.length > 0 ? (
                                role.requiredSkills
                                  .slice(0, 4)
                                  .map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="rounded-md border border-emerald-400/25 bg-emerald-500/15 px-2.5 py-1 text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))
                              ) : (
                                <span className="text-xs italic text-secondary">
                                  No matching skills detected
                                </span>
                              )}
                            </div>
                            {role.requiredSkills &&
                              role.requiredSkills.length > 4 && (
                                <p className="mt-2 text-xs text-secondary">
                                  +{role.requiredSkills.length - 4} additional
                                  skills
                                </p>
                              )}
                          </section>

                          <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                              Growth Areas
                            </h4>
                            {role.missingSkills &&
                            role.missingSkills.length > 0 ? (
                              <ul className="space-y-1.5 text-xs">
                                {role.missingSkills
                                  .slice(0, 3)
                                  .map((skill, skillIndex) => (
                                    <li key={skillIndex} className="flex gap-2">
                                      <span>•</span>
                                      <span>{skill}</span>
                                    </li>
                                  ))}
                                {role.missingSkills.length > 3 && (
                                  <li className="text-secondary italic">
                                    +{role.missingSkills.length - 3} more
                                    development areas
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <p className="text-xs font-semibold text-emerald-300">
                                Excellent alignment. No major gaps flagged.
                              </p>
                            )}
                          </section>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {resumeData?.careerPath && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-8 top-10 h-44 w-44 rounded-full bg-teal-500/15 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl"></div>

                <div className="relative mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-3 inline-flex rounded-full border border-teal-300/30 bg-teal-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] ">
                      Progress Map
                    </p>
                    <h2 className="text-3xl font-black text-white md:text-4xl">
                      Career Roadmap
                    </h2>
                    <p className="mt-3 max-w-2xl text-body">
                      A practical route from your current stage to your next
                      strategic role moves.
                    </p>
                  </div>
                </div>

                <div className="relative mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {resumeData.careerPath.current_level && (
                    <div className="rounded-xl border border-slate-700/70 p-5">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                        Current Level
                      </h4>
                      <p className="text-lg font-bold text-cyan-300">
                        {resumeData.careerPath.current_level}
                      </p>
                    </div>
                  )}
                  {resumeData.careerPath.timeline && (
                    <div className="rounded-xl border border-slate-700/70 p-5">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                        Timeline
                      </h4>
                      <p className="text-lg font-bold text-teal-300">
                        {resumeData.careerPath.timeline}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {resumeData.careerPath.next_roles &&
                    resumeData.careerPath.next_roles.length > 0 && (
                      <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                          Recommended Next Roles
                        </h4>
                        <ul className="space-y-2">
                          {resumeData.careerPath.next_roles.map((role, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-sm text-body"
                            >
                              <span className="text-emerald-300">→</span>
                              <span>{role}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                  {resumeData.careerPath.required_development &&
                    resumeData.careerPath.required_development.length > 0 && (
                      <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                          Required Development Areas
                        </h4>
                        <ul className="space-y-2">
                          {resumeData.careerPath.required_development.map(
                            (item, idx) => (
                              <li
                                key={idx}
                                className="flex gap-2 text-sm text-body"
                              >
                                <span className="text-amber-300">•</span>
                                <span>{item}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </section>
                    )}
                </div>
              </div>
            </div>
          )}

          {resumeData?.preparationPlan && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-8 top-8 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-8 bottom-10 h-48 w-48 rounded-full bg-orange-500/15 blur-3xl"></div>

                <div className="relative mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-3 inline-flex rounded-full border border-amber-300/30 bg-amber-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                      Strategy Deck
                    </p>
                    <h2 className="text-3xl font-black text-white md:text-4xl">
                      Preparation Plan
                    </h2>
                    <p className="mt-3 max-w-2xl text-body">
                      Structured priorities to close skill gaps and improve role
                      readiness with clear next actions.
                    </p>
                  </div>
                </div>

                {resumeData.preparationPlan.role_fit_score && (
                  <div className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                        Role Fit Score
                      </span>
                      <span className="text-3xl font-black text-amber-300">
                        {Math.round(resumeData.preparationPlan.role_fit_score)}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full border border-slate-600/30">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 transition-all duration-500"
                        style={{
                          width: `${resumeData.preparationPlan.role_fit_score}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {resumeData.preparationPlan.role_fit_assessment && (
                  <div className="mb-6 rounded-xl border border-slate-600/30 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-orange-300">
                      Assessment
                    </h4>
                    <p className="text-body text-sm leading-relaxed">
                      {resumeData.preparationPlan.role_fit_assessment}
                    </p>
                  </div>
                )}

                {resumeData.preparationPlan.critical_skill_gaps &&
                  resumeData.preparationPlan.critical_skill_gaps.length > 0 && (
                    <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/5 p-5">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-red-300">
                        <div className="h-2 w-2 rounded-full bg-red-400"></div>
                        Critical Skill Gaps
                      </h4>
                      <div className="space-y-3">
                        {resumeData.preparationPlan.critical_skill_gaps.map(
                          (gap, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-red-500/25 p-4"
                            >
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 font-bold text-red-300">
                                  !
                                </span>
                                <div>
                                  <h5 className="mb-1 text-sm font-semibold text-red-200">
                                    {gap.skill}
                                  </h5>
                                  <p className="text-xs text-body mb-2">
                                    <strong>Importance:</strong>{" "}
                                    {gap.importance}
                                  </p>
                                  <p className="text-xs text-secondary leading-relaxed">
                                    {gap.how_to_develop}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {resumeData.preparationPlan.personality_alignment && (
                  <div className="mb-6 rounded-xl border border-purple-500/25 bg-purple-500/5 p-5">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-purple-300">
                      <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                      Personality Alignment
                    </h4>
                    <div className="space-y-4">
                      {resumeData.preparationPlan.personality_alignment
                        .aligned_traits &&
                        resumeData.preparationPlan.personality_alignment
                          .aligned_traits.length > 0 && (
                          <div className="rounded-lg border border-purple-500/25 p-4">
                            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
                              Aligned Traits
                            </h5>
                            <ul className="space-y-1">
                              {resumeData.preparationPlan.personality_alignment.aligned_traits.map(
                                (trait, idx) => (
                                  <li key={idx} className="flex gap-2 text-xs">
                                    <span className="text-purple-400 flex-shrink-0">
                                      ✓
                                    </span>
                                    <span>{trait}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      {resumeData.preparationPlan.personality_alignment
                        .traits_to_develop &&
                        resumeData.preparationPlan.personality_alignment
                          .traits_to_develop.length > 0 && (
                          <div className="rounded-lg border border-blue-500/25 p-4">
                            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
                              Traits to Develop
                            </h5>
                            <ul className="space-y-1">
                              {resumeData.preparationPlan.personality_alignment.traits_to_develop.map(
                                (trait, idx) => (
                                  <li key={idx} className="flex gap-2 text-xs">
                                    <span className="text-blue-400 flex-shrink-0">
                                      →
                                    </span>
                                    <span>{trait}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      {resumeData.preparationPlan.personality_alignment
                        .personality_tips && (
                        <div className="rounded-lg border border-slate-600/40 p-4">
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                            Tips
                          </h5>
                          <p className="text-xs text-body leading-relaxed">
                            {
                              resumeData.preparationPlan.personality_alignment
                                .personality_tips
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {resumeData.preparationPlan.strengths_to_leverage &&
                  resumeData.preparationPlan.strengths_to_leverage.length >
                    0 && (
                    <div className="mb-6 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        Strengths to Leverage
                      </h4>
                      <div className="space-y-3">
                        {resumeData.preparationPlan.strengths_to_leverage.map(
                          (strength, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-emerald-500/25 p-4"
                            >
                              <h5 className="mb-2 text-sm font-semibold text-emerald-200">
                                {strength.strength}
                              </h5>
                              <p className="text-xs text-body leading-relaxed">
                                <strong>How to Highlight:</strong>{" "}
                                {strength.how_to_highlight}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {resumeData.preparationPlan.development_areas &&
                  resumeData.preparationPlan.development_areas.length > 0 && (
                    <div className="mb-6 rounded-xl border border-rose-500/25 bg-rose-500/5 p-5">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-rose-300">
                        <div className="h-2 w-2 rounded-full bg-rose-400"></div>
                        Development Areas
                      </h4>
                      <div className="space-y-3">
                        {resumeData.preparationPlan.development_areas.map(
                          (area, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-rose-500/25 p-4"
                            >
                              <h5 className="mb-2 text-sm font-semibold text-rose-200">
                                {area.weakness}
                              </h5>
                              <p className="text-xs text-body leading-relaxed">
                                <strong>Action Plan:</strong> {area.action_plan}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {resumeData.preparationPlan.preparation_timeline && (
                  <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                      <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                      Timeline
                    </h4>
                    <div className="mt-4 space-y-4">
                      {Object.entries(
                        resumeData.preparationPlan.preparation_timeline,
                      ).map(([phase, items]) => (
                        <div
                          key={phase}
                          className="rounded-lg border border-slate-600/40 p-4"
                        >
                          <h5 className="mb-2 text-sm font-bold capitalize text-amber-200">
                            {phase.replace(/_/g, " ")}
                          </h5>
                          {Array.isArray(items) && (
                            <ul className="space-y-1">
                              {items.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex gap-2 text-xs text-body"
                                >
                                  <span className="text-amber-400 flex-shrink-0">
                                    ✓
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {(resumeData?.preparationPlan?.estimated_readiness_timeline ||
            resumeData?.preparationPlan?.motivation_summary) && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-rose-500/15 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-pink-500/15 blur-3xl"></div>

                <div className="relative mb-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-3">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <h2 className="text-3xl font-bold text-white">
                      Your Journey
                    </h2>
                  </div>
                  <p className="text-lg text-body">
                    Timeline and motivation for success
                  </p>
                </div>

                {resumeData.preparationPlan.estimated_readiness_timeline && (
                  <div className="relative mb-6 rounded-xl border border-rose-500/25 bg-rose-500/5 p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Estimated Readiness Timeline
                    </h4>
                    <p className="text-sm text-body leading-relaxed">
                      {resumeData.preparationPlan.estimated_readiness_timeline}
                    </p>
                  </div>
                )}

                {resumeData.preparationPlan.motivation_summary && (
                  <div className="rounded-xl border border-pink-500/25 bg-pink-500/8 p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] ">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Your Success Message
                    </h4>
                    <p className="text-sm italic leading-relaxed">
                      "{resumeData.preparationPlan.motivation_summary}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {resumeData?.interview_preparation && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-indigo-500/15 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-purple-500/15 blur-3xl"></div>

                <div className="relative mb-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-indigo-300/30 bg-indigo-500/10 p-3">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h2 className="text-3xl font-bold text-white">
                      Interview Preparation
                    </h2>
                  </div>
                  <p className="text-lg text-body">
                    Key strategies for successful interviews
                  </p>
                </div>

                {resumeData.interview_preparation.key_points_to_emphasize &&
                  resumeData.interview_preparation.key_points_to_emphasize
                    .length > 0 && (
                    <div className="mb-6 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        Key Points to Emphasize
                      </h4>
                      <ul className="space-y-3">
                        {resumeData.interview_preparation.key_points_to_emphasize.map(
                          (point, idx) => (
                            <li
                              key={idx}
                              className="rounded-lg border border-emerald-500/25 p-4"
                            >
                              <p className="text-sm text-emerald-100">
                                {point}
                              </p>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {resumeData.interview_preparation.common_interview_questions &&
                  resumeData.interview_preparation.common_interview_questions
                    .length > 0 && (
                    <div className="mb-6 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-5">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
                        <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
                        Common Interview Questions
                      </h4>
                      <div className="space-y-3">
                        {resumeData.interview_preparation.common_interview_questions.map(
                          (question, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-cyan-500/25 p-4"
                            >
                              <p className="text-sm font-semibold">
                                {idx + 1}. {question}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {resumeData.interview_preparation.best_answers_outline && (
                  <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-5">
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.14em]">
                      Answering Strategy
                    </h4>
                    <p className="text-body text-sm leading-relaxed">
                      {resumeData.interview_preparation.best_answers_outline}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {resumeData?.resume_improvements &&
            resumeData.resume_improvements.length > 0 && (
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                  <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl"></div>
                  <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-green-500/15 blur-3xl"></div>

                  <div className="relative mb-10">
                    <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-3">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h2 className="text-3xl font-bold text-white">
                        Resume Enhancements
                      </h2>
                    </div>
                    <p className="text-lg text-body">
                      Section-by-section improvements
                    </p>
                  </div>

                  <div className="relative space-y-5">
                    {resumeData.resume_improvements.map((improvement, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6"
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <h4 className="text-sm font-bold uppercase tracking-[0.14em]">
                            {improvement.section}
                          </h4>
                          <div className="rounded-full border border-slate-600/60 px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                            Improvement #{idx + 1}
                          </div>
                        </div>

                        <div className="mb-4 rounded-lg border border-slate-600/40 p-4">
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]">
                            Current Gap
                          </h5>
                          <p className="mt-1 text-sm text-body">
                            {improvement.current_gap}
                          </p>
                        </div>

                        <div className="rounded-lg border border-emerald-500/25 p-4">
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]">
                            Recommended Improvement
                          </h5>
                          <p className="text-sm leading-relaxed ">
                            {improvement.improvement}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {resumeData?.success_metrics && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-yellow-500/15 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl"></div>

                <div className="relative mb-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-yellow-300/30 bg-yellow-500/10 p-3">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h2 className="text-3xl font-bold text-white">
                      Success Metrics
                    </h2>
                  </div>
                  <p className="text-lg text-body">
                    Milestones for achieving your career goals
                  </p>
                </div>

                {resumeData.success_metrics.skill_readiness && (
                  <div className="mb-6 rounded-xl border border-yellow-500/25 bg-yellow-500/5 p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-yellow-300">
                      <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                      Skill Readiness
                    </h4>
                    <p className="text-sm text-body leading-relaxed">
                      {resumeData.success_metrics.skill_readiness}
                    </p>
                  </div>
                )}

                {resumeData.success_metrics.experience_requirements && (
                  <div className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/5 p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                      <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                      Experience Requirements
                    </h4>
                    <p className="text-sm text-body leading-relaxed">
                      {resumeData.success_metrics.experience_requirements}
                    </p>
                  </div>
                )}

                {resumeData.success_metrics.confidence_checklist &&
                  resumeData.success_metrics.confidence_checklist.length >
                    0 && (
                    <div className="rounded-xl border border-orange-500/25 bg-orange-500/8 p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-300">
                        <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                        Confidence Checklist
                      </h4>
                      <ul className="space-y-2">
                        {resumeData.success_metrics.confidence_checklist.map(
                          (item, idx) => (
                            <li key={idx} className="flex gap-3 text-sm">
                              <span className="flex-shrink-0 font-bold text-orange-300">
                                ✓
                              </span>
                              <span>{item}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute -left-10 top-8 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl"></div>
            <div className="pointer-events-none absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl"></div>

            <div className="relative p-8 md:p-10">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-cyan-300/30 p-3">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <h2 className="text-2xl font-bold text-white">
                    Upload & Analyze
                  </h2>
                </div>
                <p className="max-w-2xl text-lg text-body">
                  Enhance your analysis with targeted role and job description
                  matching
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="rounded-2xl border border-slate-700/60 p-5">
                  <div className="relative group">
                    <label
                      htmlFor="targetRole"
                      className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6.341"
                        />
                      </svg>
                      Target Role (Optional)
                    </label>
                    <div className="relative">
                      <input
                        id="targetRole"
                        name="targetRole"
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                        className="w-full rounded-2xl border border-slate-600/50 px-6 py-4 text-lg text-white shadow-lg transition-all duration-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 group-hover:border-violet-500/30"
                        disabled={isLoading}
                        autoComplete="off"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-secondary">
                      <svg
                        className="h-4 w-4 text-violet-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                        />
                      </svg>
                      Get targeted analysis for specific roles
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700/60 p-5">
                  <div className="relative group">
                    <label
                      htmlFor="jobDescription"
                      className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Job Description (Optional)
                    </label>
                    <div className="relative">
                      <textarea
                        id="jobDescription"
                        name="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here for more accurate role fit analysis..."
                        rows={4}
                        className="w-full resize-vertical rounded-2xl border border-slate-600/50 px-6 py-4 text-lg text-white shadow-lg transition-all duration-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 group-hover:border-cyan-500/30"
                        disabled={isLoading}
                        autoComplete="off"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-violet-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-secondary">
                      <svg
                        className="h-4 w-4 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Enhanced skill gap analysis with job requirements
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-600/5 to-indigo-600/5"></div>
                <div className="relative">
                  <ResumeUpload
                    onFileUpload={handleFileUpload}
                    isLoading={isLoading}
                    onError={(errorData) => {
                      setError({
                        show: true,
                        message: errorData.message || "Error with file upload",
                        type: errorData.type || "warning",
                        category: errorData.category || "file",
                        originalError: errorData,
                      });
                    }}
                  />
                </div>
              </div>

              {uploadedFile && !resumeData && (
                <div className="relative mt-8">
                  <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl"></div>
                    <div className="pointer-events-none absolute -right-10 bottom-6 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl"></div>
                    <div className="text-center">
                      <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-500/12 p-3">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        <h3 className="text-2xl font-bold text-white">
                          Ready to Explore Roles
                        </h3>
                      </div>

                      <p className="mx-auto mb-8 max-w-2xl text-lg text-body">
                        Your resume "{uploadedFile.name}" has been uploaded
                        successfully. Click the button below to start the
                        AI-powered role-fit analysis and get personalized career
                        insights.
                      </p>

                      <button
                        onClick={analyzeResume}
                        disabled={isLoading}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-300/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-12 py-4 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-3">
                          {isLoading ? (
                            <>
                              <div className="relative">
                                <svg
                                  className="animate-spin h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60 animate-pulse"></div>
                              </div>
                              <span>Analyzing Role Fit...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-6 w-6 transform group-hover:rotate-12 transition-transform duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>Analyze Role Fit</span>
                            </>
                          )}
                        </div>
                      </button>

                      {isLoading && (
                        <div className="mt-8 space-y-6">
                          <div className="relative">
                            <div className="flex items-center justify-between text-sm text-secondary mb-2">
                              <span>Analysis Progress</span>
                              <span>{loadingProgress}%</span>
                            </div>
                            <div className="w-full rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${loadingProgress}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                              </div>
                            </div>
                          </div>

                          {loadingStage && (
                            <div className="backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-30 animate-ping"></div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-white font-medium text-lg">
                                    {loadingStage}
                                  </p>
                                  <p className="text-secondary text-sm mt-1">
                                    Our AI is working hard to provide you with
                                    the best insights
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Chatbot Encouragement Message */}
                          <div className="bg-gradient-to-r from-indigo-800/30 via-purple-800/20 to-pink-800/30 border border-indigo-500/30 rounded-xl p-6 mt-6 animate-pulse">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <svg
                                      className="w-6 h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="mb-2 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-lg font-semibold text-transparent">
                                  While You Wait - Chat with our AI Assistant!
                                </h3>
                                <p className="text-body text-sm leading-relaxed mb-4">
                                  Analysis takes 2-3 minutes. Don't just wait -
                                  make the most of this time! Chat with our AI
                                  assistant about your career goals, get
                                  interview tips, or discuss your job search
                                  strategy.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
                                    Career advice
                                  </span>
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors">
                                    Interview tips
                                  </span>
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 transition-colors">
                                    Job search help
                                  </span>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-slate-700/60 via-slate-600/40 to-slate-700/60 rounded-lg border border-indigo-400/50 shadow-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center animate-pulse">
                                        <svg
                                          className="w-4 h-4 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                    <p className="text-body text-sm font-medium">
                                      Look for the{" "}
                                      <span className="text-purple-300 font-semibold">
                                        colorful chat bubble
                                      </span>{" "}
                                      in the bottom-right corner to start
                                      chatting!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center gap-3 mt-6">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>

                          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-purple-200 font-semibold mb-2">
                                  Did you know?
                                </h4>
                                <p className="text-body text-sm leading-relaxed">
                                  Our AI analyzes over 50+ career factors
                                  including skills, experience patterns,
                                  industry trends, and role compatibility to
                                  give you the most accurate career guidance.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderSpecialError()}

        {alertMessage && (
          <div className="fixed top-8 right-8 z-50 max-w-md">
            <div className="relative">
              <div
                className={`absolute inset-0 ${
                  alertType === "success"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600"
                    : "bg-gradient-to-r from-red-600 to-rose-600"
                } rounded-2xl blur-lg opacity-30 animate-pulse`}
              ></div>
              <div
                className={`relative backdrop-blur-xl border rounded-2xl p-6 shadow-2xl ${
                  alertType === "success"
                    ? "border-emerald-500/30 text-emerald-300"
                    : "border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      alertType === "success" ? "bg-emerald-600" : "bg-red-600"
                    }`}
                  >
                    {alertType === "success" ? (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium leading-relaxed">
                      {alertMessage}
                    </p>
                  </div>
                  <button
                    onClick={handleErrorClose}
                    className="flex-shrink-0 text-secondary hover:text-white transition-colors duration-200 focus:outline-none"
                    aria-label="Close alert"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoleSuggestion;
