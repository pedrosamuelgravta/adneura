import Audience from "@/components/Audience";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export const AudiencePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPanel = location.state?.activePanel || "Menu";
  const brand =
    location.state?.brand || new URLSearchParams(location.search).get("brand");

  const handleBack = () => {
    // Volta para a Home, informando qual painel restaurar
    navigate(`/audienceSegments?brand=${brand}`, {
      state: { activePanel: fromPanel },
    });
  };

  return (
    <div className="w-full h-screen  bg-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-start justify-start gap-4 mt-4 pb-4 container mx-auto">
        <Button
          onClick={handleBack}
          className="self-start"
          variant={"secondary"}
        >
          Return
        </Button>
        <Audience />
      </div>
    </div>
  );
};
