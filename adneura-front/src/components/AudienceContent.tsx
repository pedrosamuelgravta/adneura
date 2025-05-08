import { ShimmerText } from "shimmer-effects-react";
import Card from "./CardAudience";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AudienceContentProps = {
  audience: any;
  loading: boolean;
  onUpdate: (field: string, value: string) => void;
};

type EditableFieldProps = {
  fieldKey: string;
  value: string;
  onSave: (field: string, value: string) => void;
  extraClass?: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onCancelEdit?: () => void;
  "data-field-key"?: string;
  [key: string]: any;
};

export const EditableField = ({
  fieldKey,
  value,
  onSave,
  extraClass = "",
  isEditing,
  setIsEditing,
  onCancelEdit,
  ...rest
}: EditableFieldProps) => {
  const [text, setText] = useState(value || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  useEffect(() => {
    setText(value || "");
  }, [value]);

  const handleSave = () => {
    onSave(fieldKey, text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      setText(value);
      setIsEditing(false);
      if (onCancelEdit) onCancelEdit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (isEditing) {
    return (
      <div className="flex flex-col w-full">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="w-full p-2 rounded resize-none min-h-[100px] outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          style={{ height: "auto" }}
        />
        <div className="text-xs text-gray-500 mt-1">
          Press Ctrl+Enter to save or Esc to cancel
        </div>
      </div>
    );
  }

  return (
    <div className={extraClass} onClick={() => setIsEditing(true)} {...rest}>
      {value || "Click to add content"}
    </div>
  );
};

type SimpleEditableFieldProps = {
  fieldKey: string;
  value: string;
  onSave: (field: string, value: string) => void;
  extraClass?: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

const SimpleEditableField = ({
  fieldKey,
  value,
  onSave,
  extraClass = "",
  isEditing,
  setIsEditing,
}: SimpleEditableFieldProps) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    onSave(fieldKey, inputValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setInputValue(value);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`w-full bg-white border-b border-gray-400 focus:outline-none focus:border-black  ${extraClass}`}
    />
  ) : (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:border-b hover:border-black  ${extraClass}`}
    >
      {value || "Click to edit"}
    </span>
  );
};

export const AudienceContent = ({
  audience,
  loading,
  onUpdate,
}: AudienceContentProps) => {
  const demographics = audience.demographics || {};
  const [editingField, setEditingField] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-row gap-4">
        <Card title="Demographics" className="h-full relative">
          <div className="flex flex-col gap-5 mt-2">
            {Object.entries(demographics)
              .filter(([key]) =>
                [
                  "gender",
                  "age_bracket",
                  "hhi",
                  "race",
                  "education",
                  "location",
                ].includes(key)
              )
              .map(([key, value]) => (
                <ShimmerText
                  key={key}
                  mode="light"
                  line={1}
                  gap={6}
                  loading={loading}
                >
                  <p className="flex items-center gap-2">
                    <strong className="text-nowrap">
                      {key
                        .split("_")
                        .map((word) =>
                          word === "hhi"
                            ? "HHI"
                            : word[0].toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                      :
                    </strong>{" "}
                    <SimpleEditableField
                      fieldKey={`demographics.${key}`}
                      value={String(value)}
                      onSave={onUpdate}
                      isEditing={editingField === key}
                      setIsEditing={(isEditing) =>
                        setEditingField(isEditing ? key : null)
                      }
                      extraClass="inline"
                    />
                  </p>
                </ShimmerText>
              ))}
          </div>
        </Card>
        <div className="flex w-full flex-col gap-4">
          {[
            ["Psychographics", "psycho_graphic"],
            ["Attitudinal", "attitudinal"],
            ["Self-concept", "self_concept"],
          ].map(([label, key]) => (
            <Card key={key} title={label} className="h-full relative">
              <button
                className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setEditingField(key)}
              >
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
              </button>
              <ShimmerText mode="light" line={1} gap={6} loading={loading}>
                {
                  <EditableField
                    fieldKey={key}
                    value={audience[key]}
                    onSave={onUpdate}
                    isEditing={editingField === key}
                    setIsEditing={(isEditing) =>
                      setEditingField(isEditing ? key : null)
                    }
                    onStartEdit={() => setEditingField(key)}
                    onCancelEdit={() => setEditingField(null)}
                  />
                }
              </ShimmerText>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid w-full gap-4 h-full grid-cols-2">
        <div className="flex w-full flex-col gap-4">
          {[
            ["Lifestyle", "lifestyle"],
            ["Brand Audience Keywords", "brand_keywords"],
          ].map(([label, key]) => (
            <Card key={key} title={label as string} className="h-full relative">
              <button
                className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setEditingField(key)}
              >
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
              </button>
              <ShimmerText mode="light" line={1} gap={6} loading={loading}>
                {
                  <EditableField
                    fieldKey={key}
                    value={audience[key]}
                    onSave={onUpdate}
                    isEditing={editingField === key}
                    setIsEditing={(isEditing) =>
                      setEditingField(isEditing ? key : null)
                    }
                    onStartEdit={() => setEditingField(key)}
                    onCancelEdit={() => setEditingField(null)}
                  />
                }
              </ShimmerText>
            </Card>
          ))}
        </div>
        <div className="flex w-full flex-col gap-4">
          {[
            ["Media Habits", "media_habits"],
            ["General Audience Keywords", "general_keywords"],
          ].map(([label, key]) => (
            <Card key={key} title={label as string} className="h-full relative">
              <button
                className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setEditingField(key)}
              >
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
              </button>
              <ShimmerText mode="light" line={1} gap={6} loading={loading}>
                {
                  <EditableField
                    fieldKey={key}
                    value={audience[key]}
                    onSave={onUpdate}
                    isEditing={editingField === key}
                    setIsEditing={(isEditing) =>
                      setEditingField(isEditing ? key : null)
                    }
                    onStartEdit={() => setEditingField(key)}
                    onCancelEdit={() => setEditingField(null)}
                  />
                }
              </ShimmerText>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
