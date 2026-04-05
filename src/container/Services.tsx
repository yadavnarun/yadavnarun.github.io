import AnimateIn from "../components/AnimateIn";

const services = [
  {
    number: "01",
    title: "MVP Sprint",
    description:
      "6-8 weeks. Idea to deployed product. Tech stack that scales. No technical debt.",
    ideal: "Pre-seed with funding, no technical co-founder",
    cta: "Book MVP Call",
    topic: "mvp",
  },
  {
    number: "02",
    title: "AI Integration",
    description:
      "Voice AI. LLM pipelines. ASR systems. Function calling. Production-grade, not demo-grade.",
    ideal: "Seed+ startups adding AI features that need to actually work",
    cta: "Book AI Call",
    topic: "ai",
  },
  {
    number: "03",
    title: "Compliance & Security",
    description:
      "PCI DSS. SOC2 prep. Security hardening. The stuff blocking your enterprise deals.",
    ideal: "Startups blocked on enterprise sales by compliance",
    cta: "Book Compliance Call",
    topic: "compliance",
  },
  {
    number: "04",
    title: "Architecture Review",
    description:
      "Deep dive into your codebase. What breaks at scale. How to fix it. Kubernetes. Infra. State machines.",
    ideal: "Series A+ needing external validation before major decisions",
    cta: "Book Review Call",
    topic: "review",
  },
];

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="container">
        <AnimateIn className="services__header">
          <h2 className="services__title">What I build</h2>
        </AnimateIn>

        <div className="services__grid">
          {services.map((service, index) => (
            <AnimateIn
              key={index}
              className="services__card"
            >
              <div className="services__card-header">
                <h3 className="services__card-title">{service.title}</h3>
                <span className="services__card-number">{service.number}</span>
              </div>
              <p className="services__card-desc">{service.description}</p>
              <p className="services__card-ideal">
                <strong>IDEAL FOR:</strong> {service.ideal}
              </p>
              <a
                href={`?topic=${service.topic}#final-cta`}
                className="services__card-cta"
              >
                {service.cta}
              </a>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
