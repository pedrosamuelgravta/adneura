import { motion } from "framer-motion";

export const ScrollDown = () => {
  return (
    <div className="flex flex-col items-center mr-8 mb-3">
      <div className="relative flex items-center justify-center w-8 h-20 border border-black rounded-full">
        <motion.div
          className="w-3 h-3 bg-black opacity-95 rounded-full mb-9"
          animate={{ y: [0, 35, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <p className="mt-2 text-base text-black">Scroll down</p>
    </div>
  );
};
