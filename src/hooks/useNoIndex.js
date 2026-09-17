import { useEffect } from "react";

/**
 * Marks the page as noindex, nofollow for search engines.
 * Updates the existing robots meta in place (restoring it on unmount)
 * instead of appending a conflicting duplicate tag.
 */
export default function useNoIndex() {
  useEffect(() => {
    let el = document.querySelector('meta[name="robots"]');
    const created = !el;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      document.head.appendChild(el);
    }
    const previous = el.getAttribute("content");
    el.setAttribute("content", "noindex, nofollow");
    return () => {
      if (created) {
        el.remove();
      } else if (previous !== null) {
        el.setAttribute("content", previous);
      }
    };
  }, []);
}