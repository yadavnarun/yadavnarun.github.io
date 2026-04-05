import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import AnimateIn from "../components/AnimateIn";

const caseStudies = [
  {
    company: "Rifa",
    role: "Founding Engineer",
    summary:
      "Rebuilt the voice bot from scratch on state machines and WebSockets — 50% lower latency, 100K+ monthly calls. Designed PCI DSS card capture with a BERT classifier (no generative model in the data path). Built in-house ASR processing 25K calls/day.",
    details: [
      "Rebuilt voice bot on state machines and WebSockets — 50% lower latency, 100K+ monthly calls",
      "PCI DSS card capture with BERT classifier — no generative model in the data path",
      "In-house ASR processing 25K calls/day",
      "Graph-based testing framework: HDBSCAN-driven test case generation from production conversations, structured LLM tool call logging, static/dynamic flow validation",
      "Live credential compromise → restructured attack surface with VPN-gated access controls, hardened perimeter; no further security incidents",
      "GCP migration, Kubernetes deployment with full observability (OpenTelemetry, SignOz), reducing infrastructure downtime",
      "Evaluated 10+ TTS models → Kyutai streaming model eliminated buffering entirely: 800ms → 250ms latency",
    ],
    metrics: ["$500K+/mo recovery", "100K+ calls/mo", "70% latency cut", "25K calls/day"],
  },
  {
    company: "Floworks (YC W23)",
    role: "Founding Engineer",
    summary:
      "Built the function calling execution engine (arXiv 2410.17950) — parallel/async tool orchestration benchmarked against OpenAI and Anthropic. Earlier, built the WhatsApp platform that attracted $250K in LOIs and contributed to YC W23 acceptance.",
    details: [
      "Function calling execution engine (arXiv 2410.17950) — parallel/async tool orchestration benchmarked against OpenAI and Anthropic",
      "WhatsApp platform that attracted $250K in LOIs and contributed to YC W23 acceptance",
      "Autonomous cold email and LinkedIn agent: campaign execution, multi-database lead enrichment, follow-up sequencing, >2% meeting booking rate at scale",
      "Led the technical pivot from WhatsApp to cold outreach — built the campaign, sequencing, and meeting-booking infrastructure",
      "AWS infrastructure at 99.95% uptime under SOC compliance, Terraform IaC, GitHub Actions CI/CD",
    ],
    metrics: ["arXiv 2410.17950", "YC W23", "$250K LOI pipeline", "99.95% uptime"],
  },
];

const Proof = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="proof" id="proof">
      <div className="container">
        <AnimateIn className="proof__header">
          <h2 className="proof__title">Where I&apos;ve shipped</h2>
          <button
            className="proof__toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>Less <HiChevronUp /></>
            ) : (
              <>Details <HiChevronDown /></>
            )}
          </button>
        </AnimateIn>

        <div className="proof__grid">
          {caseStudies.map((study, index) => (
            <AnimateIn
              key={index}
              className={`proof__card ${expanded ? "proof__card--expanded" : ""}`}
            >
              <p className="proof__card-company">{study.company}</p>
              <h3 className="proof__card-role">{study.role}</h3>

              <div className="proof__card-body">
                <p className="proof__card-desc">{study.summary}</p>
                <ul className="proof__card-details">
                  {study.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div className="proof__card-metrics">
                {study.metrics.map((metric, i) => (
                  <span key={i} className="proof__card-metric">
                    {metric}
                  </span>
                ))}
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proof;
