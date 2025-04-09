import CardBrandInfo from "@/components/CardBrandInfo";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatBrandName } from "@/lib/utils";
import { getBrandInfoById } from "@/services/BrandInfoServices";
import { getBrandById, updateBrand } from "@/services/BrandServices";
import { BrainCircuitIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import CardBrandInfoConjunt from "./CardBrandInfoConjunt";
import { useLocation } from "react-router-dom";
import { useBrand } from "@/context/BrandContext";

type BrandSummaryProps = {
  onLoadingState?: (loading: boolean) => void;
  onUpdateSummary: (hasUpdated: boolean) => void;
};

function BrandSummary({ onUpdateSummary, onLoadingState }: BrandSummaryProps) {
  const { updateBrandSelection } = useBrand();
  const [brandInfoId, setBrandInfoId] = useState<number>(0);
  const [steps, setSteps] = useState<{ step: string; content: any }[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<
    { step: string; content: any }[]
  >([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("in_progress");
  const [name, setName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const brand = params.get("brand");

  useEffect(() => {
    setIsLoading(true);
    if (brand) {
      getBrandInfoById(brand).then((res) => {
        const allSteps = [
          { step: "about", content: res.brand_info.about || "" },
          {
            step: "key_characteristics",
            content: res.brand_info.key_characteristics || "",
          },
          { step: "category", content: res.brand_info.category || "" },
          { step: "positioning", content: res.brand_info.positioning || "" },
          {
            step: "target_audience",
            content: res.brand_info.target_audience || "",
          },
          {
            step: "key_competitors",
            content: res.brand_info.key_competitors || "",
          },
        ].filter((step) => step.content);

        setSteps(allSteps);
        if (res.status === "complete") {
          setVisibleSteps(allSteps);
        } else {
          setVisibleSteps(allSteps.slice(0, 3));
        }
        setBrandInfoId(res.brand_info.id);
        setCurrentIndex(res.status === "complete" ? allSteps.length - 1 : 2);
        console.log(res);
        setStatus(res.status);
        getBrandById(brand).then((res) => {
          setName(res.name);
          if (res.strategic_goals_active === false) {
            updateBrand({ id: brand, strategic_goals_active: true }).then(
              () => {
                updateBrandSelection(brand);
              }
            );
          }
          setIsLoading(false);
        });

        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (onLoadingState) {
      onLoadingState(isLoading);
    }
  }, [isLoading, onLoadingState]);

  const handleModalSave = async () => {
    try {
      const response = await api.get("brand-info/", {
        params: { id: brand },
      });
      const currentData = response.data;

      const allSteps = [
        { step: "about", content: currentData.brand_info.about || "" },
        {
          step: "key_characteristics",
          content: currentData.brand_info.key_characteristics || "",
        },
        { step: "category", content: currentData.brand_info.category || "" },
        {
          step: "positioning",
          content: currentData.brand_info.positioning || "",
        },
        {
          step: "target_audience",
          content: currentData.brand_info.target_audience || "",
        },
        {
          step: "key_competitors",
          content: currentData.brand_info.key_competitors || "",
        },
      ].filter((step) => step.content);
      setSteps(allSteps);
      setVisibleSteps(allSteps);
      onUpdateSummary(true);
    } catch (error) {
      console.error("Erro ao atualizar os cards após salvar no modal:", error);
    }
  };

  const handleNext = () => {
    setLoadingButton(true);

    setTimeout(() => {
      // Mostra o próximo passo
      const nextIndex = currentIndex + 1;
      if (nextIndex < steps.length) {
        setVisibleSteps((prev) => [...prev, steps[nextIndex]]);
        setCurrentIndex(nextIndex);
      } else {
        setStatus("completed");
      }

      setLoadingButton(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 mt-4 pb-4 w-full">
        <BrainCircuitIcon className="text-lg h-14 w-14 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-start justify-start gap-4 mt-4 pb-4 w-full">
      <h1 className="text-2xl font-bold mb-1">
        {formatBrandName(name)} Summary
      </h1>
      {visibleSteps.length > 0 && (
        <CardBrandInfoConjunt
          brand_id={brandInfoId}
          cards={steps.slice(0, 3)} // Passa os 3 primeiros passos
          onSave={handleModalSave}
          status={status}
        />
      )}
      {visibleSteps.slice(3).map((card, index) => (
        <CardBrandInfo
          brand_id={brandInfoId}
          key={`card-${index + 3}`}
          card={card}
          index={index + 3}
          onSave={handleModalSave}
          status={status}
        />
      ))}
      {visibleSteps.length !== 6 && (
        <Button onClick={handleNext} className="self-end">
          {loadingButton ? (
            <Loader2 className="text-lg h-full w-full animate-spin" />
          ) : (
            "Next"
          )}
        </Button>
      )}
    </div>
  );
}

export default BrandSummary;
