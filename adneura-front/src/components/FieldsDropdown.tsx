import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Audience } from "@/@types/Audience";

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

interface Props {
  visibleFields: (keyof typeof FIELDS)[];
  setVisibleFields: React.Dispatch<
    React.SetStateAction<(keyof typeof FIELDS)[]>
  >;
}

export const FieldsDropdown = ({ visibleFields, setVisibleFields }: Props) => {
  const toggleField = (field: keyof typeof FIELDS) => {
    setVisibleFields((prev: (keyof typeof FIELDS)[]) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Eye className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Visible Fields</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(FIELDS).map(([key, label]) => (
          <div key={key} className="flex items-center px-2 py-2">
            <Checkbox
              id={`field-${key}`}
              checked={visibleFields.includes(key as keyof typeof FIELDS)}
              onCheckedChange={() => toggleField(key as keyof typeof FIELDS)}
            />
            <label htmlFor={`field-${key}`} className="ml-2 text-sm">
              {label}
            </label>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
