import { motion } from "framer-motion";
import { AppWrap, MotionWrap } from "../../wrapper";
import { images } from "../../constants";
import "./About.scss";

const About = () => {
  const abouts = [
    {
      imgUrl: "about01",
      title: "Frontend Developer",
      description:
        "I am a frontend developer  with a passion of building beautiful and functional web applications.",
    },
    {
      imgUrl: "about02",
      title: "Backend Developer",
      description:
        "Backend developer with a passion of building functional web applications with dynamic data.",
    },
    {
      imgUrl: "about03",
      title: "DevOps",
      description:
        "Building CI/CD pipelines and deploying apps to production that can scale",
    },
  ];

  return (
    <>
      <h2 className="head-text">
        I Know <span>Development</span> <br />
        build <span>Scalable & Performant Web Applications</span>
      </h2>

      <div className="app__profiles">
        {abouts.map((about, index) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="app__profile-item"
            key={about.title + index}
          >
            <img src={images[about.imgUrl]} alt={about.title} />
            <h2 className="bold-text" style={{ marginTop: 20 }}>
              {about.title}
            </h2>
            <p className="p-text" style={{ marginTop: 10 }}>
              {about.description}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(About, "app__about"),
  "about",
  "app__whitebg"
);
