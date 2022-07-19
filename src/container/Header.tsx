import { motion } from "framer-motion";

import { AppWrap } from "../wrapper";
import { images } from "../constants";
import { HiDownload } from "react-icons/hi";
import Image from "next/image";

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

const Header = () => (
  <div className="app__header app__flex">
    <motion.div
      whileInView={{ x: [-100, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      className="app__header-info"
    >
      <div className="app__header-badge">
        <div className="badge-cmp app__flex">
          <span>👋</span>
          <div style={{ marginLeft: 20 }}>
            <p className="p-text">Hello, I am</p>
            <h1 className="head-text">Narun</h1>
          </div>
        </div>

        <div className="tag-cmp app__flex">
          <p className="p-text">
            <a
              href="https://rebrand.ly/narunyadav"
              target={"_blank"}
              rel="noreferrer"
            >
              <HiDownload />
              &nbsp;&nbsp; resume
            </a>
          </p>
        </div>
      </div>
    </motion.div>

    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, delayChildren: 0.5 }}
      className="app__header-img"
    >
      <motion.div
        whileInView={{ scale: [0, 1] }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="overlay_circle"
      >
        <Image
          src={images.circle}
          alt="profile_circle"
          loading="eager"
          layout="fill"
        />
      </motion.div>
    </motion.div>

    <motion.div
      variants={scaleVariants}
      whileInView={scaleVariants.whileInView}
      className="app__header-circles"
    >
      {[images.javascript, images.node, images.api].map((circle, index) => (
        <div className="circle-cmp app__flex" key={`circle-${index}`}>
          <Image
            src={circle}
            alt={`${circle}`}
            objectFit="cover"
            width="75"
            height="75"
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
    <motion.div
      variants={scaleVariants}
      whileInView={scaleVariants.whileInView}
      className="app__header-circles"
    >
      {[images.react, images.git].map((circle, index) => (
        <div className="circle-cmp app__flex" key={`circle-${index}`}>
          <Image
            src={circle}
            alt={`${circle}`}
            objectFit="cover"
            width="75"
            height="75"
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  </div>
);

export default AppWrap(Header, "home", "");
