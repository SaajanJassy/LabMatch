import styles from './Footer.module.css';

/**
 * Footer: Minimal, clean design with dark background.
 * Provides copyright and placeholder links.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`section-container ${styles.inner}`}>
        <div className={styles.left}>
          <span className={styles.wordmark}>LabMatch</span>
          <p className={styles.copyright}>
            &copy; {currentYear} LabMatch. All rights reserved. Registered in the UK.
          </p>
        </div>
        <div className={styles.links}>
          <a href="#privacy" className={styles.link}>Privacy Policy</a>
          <a href="#terms" className={styles.link}>Terms of Service</a>
          <a href="#contact" className={styles.link}>Contact</a>
        </div>
      </div>
    </footer>
  );
}
