import React from "react";
import { motion } from "framer-motion";

const HelloWorld: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.h1
        className="text-5xl font-extrabold text-blue-600 drop-shadow-lg animate-fade-up"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Hello World
      </motion.h1>
      <motion.div
        className="ml-8 p-6 rounded-xl bg-white/80 shadow-xl animate-gentle-levitate"
        initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <p className="text-lg text-gray-700 font-medium animate-tracking-in">
          Tailwind CSS + Framer Motion demo
        </p>
        <div className="mt-4 w-32 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-shine"></div>
      </motion.div>
    </div>
  );
};

export default HelloWorld;
