import type { NextPage } from "next";
import Head from "next/head";
import { Navbar } from "../components";
import { Header, About, Work, Skills, Footer } from "../container";
import Script from "next/script";

const Home: NextPage = () => {
  return (
    <div className="app">
      <Head>
        <title>Narun Yadav</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Narun Yadav personal website. learn more about narun yadav. about, works, skills, contact"
        />
        <meta name="theme-color" content="#e4e4e4" />
      </Head>
      <div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N7CQJ7QBGK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-N7CQJ7QBGK');
        `}
        </Script>
      </div>
      <Navbar />
      <Header />
      <About />
      <Work />
      <Skills />
      <Footer />
    </div>
  );
};

export default Home;
