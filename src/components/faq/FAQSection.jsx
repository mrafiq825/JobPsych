import React from "react";
import { faqs } from "@data/faqs";
import FAQDropdown from "@components/faq/FAQDropdown";

const FAQSection = () => {
  return (
    <section className="relative py-10 sm:py-16 page-force-light">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(245, 242, 234, 0.9)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 rounded-full section-label-pill mb-6">
            <span>Common Questions</span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-h2 sm:text-4xl">
            Everything you need to know about
            <br />
            <span className="text-h1">
              AI-Based Career Readiness and Interview Preparation
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-body">
            Get answers to common questions about our comprehensive system:
            Career Path Exploration, Professional Document Analysis, and
            AI-Assisted Interview Practice.
          </p>
        </div>
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, index) => (
            <FAQDropdown
              key={index}
              question={faq.question}
              answer={faq.answer}
              type={faq.type || "general"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
