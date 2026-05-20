import React, { useState, useEffect } from "react";
import { testimonials } from "@/data/testimonials";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  const handlePrev = () => {
    setAutoScroll(false);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setAutoScroll(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index) => {
    setAutoScroll(false);
    setCurrentIndex(index);
  };

  return (
    <section className="relative py-10 sm:py-16 page-force-light bg-card-ivory">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-h4 mb-3">
            Success Stories
          </h3>
          <h2 className="text-3xl font-semibold tracking-tight text-h2 sm:text-4xl lg:text-5xl">
            See how our AI-Based system transforms
            <br />
            <span className="text-h1">
              Career Readiness & Interview Success
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-base leading-8 text-body sm:text-lg">
            Real stories from professionals who have built confidence, improved
            documents, and found career clarity through intelligent interview
            preparation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "Career Path Exploration",
              "Professional Document Analysis",
              "AI-Assisted Interview Practice",
            ].map((label) => (
              <div
                key={label}
                className="inline-flex items-center px-4 py-2 rounded-full bg-card-sand text-h4 text-sm font-semibold border border-border-subtle"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <div className="relative overflow-hidden min-h-[34rem]">
              <div className="relative">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`w-full transition-opacity duration-500 ${
                      index === currentIndex
                        ? "opacity-100 relative"
                        : "opacity-0 absolute inset-0"
                    }`}
                  >
                    <div className="mx-auto max-w-3xl">
                      <div className="section-surface p-10 pt-16 rounded-[2rem] shadow-2xl transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                          <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full bg-card-sand opacity-60" />
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="relative w-16 h-16 rounded-full object-cover border border-border-subtle"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-2xl font-semibold text-h2">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-h3">
                              {testimonial.role}
                            </p>
                            <p className="text-sm text-secondary">
                              {testimonial.company}
                            </p>
                          </div>
                        </div>

                        <blockquote className="mb-8 max-w-2xl text-xl leading-relaxed text-body mx-auto">
                          “{testimonial.quote}”
                        </blockquote>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    index === currentIndex
                      ? "bg-card-dark w-4 h-4"
                      : "bg-card-sand w-3 h-3 hover:bg-card-clay"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-center mt-6">
              <span className="text-sm text-caption">
                {currentIndex + 1} / {testimonials.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
