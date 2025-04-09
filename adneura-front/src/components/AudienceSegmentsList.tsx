import { getAudienceByBrandId } from "@/services/AudienceServices";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBrandById } from "@/services/BrandServices";
import { Trigger } from "@/@types/Trigger";
import { Audience } from "@/@types/Audience";
import { ViewModeButtons } from "./ViewModeButtons";
import { FieldsDropdown } from "./FieldsDropdown";
import { AudienceVisualization } from "./AudienceSegmentVisualization";
import { Brain } from "lucide-react";

const FIELDS: Record<
  keyof Omit<Audience, "id" | "triggers" | "image_prompt">,
  string
> = {
  audience_img: "Audience Image",
  name: "Name",
  description: "Description",
  demographics: "Demographics",
  psycho_graphic: "Psychographic",
  attitudinal: "Attitudinal",
  self_concept: "Self Concept",
  lifestyle: "Lifestyle",
  media_habits: "Media Habits",
  general_keywords: "General Keywords",
  brand_keywords: "Brand Keywords",
  key_tags: "Keys Tags",
};

const AudienceSegmentsList = () => {
  const [audienceSegments, setAudienceSegments] = useState<Audience[]>([]);

  const [visibleFields, setVisibleFields] = useState<(keyof typeof FIELDS)[]>([
    "audience_img",
    "name",
    "description",
    "demographics",
    "key_tags",
  ]);
  const [brandName, setBrandName] = useState("");
  const [viewMode, setViewMode] = useState<
    "grid" | "list" | "mindmap" | "sankey" | "branduniverse"
  >("grid");

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const brand = params.get("brand");
  const [sankeyData, setSankeyData] = useState<any>([["From", "To", "Weight"]]);
  const [sankeyTerritories, setSankeyTerritories] = useState<any>([
    ["From", "To", "Weight"],
  ]);

  useEffect(() => {
    if (brand) {
      getBrandById(brand).then((res) => {
        setBrandName(res.name);
      });
      getAudienceByBrandId(brand).then((res) => {
        setAudienceSegments(res);
        res.forEach((audience: Audience) => {
          (audience.triggers || []).forEach((trigger: Trigger) => {
            setSankeyData((prev: any[]) => [
              ...prev,
              [`Audience: ${audience.name}`, `Trigger: ${trigger.name}`, 10],
            ]);
            setSankeyTerritories((prev: any[]) => {
              const newEntries = [
                [`Audience: ${audience.name}`, `Trigger: ${trigger.name}`, 10],
                [
                  `Trigger: ${trigger.name}`,
                  `Territory: ${trigger.territory}`,
                  10,
                ],
              ];
              return [...prev, ...newEntries];
            });
          });
        });
      });

      const viewFromState = location.state?.viewMode;
      if (
        viewFromState &&
        ["grid", "list", "mindmap", "sankey", "branduniverse"].includes(
          viewFromState
        )
      ) {
        setViewMode(viewFromState);
      }
    }
  }, []);

  const handleNavigateClick = (id: number, name: string) => {
    navigate(
      `/audience/${id}?name=${encodeURIComponent(name)}&brand=${brand}`,
      {
        state: { activePanel: "AudienceSegments", brand },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col items-start justify-start gap-4 mt-4 pb-4 w-full">
      <div className="flex flex-col justify-start items-start w-full flex-1">
        <h1 className="text-3xl font-bold">
          {brandName
            ? `${
                brandName.endsWith("s") ? brandName + "’" : brandName + "'s"
              } Neural Audiences`
            : "Audience Segments"}
        </h1>
        <div className="flex items-center justify-between w-full mt-5">
          <ViewModeButtons
            viewMode={viewMode}
            setViewMode={setViewMode}
            hasBrandEspecificView={
              brandName?.includes("Only Murders In The Building") ||
              brandName?.includes("OMITB")
            }
          />
          <FieldsDropdown
            visibleFields={visibleFields}
            setVisibleFields={setVisibleFields}
          />
        </div>
        {audienceSegments.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center h-full flex-1 animate-pulse">
            <Brain size={88} />
          </div>
        ) : (
          <AudienceVisualization
            viewMode={viewMode}
            audienceSegments={audienceSegments}
            sankeyData={sankeyData}
            sankeyTerritories={sankeyTerritories}
            visibleFields={visibleFields}
            handleNavigateClick={handleNavigateClick}
            hasBrandEspecificView={
              brandName?.includes("Only Murders In The Building") ||
              brandName?.includes("OMITB")
            }
          />
        )}
      </div>
    </div>
  );
};

export default AudienceSegmentsList;
