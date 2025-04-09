import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NewBrandModal from "./NewBrandModal";
import { useBrand } from "@/context/BrandContext";

export function Combobox() {
  const { brands, updateBrandSelection, selectedBrand } = useBrand();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const brand = params.get("brand");
  const [value, setValue] = React.useState(brand || selectedBrand || "");

  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitialMount.current) {
      const initialValue = brand || selectedBrand;
      if (initialValue) {
        setValue(initialValue);
        updateBrandSelection(initialValue);
      }
      isInitialMount.current = false;
    }
  }, [brand, selectedBrand]);

  React.useEffect(() => {
    if (!isInitialMount.current && value) {
      updateBrandSelection(value);
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("brand", value);
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  }, [value, navigate, brand]);

  const filteredBrands = query
    ? brands.filter((brand: { label: string; value: string }) =>
        brand.label.toLowerCase().includes(query.toLowerCase())
      )
    : brands;

  const handleItemClick = (value: string) => {
    updateBrandSelection(value);
    setValue(value);
    setOpen(false);
  };

  const currentBrandLabel = React.useMemo(() => {
    const currentBrand = brands.find((b: any) => b.value === value);
    return currentBrand?.label || "Select Brand...";
  }, [brands, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="max-w-[200px] w-full justify-between "
        >
          <p className="text-ellipsis overflow-hidden whitespace-nowrap text-left">
            {currentBrandLabel}
          </p>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command onValueChange={setQuery}>
          <CommandInput placeholder="Search brand..." className="h-9" />

          <CommandList>
            <CommandGroup>
              <CommandItem
                key="0"
                onSelect={() => {
                  setValue("0");
                  setQuery("");
                }}
              >
                <NewBrandModal
                  inComboBox={true}
                  setValue={setValue}
                  setOpen={setOpen}
                />
              </CommandItem>

              {filteredBrands.map((brand: any) => (
                <CommandItem
                  key={brand.value}
                  onSelect={() => {
                    handleItemClick(brand.value);
                    setOpen(false);
                  }}
                >
                  {brand.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === brand.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
