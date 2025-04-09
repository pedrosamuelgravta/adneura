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
    subtitle: "Stay Ahead of the Competition",
    content:
      "What are your competitors doing? Where are they investing? What’s resonating with their audience? We plug into top-tier competitive intelligence platforms to analyze:",
    topics: [
      "Ad spend & media placements (Pathmatics, MediaRadar)",
      "Consumer sentiment & brand perception (Brandwatch, YouGov)",
      "SEO & digital traffic insights (SEMrush, SimilarWeb)",
      "Audience Targeting",
      "Retail & e-commerce performance (Nielsen, Stackline)",
      "Category & industry trends (Mintel, IBISWorld)",
    ],
    footer:
      "The Outcome: A clear competitive landscape to spot opportunities, gaps, and winning strategies.",
  },
  {
    name: "Third-Party Research",
    src: "ThirdPartyResearch",
    subtitle: "Stay Ahead of the Competition",
    content:
      "What are your competitors doing? Where are they investing? What’s resonating with their audience? We plug into top-tier competitive intelligence platforms to analyze:",
    topics: [
      "Ad spend & media placements (Pathmatics, MediaRadar)",
      "Consumer sentiment & brand perception (Brandwatch, YouGov)",
      "SEO & digital traffic insights (SEMrush, SimilarWeb)",
      "Audience Targeting",
      "Retail & e-commerce performance (Nielsen, Stackline)",
      "Category & industry trends (Mintel, IBISWorld)",
    ],
    footer:
      "The Outcome: A clear competitive landscape to spot opportunities, gaps, and winning strategies.",
  },
  {
    name: "Social Presence",
    src: "SocialPresence",
    subtitle: "Stay Ahead of the Competition",
    content:
      "What are your competitors doing? Where are they investing? What’s resonating with their audience? We plug into top-tier competitive intelligence platforms to analyze:",
    topics: [
      "Ad spend & media placements (Pathmatics, MediaRadar)",
      "Consumer sentiment & brand perception (Brandwatch, YouGov)",
      "SEO & digital traffic insights (SEMrush, SimilarWeb)",
      "Audience Targeting",
      "Retail & e-commerce performance (Nielsen, Stackline)",
      "Category & industry trends (Mintel, IBISWorld)",
    ],
    footer:
      "The Outcome: A clear competitive landscape to spot opportunities, gaps, and winning strategies.",
  },
  {
    name: "Sales Results",
    src: "SalesResults",
    subtitle: "Link Consumer Behavior to Actual Purchases",
    content:
      "We connect real-world sales data to advertising performance by integrating:",
    topics: [
      "Retail & POS sales trends (NielsenIQ, IRI, SPINS)",
      "E-commerce sales tracking (Amazon Retail Analytics, Profitero)",
      "DTC & CRM-driven purchase insights (Shopify, Salesforce Commerce Cloud)",
      "Pricing & promotional effectiveness (Numerator, PriceSpider)",
    ],
    footer:
      "The Outcome: A clear view of revenue-driving factors, enabling precise media and creative optimizations.",
  },
  {
    name: "Customer Data",
    src: "CustomerData",
    subtitle: "Turn First-Party Data into a Competitive Advantage",
    content: "Leverage direct consumer interactions to refine audiences:",
    topics: [
      "CRM & loyalty data (Salesforce, HubSpot, Braze)",
      "Purchase & repeat behavior (Shopify, Klaviyo, Attentive)",
      "Customer reviews & sentiment (Trustpilot, Bazaarvoice)",
      "Behavioral analytics & engagement (Amplitude, Mixpanel)",
    ],
    footer:
      "The Outcome: Precise customer segmentation and personalized ad messaging.",
  },
  {
    name: "Advertising Results",
    src: "AdvertisingResults",
    subtitle: "Measure What Matters. Optimize in Real Time.",
    content: "Connect ad spend to business outcomes with:",
    topics: [
      "TV & video ad effectiveness (iSpot.tv, VideoAmp, TVSquared)",
      "Digital campaign performance (Google Analytics, Meta Ads Manager)",
      "Cross-channel attribution (Neustar, LiveRamp)",
      "Brand lift & recall tracking (Kantar Millward Brown, Dynata)",
      "CTV & Cross-Platform Viewing Habits (e.g., Samsung Ads)",
    ],
    footer:
      "The Outcome: Smarter, data-driven optimizations that maximize ROAS & media efficiency.",
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
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
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
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showIntro, setShowIntro] = useState(
    brandData?.informations_active || false
  );
  const [introAnimatingOut, setIntroAnimatingOut] = useState(false);

  useEffect(() => {
    if (brandData && typeof brandData.informations_active === "boolean") {
      setShowIntro(brandData.informations_active);
    }
  }, [brandData]);

  useEffect(() => {
    if (!showIntro) return;
    const handleWheel = (event: WheelEvent) => {
      if (isAnimating || !showIntro) return;

      if (event.deltaY > 0) {
        if (currentInstructionIndex < itensInstructions.length - 1) {
          setIsAnimating(true);
          setCurrentInstructionIndex((prev) => prev + 1);
          setTimeout(() => setIsAnimating(false), 1500);
        } else {
          // Se estiver no último card e scrollar para baixo, finaliza a introdução
          finishIntroduction();
        }
      } else if (event.deltaY < 0) {
        if (currentInstructionIndex > 0) {
          setIsAnimating(true);
          setCurrentInstructionIndex((prev) => prev - 1);
          setTimeout(() => setIsAnimating(false), 1500);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentInstructionIndex, isAnimating, showIntro, informations_active]);

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

  useEffect(() => {
    if (!showIntro) return;
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

  const handleMenuItemClick = (panel: string) => {
    const validPanels = apps.map(
      (app: { name: string; src: string; active: boolean }) =>
        app.active === true && app.name
    );
    console.log(validPanels);
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
        />
      </main>
    </div>
  );
};

export default Home;
