import Navbar from "@/components/Navbar";
import { StrategicGoals } from "@/components/StrategicGoals";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const StrategicGoalsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/`);
  };

  return (
    <div className="w-full h-screen  bg-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-start justify-start gap-4 mt-4 pb-4 mx-auto container">
        <Button
          onClick={handleBack}
          className="self-start my-4"
          variant={"secondary"}
        >
          Home
        </Button>
        <StrategicGoals />
      </div>
    </div>
  );
};
