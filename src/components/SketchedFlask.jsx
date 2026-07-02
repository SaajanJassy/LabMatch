import { motion } from 'framer-motion';

/**
 * SketchedFlask: Renders a vector line-drawn beaker flask, pipette,
 * and DNA helix. The paths animate (draw themselves) when scrolled into view.
 */
export default function SketchedFlask() {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="#2d5a3d" /* var(--forest) */
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: '100%', height: '100%', maxWidth: '300px', maxHeight: '300px' }}
    >
      {/* Background DNA Helix */}
      <motion.path
        d="M 30,80 Q 60,30 100,80 T 170,80"
        stroke="#a89f91" /* var(--stone) */
        strokeWidth="1"
        strokeDasharray="4 4"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      <motion.path
        d="M 30,120 Q 60,170 100,120 T 170,120"
        stroke="#a89f91"
        strokeWidth="1"
        strokeDasharray="4 4"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      
      {/* DNA Rungs */}
      {[50, 70, 90, 110, 130, 150].map((x, i) => (
        <motion.line
          key={i}
          x1={x}
          y1={100 - 25 * Math.sin((x / 140) * Math.PI * 2)}
          x2={x}
          y2={100 + 25 * Math.sin((x / 140) * Math.PI * 2)}
          stroke="#a89f91"
          strokeWidth="1"
          variants={pathVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        />
      ))}

      {/* The Beaker Flask */}
      {/* Lip */}
      <motion.path
        d="M 75,60 L 125,60"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Neck & Body */}
      <motion.path
        d="M 85,60 L 85,90 L 50,160 L 150,160 L 115,90 L 115,60"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Base */}
      <motion.path
        d="M 50,160 Q 100,164 150,160"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />

      {/* Liquid level */}
      <motion.path
        d="M 65,130 Q 100,125 135,130"
        strokeWidth="1"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />

      {/* Graduation Marks */}
      <motion.path d="M 115,100 L 105,100" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: false }} />
      <motion.path d="M 115,115 L 108,115" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: false }} />
      <motion.path d="M 115,130 L 105,130" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: false }} />
      <motion.path d="M 115,145 L 108,145" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: false }} />

      {/* Pipette */}
      <motion.path
        d="M 155,40 C 150,45 150,55 155,60 L 155,140 L 150,150 L 151,152 L 157,148 L 157,60 C 162,55 162,45 157,40 Z"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
    </svg>
  );
}
