import { motion } from 'framer-motion';
import { glowMove } from '../utils/glow';
import flaskSketch from '../assets/flask-sketch.jpg';
import buildingSketch from '../assets/building-sketch.jpg';
import styles from './HowItWorks.module.css';

/**
 * HowItWorks: Two sections showing the step-by-step process
 * for startups (sand background) and landlords (white background).
 * Includes two-column layouts featuring custom architectural sketches with clip-path draw animations.
 */

const startupSteps = [
  {
    number: '01',
    title: 'Tell us what you need.',
    description:
      'Your sector, budget, team size, and containment requirements. It takes less than five minutes.',
  },
  {
    number: '02',
    title: 'We filter and match.',
    description:
      'Deterministic compliance checks first, then AI-powered scoring to surface the best-fit spaces.',
  },
  {
    number: '03',
    title: 'Review curated options.',
    description:
      "A shortlist of vetted labs, each with a Broker's Rationale explaining why it suits your research.",
  },
  {
    number: '04',
    title: 'Move in.',
    description:
      'We handle the warm introductions and support you through to lease signing.',
  },
];

const landlordSteps = [
  {
    number: '01',
    title: 'List your space.',
    description:
      'Upload a spec sheet, brochure, or floor plan in any format. No rigid forms to fill.',
  },
  {
    number: '02',
    title: 'AI parses your listing.',
    description:
      'Our system reads your documents and extracts the key details automatically.',
  },
  {
    number: '03',
    title: 'Receive qualified tenants.',
    description:
      'Every startup we present has been compliance-checked and financially vetted.',
  },
  {
    number: '04',
    title: 'Close the deal.',
    description:
      'We manage the introduction and support the lease lifecycle from offer to completion.',
  },
];

/**
 * Renders a single step row with scroll animation.
 */
function Step({ step, index, direction = 'left' }) {
  const xOffset = direction === 'left' ? -30 : 30;

  return (
    <motion.div
      className={styles.step}
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.1 }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <span className={styles.stepNumber}>{step.number}</span>
      <div className={styles.stepContent}>
        <h3 className={styles.stepTitle}>{step.title}</h3>
        <p className={styles.stepDescription}>{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const sketchAnimation = {
    hidden: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.8 },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      {/* Startups section */}
      <section id="startups" className={`${styles.section} ${styles.sectionStartups}`}>
        <div className="section-container">
          <div className={styles.grid}>
            {/* Steps column */}
            <div className={styles.columnSteps}>
              <h2 className={styles.heading}>How LabMatch works for startups</h2>
              <div className={styles.steps}>
                {startupSteps.map((step, i) => (
                  <Step key={step.number} step={step} index={i} direction="left" />
                ))}
              </div>
              <div className={styles.ctaWrapper}>
                <a href="#contact" className="cta-button">Find your lab</a>
              </div>
            </div>

            {/* Sketch Column */}
            <div className={styles.columnVisual}>
              <div className={`${styles.sketchCard} glow`} onMouseMove={glowMove}>
                <motion.img 
                  src={flaskSketch} 
                  alt="Original detailed pencil sketch of biology flask and DNA helix"
                  className={styles.sketchImage}
                  variants={sketchAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-80px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landlords section */}
      <section id="landlords" className={`${styles.section} ${styles.sectionLandlords}`}>
        <div className="section-container">
          <div className={styles.grid}>
            {/* Sketch Column (Left on desktop) */}
            <div className={`${styles.columnVisual} ${styles.orderMobileSecond}`}>
              <div className={`${styles.sketchCard} glow`} onMouseMove={glowMove}>
                <motion.img 
                  src={buildingSketch} 
                  alt="Original detailed pencil sketch of modern lab building"
                  className={styles.sketchImage}
                  variants={sketchAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-80px' }}
                />
              </div>
            </div>

            {/* Steps column */}
            <div className={styles.columnSteps}>
              <h2 className={styles.heading}>How LabMatch works for landlords</h2>
              <div className={styles.steps}>
                {landlordSteps.map((step, i) => (
                  <Step key={step.number} step={step} index={i} direction="right" />
                ))}
              </div>
              <div className={styles.ctaWrapper}>
                <a href="#contact" className="cta-button cta-button--outline">
                  List your lab
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
