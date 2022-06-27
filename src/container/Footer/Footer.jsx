import { AppWrap, MotionWrap } from "../../wrapper";
import { BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs";
import { SiLeetcode, SiGmail, SiGooglehangouts } from "react-icons/si";
import "./Footer.scss";

const Footer = () => {
  return (
    <>
      <h2 className="head-text">Connect with me</h2>

      <div className="app__footer-cards">
        <div className="app__footer-card ">
          <SiGmail />
          <a href="mailto:n.y.narun@gmail.com" className="p-text">
            <span>&nbsp;&nbsp;&nbsp;</span>n.y.narun@gmail.com
          </a>
        </div>
        <div className="app__footer-card">
          <SiGooglehangouts />
          <a href="tel:+919521158199" className="p-text">
            <span>&nbsp;&nbsp;&nbsp;</span>+91 95211-58199
          </a>
        </div>
        <div className="app__social2">
          <div>
            <a href="https://www.linkedin.com/in/narunyadav/" target={"_blank"}>
              <BsLinkedin />
            </a>
          </div>
          <div>
            <a href="https://twitter.com/NarunYadav/" target={"_blank"}>
              <BsTwitter />
            </a>
          </div>
          <div>
            <a href="https://github.com/yadavnarun/" target={"_blank"}>
              <BsGithub />
            </a>
          </div>
          <div>
            <a href="https://leetcode.com/narun/" target={"_blank"}>
              <SiLeetcode />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, "app__footer"),
  "contact",
  "app__whitebg"
);
