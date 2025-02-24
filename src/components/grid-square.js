import React from 'react';
import { motion } from 'framer-motion';

// Represents a grid square with a color

const GridSquare = ({ color, square, isClearing = false }) => {
  // Only show clearing animation if the square has a block in it
  const shouldAnimate = isClearing && square !== 0;
  
  return (
    <motion.div
      className={`grid-square ${shouldAnimate ? 'clearing' : ''}`}
      style={{ 
        backgroundColor: color,
      }}
      animate={shouldAnimate ? {
        filter: [
          'brightness(1) blur(0px)',
          'brightness(2) blur(2px)',
          'brightness(3) blur(4px)',
          'brightness(2) blur(2px)',
          'brightness(1) blur(0px)',
        ],
        scale: [1, 1.1, 1.2, 1.1, 1],
      } : {}}
      transition={shouldAnimate ? {
        duration: 0.5,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: 0,
      } : {}}
    />
  );
};

export default React.memo(GridSquare);