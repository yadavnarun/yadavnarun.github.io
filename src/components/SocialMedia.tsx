import { BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs";
import { SiLeetcode } from "react-icons/si";

const SocialMedia = () => (
  <div className="app__social">
    <div>
      <a
        href="https://www.linkedin.com/in/narunyadav/"
        target={"_blank"}
        rel="noreferrer"
      >
        <BsLinkedin />
      </a>
    </div>
    <div>
      <a
        href="https://twitter.com/NarunYadav/"
        target={"_blank"}
        rel="noreferrer"
      >
        <BsTwitter />
      </a>
    </div>
    <div>
      <a
        href="https://github.com/yadavnarun/"
        target={"_blank"}
        rel="noreferrer"
      >
        <BsGithub />
      </a>
    </div>
    <div>
      <a href="https://leetcode.com/narun/" target={"_blank"} rel="noreferrer">
        <SiLeetcode />
      </a>
    </div>
  </div>
);

export default SocialMedia;
