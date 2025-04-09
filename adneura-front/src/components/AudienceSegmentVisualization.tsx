import { Chart } from "react-google-charts";
import AudienceSegmentCard from "./AudienceSegmentCard";
import { Audience } from "@/@types/Audience";

interface Props {
  viewMode: "grid" | "list" | "mindmap" | "sankey" | "branduniverse";
  audienceSegments: Audience[];
  sankeyData: any;
  sankeyTerritories: any;
  visibleFields: (keyof Audience)[];
  handleNavigateClick: (id: number, name: string) => void;
  hasBrandEspecificView?: boolean;
}

const options = {
  sankey: {
    node: {
      interactivity: true,
      nodePadding: 30,
      label: {
        fontName: "Arial",
        fontSize: 14,
        color: "#000",
      },
    },
    link: { color: { fill: "#cdcdcd" } },
  },
};

export const AudienceVisualization = ({
  viewMode,
  audienceSegments,
  sankeyData,
  sankeyTerritories,
  visibleFields,
  handleNavigateClick,
  hasBrandEspecificView,
}: Props) => {
  if (viewMode === "mindmap" || viewMode === "sankey") {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="flex gap-4 w-full justify-between p-1 mt-5 mb-10 border-b border-black">
          <p className="text-xl font-bold">Audiences</p>
          <p className="text-xl font-bold">Triggers</p>
          {viewMode === "sankey" && (
            <p className="text-xl font-bold">Territories</p>
          )}
        </div>
        <Chart
          chartType="Sankey"
          width="100%"
          height="150vh"
          data={viewMode === "mindmap" ? sankeyData : sankeyTerritories}
          options={options}
        />
      </div>
    );
  }

  if (viewMode === "branduniverse" && hasBrandEspecificView) {
    return (
      <div className="w-full flex flex-col items-center flex-1">
        <div className="w-full h-full mt-5 flex items-center justify-center">
          <video
            width="100%"
            height="100%"
            src="./public/OMITB_brand universe.mp4"
            autoPlay
            muted
            loop
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full mt-5 border-red-500 ${
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex flex-col gap-4"
      }`}
    >
      {audienceSegments.map((audience) => (
        <AudienceSegmentCard
          key={audience.id}
          audience={audience}
          visibleFields={visibleFields}
          viewMode={
            viewMode === "grid" || viewMode === "list" ? viewMode : "grid"
          }
          handleNavigateClick={handleNavigateClick}
        />
      ))}
    </div>
  );
};
