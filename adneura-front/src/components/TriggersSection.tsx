import { Trigger } from "@/@types/Trigger";
import TriggerCard from "./TriggerCard";
import { Audience } from "@/@types/Audience";

type TriggersSectionProps = {
  audience: Audience;
  setAudience: (value: Audience) => void;
  triggers: Trigger[];
  onStartEditing: (id: number, field: string, currentValue: string) => void;
  onChangeEditingValue: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFinishEditing: (id: number) => void;
  editingTriggerId: number | null;
  editingFieldKey: string | null;
  editingValue: string;
};

export const TriggersSection = ({
  setAudience,
  triggers,
  onStartEditing,
  onChangeEditingValue,
  onFinishEditing,
  editingTriggerId,
  editingFieldKey,
  editingValue,
}: TriggersSectionProps) => {
  return (
    <div className="flex flex-col w-full gap-4 mt-10">
      <div className="flex flex-row justify-between gap-4 w-full">
        <h1 className="text-2xl font-bold mb-1">Triggers</h1>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {triggers.map((trigger: Trigger) => (
          <TriggerCard
            key={trigger.id}
            trigger={trigger}
            editingTriggerId={editingTriggerId}
            editingFieldKey={editingFieldKey}
            editingValue={editingValue}
            onStartEditing={onStartEditing}
            onChangeEditingValue={onChangeEditingValue}
            onFinishEditing={onFinishEditing}
            setAudience={setAudience}
          />
        ))}
      </div>
    </div>
  );
};
