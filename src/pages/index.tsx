import type { NextPage } from "next";
import Head from "next/head";
import { Navbar } from "../components";
import Hero from "../container/Hero";
import Problem from "../container/Problem";
import Credibility from "../container/Credibility";
import Services from "../container/Services";
import Proof from "../container/Proof";
import FinalCTA from "../container/FinalCTA";

const Home: NextPage = () => {
  return (
    <div className="app">
      <Head>
        <title>Narun Yadav | Technical Consultant</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Founding Engineer for hire. I build MVPs, AI systems, and production infrastructure for YC-backed startups. $500K+/month in automated collections. 100K+ calls processed."
        />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Hero />
      <Problem />
      <Credibility />
      <Services />
      <Proof />
      <FinalCTA />
      <footer className="footer">
        <p className="footer__text">
          &copy; {new Date().getFullYear()} Narun Yadav. Built with intention.
        </p>
      </footer>
    </div>
  );
};

export default Home;
