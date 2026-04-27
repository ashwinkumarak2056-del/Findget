import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', delay = 0, hover = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.2)" } : {}}
      className={`glass-panel p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
