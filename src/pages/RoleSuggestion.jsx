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
    <div className="relative min-h-screen flex flex-col overflow-x-hidden page-force-light bg-card-ivory">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-64 bg-card-sand/50"></div>
        <div className="absolute inset-0 bg-transparent opacity-10"></div>
      </div>

      <header className="mb-6 rounded-2xl border border-border-subtle bg-card-primary p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button
            onClick={() => (window.location.href = "/")}
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-card-sand px-4 py-2 text-sm font-semibold text-h2 transition-all duration-300 hover:border-border-mid cursor-pointer"
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
            <h1 className="mt-1 text-2xl font-black leading-tight text-h1 sm:text-3xl">
              Role Match Studio
            </h1>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card-ivory px-4 py-2 text-xs text-body">
            Upload your resume to get AI-powered role fit insights and
            personalized career recommendations
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4">
        <div className="container mx-auto space-y-12 py-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-card-primary p-8 shadow-sm md:p-12">
            <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-card-sand/50 blur-3xl"></div>
            <div className="absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-card-linen/40 blur-3xl"></div>
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card-sand/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-h4">
                  Role Match Studio
                </p>
                <h1
                  className="text-4xl font-black leading-[0.95] text-h1 sm:text-5xl md:text-7xl"
                  style={{ fontFamily: "'Tinos', serif" }}
                >
                  Reimagine Your
                  <span className="block text-h2">Next Career Move</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-body md:text-xl">
                  Upload once, then get an AI-guided role map with fit scores,
                  gap signals, and a roadmap that feels like a personal career
                  strategist built into your workflow.
                </p>
              </div>
              <div className="rounded-3xl border border-border-subtle bg-card-linen p-6">
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
                      className="flex items-start gap-3 rounded-xl border border-border-subtle bg-card-ivory p-3"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-card-clay text-xs font-black text-h2">
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
            <div className="relative rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-sand p-3">
                  <svg
                    className="h-8 w-8 text-h2"
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
                  <h2 className="text-2xl font-bold text-h1">
                    Career Exploration Tips
                  </h2>
                </div>
                <p className="mx-auto max-w-2xl text-lg text-body">
                  Boost your role discovery with proven strategies from top
                  career experts
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {generalTips.map((tip, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-card-ivory p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-mid hover:shadow-lg"
                  >
                    <div className="absolute inset-0 bg-card-sand/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-clay shadow-lg">
                          <span className="text-sm font-bold text-h2">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="leading-relaxed text-body transition-colors duration-300 group-hover:text-h1">
                          {tip}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 origin-left scale-x-0 transform bg-card-clay transition-transform duration-300 group-hover:scale-x-100"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-xl"></div>
            <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary shadow-sm backdrop-blur-xl">
              {resumeData ? (
                <div className="p-8">
                  <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-card-clay p-3">
                      <svg
                        className="h-8 w-8 text-h2"
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
                      <h2 className="text-2xl font-bold text-h1">
                        Analysis Complete
                      </h2>
                    </div>
                    <div className="flex justify-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-card-clay"></div>
                      <div
                        className="h-2 w-2 animate-pulse rounded-full bg-card-clay"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-pulse rounded-full bg-card-clay"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center md:p-16">
                  <div className="mx-auto max-w-4xl space-y-8">
                    <div className="relative">
                      <div className="absolute inset-0 animate-pulse rounded-full bg-card-clay opacity-20 blur-2xl"></div>
                      <div className="relative inline-block rounded-3xl bg-card-clay p-6">
                        <svg
                          className="h-20 w-20 text-h2"
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
                      <h3 className="text-4xl font-black leading-tight text-h1 md:text-5xl">
                        Discover Your
                        <br />
                        <span className="text-h2">Career Potential</span>
                      </h3>

                      <p className="mx-auto max-w-2xl text-xl leading-relaxed text-body">
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
              <div className="relative rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm backdrop-blur-xl">
                <div className="mb-12 text-center">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-card-clay p-3">
                    <svg
                      className="h-8 w-8 text-h2"
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
                    <h2 className="text-3xl font-bold text-h2">
                      Career Readiness Score
                    </h2>
                  </div>
                  <p className="text-lg text-body">
                    Your role fit readiness breakdown
                  </p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
                  {[
                    {
                      label: "Overall",
                      value: resumeData.resumeScore.overall_score,
                      color: "bg-card-clay",
                    },
                    {
                      label: "Technical",
                      value: resumeData.resumeScore.technical_score,
                      color: "bg-card-clay",
                    },
                    {
                      label: "Experience",
                      value: resumeData.resumeScore.experience_score,
                      color: "bg-card-clay",
                    },
                    {
                      label: "Education",
                      value: resumeData.resumeScore.education_score,
                      color: "bg-card-clay",
                    },
                    {
                      label: "Communication",
                      value: resumeData.resumeScore.communication_score,
                      color: "bg-card-clay",
                    },
                  ].map((score, idx) => (
                    <div key={idx} className="text-center">
                      <div
                        className={`relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg ${score.color}`}
                      >
                        <div className="text-3xl font-black text-h1">
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
                  <div className="mb-4 rounded-xl border border-border-subtle p-4">
                    <h4 className="mb-2 text-sm font-semibold text-h2">
                      Analysis
                    </h4>
                    <p className="text-sm leading-relaxed text-body">
                      {resumeData.resumeScore.reasoning}
                    </p>
                  </div>
                )}

                {resumeData.resumeScore.strengths &&
                  resumeData.resumeScore.strengths.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-h2">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {resumeData.resumeScore.strengths.map(
                          (strength, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="flex-shrink-0 text-h2">✓</span>
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
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-h2">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                        Areas to Improve
                      </h4>
                      <ul className="space-y-2">
                        {resumeData.resumeScore.weaknesses.map(
                          (weakness, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="flex-shrink-0 text-h2">⚠</span>
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
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-h2">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                        Improvement Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {resumeData.resumeScore.improvement_suggestions.map(
                          (suggestion, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 text-sm text-body"
                            >
                              <span className="flex-shrink-0 text-h2">→</span>
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
              <div className="relative rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm backdrop-blur-xl">
                <div className="mb-12 text-center">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-card-clay p-3">
                    <svg
                      className="h-8 w-8 text-h2"
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
                    <h2 className="text-3xl font-bold text-h1">
                      Personality Profile
                    </h2>
                  </div>
                  <p className="text-lg text-body">
                    Your work style and professional traits
                  </p>
                </div>

                {resumeData.personalityInsights.traits && (
                  <div className="mb-8 space-y-4">
                    {Object.entries(resumeData.personalityInsights.traits).map(
                      ([trait, score]) => (
                        <div key={trait}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-semibold capitalize text-secondary">
                              {trait}
                            </span>
                            <span className="text-xs font-bold text-h2">
                              {Math.round(score)}%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full border border-border-subtle">
                            <div
                              className="h-2 rounded-full bg-card-clay transition-all duration-500"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {resumeData.personalityInsights.work_style && (
                  <div className="mb-4 rounded-xl border border-border-subtle p-4">
                    <h4 className="mb-2 text-sm font-semibold text-h2">
                      Work Style
                    </h4>
                    <p className="text-sm text-body">
                      {resumeData.personalityInsights.work_style}
                    </p>
                  </div>
                )}

                {(resumeData.personalityInsights.leadership_potential !==
                  undefined ||
                  resumeData.personalityInsights.team_player_score !==
                    undefined) && (
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {resumeData.personalityInsights.leadership_potential !==
                      undefined && (
                      <div className="rounded-xl border border-border-subtle p-4">
                        <h4 className="mb-3 text-sm font-semibold text-h2">
                          Leadership Potential
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-h2">
                            {Math.round(
                              resumeData.personalityInsights
                                .leadership_potential,
                            )}
                            %
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-full rounded-full border border-border-subtle">
                              <div
                                className="h-2 rounded-full bg-card-clay transition-all duration-500"
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
                      <div className="rounded-xl border border-border-subtle p-4">
                        <h4 className="mb-3 text-sm font-semibold text-h2">
                          Team Player Score
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-h2">
                            {Math.round(
                              resumeData.personalityInsights.team_player_score,
                            )}
                            %
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-full rounded-full border border-border-subtle">
                              <div
                                className="h-2 rounded-full bg-card-clay transition-all duration-500"
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
                  <div className="rounded-xl border border-border-subtle p-4">
                    <h4 className="mb-2 text-sm font-semibold text-h2">
                      Analysis
                    </h4>
                    <p className="text-sm leading-relaxed text-body">
                      {resumeData.personalityInsights.analysis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {roleRecommendations.length > 0 && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-10 top-20 h-52 w-52 rounded-full bg-card-sand blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-card-sand blur-3xl"></div>

                <div className="relative mb-12 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <p className="mb-3 inline-flex items-center rounded-full border border-border-subtle bg-card-ivory px-4 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                      Role Dossier
                    </p>
                    <h2 className="text-3xl font-black text-h1 md:text-4xl">
                      Career Matches
                    </h2>
                    <p className="mt-3 max-w-2xl text-body">
                      Ranked opportunities with contextual fit and growth
                      signals tailored to your profile.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-subtle px-4 py-3 text-sm text-secondary">
                    {roleRecommendations.length} roles shortlisted
                  </div>
                </div>

                <div className="relative space-y-5">
                  {roleRecommendations.map((role, index) => {
                    const isBestMatch = index === 0;
                    const gradientSet = [
                      "bg-card-clay",
                      "bg-card-clay",
                      "bg-card-clay",
                      "bg-card-clay",
                    ];
                    const gradient = gradientSet[index % gradientSet.length];
                    const matchScore = Math.max(
                      0,
                      Math.min(100, Math.round(role.matchPercentage || 0)),
                    );

                    return (
                      <article
                        key={index}
                        className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm md:p-7 ${
                          isBestMatch
                            ? "border-border-subtle shadow-sm"
                            : "border-border-subtle"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 h-full w-1.5 ${gradient}`}
                        ></div>

                        {isBestMatch && (
                          <div className="absolute right-4 top-4 rounded-full border border-border-subtle bg-card-ivory px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
                            Top Recommendation
                          </div>
                        )}

                        <div className="mb-5 flex items-start justify-between gap-4 pr-2 sm:pr-0">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                              Candidate Match #{index + 1}
                            </p>
                            <h3 className="text-xl font-bold text-h1 sm:text-2xl">
                              {role.roleName}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black text-h2">
                              {matchScore}%
                            </p>
                            <p className="text-xs uppercase tracking-[0.14em] text-secondary">
                              Fit Score
                            </p>
                          </div>
                        </div>

                        <div className="mb-5 h-2 overflow-hidden rounded-full">
                          <div
                            className={`h-full rounded-full ${gradient} transition-all duration-700`}
                            style={{ width: `${matchScore}%` }}
                          ></div>
                        </div>

                        <div className="mb-5 flex flex-wrap gap-2">
                          <span className="rounded-lg border border-border-subtle px-3 py-1 text-xs font-semibold text-secondary">
                            {role.careerLevel}
                          </span>
                          <span className="rounded-lg border border-border-subtle bg-card-ivory px-3 py-1 text-xs font-semibold text-h2"></span>
                        </div>

                        <div className="mb-5 rounded-xl border border-border-subtle p-4">
                          <p className="text-sm leading-relaxed text-body">
                            {role.reasoning}
                          </p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <section className="rounded-xl border border-border-subtle bg-card-ivory p-4">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-h2">
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
                                      className="rounded-md border border-border-subtle bg-card-ivory px-2.5 py-1 text-xs text-body"
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

                          <section className="rounded-xl border border-border-subtle bg-card-ivory p-4">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-h2">
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
                                  <li className="italic text-secondary">
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
              <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-8 top-10 h-44 w-44 rounded-full bg-card-sand blur-3xl"></div>
                <div className="pointer-events-none absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-card-sand blur-3xl"></div>

                <div className="relative mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-3 inline-flex rounded-full border border-border-subtle bg-card-ivory px-4 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                      Progress Map
                    </p>
                    <h2 className="text-3xl font-black text-h1 md:text-4xl">
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
                    <div className="rounded-xl border border-border-subtle p-5">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                        Current Level
                      </h4>
                      <p className="text-lg font-bold text-h2">
                        {resumeData.careerPath.current_level}
                      </p>
                    </div>
                  )}
                  {resumeData.careerPath.timeline && (
                    <div className="rounded-xl border border-slate-700/70 p-5">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                        Timeline
                      </h4>
                      <p className="text-lg font-bold text-h2">
                        {resumeData.careerPath.timeline}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {resumeData.careerPath.next_roles &&
                    resumeData.careerPath.next_roles.length > 0 && (
                      <section className="rounded-xl border border-border-subtle bg-card-ivory p-5">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-h2">
                          Recommended Next Roles
                        </h4>
                        <ul className="space-y-2">
                          {resumeData.careerPath.next_roles.map((role, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 text-sm text-body"
                            >
                              <span className="text-h2">→</span>
                              <span>{role}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                  {resumeData.careerPath.required_development &&
                    resumeData.careerPath.required_development.length > 0 && (
                      <section className="rounded-xl border border-border-subtle bg-card-ivory p-5">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-h2">
                          Required Development Areas
                        </h4>
                        <ul className="space-y-2">
                          {resumeData.careerPath.required_development.map(
                            (item, idx) => (
                              <li
                                key={idx}
                                className="flex gap-2 text-sm text-body"
                              >
                                <span className="text-h2">•</span>
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
              <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm backdrop-blur-xl md:p-10">
                <div className="pointer-events-none absolute -left-8 top-8 h-44 w-44 rounded-full bg-card-sand blur-3xl"></div>
                <div className="pointer-events-none absolute -right-8 bottom-10 h-48 w-48 rounded-full bg-card-sand blur-3xl"></div>

                <div className="relative mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-3 inline-flex rounded-full border border-border-subtle bg-card-ivory px-4 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                      Strategy Deck
                    </p>
                    <h2 className="text-3xl font-black text-h1 md:text-4xl">
                      Preparation Plan
                    </h2>
                    <p className="mt-3 max-w-2xl text-body">
                      Structured priorities to close skill gaps and improve role
                      readiness with clear next actions.
                    </p>
                  </div>
                </div>

                {resumeData.preparationPlan.role_fit_score && (
                  <div className="mb-8 rounded-2xl border border-border-subtle bg-card-ivory p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                        Role Fit Score
                      </span>
                      <span className="text-3xl font-black text-h2">
                        {Math.round(resumeData.preparationPlan.role_fit_score)}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full border border-border-subtle">
                      <div
                        className="h-3 rounded-full bg-card-clay transition-all duration-500"
                        style={{
                          width: `${resumeData.preparationPlan.role_fit_score}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {resumeData.preparationPlan.role_fit_assessment && (
                  <div className="mb-6 rounded-xl border border-border-subtle p-4">
                    <h4 className="mb-2 text-sm font-semibold text-h2">
                      Assessment
                    </h4>
                    <p className="text-sm leading-relaxed text-body">
                      {resumeData.preparationPlan.role_fit_assessment}
                    </p>
                  </div>
                )}

                {resumeData.preparationPlan.critical_skill_gaps &&
                  resumeData.preparationPlan.critical_skill_gaps.length > 0 && (
                    <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-5">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-h2">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                        Critical Skill Gaps
                      </h4>
                      <div className="space-y-3">
                        {resumeData.preparationPlan.critical_skill_gaps.map(
                          (gap, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-border-subtle p-4"
                            >
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 font-bold text-h2">
                                  !
                                </span>
                                <div>
                                  <h5 className="mb-1 text-sm font-semibold text-h2">
                                    {gap.skill}
                                  </h5>
                                  <p className="mb-2 text-xs text-body">
                                    <strong>Importance:</strong>{" "}
                                    {gap.importance}
                                  </p>
                                  <p className="text-xs leading-relaxed text-secondary">
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
                  <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-5">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-h2">
                      <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                      Personality Alignment
                    </h4>
                    <div className="space-y-4">
                      {resumeData.preparationPlan.personality_alignment
                        .aligned_traits &&
                        resumeData.preparationPlan.personality_alignment
                          .aligned_traits.length > 0 && (
                          <div className="rounded-lg border border-border-subtle p-4">
                            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-h2">
                              Aligned Traits
                            </h5>
                            <ul className="space-y-1">
                              {resumeData.preparationPlan.personality_alignment.aligned_traits.map(
                                (trait, idx) => (
                                  <li key={idx} className="flex gap-2 text-xs">
                                    <span className="flex-shrink-0 text-h2">
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
                          <div className="rounded-lg border border-border-subtle p-4">
                            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-h2">
                              Traits to Develop
                            </h5>
                            <ul className="space-y-1">
                              {resumeData.preparationPlan.personality_alignment.traits_to_develop.map(
                                (trait, idx) => (
                                  <li key={idx} className="flex gap-2 text-xs">
                                    <span className="flex-shrink-0 text-h2">
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
                        <div className="rounded-lg border border-border-subtle p-4">
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                            Tips
                          </h5>
                          <p className="text-xs leading-relaxed text-body">
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
                    <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-5">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-h2">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                        Strengths to Leverage
                      </h4>
                      <div className="space-y-3">
                        {resumeData.preparationPlan.strengths_to_leverage.map(
                          (strength, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-border-subtle p-4"
                            >
                              <h5 className="mb-2 text-sm font-semibold text-h2">
                                {strength.strength}
                              </h5>
                              <p className="text-xs leading-relaxed text-body">
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
                    <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-5">
                      <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-h2">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                        Development Areas
                      </h4>
                      <div className="space-y-3">
                        {resumeData.preparationPlan.development_areas.map(
                          (area, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg border border-border-subtle p-4"
                            >
                              <h5 className="mb-2 text-sm font-semibold text-h2">
                                {area.weakness}
                              </h5>
                              <p className="text-xs leading-relaxed text-body">
                                <strong>Action Plan:</strong> {area.action_plan}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {resumeData.preparationPlan.preparation_timeline && (
                  <div className="mt-6 rounded-xl border border-border-subtle bg-card-ivory p-5">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                      <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                      Timeline
                    </h4>
                    <div className="mt-4 space-y-4">
                      {Object.entries(
                        resumeData.preparationPlan.preparation_timeline,
                      ).map(([phase, items]) => (
                        <div
                          key={phase}
                          className="rounded-lg border border-border-subtle p-4"
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
                                  <span className="flex-shrink-0 text-h2">
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
              <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm md:p-10">
                <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>

                <div className="relative mb-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-sand/50 p-3">
                    <svg
                      className="h-8 w-8 text-h2"
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
                    <h2 className="text-3xl font-bold text-h2">Your Journey</h2>
                  </div>
                  <p className="text-lg text-body">
                    Timeline and motivation for success
                  </p>
                </div>

                {resumeData.preparationPlan.estimated_readiness_timeline && (
                  <div className="relative mb-6 rounded-xl border border-border-subtle bg-card-ivory p-6">
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
                    <p className="text-sm leading-relaxed text-body">
                      {resumeData.preparationPlan.estimated_readiness_timeline}
                    </p>
                  </div>
                )}

                {resumeData.preparationPlan.motivation_summary && (
                  <div className="rounded-xl border border-border-subtle bg-card-ivory p-6">
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
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Your Success Message
                    </h4>
                    <p className="text-sm italic leading-relaxed">
                      &quot;{resumeData.preparationPlan.motivation_summary}
                      &quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {resumeData?.interview_preparation && (
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm md:p-10">
                <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>

                <div className="relative mb-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-sand/50 p-3">
                    <svg
                      className="h-8 w-8 text-h2"
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
                    <h2 className="text-3xl font-bold text-h2">
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
                    <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-5">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                        Key Points to Emphasize
                      </h4>
                      <ul className="space-y-3">
                        {resumeData.interview_preparation.key_points_to_emphasize.map(
                          (point, idx) => (
                            <li
                              key={idx}
                              className="rounded-lg border border-border-subtle p-4"
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
                    <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-5">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
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
                  <div className="rounded-xl border border-border-subtle bg-card-ivory p-5">
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.14em]">
                      Answering Strategy
                    </h4>
                    <p className="text-sm leading-relaxed text-body">
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
                <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm md:p-10">
                  <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>
                  <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>

                  <div className="relative mb-10">
                    <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-sand/50 p-3">
                      <svg
                        className="h-8 w-8 text-h2"
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
                      <h2 className="text-3xl font-bold text-h2">
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
                        className="rounded-xl border border-border-subtle bg-card-ivory p-6"
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <h4 className="text-sm font-bold uppercase tracking-[0.14em]">
                            {improvement.section}
                          </h4>
                          <div className="rounded-full border border-slate-600/60 px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                            Improvement #{idx + 1}
                          </div>
                        </div>

                        <div className="mb-4 rounded-lg border border-border-subtle p-4">
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]">
                            Current Gap
                          </h5>
                          <p className="mt-1 text-sm text-body">
                            {improvement.current_gap}
                          </p>
                        </div>

                        <div className="rounded-lg border border-border-subtle p-4">
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]">
                            Recommended Improvement
                          </h5>
                          <p className="text-sm leading-relaxed">
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
              <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm md:p-10">
                <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>
                <div className="pointer-events-none absolute -right-10 bottom-8 h-44 w-44 rounded-full bg-card-sand/40 blur-3xl"></div>

                <div className="relative mb-10">
                  <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-sand/50 p-3">
                    <svg
                      className="h-8 w-8 text-h2"
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
                    <h2 className="text-3xl font-bold text-h2">
                      Success Metrics
                    </h2>
                  </div>
                  <p className="text-lg text-body">
                    Milestones for achieving your career goals
                  </p>
                </div>

                {resumeData.success_metrics.skill_readiness && (
                  <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-yellow-300">
                      <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                      Skill Readiness
                    </h4>
                    <p className="text-sm leading-relaxed text-body">
                      {resumeData.success_metrics.skill_readiness}
                    </p>
                  </div>
                )}

                {resumeData.success_metrics.experience_requirements && (
                  <div className="mb-6 rounded-xl border border-border-subtle bg-card-ivory p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
                      <div className="h-2 w-2 rounded-full bg-card-clay"></div>
                      Experience Requirements
                    </h4>
                    <p className="text-sm leading-relaxed text-body">
                      {resumeData.success_metrics.experience_requirements}
                    </p>
                  </div>
                )}

                {resumeData.success_metrics.confidence_checklist &&
                  resumeData.success_metrics.confidence_checklist.length >
                    0 && (
                    <div className="rounded-xl border border-border-subtle bg-card-ivory p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-300">
                        <div className="h-2 w-2 rounded-full bg-card-clay"></div>
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
          <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary shadow-sm">
            <div className="pointer-events-none absolute -left-10 top-8 h-48 w-48 rounded-full bg-card-sand/40 blur-3xl"></div>
            <div className="pointer-events-none absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-card-sand/40 blur-3xl"></div>

            <div className="relative p-8 md:p-10">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-sand/50 p-3">
                  <svg
                    className="h-8 w-8 text-h2"
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
                  <h2 className="text-2xl font-bold text-h2">
                    Upload & Analyze
                  </h2>
                </div>
                <p className="max-w-2xl text-lg text-body">
                  Enhance your analysis with targeted role and job description
                  matching
                </p>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-border-subtle bg-card-ivory p-5">
                  <div className="group relative">
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
                        className="w-full rounded-2xl border border-border-subtle bg-card-ivory px-6 py-4 text-lg text-h2 shadow-sm transition-all duration-300 placeholder:text-placeholder focus:border-border-subtle focus:outline-none focus:ring-2 focus:ring-black/10"
                        disabled={isLoading}
                        autoComplete="off"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-card-sand/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-secondary">
                      <svg
                        className="h-4 w-4 text-h4"
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

                <div className="rounded-2xl border border-border-subtle bg-card-ivory p-5">
                  <div className="group relative">
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
                        className="w-full resize-vertical rounded-2xl border border-border-subtle bg-card-ivory px-6 py-4 text-lg text-h2 shadow-sm transition-all duration-300 placeholder:text-placeholder focus:border-border-subtle focus:outline-none focus:ring-2 focus:ring-black/10"
                        disabled={isLoading}
                        autoComplete="off"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-card-sand/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-secondary">
                      <svg
                        className="h-4 w-4 text-h4"
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
                <div className="absolute inset-0 rounded-2xl bg-card-sand/40"></div>
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
                  <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card-primary p-8 shadow-sm">
                    <div className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-card-sand/40 blur-3xl"></div>
                    <div className="pointer-events-none absolute -right-10 bottom-6 h-40 w-40 rounded-full bg-card-sand/40 blur-3xl"></div>
                    <div className="text-center">
                      <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-sand/50 p-3">
                        <svg
                          className="h-8 w-8 text-h2"
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
                        <h3 className="text-2xl font-bold text-h2">
                          Ready to Explore Roles
                        </h3>
                      </div>

                      <p className="mx-auto mb-8 max-w-2xl text-lg text-body">
                        Your resume &quot;{uploadedFile.name}&quot; has been
                        uploaded successfully. Click the button below to start
                        the AI-powered role-fit analysis and get personalized
                        career insights.
                      </p>

                      <button
                        onClick={analyzeResume}
                        disabled={isLoading}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-btn-primary px-12 py-4 text-xl font-bold text-btn-primary-text shadow-sm transition-all duration-300 hover:bg-btn-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
                      >
                        <div className="absolute inset-0 bg-card-clay/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative flex items-center gap-3">
                          {isLoading ? (
                            <>
                              <div className="relative">
                                <svg
                                  className="h-6 w-6 animate-spin"
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
                                <div className="absolute -inset-1 animate-pulse rounded-full bg-purple-400 opacity-60"></div>
                              </div>
                              <span>Analyzing Role Fit...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-6 w-6 transform transition-transform duration-300 group-hover:rotate-12"
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
                            <div className="mb-2 flex items-center justify-between text-sm text-secondary">
                              <span>Analysis Progress</span>
                              <span>{loadingProgress}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full">
                              <div
                                className="relative h-full rounded-full bg-card-clay transition-all duration-1000 ease-out"
                                style={{ width: `${loadingProgress}%` }}
                              >
                                <div className="absolute inset-0 animate-pulse bg-white/20"></div>
                              </div>
                            </div>
                          </div>

                          {loadingStage && (
                            <div className="rounded-xl border border-border-subtle p-6 backdrop-blur-sm">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="absolute -inset-1 animate-ping rounded-full bg-card-clay/30 opacity-30"></div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-lg font-medium text-h2">
                                    {loadingStage}
                                  </p>
                                  <p className="mt-1 text-sm text-secondary">
                                    Our AI is working hard to provide you with
                                    the best insights
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Chatbot Encouragement Message */}
                          <div className="mt-6 animate-pulse rounded-xl border border-border-subtle bg-card-sand/70 p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-card-clay shadow-sm">
                                    <svg
                                      className="h-6 w-6 text-card-ivory"
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
                                  <div className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full border-2 border-card-ivory bg-card-clay"></div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="mb-2 text-lg font-semibold text-h2">
                                  While You Wait - Chat with our AI Assistant!
                                </h3>
                                <p className="mb-4 text-sm leading-relaxed text-body">
                                  Analysis takes 2-3 minutes. Don&apos;t just
                                  wait - make the most of this time! Chat with
                                  our AI assistant about your career goals, get
                                  interview tips, or discuss your job search
                                  strategy.
                                </p>
                                <div className="mb-4 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center rounded-full border border-border-subtle bg-card-sand px-3 py-1 text-xs font-medium text-h4 transition-colors hover:bg-card-sand/90">
                                    Career advice
                                  </span>
                                  <span className="inline-flex items-center rounded-full border border-border-subtle bg-card-sand px-3 py-1 text-xs font-medium text-h4 transition-colors hover:bg-card-sand/90">
                                    Interview tips
                                  </span>
                                  <span className="inline-flex items-center rounded-full border border-border-subtle bg-card-sand px-3 py-1 text-xs font-medium text-h4 transition-colors hover:bg-card-sand/90">
                                    Job search help
                                  </span>
                                </div>
                                <div className="rounded-lg border border-border-subtle bg-card-sand p-4 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-emerald-400">
                                        <svg
                                          className="h-4 w-4 text-h2"
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
                                    <p className="text-sm font-medium text-body">
                                      Look for the{" "}
                                      <span className="font-semibold text-h2">
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

                          <div className="mt-6 flex justify-center gap-3">
                            <div className="h-3 w-3 animate-bounce rounded-full bg-card-clay"></div>
                            <div
                              className="h-3 w-3 animate-bounce rounded-full bg-card-clay"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="h-3 w-3 animate-bounce rounded-full bg-card-clay"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>

                          <div className="rounded-xl border border-border-subtle bg-card-sand/70 p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-card-clay">
                                <svg
                                  className="h-5 w-5 text-h2"
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
                                <h4 className="mb-2 font-semibold text-h2">
                                  Did you know?
                                </h4>
                                <p className="text-sm leading-relaxed text-body">
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
          <div className="fixed right-8 top-8 z-50 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-card-clay/10 opacity-30 blur-lg"></div>
              <div
                className={`relative rounded-2xl border p-6 shadow-2xl backdrop-blur-xl ${
                  alertType === "success"
                    ? "border-border-subtle bg-card-primary"
                    : "border-red-500/30 bg-card-primary"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-card-clay">
                    {alertType === "success" ? (
                      <svg
                        className="h-5 w-5 text-h2"
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
                        className="h-5 w-5 text-h2"
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
                    <p className="font-medium leading-relaxed text-h2">
                      {alertMessage}
                    </p>
                  </div>
                  <button
                    onClick={handleErrorClose}
                    className="flex-shrink-0 text-secondary transition-colors duration-200 hover:text-h2 focus:outline-none"
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
