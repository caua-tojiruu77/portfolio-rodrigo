// components/IntroAnimation.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function IntroAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const squares = [0, 1, 2, 3];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-400"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-end space-x-3">
            {squares.map((_, index) => (
              <motion.div
                key={index}
                className="w-6 h-6 bg-brand-300 rounded-md"
                initial={{ y: 0 }}
                animate={{ y: -30 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
