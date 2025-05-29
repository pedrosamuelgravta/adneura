import "@/styles/dock.scss";
import { useEffect, useLayoutEffect, useState } from "react";
import { Combobox } from "./Combobox";
import { getBrand, updateBrand } from "@/services/BrandServices";
import NewBrandModal from "./NewBrandModal";
import { useBrand } from "@/context/BrandContext";
import {
  getAudienceByBrandId,
  analyzeAudience,
  postAudience,
  postGenerateAudienceImg,
  postGenerateTriggerImg,
  postTerritories,
  postTriggers,
} from "@/services/AudienceServices";
import { motion, AnimatePresence } from "framer-motion";
// import { ScrollDown } from "./ScrollDown";

type AppType = {
  name: string;
  src: string;
  active: boolean;
};

interface DocksProps {
  onMenuItemClick: (item: string) => void;
  brand: string;
  itensInstructions: {
    src: string;
    name: string;
    content: string;
  }[];
  containerVariants: any;
  itemVariants: any;
  // currentInstructionIndex: number;
  // showIntro: any;
  // showScrollDown: boolean;
}

const Dock = ({
  onMenuItemClick,
  brand,
  itensInstructions,
  containerVariants,
  itemVariants,
}: // currentInstructionIndex,
// showIntro,
// showScrollDown,
DocksProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [comboboxitens, setComboboxitens] = useState([]);
  const { apps, setApps, brands, brandData, updateBrandSelection } = useBrand();
  const [itemMouseOver, setItemMouseOver] = useState<string>("");

  const getCircularDistance = (
    index1: number,
    index2: number,
    totalItems: number
  ) => {
    const diff = Math.abs(index1 - index2);
    return Math.min(diff, totalItems - diff);
  };

  const getIconStyle = (index: number) => {
    if (hoveredIndex === null) {
      return {
        transform: "translate(0, 0) scale(1)",
        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    }

    const distance = getCircularDistance(hoveredIndex, index, apps.length);
    const maxDistance = Math.floor(apps.length / 2);

    let scale = 1;
    let translateY = 0;
    let translateX = 0;

    if (distance === 0) {
      scale = 1.5;
      translateY = -10;
    } else if (distance === 1) {
      scale = 1.2;
      translateY = -6;
    } else if (distance === 2) {
      scale = 1.1;
      translateY = -3;
    } else {
      const distanceRatio = 1 - distance / maxDistance;
      scale = 1 + distanceRatio * 0.05;

      const hoveredAngle = hoveredIndex * (360 / apps.length) * (Math.PI / 180);
      const currentAngle = index * (360 / apps.length) * (Math.PI / 180);

      const angleDistance = Math.atan2(
        Math.sin(currentAngle - hoveredAngle),
        Math.cos(currentAngle - hoveredAngle)
      );

      const movement = distanceRatio * 4;
      translateX = Math.cos(angleDistance) * movement;
      translateY = Math.sin(angleDistance) * movement;
    }

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transition:
        hoveredIndex === null
          ? "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    };
  };

  const rotationOffset = -90;

  const handleMenuItemClick = (appName: string) => {
    onMenuItemClick(appName);
  };

  useLayoutEffect(() => {
    getBrand().then((res) => {
      if (res.brand_summary_active) {
        const newApps = apps.map((app: AppType) => {
          if (app.name === "BrandSummary") {
            return { ...app, active: true };
          }
          return app;
        });
        setApps(newApps);
      }
      setComboboxitens(
        res.map((item: { id: number; name: string }) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (brands.length > 0) {
      setComboboxitens(brands);
    }
  }, [brands]);

  const onGoToAudienceSegments = async () => {
    await postAudience({ brand_id: brand });
    updateBrand({ id: brand, audience_active: true }).then(() => {
      updateBrandSelection(brand);
    });
    const audiences = await getAudienceByBrandId(brand);
    if (audiences.success && audiences.success.length > 0) {
      const promises = audiences.success.map(async (audience: any) => {
        await analyzeAudience(audience.id);
        await postTriggers(audience.id);
      });
      await Promise.all(promises);
      postGenerateAudienceImg(brand);
      postTerritories({ brand_id: brand });
      postGenerateTriggerImg(brand);
    }
  };

  return (
    <>
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="mt-40 self-start flex w-full flex-col">
          <h2 className="text-[2rem] font-semibold font-montserrat mb-4 w-60">
            Welcome to AdNeura™
          </h2>
          {comboboxitens.length > 0 ? <Combobox /> : <NewBrandModal />}
        </div>
        <div className="w-[35rem] h-[35rem] absolute z-2">
          {apps.map((app: AppType, index: number) => {
            const isAudienceSegments = app.name === "AudienceSegments";
            const angle =
              (index * (360 / apps.length) + rotationOffset) * (Math.PI / 180);
            const radius = 240;
            const left = radius * Math.cos(angle) + radius;
            const top = radius * Math.sin(angle) + radius;

            return (
              <div
                key={app.name}
                className="absolute w-12 h-12"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  transform: " translate(-50%, -50%)",
                }}
              >
                <div
                  className="relative group cursor-pointer"
                  onMouseOver={() => {
                    setItemMouseOver(app.name);
                  }}
                  onMouseLeave={() => {
                    setItemMouseOver("");
                  }}
                >
                  <div
                    className={`w-[6rem] h-[6rem] transition-all duration-300 relative  ${
                      app.active ? "opacity-100" : "opacity-40"
                    }`}
                    onClick={() => {
                      handleMenuItemClick(app.name);
                    }}
                  >
                    <img
                      src={app.src}
                      alt={app.name}
                      className="w-full h-full object-contain rounded-full"
                      style={getIconStyle(index)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </div>
                  {isAudienceSegments &&
                  brandData.ad_legacy_active &&
                  !brandData.audience_active &&
                  itemMouseOver === "AudienceSegments" ? (
                    <div
                      className={`flex gap-2 justify-center items-center px-[1.30rem] 
                            pl-28 border w-[500px] h-[120px] rounded-full 
                            border-black absolute z-50 bg-gray-50 bg-opacity-50 
                            top-1/2 bottom-1/2 left-0 -translate-x-5 -translate-y-1/2`}
                    >
                      <p className="text-start text-sm">
                        <b>No neural audiences created for this brand.</b> If
                        all your data sources were connected, click GO to
                        generate your neural audiences.
                      </p>
                      <button
                        onClick={() => {
                          handleMenuItemClick(app.name);
                          onGoToAudienceSegments();
                        }}
                        className=" text-2xl font-extrabold rounded-full w-10 h-10  p-10 flex justify-center items-center border border-black shadow-lg hover:transform hover:scale-105 transition-all duration-300"
                      >
                        GO
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
          <AnimatePresence mode="wait">
            {itemMouseOver &&
              brand &&
              brandData.ad_legacy_active &&
              apps.some((app: any) => app.name === itemMouseOver) && (
                <motion.div
                  key="intro-container"
                  className={`${
                    itemMouseOver !== "AudienceSegments" ? "" : "hidden"
                  } absolute top-0 bottom-0  left-[35rem] right-0 z-10 flex justify-center items-center w-[450px] mb-20 `}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {itensInstructions
                    .filter((item) => item.src === itemMouseOver)
                    .map((item) => (
                      <motion.div
                        key={item.name}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="instruction-card p-6 flex flex-col justify-start items-start min-h-[310px] w-[450px]"
                      >
                        <motion.p
                          variants={itemVariants}
                          className="text-[20px] font-bold tracking-[0.5px] leading-2"
                        >
                          {item.content}
                        </motion.p>
                      </motion.div>
                    ))}
                </motion.div>
              )}
          </AnimatePresence>
          {/* <AnimatePresence mode="wait">
            {showIntro && (
              <motion.div
                key="intro-container"
                className=" absolute top-0 bottom-0  left-[35rem] right-0 z-10 flex justify-center items-center w-[450px] mb-28"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {itensInstructions.map(
                  (item, index) =>
                    index === currentInstructionIndex && (
                      <motion.div
                        key={item.name}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="instruction-card p-6 flex flex-col justify-start items-start min-h-[310px] w-[450px]"
                      >
                        <motion.p
                          variants={itemVariants}
                          className="text-xl font-bold tracking-[0.5px]"
                        >
                          {item.content}
                        </motion.p>
                      </motion.div>
                    )
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {showScrollDown && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ScrollDown />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default Dock;
