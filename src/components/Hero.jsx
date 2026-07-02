import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import floorplanSketch from '../assets/floorplan-sketch.jpg';
import styles from './Hero.module.css';

/**
 * Hero: Full-viewport hero section.
 * Centred "LabMatch." heading with a pencil-sketch floor plan
 * that fades and scales on scroll.
 */
export default function Hero() {
  const heroRef = useRef(null);

  // Track scroll progress within the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Floor plan: fade out and scale up as user scrolls
  const sketchOpacity = useTransform(scrollYProgress, [0, 0.5], [0.13, 0]);
  const sketchScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  // Heading: subtle parallax (moves slower than scroll)
  const headingY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Floor plan sketch background */}
      <motion.div
        className={styles.sketchWrapper}
        style={{ opacity: sketchOpacity, scale: sketchScale }}
      >
        <img
          src={floorplanSketch}
          alt=""
          className={styles.sketch}
          aria-hidden="true"
        />
      </motion.div>

      {/* Centred heading content */}
      <motion.div className={styles.content} style={{ y: headingY }}>
        <h1 className={styles.heading}>LabMatch.</h1>
        <p className={styles.subtitle}>Lab space, matched to your science.</p>
      </motion.div>
    </section>
  );
}
