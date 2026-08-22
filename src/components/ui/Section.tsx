import React from 'react';
import { motion } from 'motion/react';

interface SectionProps {
  id?: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}

// Standardizes the fade-in-on-scroll treatment so every section of the site
// animates with the same offset/duration/easing instead of hand-tuned values.
export const Section: React.FC<SectionProps> = ({ id, className = '', delay = 0, children }) => {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};
