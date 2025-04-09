import LoadingAudiences from "@/components/LoadingAudiences";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export const LoadingAudiencesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPanel = location.state?.activePanel || "Menu";
  const brand =
    location.state?.brand || new URLSearchParams(location.search).get("brand");

  const handleBack = () => {
    // Volta para a Home, informando qual painel restaurar
    navigate(`/?brand=${brand}`, { state: { activePanel: fromPanel } });
  };

  return (
    <div className="w-full h-screen container mx-auto bg-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-start justify-start gap-4 mt-4 pb-4">
        <Button
          onClick={handleBack}
          className="self-start my-4"
          variant={"secondary"}
        >
          Return
        </Button>
        <LoadingAudiences />
      </div>
    </div>
  );
};
