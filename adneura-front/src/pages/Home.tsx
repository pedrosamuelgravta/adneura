import Dock from "@/components/Dock";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContextProvider";
import { useBrand } from "@/context/BrandContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateBrand } from "@/services/BrandServices";

const itensInstructions = [
  {
    name: "Competitor Analysis",
    src: "CompetitorsAnalysis",
    content: "Consolidate competitors information from all your sources.",
  },
  {
    name: "Third-Party Research",
    src: "ThirdPartyResearch",
    content:
      "Access granular audience insights from any of your research databases.",
  },
  {
    name: "Social Presence",
    src: "SocialPresence",
    content:
      "Track real-time consumer conversations, trends, and influencers across social platforms.",
  },
  {
    name: "Sales Results",
    src: "SalesResults",
    content:
      "Connect consumer behavior to actual sales for sharper media and creative decisions.",
  },
  {
    name: "Customer Data",
    src: "CustomerData",
    content:
      "Transform your first-party data into precise segments and personalized messaging.",
  },
  {
    name: "Advertising Results",
    src: "AdvertisingResults",
    content:
      "Track ad performance across channels to optimize spend and boost ROI in real time.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    apps,
    brand,
    brandData,
    setApps,
    setIntroCompleted,
    informations_active,
    setInformationsActive,
    updateBrandSelection,
  } = useBrand();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showIntro, setShowIntro] = useState(
    brandData?.informations_active || false
  );
  const [introAnimatingOut, setIntroAnimatingOut] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(
    brandData?.informations_active || false
  );

  useEffect(() => {
    if (brandData && typeof brandData.informations_active === "boolean") {
      setShowIntro(brandData.informations_active);
    }
  }, [brandData]);

  useEffect(() => {
    if (!showIntro) return;
    const handleWheel = (event: WheelEvent) => {
      if (isAnimating || !showIntro) return;

      if (
        showScrollDown &&
        brandData?.informations_active &&
        currentInstructionIndex === -1 &&
        event.deltaY > 0
      ) {
        setShowScrollDown(false);
        setCurrentInstructionIndex(0);
        return;
      }

      if (event.deltaY > 0) {
        if (currentInstructionIndex < itensInstructions.length - 1) {
          setShowScrollDown(false);
          setIsAnimating(true);
          setCurrentInstructionIndex((prev) => prev + 1);
          setTimeout(() => setIsAnimating(false), 1500);
        } else {
          finishIntroduction();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [
    currentInstructionIndex,
    isAnimating,
    showIntro,
    showScrollDown,
    informations_active,
  ]);

  useEffect(() => {
    if (!showIntro || currentInstructionIndex < 0) return;
    setApps((prevApps: any) =>
      prevApps.map((app: any) => {
        if (
          [
            "CompetitorsAnalysis",
            "ThirdPartyResearch",
            "SocialPresence",
            "SalesResults",
            "CustomerData",
            "AdvertisingResults",
          ].includes(app.name)
        ) {
          console.log(app.name);
          return {
            ...app,
            active:
              app.active ||
              app.name ===
                mapInstructionToApp(
                  itensInstructions[currentInstructionIndex].name
                ),
          };
        }
        return app;
      })
    );
  }, [currentInstructionIndex, setApps, showIntro, informations_active]);

  useEffect(() => {
    if (introAnimatingOut) {
      const timeout = setTimeout(() => {
        setShowIntro(false);
        setIsAnimating(false);
        setIntroCompleted(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [introAnimatingOut, setIntroCompleted]);

  useEffect(() => {
    if (!isAuthenticated()) navigate("/login");
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (location.state?.activePanel) {
      navigate(location.pathname + location.search, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  // Função para finalizar a introdução: dispara a animação de saída e atualiza o back‑end
  const finishIntroduction = () => {
    setIsAnimating(true);
    setIntroAnimatingOut(true);
    updateBrand({
      id: brand,
      ad_legacy_active: true,
      informations_active: false,
    })
      .then(() => {
        setInformationsActive(false);
        updateBrandSelection(brand);
      })
      .catch((error) => {
        console.error("Erro ao atualizar a brand:", error);
      });
  };

  const mapInstructionToApp = (instructionName: string) => {
    switch (instructionName) {
      case "Competitor Analysis":
        return "CompetitorsAnalysis";
      case "Third-Party Research":
        return "ThirdPartyResearch";
      case "Social Presence":
        return "SocialPresence";
      case "Sales Results":
        return "SalesResults";
      case "Customer Data":
        return "CustomerData";
      case "Advertising Results":
        return "AdvertisingResults";
      default:
        return "";
    }
  };

  const handleMenuItemClick = (panel: string) => {
    const validPanels = apps.map(
      (app: { name: string; src: string; active: boolean }) =>
        app.active === true && app.name
    );

    if (validPanels.includes(panel)) {
      if (panel === "AudienceSegments" && brandData.audience_active) {
        navigate(
          `/${
            panel.charAt(0).toLocaleLowerCase() + panel.slice(1)
          }?brand=${brand}`,
          { state: { activePanel: panel } }
        );
        return;
      } else if (panel === "AudienceSegments" && !brandData.audience_active) {
        navigate(`/audienceLoading?brand=${brand}`, {
          state: { activePanel: panel },
        });
        return;
      } else if (panel === "BrandUniverse" && brandData.brand_universe_active) {
        navigate(`/audienceSegments?brand=${brand}`, {
          state: { activePanel: panel, viewMode: "branduniverse" },
        });
        return;
      } else if (panel === "BrandSummary") {
        navigate(
          `/${
            panel.charAt(0).toLocaleLowerCase() + panel.slice(1)
          }?brand=${brand}`,
          { state: { activePanel: panel } }
        );
      } else if (panel === "StrategicGoals") {
        navigate(
          `/${
            panel.charAt(0).toLocaleLowerCase() + panel.slice(1)
          }?brand=${brand}`,
          { state: { activePanel: panel } }
        );
      }
    }
  };

  return (
    <div className="w-full min-w-[1440px] h-dvh bg-white flex flex-col overflow-x-hidden">
      <Navbar isHome={true} />
      <main className="mx-48 flex-1">
        <Dock
          onMenuItemClick={handleMenuItemClick}
          brand={brand}
          itensInstructions={itensInstructions}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          currentInstructionIndex={currentInstructionIndex}
          showIntro={showIntro}
          showScrollDown={showScrollDown}
        />
      </main>
    </div>
  );
};

export default Home;
