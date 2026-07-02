import { motion } from 'framer-motion';
import styles from './Problem.module.css';

/**
 * Problem: Three cards outlining why finding lab space is broken.
 * Cards animate in on scroll with staggered delays.
 */

const problems = [
  {
    title: 'Small deals get ignored.',
    body: 'Traditional brokers focus on large corporate tenants. If you need under 5,000 sq ft of specialist lab space, you are simply not a priority.',
  },
  {
    title: 'The market is fragmented.',
    body: 'Lab availability is scattered across niche landlords, academic spinouts, and science parks with no central place to search. Founders waste weeks chasing leads that go nowhere.',
  },
  {
    title: 'Time kills momentum.',
    body: 'Every month spent searching is a month of runway burned. For early-stage startups, delays in securing compliant space can stall fundraising, hiring, and research timelines.',
  },
];

export default function Problem() {
  return (
    <section className={styles.section}>
      <div className="section-container">
        <h2 className={styles.heading}>
          Finding lab space shouldn&rsquo;t hold back your research.
        </h2>
        <div className={styles.grid}>
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.15 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <h3 className={styles.cardTitle}>{problem.title}</h3>
              <p className={styles.cardBody}>{problem.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
