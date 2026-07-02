import { motion } from 'framer-motion';
import styles from './Trust.module.css';

/**
 * Trust: Lightweight social proof section with three stat items.
 * Dark background (ink) to create visual contrast.
 */

const stats = [
  { label: 'Focus', value: 'Under 5,000 sq ft' },
  { label: 'Approach', value: 'Compliance-first matching' },
  { label: 'Quality', value: 'AI-assisted, broker-approved' },
];

export default function Trust() {
  return (
    <section className={styles.section}>
      <div className={`section-container ${styles.grid}`}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={styles.stat}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.12 }}
            viewport={{ once: true, margin: '-30px' }}
          >
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
