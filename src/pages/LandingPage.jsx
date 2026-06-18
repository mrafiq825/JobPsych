import React from "react";
import Footer from "@components/layout/Footer";
import HeroSection from "@components/hero/HeroSection";
import FAQSection from "@components/faq/FAQSection";
import TestimonialsSection from "@components/testimonials/TestimonialsSection";
import Header from "@components/layout/Header";
import useSEO from "@hooks/useSEO";

const LandingPage = () => {
  useSEO({
    title:
      "JobPsych - AI Career Readiness & Interview Preparation Platform",
    description:
      "JobPsych is your all-in-one AI career readiness platform. Explore career paths, optimize your resume with ATS analysis, and practice interviews with real-time AI feedback. Land your dream job faster.",
    keywords:
      "AI career readiness, interview preparation platform, career path exploration, resume ATS checker, AI mock interview, job readiness tool, career development AI, resume optimization, interview coaching, career transition tool",
    canonical: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://jobpsych.vercel.app/#website",
          url: "https://jobpsych.vercel.app/",
          name: "JobPsych",
          description:
            "AI-Based Career Readiness and Interview Preparation System",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://jobpsych.vercel.app/role-suggestions?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@type": "Organization",
          "@id": "https://jobpsych.vercel.app/#organization",
          name: "JobPsych",
          url: "https://jobpsych.vercel.app/",
          logo: {
            "@type": "ImageObject",
            url: "https://jobpsych.vercel.app/logo.png",
          },
          sameAs: [],
        },
        {
          "@type": "WebPage",
          "@id": "https://jobpsych.vercel.app/#webpage",
          url: "https://jobpsych.vercel.app/",
          name: "JobPsych - AI Career Readiness & Interview Preparation Platform",
          isPartOf: { "@id": "https://jobpsych.vercel.app/#website" },
          about: { "@id": "https://jobpsych.vercel.app/#organization" },
          description:
            "Comprehensive AI-based career readiness platform with Career Path Exploration, ATS Resume Analysis, and AI Interview Practice modules.",
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://jobpsych.vercel.app/",
              },
            ],
          },
        },
      ],
    },
  });

  return (
    <div className="min-h-screen page-force-light">
      <Header />
      <HeroSection />
      <FAQSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

