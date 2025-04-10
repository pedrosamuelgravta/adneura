import { getBrand, getBrandById, updateBrand } from "@/services/BrandServices";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type AppType = {
  name: string;
  src: string;
  active: boolean;
};

const BrandContext = createContext<any>(null);

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const brand = params.get("brand");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brand || null
  );
  const [brandData, setBrandData] = useState<any>({});
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);

  const [introCompleted, setIntroCompleted] = useState(false);
  const [informations_active, setInformationsActive] = useState(false);

  const [apps, setApps] = useState<AppType[]>([
    { name: "BrandSummary", src: "/public/12BrandSummary.svg", active: false },
    {
      name: "StrategicGoals",
      src: "/public/01StrategicGoals.svg",
      active: false,
    },
    {
      name: "AudienceSegments",
      src: "/public/02AudienceSegments.svg",
      active: false,
    },
    {
      name: "BrandUniverse",
      src: "/public/03BrandUniverse.svg",
      active: false,
    },
    { name: "AdFilms", src: "/public/04AdFilms.svg", active: false },
    {
      name: "AdvertisingResults",
      src: "/public/05AdvertisingResults.svg",
      active: false,
    },
    { name: "CustomerData", src: "/public/06CustomerData.svg", active: false },
    { name: "SalesResults", src: "/public/07SalesResults.svg", active: false },
    {
      name: "SocialPresence",
      src: "/public/08SocialPresence.svg",
      active: false,
    },
    {
      name: "ThirdPartyResearch",
      src: "/public/09ThirdPartyResearch.svg",
      active: false,
    },
    {
      name: "CompetitorsAnalysis",
      src: "/public/10CompetitorsAnalysis.svg",
      active: false,
    },
    {
      name: "AdvertisingLegacy",
      src: "/public/11AdvertisingLegacy.svg",
      active: false,
    },
  ]);

  const updateBrandSelection = async (brandId: any) => {
    setSelectedBrand(brandId);
    try {
      let res = await getBrandById(brandId);
      if (!res) {
        console.error("Brand not found or API returned an error.");
        return;
      }

      if (!res.brand_summary_active) {
        await updateBrand({ id: brandId, brand_summary_active: true });
        res = await getBrandById(brandId);
      }
      setBrandData(res);

      setApps((prevApps) => {
        const updatedApps = prevApps.map((app) => {
          if (app.name === "BrandSummary" && res.brand_summary_active) {
            return { ...app, active: true };
          }
          if (app.name === "StrategicGoals" && res.strategic_goals_active) {
            return { ...app, active: true };
          }
          if (app.name === "AudienceSegments" && res.ad_legacy_active) {
            return { ...app, active: true };
          }
          if (app.name === "BrandUniverse" && res.brand_universe_active) {
            if (
              res.name.includes("Only Murders In The Building") ||
              res.name.includes("OMITB")
            ) {
              return { ...app, active: true };
            }
          }
          if (res.ad_legacy_active) {
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
              return { ...app, active: true };
            }
          }
          return { ...app, active: false };
        });
        return updatedApps;
      });
    } catch (error) {
      console.error("Erro ao atualizar a brand:", error);
    }
  };

  const addNewBrand = (newBrand: { value: string; label: string }) => {
    setBrands((prevBrands) => [...prevBrands, newBrand]);
    setSelectedBrand(newBrand.value);
  };

  useEffect(() => {
    getBrand().then((res) => {
      setBrands(
        res.map((item: { id: number; name: string }) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );
    });
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrand();
        setBrands(
          res.map((item: { id: number; name: string }) => ({
            value: item.id.toString(),
            label: item.name,
          }))
        );
        if (brand) {
          setSelectedBrand(brand);
          const brandData = await getBrandById(brand);
          if (!brandData) {
            return;
          }
          setInformationsActive(brandData.informations_active);
          setBrandData(brandData);
          if (brandData) {
            setApps((prevApps) => {
              const updatedApps = prevApps.map((app) => {
                if (
                  app.name === "BrandSummary" &&
                  brandData.brand_summary_active
                ) {
                  return { ...app, active: true };
                }
                if (
                  app.name === "StrategicGoals" &&
                  brandData.strategic_goals_active
                ) {
                  return { ...app, active: true };
                }
                if (
                  app.name === "AudienceSegments" &&
                  brandData.ad_legacy_active
                ) {
                  return { ...app, active: true };
                }
                if (
                  app.name === "BrandUniverse" &&
                  brandData.brand_universe_active
                ) {
                  if (
                    brandData.name.includes("Only Murders In The Building") ||
                    brandData.name.includes("OMITB")
                  )
                    return { ...app, active: true };
                }

                if (brandData.ad_legacy_active) {
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
                    return { ...app, active: true };
                  }
                }
                return { ...app, active: false };
              });
              return updatedApps;
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar as brands:", error);
      }
    };

    fetchBrands();
  }, [brand, selectedBrand, introCompleted]);

  return (
    <BrandContext.Provider
      value={{
        selectedBrand,
        updateBrandSelection,
        apps,
        setApps,
        brands,
        brand,
        brandData,
        addNewBrand,
        introCompleted,
        setIntroCompleted,
        informations_active,
        setInformationsActive,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
