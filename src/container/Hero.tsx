import TerminalText from "../components/TerminalText";
import { HiArrowRight } from "react-icons/hi";

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero__content hero__content--animate">
        <p className="hero__prompt hero__prompt--animate">
          {">"} narun@console:~$
        </p>

        <h1 className="hero__title">
          <TerminalText
            text="I turn demos into production."
            speed={40}
            delay={500}
            showCursor={true}
          />
        </h1>

        <div className="hero__subtitle hero__subtitle--animate">
          <p className="hero__hook">
            Demos don&apos;t close deals. Production does.
          </p>
          <p className="hero__proof">
            Voice AI · LLM · PCI &amp; SOC — 4 years shipping at YC startups.
          </p>
        </div>

        <a href="#final-cta" className="hero__cta hero__cta--animate">
          Let&apos;s talk about your problem
          <HiArrowRight />
        </a>
      </div>
    </section>
  );
};

export default Hero;
