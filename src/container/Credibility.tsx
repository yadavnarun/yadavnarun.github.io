import { useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";
import AnimateIn from "../components/AnimateIn";

const metrics = [
  { target: 500, prefix: "$", suffix: "K+", label: "monthly debt recovery" },
  { target: 100, prefix: "", suffix: "K+", label: "monthly calls & chats" },
  { target: 70, prefix: "", suffix: "%", label: "latency reduction" },
  { value: "arXiv", label: "2410.17950", accent: true },
];

function useCounter(target: number, isInView: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || !target) return;

    let start = 0;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (current !== start) {
        start = current;
        setCount(current);
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return count;
}

const CounterMetric = ({ metric, isInView }: {
  metric: typeof metrics[0];
  isInView: boolean;
}) => {
  const count = useCounter("target" in metric ? metric.target! : 0, isInView);

  if ("value" in metric && metric.value) {
    return (
      <>
        <p className="credibility__metric">{metric.value}</p>
        <p className="credibility__label-text">{metric.label}</p>
      </>
    );
  }

  return (
    <>
      <p className="credibility__metric">
        {"prefix" in metric ? metric.prefix : ""}{count}{"suffix" in metric ? metric.suffix : ""}
      </p>
      <p className="credibility__label-text">{metric.label}</p>
    </>
  );
};

const Credibility = () => {
  const { ref, isInView } = useInView();

  return (
    <section
      className="credibility"
      id="credibility"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="credibility__grid">
          {metrics.map((metric, index) => (
            <AnimateIn
              key={index}
              className={`credibility__card ${metric.accent ? "credibility__card--accent" : ""}`}
            >
              <CounterMetric metric={metric} isInView={isInView} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credibility;
