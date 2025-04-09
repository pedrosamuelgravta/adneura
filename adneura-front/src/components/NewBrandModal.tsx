import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useRef, useState } from "react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createBrand } from "@/services/BrandServices";
import { Loader2 } from "lucide-react";
import { createBrandInfo } from "@/services/BrandInfoServices";
import { useBrand } from "@/context/BrandContext";
import { useNavigate } from "react-router-dom";

const NewBrandModal = ({
  inComboBox = false,
  setOpen = () => {},
  setValue = () => {},
}: any) => {
  const { addNewBrand, updateBrandSelection } = useBrand();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const brandName = useRef<HTMLInputElement>(null);
  const brandURL = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  const handleCreateBrand = async () => {
    const value = brandName.current?.value;
    if (!value) return;

    setLoading(true);
    try {
      const resp = await createBrand({
        brand_name: value,
        brand_url: brandURL.current?.value,
      });

      await createBrandInfo({ brand_id: resp.id });

      // Update all necessary states and URL
      handleDialogOpenChange(false);
      addNewBrand({ value: resp.id.toString(), label: value });
      setValue(resp.id.toString());

      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("brand", resp.id.toString());
      navigate({ search: searchParams.toString() }, { replace: true });

      await updateBrandSelection(resp.id.toString());
      setOpen(false);
    } catch (error) {
      console.error("Error creating brand:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger onClick={() => handleDialogOpenChange(true)}>
          {inComboBox ? (
            "Add a new brand"
          ) : (
            <Button variant="outline" className="w-[200px] text-center">
              Add a new brand
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lets get it started!</DialogTitle>
            <DialogDescription>
              Add a new brand to your workspace
            </DialogDescription>
          </DialogHeader>
          <Label>Brand Name</Label>
          <Input placeholder="Enter brand name" ref={brandName} />
          <Label>Brand URL</Label>
          <Input placeholder="Enter brand URL" ref={brandURL} />
          <DialogFooter>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDialogOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="w-28"
              onClick={() => handleCreateBrand()}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create brand"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewBrandModal;
