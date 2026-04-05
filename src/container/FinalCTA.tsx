import { useEffect, useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import { useInView } from "../hooks/useInView";

const EMAIL = "mail@narun.in";

const FinalCTA = () => {
  const { ref, isInView } = useInView();
  const [meetUrl, setMeetUrl] = useState("https://l.narun.in/meet");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");
    if (topic) {
      setMeetUrl(`https://l.narun.in/meet?topic=${topic}`);
    }
  }, []);

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      className={`final-cta ${isInView ? "in-view" : ""}`}
      id="final-cta"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="final-cta__container">
        <p className="final-cta__label">Limited availability</p>
        <h2 className="final-cta__title">
          Let&apos;s build something together
        </h2>

        <div className="final-cta__availability">
          <span className="final-cta__availability-dot" />
          <span>Currently available for projects</span>
        </div>

        <a
          href={meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="final-cta__button"
        >
          Schedule a 30-min call
          <HiArrowRight />
        </a>

        <p className="final-cta__subtext">
          No pitch. No BS.
          <br />
          Just: your problem, my take, whether I can help.
        </p>

        <p className="final-cta__email">
          Or email directly:{" "}
          <a href={`mailto:${EMAIL}`} onClick={copyEmail}>
            {copied ? "copied!" : EMAIL}
          </a>
          {" "}·{" "}
          <a href="https://l.narun.in/resume" target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
