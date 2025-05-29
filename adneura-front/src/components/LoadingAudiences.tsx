import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "@/context/BrandContext";

import { useNavigate } from "react-router-dom";

export const LoadingAudiences = () => {
  const { brand } = useBrand();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const textData = [
    { text: "Processing Brand Info", duration: 4000 },
    { text: "Examining Competitor Analysis", duration: 5500 },
    { text: "Interpreting Advertising Legacy", duration: 7800 },
    { text: "Assessing Third-Party Research", duration: 5200 },
    { text: "Reviewing Sales Results", duration: 4200 },
    { text: "Evaluating Social Presence", duration: 6500 },
    { text: "Leveraging Customer Data", duration: 3800 },
    { text: "Measuring Advertising Results", duration: 3700 },
    { text: "Aligning Strategic Goals", duration: 4850 },
    { text: "Refining Fuzzy Clustering", duration: 3800 },
    { text: "Enhancing Neural Audiences", duration: 6000 },
  ];

  useEffect(() => {
    if (currentIndex < textData.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, textData[currentIndex].duration);
      return () => clearTimeout(timer);
    } else {
      setShowButton(true);
    }
  }, [currentIndex, textData]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="h-20 flex flex-col items-center justify-center gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "relative",
              overflow: "hidden",
              display: "inline-block",
              padding: "0 10px",
            }}
          >
            <h1
              className="font-montserrat font-bold text-xl text-center"
              style={{
                position: "relative",
                background: "linear-gradient(90deg, #000, #000)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {textData[currentIndex].text}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
                  animation: "shine 3s linear infinite",
                  transform: "skewX(-20deg)",
                }}
              />
            </h1>
            <style>
              {`
                @keyframes shine {
                  from {
                    transform: translateX(-100%) skewX(-20deg);
                  }
                  to {
                    transform: translateX(200%) skewX(-20deg);
                  }
                }
              `}
            </style>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => {
                navigate(`/audienceSegments?brand=${brand}`, {
                  state: { activePanel: "AudienceSegments" },
                });
              }}
              className="bg-black text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              Go to Neural Audiences
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <motion.video
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        src="/adneura_clusterization.mp4"
        autoPlay
        muted
        playsInline
        style={{ width: "800px", objectFit: "contain" }}
      />
    </div>
  );
};

export default LoadingAudiences;
