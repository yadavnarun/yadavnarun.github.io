import { useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";

const problems = [
  "Your MVP needs to ship in 6 weeks. Your team is 8 weeks away.",
  "You raised a round. Now you need to actually build the thing.",
  'Your "AI feature" is a demo. It needs to ship.',
  "Compliance is blocking your enterprise deal. PCI. SOC2.",
  "Your infra is duct tape. It works until it doesn't.",
  "You patched the security hole. But the architecture is still exposed.",
];

const Problem = () => {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const { ref, isInView } = useInView();

  // Auto-check a random one after scroll
  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * problems.length);
      setChecked(new Set([randomIndex]));
    }, 2000);

    return () => clearTimeout(timer);
  }, [isInView]);

  const toggleCheck = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section
      className={`problem ${isInView ? "in-view" : ""}`}
      id="problem"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="problem__header">
          <h2 className="problem__title">You&apos;re here because:</h2>
        </div>

        <div className="problem__list">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`problem__item ${
                checked.has(index) ? "problem__item--checked" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => toggleCheck(index)}
            >
              <div className="problem__checkbox" />
              <span>{problem}</span>
            </div>
          ))}
        </div>

        <p className="problem__conclusion">I fix these.</p>
      </div>
    </section>
  );
};

export default Problem;
