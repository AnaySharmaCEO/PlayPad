import React from 'react';
import { motion } from 'motion/react';

interface WaveformAnimationProps {
  isActive: boolean;
  barCount?: number;
}

export const WaveformAnimation: React.FC<WaveformAnimationProps> = ({ 
  isActive, 
  barCount = 5 
}) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className="w-1 bg-current rounded-full"
          animate={{
            height: isActive ? [4, 20, 4] : 4,
            opacity: isActive ? [0.3, 1, 0.3] : 0.3,
          }}
          transition={{
            duration: 0.6,
            repeat: isActive ? Infinity : 0,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
          style={{ height: '4px' }}
        />
      ))}
    </div>
  );
};