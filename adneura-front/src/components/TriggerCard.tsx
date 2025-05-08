import { Trigger } from "@/@types/Trigger";
import { ImageIcon, Map, RefreshCw } from "lucide-react";
import { ShimmerDiv } from "shimmer-effects-react";
import { Button } from "./ui/button";
import {
  getAudienceById,
  postGenerateTriggerImg,
} from "@/services/AudienceServices";
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface TriggerCardProps {
  trigger: Trigger;
  editingTriggerId: number | null;
  editingFieldKey: string | null;
  editingValue: string;
  onStartEditing: (id: number, field: string, currentValue: string) => void;
  onChangeEditingValue: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFinishEditing: (id: number) => void;
  setAudience: (value: any) => void;
}

const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  editingTriggerId,
  editingFieldKey,
  editingValue,
  onStartEditing,
  onChangeEditingValue,
  onFinishEditing,
}) => {
  const fetchImage = async (imageName: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND}/images/${imageName}`
    );
    if (!res.ok) throw new Error("Image not found");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const { data: imageUrl } = useQuery({
    queryKey: ["audience-image", trigger.trigger_img],
    queryFn: () => fetchImage(trigger.trigger_img!),
    retry: true,
    retryDelay: (attempt) => Math.min(3000 * attempt, 15000),
  });

  return (
    <div className="relative w-full h-[35rem] rounded-md overflow-hidden bg-cover bg-center hover:shadow-xl cursor-default transition-all group">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={trigger.name}
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
        <h3 className="text-white text-2xl font-bold mx-4">
          {editingTriggerId === trigger.id && editingFieldKey === "name" ? (
            <input
              type="text"
              value={editingValue}
              onChange={(e) =>
                onChangeEditingValue(
                  e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                )
              }
              onBlur={() => onFinishEditing(trigger.id)}
              onKeyDown={(e) =>
                e.key === "Enter" && onFinishEditing(trigger.id)
              }
              autoFocus
              className="font-bold bg-transparent border-b border-white text-white p-0 focus:border-white focus:outline-none"
            />
          ) : (
            <span
              className="hover:underline cursor-pointer"
              onClick={() =>
                onStartEditing(trigger.id, "name", trigger.name || "Unnamed")
              }
            >
              {trigger.name || "Unnamed"}
            </span>
          )}
        </h3>

        <p className="px-4 text-white mb-2 text-lg w-full">
          {editingTriggerId === trigger.id &&
          editingFieldKey === "description" ? (
            <textarea
              value={editingValue}
              onChange={onChangeEditingValue}
              onBlur={() => onFinishEditing(trigger.id)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && onFinishEditing(trigger.id)
              }
              autoFocus
              className="font-normal bg-transparent border-b border-white text-white p-0 focus:border-white focus:outline-none w-full resize-none"
              rows={3}
            />
          ) : (
            <span
              className="hover:underline cursor-pointer"
              onClick={() =>
                onStartEditing(
                  trigger.id,
                  "description",
                  trigger.description || ""
                )
              }
            >
              {trigger.description || "Clique para editar"}
            </span>
          )}
        </p>

        <p className="mx-4 text-white mb-2 text-lg flex items-center gap-2 font-bold">
          <Map /> Territory:
          {editingTriggerId === trigger.id &&
          editingFieldKey === "territory" ? (
            <input
              type="text"
              value={editingValue}
              onChange={onChangeEditingValue}
              onBlur={() => onFinishEditing(trigger.id)}
              onKeyDown={(e) =>
                e.key === "Enter" && onFinishEditing(trigger.id)
              }
              autoFocus
              className="font-normal bg-transparent border-b border-white text-white p-0 focus:border-white focus:outline-none"
            />
          ) : (
            <span
              className="font-normal hover:underline transition-all cursor-pointer"
              onClick={() =>
                onStartEditing(trigger.id, "territory", trigger.territory || "")
              }
            >
              {trigger.territory || "Clique para editar"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default TriggerCard;
