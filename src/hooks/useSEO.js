import { useEffect } from "react";

const BASE_URL = "https://jobpsych.vercel.app";
const DEFAULT_TITLE =
  "JobPsych - AI-Based Career Readiness and Interview Preparation System";
const DEFAULT_DESCRIPTION =
  "Comprehensive AI-based career readiness platform: Career Path Exploration, Professional Document Analysis, and AI-Assisted Interview Practice for complete career success.";
const DEFAULT_KEYWORDS =
  "AI career readiness, interview preparation, career path exploration, resume optimization, AI interview practice, job readiness";
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;

/**
 * useSEO - Dynamically update page-level SEO metadata for every route.
 *
 * @param {object} options
 * @param {string} [options.title]          - Page <title>. Defaults to site title.
 * @param {string} [options.description]    - Meta description. Max ~160 chars.
 * @param {string} [options.keywords]       - Comma-separated keywords string.
 * @param {string} [options.canonical]      - Canonical URL path (e.g. "/role-suggestions").
 * @param {string} [options.ogImage]        - Absolute OG image URL.
 * @param {boolean} [options.noIndex]       - If true, adds noindex,nofollow robots directive.
 * @param {object} [options.jsonLd]         - Page-specific JSON-LD structured data object.
 */
const useSEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  noIndex = false,
  jsonLd,
} = {}) => {
  useEffect(() => {
    const resolvedTitle = title || DEFAULT_TITLE;
    const resolvedDescription = description || DEFAULT_DESCRIPTION;
    const resolvedKeywords = keywords || DEFAULT_KEYWORDS;
    const resolvedImage = ogImage || DEFAULT_IMAGE;
    const resolvedCanonical = canonical
      ? `${BASE_URL}${canonical}`
      : BASE_URL + "/";

    // ── Title ──────────────────────────────────────────────────────────────
    document.title = resolvedTitle;

    // ── Helper: upsert a <meta> tag ────────────────────────────────────────
    const setMeta = (selector, attribute, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attr, attrValue] = selector
          .replace(/[\[\]"]/g, "")
          .split("=");
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
    };

    // ── Helper: upsert a <link> tag ────────────────────────────────────────
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // ── Standard meta ──────────────────────────────────────────────────────
    setMeta('meta[name="title"]', "content", resolvedTitle);
    setMeta('meta[name="description"]', "content", resolvedDescription);
    setMeta('meta[name="keywords"]', "content", resolvedKeywords);
    setMeta(
      'meta[name="robots"]',
      "content",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    );

    // ── Canonical ──────────────────────────────────────────────────────────
    setLink("canonical", resolvedCanonical);

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]', "content", resolvedTitle);
    setMeta(
      'meta[property="og:description"]',
      "content",
      resolvedDescription
    );
    setMeta('meta[property="og:url"]', "content", resolvedCanonical);
    setMeta('meta[property="og:image"]', "content", resolvedImage);

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta('meta[property="twitter:title"]', "content", resolvedTitle);
    setMeta(
      'meta[property="twitter:description"]',
      "content",
      resolvedDescription
    );
    setMeta(
      'meta[property="twitter:url"]',
      "content",
      resolvedCanonical
    );
    setMeta('meta[property="twitter:image"]', "content", resolvedImage);

    // ── Per-page JSON-LD ───────────────────────────────────────────────────
    const JSON_LD_ID = "seo-page-jsonld";
    let jsonLdScript = document.getElementById(JSON_LD_ID);

    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement("script");
        jsonLdScript.id = JSON_LD_ID;
        jsonLdScript.type = "application/ld+json";
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      // Remove page-specific JSON-LD if navigating to a page without one
      jsonLdScript.remove();
    }

    // ── Cleanup on unmount ─────────────────────────────────────────────────
    return () => {
      // Restore defaults when component unmounts (route change)
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="robots"]', "content", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    };
  }, [title, description, keywords, canonical, ogImage, noIndex, jsonLd]);
};

export default useSEO;
