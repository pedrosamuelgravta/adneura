import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  getAudienceById,
  putAudience,
  putTriggers,
} from "@/services/AudienceServices";
import { getBrandById } from "@/services/BrandServices";
import { Trigger } from "@/@types/Trigger";
import { AudienceHeader } from "./AudienceHeader";
import { AudienceKeyTags } from "./AudienceKeyTags";
import { AudienceImageCard } from "./AudienceImageCard";
import { AudienceContent } from "./AudienceContent";
import { TriggersSection } from "./TriggersSection";

const Audience = () => {
  const { audienceId } = useParams();
  const [audience, setAudience] = useState<any>({});
  const [brandName, setBrandName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyTags, setKeyTags] = useState<string[]>([]);

  const location = useLocation();
  const brand =
    location.state?.brand || new URLSearchParams(location.search).get("brand");

  // Estados para edição inline dos triggers
  const [editingTriggerId, setEditingTriggerId] = useState<number | null>(null);
  const [editingFieldKey, setEditingFieldKey] = useState<null | string>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!audienceId) {
          throw new Error("Audience ID is required");
        }
        console.log("audienceId", audienceId);
        const audienceData = await getAudienceById(audienceId!);
        console.log("audienceData", audienceData);
        setAudience(audienceData);
        const firstThree = getFirstThreeStrings(audienceData.key_tags);
        setKeyTags(firstThree);
        const brandData = await getBrandById(brand);
        setBrandName(brandData.name);
        setLoading(false);
      } catch (error) {
        throw new Error("Error fetching audience data");
      }
    };

    fetchData();
  }, []);

  function getFirstThreeStrings(text: any) {
    const lines = text.split("\n");
    const firstLine = lines.find((line: any) => line.trim().length > 0) || text;
    const firstThree = firstLine
      .split(",")
      .map((item: any) => item.trim())
      .slice(0, 3);
    return firstThree;
  }

  // Funções de edição inline dos triggers
  const handleStartEditing = (
    id: number,
    field: string,
    currentValue: string
  ) => {
    setEditingTriggerId(id);
    setEditingFieldKey(field); // "name", "description" ou "territory"
    setEditingValue(currentValue);
  };

  const handleChangeEditingValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditingValue(e.target.value);
  };

  const handleFinishEditing = async (id: number) => {
    setAudience((prev: any) => {
      const updatedTriggers = prev.triggers.map((t: Trigger) =>
        t.id === id ? { ...t, [editingFieldKey!]: editingValue } : t
      );
      return { ...prev, triggers: updatedTriggers };
    });

    try {
      await putTriggers({ [editingFieldKey!]: editingValue }, id);
    } catch (error) {
      console.error("Error updating trigger:", error);
    }

    setEditingTriggerId(null);
    setEditingFieldKey(null);
  };

  // Função para atualização de outros campos da audiência
  const updateAudienceField = async (field: string, value: string) => {
    let payload;
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      payload = { [parent]: { [child]: value } };
    } else {
      payload = { [field]: value };
    }

    setAudience((prev: any) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      } else {
        return { ...prev, [field]: value };
      }
    });

    try {
      await putAudience(payload, audienceId!);
    } catch (error) {
      console.error("Error updating audience:", error);
    }
  };

  return (
    <div className="w-full h-screen container mx-auto bg-white flex flex-col">
      <div className="flex flex-1 flex-col items-start justify-start gap-4 mt-4 pb-4">
        <AudienceHeader
          audienceName={audience.name}
          brandName={brandName}
          onUpdate={updateAudienceField}
        />
        <AudienceKeyTags keyTags={keyTags} />
        <AudienceImageCard
          audience={audience}
          loading={loading}
          onUpdate={updateAudienceField}
        />
        <AudienceContent
          audience={audience}
          loading={loading}
          onUpdate={updateAudienceField}
        />
        <TriggersSection
          audience={audience}
          setAudience={setAudience}
          triggers={audience.triggers || []}
          onStartEditing={handleStartEditing}
          onChangeEditingValue={handleChangeEditingValue}
          onFinishEditing={handleFinishEditing}
          editingTriggerId={editingTriggerId}
          editingFieldKey={editingFieldKey}
          editingValue={editingValue}
        />
      </div>
    </div>
  );
};

export default Audience;
