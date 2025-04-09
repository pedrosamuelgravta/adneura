import { useEffect, useState } from "react";

type EditableFieldProps = {
  fieldKey: string;
  value: string;
  onSave: (field: string, value: string) => void;
  extraClass?: string;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
};

const EditableField = ({
  fieldKey,
  value,
  onSave,
  extraClass = "",
  isEditing,
  onCancelEdit,
}: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleBlur = () => {
    onSave(fieldKey, val);
    if (onCancelEdit) onCancelEdit();
    setEditing(false);
  };

  return editing || isEditing ? (
    <input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBlur();
      }}
      autoFocus
      className={`w-full bg-transparent border-b-2 border-black p-0 focus:outline-none ${extraClass}`}
    />
  ) : (
    <span
      className={`cursor-pointer hover:border-b-2 hover:border-black ${extraClass}`}
      onClick={() => setEditing(true)}
    >
      {value}
    </span>
  );
};

export default EditableField;
