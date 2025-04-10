import EditableField from "./EditableField";

type AudienceHeaderProps = {
  brandName: string | null;
  audienceName: string;
  onUpdate: (field: string, value: string) => void;
};

export const AudienceHeader = ({
  audienceName,
  brandName,
  onUpdate,
}: AudienceHeaderProps) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold">
        {brandName
          ? `${
              brandName.endsWith("s") ? brandName + "’" : brandName + "'s"
            } Neural Audiences`
          : "Audience Segments"}
      </h1>
      <h1 className="text-3xl font-light mb-1">
        <span className="text-gray-700 ">
          <span className="cursor-pointer hover:text-gray-800 transition-all">
            <EditableField
              fieldKey="name"
              value={audienceName}
              onSave={onUpdate}
            />
          </span>
        </span>
      </h1>
    </div>
  );
};
