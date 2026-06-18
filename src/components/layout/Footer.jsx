import React from "react";

const Footer = () => {
  return (
    <footer
      className="relative page-force-light border-t border-border-subtle"
      style={{ backgroundColor: "rgba(245, 242, 234, 0.8)" }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-card-sand rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-card-clay rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-card-linen rounded-full blur-2xl opacity-40"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
          <div className="section-surface p-6">
            <h3 className="text-lg font-semibold text-h2 mb-4">
              About JobPsych
            </h3>
            <p className="text-body text-sm leading-relaxed">
              An AI-Based Career Readiness and Interview Preparation System
              offering comprehensive solutions through:
              <span className="block mt-2">
                • Career Path Exploration Module
              </span>
              <span className="block">
                • Professional Document Analysis Module
              </span>
              <span className="block">
                • AI-Assisted Interview Practice Module
              </span>
            </p>
          </div>
          <div className="section-surface p-6">
            <h3 className="text-lg font-semibold text-h2 mb-4">Core Modules</h3>
            <ul className="text-body space-y-3 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-card-clay rounded-full mr-3" />
                Career Path Exploration
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-card-sand rounded-full mr-3" />
                Professional Document Analysis
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-card-ivory rounded-full mr-3" />
                AI-Assisted Interview Simulation
              </li>
            </ul>
          </div>
          <div className="section-surface p-6">
            <h3 className="text-lg font-semibold text-h2 mb-4">
              Explore Modules
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Career Path Exploration",
                  to: "/role-suggestions",
                },
                {
                  label: "Document Analysis",
                  to: "/ats-analyzer",
                },
                {
                  label: "Interview Practice",
                  to: "/interview-prep",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.to}
                  className="group flex items-center w-full p-3 rounded-xl border border-border-subtle bg-card-linen text-body hover:bg-card-ivory transition-all duration-300 no-underline"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <svg
                    className="w-4 h-4 ml-auto transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap items-center gap-6 mb-4 md:mb-0 text-body text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-card-clay rounded-full" />
                <span>Active Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-h2">15K+</span>
                <span>Happy Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-h2">94%</span>
                <span>Success Rate</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-body text-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-h4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2">4.9/5 Rating</span>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-caption text-xs leading-5">
              &copy; {new Date().getFullYear()} JobPsych. All rights reserved.
              <span className="mx-2">•</span>
              Your data remains private and protected.
              <span className="mx-2">•</span>
              <a
                href="/privacy-policy"
                className="text-link hover:text-h2 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <span className="mx-2">•</span>
              <a
                href="/terms-of-service"
                className="text-link hover:text-h2 transition-colors duration-300"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
