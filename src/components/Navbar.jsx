import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './Navbar.module.css';

/**
 * Navbar: Sticky navigation bar.
 * Transparent on the hero, gains a blurred sand background on scroll.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Listen for scroll position and toggle background state
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#" className={styles.wordmark}>LabMatch</a>
        <div className={styles.links}>
          <a href="#startups" className={styles.link}>I&rsquo;m a Startup</a>
          <a href="#landlords" className={styles.link}>I&rsquo;m a Landlord</a>
        </div>
      </div>
    </nav>
  );
}
