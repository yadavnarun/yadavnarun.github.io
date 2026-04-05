import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const isMobile = window.innerWidth <= 768;
    const defaults: IntersectionObserverInit = {
      threshold: isMobile ? 0.02 : 0.05,
      rootMargin: isMobile ? "-20px 0px" : "-60px 0px",
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { ...defaults, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
