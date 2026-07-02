/**
 * Cursor-following border glow utility.
 * Attach onMouseMove={glowMove} to any element with the 'glow' CSS class.
 */
export function glowMove(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
}
