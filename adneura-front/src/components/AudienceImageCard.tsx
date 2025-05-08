import { Audience } from "@/@types/Audience";

import { ShimmerText } from "shimmer-effects-react";
import EditableField from "./EditableField";

import { Loader2 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

type AudienceImageCardProps = {
  audience: Audience;
  loading: boolean;
  onUpdate: (field: string, value: string) => void;
};

export const AudienceImageCard = ({
  audience,
  loading,
  onUpdate,
}: AudienceImageCardProps) => {
  const fetchImage = async (imageName: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND}/images/${imageName}`
    );
    if (!res.ok) throw new Error("Image not found");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ["audience-image", audience.audience_img],
    queryFn: () => fetchImage(audience.audience_img!),
    retry: true,
    retryDelay: (attempt) => Math.min(3000 * attempt, 15000),
  });

  console.log(imageUrl, isLoading);
  return (
    <div className="relative w-full h-[35rem] rounded-md overflow-hidden bg-cover bg-center hover:shadow-xl transition-all group">
      {isLoading ? (
        <span className="text-gray-500 text-sm animate-spin absolute inset-0 flex items-center justify-center">
          <Loader2 />
        </span>
      ) : (
        <img
          src={imageUrl}
          alt={audience.name}
          className="object-cover w-full h-full rounded-sm"
        />
      )}
      <div className="absolute flex flex-col justify-end items-start gap-2 w-full bottom-0 h-[50%] bg-gradient-to-t from-[#222222] via-[#222222]/65 to-transparent p-4">
        <ShimmerText
          mode="light"
          line={2}
          gap={6}
          loading={loading}
          className=" w-full "
        >
          <EditableField
            fieldKey="description"
            value={audience.description!}
            onSave={onUpdate}
            extraClass="hover:border-b-2 hover:border-white cursor-pointer border-white text-white text-[19px] italic font-normal w-full"
          />
        </ShimmerText>
      </div>
    </div>
  );
};
