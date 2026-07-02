import { motion } from 'framer-motion';

/**
 * SketchedBuilding: Renders a vector line-drawn laboratory building facade.
 * The lines animate (draw themselves) when scrolled into view.
 */
export default function SketchedBuilding() {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] }
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
      {/* Ground Line */}
      <motion.path
        d="M 20,165 L 180,165"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />

      {/* Building Main Block Outline (3D Isometric feel) */}
      {/* Front Corner */}
      <motion.path
        d="M 100,50 L 100,165"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Left Roof line */}
      <motion.path
        d="M 40,75 L 100,50"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Left Back Vertical Corner */}
      <motion.path
        d="M 40,75 L 40,165"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Right Roof line */}
      <motion.path
        d="M 100,50 L 160,75"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Right Back Vertical Corner */}
      <motion.path
        d="M 160,75 L 160,165"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />

      {/* Floor Dividers (Horizontal perspective lines) */}
      {/* Left side Floor 1 */}
      <motion.path
        d="M 40,120 L 100,95"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Right side Floor 1 */}
      <motion.path
        d="M 100,95 L 160,120"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />

      {/* Window Grid Patterns */}
      {/* Left side window outlines */}
      <motion.path
        d="M 55,108 L 55,150 M 70,102 L 70,143 M 85,95 L 85,137"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Right side window outlines */}
      <motion.path
        d="M 115,95 L 115,137 M 130,102 L 130,143 M 145,108 L 145,150"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />

      {/* Top Floor Windows */}
      <motion.path
        d="M 55,68 L 85,55 M 115,55 L 145,68"
        strokeWidth="1"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      />

      {/* Entrance Canopy (Right Side) */}
      <motion.path
        d="M 110,135 L 145,150 L 145,165"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
      {/* Door lines */}
      <motion.path
        d="M 120,150 L 120,165 M 130,154 L 130,165"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      />

      {/* Small sketched tree on the left side */}
      <motion.path
        d="M 28,165 L 28,145 M 28,148 Q 20,135 28,130 Q 36,135 28,148"
        stroke="#a89f91" /* var(--stone) */
        strokeWidth="1"
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      />
    </svg>
  );
}
