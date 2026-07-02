import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ThreeFloorPlan from './ThreeFloorPlan';
import styles from './Hero.module.css';

/**
 * Hero: Full-viewport hero section.
 * Centres the "LabMatch." heading over a slowly rotating 3D model
 * of the lab floor plan that scales and fades on scroll.
 */
export default function Hero() {
  const heroRef = useRef(null);

  // Track scroll progress within the hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // 3D canvas wrapper: fade out and scale up as user scrolls
  const sketchOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0]); // increased opacity slightly for 3D visibility
  const sketchScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Heading: subtle parallax (moves slower than scroll)
  const headingY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* 3D floor plan canvas background */}
      <motion.div
        className={styles.sketchWrapper}
        style={{ opacity: sketchOpacity, scale: sketchScale }}
      >
        <ThreeFloorPlan />
      </motion.div>

      {/* Centred heading content */}
      <motion.div className={styles.content} style={{ y: headingY }}>
        <h1 className={styles.heading}>LabMatch.</h1>
        <p className={styles.subtitle}>Lab space, matched to your science.</p>
      </motion.div>
    </section>
  );
}
