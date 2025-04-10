import { Audience } from "@/@types/Audience";

import { ShimmerDiv, ShimmerText } from "shimmer-effects-react";
import EditableField from "./EditableField";
import { useLocation, useParams } from "react-router-dom";
import {
  getAudienceById,
  postGenerateAudienceImg,
} from "@/services/AudienceServices";
import { Button } from "./ui/button";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type AudienceImageCardProps = {
  audience: Audience;
  loading: boolean;
  setAudience: (value: any) => void;
  onUpdate: (field: string, value: string) => void;
};

export const AudienceImageCard = ({
  audience,
  loading,
  setAudience,
  onUpdate,
}: AudienceImageCardProps) => {
  const { audienceId } = useParams();
  const location = useLocation();
  const brand =
    location.state?.brand || new URLSearchParams(location.search).get("brand");

  const [rerunLoading, setRerunLoading] = useState(false);

  const fetchImage = async (imageName: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND}/images/${imageName}`
    );
    if (!res.ok) throw new Error("Image not found");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const { data: imageUrl } = useQuery({
    queryKey: ["audience-image", audience.audience_img],
    queryFn: () => fetchImage(audience.audience_img!),
    enabled: !!audience.audience_img && !rerunLoading,
    retry: true, // tenta infinitamente
    retryDelay: (attempt) => Math.min(3000 * attempt, 15000),
  });

  const rerunAudienceImage = async () => {
    try {
      setRerunLoading(true);

      const updatedAudience = await getAudienceById(audienceId!);
      await postGenerateAudienceImg({
        text: audience.image_prompt,
        brand_id: brand,
        audience_id: audience.id,
      });
      setAudience(updatedAudience);
    } catch (error) {
      console.error("Error rerunning triggers images:", error);
    } finally {
      setRerunLoading(false);
    }
  };
  return (
    <div className="relative w-full h-[35rem] rounded-md overflow-hidden bg-cover bg-center hover:shadow-xl transition-all group">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="secondary"
          size="sm"
          className="group/button bg-white/90 hover:bg-white text-black backdrop-blur-sm rounded-full h-10 w-10 p-0"
          onClick={() => rerunAudienceImage()}
          title="Regenerate Image"
        >
          <ImageIcon size={18} />
        </Button>
      </div>
      {!rerunLoading && imageUrl ? (
        <img
          src={imageUrl}
          alt={audience.name}
          className="object-cover h-full w-full"
        />
      ) : (
        <ShimmerDiv
          className="w-full h-full flex justify-end items-start object-cover"
          loading={true}
          height="100%"
          width="100%"
          mode="light"
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
