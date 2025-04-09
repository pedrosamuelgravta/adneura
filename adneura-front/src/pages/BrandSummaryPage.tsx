import BrandSummary from "@/components/BrandSummary";
import Navbar from "@/components/Navbar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/context/BrandContext";
import { updateBrand } from "@/services/BrandServices";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const BrandSummaryPage = () => {
  const { brand, updateBrandSelection } = useBrand();
  const navigate = useNavigate();
  const [hasUpdated, setHasUpdated] = useState(false);
  const [alertRerunOpen, setAlertRerunOpen] = useState(false);
  const [rerunLoading, setRerunLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (hasUpdated) {
      setAlertRerunOpen(true);
      return;
    }
    navigate(`/`);
  };

  const handleAlertConfirm = async (rerun: boolean) => {
    setRerunLoading(true);
    if (rerun) {
      updateBrand({ id: brand, audience_active: false }).then(() => {
        updateBrandSelection(brand);
      });
    }
    navigate(`/`);
  };

  const handleAlertCancel = () => {
    setAlertRerunOpen(false);
    navigate(`/`);
  };

  return (
    <div className="w-full h-screen  bg-white flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-start justify-start gap-4 mt-4 pb-4 container mx-auto">
        {!isLoading && (
          <Button
            onClick={handleBack}
            className="self-start"
            variant={"secondary"}
          >
            Home
          </Button>
        )}
        <BrandSummary
          onUpdateSummary={setHasUpdated}
          onLoadingState={setIsLoading}
        />
      </div>
      <AlertDialog open={alertRerunOpen} onOpenChange={setAlertRerunOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to rerun your Neural Audiences?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Rerunning will update your Neural Audiences based on your new
              brand summary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => handleAlertConfirm(true)}
              disabled={rerunLoading}
            >
              {rerunLoading ? (
                <Loader className="text-lg h-full w-full animate-spin" />
              ) : (
                "Yes, please! "
              )}
            </Button>
            <AlertDialogCancel onClick={handleAlertCancel}>
              Not necessary!
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
