// components/FadeInSection.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React from "react";

export default function FadeInSection({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}
