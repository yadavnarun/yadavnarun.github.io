import { motion } from 'framer-motion';
import ReactTooltip from 'react-tooltip';

import { AppWrap, MotionWrap } from '../../wrapper';
import { images } from '../../constants';
import './Skills.scss';

const Skills = () => {
  const experiences = [
    // {
    //   year: '2020',
    //   works: [{ name: 'lol', company: 'lollol', desc: 'dkajsdnaksjd' }],
    // },
  ];
  const skills = [
    {
      name: 'JavaScript',
      bgColor: '#ffffb3',
      icon: 'javascript',
    },
    {
      name: 'TypeScript',
      bgColor: '#b3c6ff',
      icon: 'typescript',
    },
    {
      name: 'ReactJs',
      bgColor: '#c2f0f0',
      icon: 'react',
    },
    {
      name: 'Sass',
      bgColor: '#ffccf2',
      icon: 'sass',
    },
    {
      name: 'NodeJs',
      bgColor: '#8cd9b3',
      icon: 'node',
    },
    {
      name: 'GoLang',
      bgColor: '#cceeff',
      icon: 'golang',
    },
    {
      name: 'Python',
      bgColor: '#ffffe6',
      icon: 'python',
    },
    {
      name: 'Git',
      bgColor: '#ffcccc',
      icon: 'git',
    },
    {
      name: 'Docker',
      bgColor: '#b3d9ff',
      icon: 'docker',
    },
    {
      name: 'Figma',
      bgColor: '#f0f5f5',
      icon: 'figma',
    },
  ];

  return (
    <>
      <h2 className="head-text">Skills & Experiences</h2>

      <div className="app__skills-container">
        <motion.div className="app__skills-list">
          {skills.map((skill) => (
            <motion.div
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
              className="app__skills-item app__flex"
              key={skill.name}
            >
              <div
                className="app__flex"
                style={{ backgroundColor: skill.bgColor }}
              >
                <img src={images[skill.icon]} alt={skill.name} />
              </div>
              <p className="p-text">{skill.name}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="app__skills-exp">
          {experiences.map((experience) => (
            <motion.div className="app__skills-exp-item" key={experience.year}>
              <div className="app__skills-exp-year">
                <p className="bold-text">{experience.year}</p>
              </div>
              <motion.div className="app__skills-exp-works">
                {experience.works.map((work) => (
                  <>
                    <motion.div
                      whileInView={{ opacity: [0, 1] }}
                      transition={{ duration: 0.5 }}
                      className="app__skills-exp-work"
                      data-tip
                      data-for={work.name}
                      key={work.name}
                    >
                      <h4 className="bold-text">{work.name}</h4>
                      <p className="p-text">{work.company}</p>
                    </motion.div>
                    <ReactTooltip
                      id={work.name}
                      effect="solid"
                      arrowColor="#fff"
                      className="skills-tooltip"
                    >
                      {work.desc}
                    </ReactTooltip>
                  </>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(Skills, 'app__skills'),
  'skills',
  'app__whitebg'
);
