import { Button } from "@/components/ui/button";
import { GitCommit, GitFork, Globe, Hash, List } from "lucide-react";

interface ViewModeProps {
  viewMode: string;
  setViewMode: (
    mode: "grid" | "list" | "mindmap" | "sankey" | "branduniverse"
  ) => void;
  hasBrandEspecificView?: boolean;
}

export const ViewModeButtons = ({
  viewMode,
  setViewMode,
  hasBrandEspecificView,
}: ViewModeProps) => {
  return (
    <div>
      <div className="flex gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          onClick={() => setViewMode("grid")}
        >
          <Hash className="h-4 w-4" />
          Grid
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
          List
        </Button>
        <Button
          variant={viewMode === "mindmap" ? "default" : "outline"}
          onClick={() => setViewMode("mindmap")}
        >
          <GitCommit className="h-4 w-4" />
          Message Triggers
        </Button>
        <Button
          variant={viewMode === "sankey" ? "default" : "outline"}
          onClick={() => setViewMode("sankey")}
        >
          <GitFork className="h-4 w-4 rotate-90" />
          Brand Territories
        </Button>
        {hasBrandEspecificView && (
          <Button
            variant={viewMode === "branduniverse" ? "default" : "outline"}
            onClick={() => setViewMode("branduniverse")}
          >
            <Globe className="h-4 w-4 rotate-90" />
            Brand Universe
          </Button>
        )}
      </div>
    </div>
  );
};
