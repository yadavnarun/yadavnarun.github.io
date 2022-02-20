import React from 'react';
import { BsTwitter, BsLinkedin } from 'react-icons/bs';

const SocialMedia = () => (
  <div className="app__social">
    <div>
      <a href="https://www.linkedin.com/in/narunyadav/" target={'_blank'}>
        <BsLinkedin />
      </a>
    </div>
    <div>
      <a href="https://twitter.com/NarunYadav" target={'_blank'}>
        <BsTwitter />
      </a>
    </div>
  </div>
);

export default SocialMedia;
