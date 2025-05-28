import { Audience } from "@/@types/Audience";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Props {
  audience: Audience;
  visibleFields: (keyof Audience)[];
  viewMode: "grid" | "list";
  handleNavigateClick: (id: number, name: string) => void;
}

const fetchImage = async (imgName: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND}/images/${imgName}`
    );
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

const AudienceSegmentCard: React.FC<Props> = ({
  audience,
  visibleFields,
  viewMode,
  handleNavigateClick,
}) => {
  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ["audience-image", audience.audience_img],
    queryFn: async () => {
      const result = await fetchImage(audience.audience_img!);
      if (!result) throw new Error("Image not ready");
      return result;
    },
    retry: true,
    retryDelay: (attemptIndex) => Math.min(3000 * attemptIndex, 15000),
  });

  const keyTags = getFirstThreeStrings(audience.key_tags);

  function getFirstThreeStrings(text: any) {
    const lines = text.split("\n");
    const firstLine = lines.find((line: any) => line.trim().length > 0) || text;

    const firstThree = firstLine
      .split(",")
      .map((item: any) => item.trim())
      .slice(0, 3);

    return firstThree;
  }

  return (
    <div
      key={audience.id}
      className={`flex ${
        viewMode === "list" ? "flex-row items-center" : "flex-col"
      } p-4 bg-white rounded-md w-full h-auto border border-gray-200 transition-all hover:shadow-lg cursor-pointer mt-0`}
      onClick={() => handleNavigateClick(audience.id!, audience.name!)}
    >
      {visibleFields.includes("audience_img") && (
        <div
          className={`${
            viewMode === "list" ? "w-96 h-full mr-4" : "w-full h-[250px]"
          } flex items-center justify-center bg-gray-100 rounded-sm`}
        >
          {isLoading || !imageUrl ? (
            <span className="text-gray-500 text-sm animate-spin">
              <Loader2 />
            </span>
          ) : (
            <img
              src={imageUrl}
              alt={audience.name}
              className="object-cover w-full h-full rounded-sm"
            />
          )}
        </div>
      )}

      <div className={viewMode === "list" ? "flex-grow" : ""}>
        {visibleFields.includes("name") && (
          <h2 className="text-xl font-bold mt-3">{audience.name}</h2>
        )}
        {visibleFields.includes("description") && (
          <p className="text-gray-500 text-base mt-1">{audience.description}</p>
        )}
        {visibleFields.includes("demographics") && audience.demographics && (
          <div className="mt-2">
            <h3 className="font-semibold">Demographics:</h3>
            <div
              className={`${
                viewMode === "list" ? "flex flex-wrap gap-4" : "flex flex-col"
              }`}
            >
              {Object.entries(audience.demographics)
                .filter(([key]) =>
                  ["gender", "age_bracket", "hhi"].includes(key)
                )
                .map(([key, value]) => {
                  const formattedKey =
                    key === "hhi"
                      ? key.toUpperCase()
                      : key
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");
                  return (
                    <p key={key} className="text-gray-600 text-sm">
                      <strong>{formattedKey}:</strong> {value}
                    </p>
                  );
                })}
            </div>
          </div>
        )}

        {visibleFields.includes("psycho_graphic") && (
          <div className="mt-2">
            <h3 className="font-semibold">Psychographic:</h3>
            <p className="text-gray-600 text-sm">{audience.psycho_graphic}</p>
          </div>
        )}
        {visibleFields.includes("attitudinal") && (
          <div className="mt-2">
            <h3 className="font-semibold">Attitudinal:</h3>
            <p className="text-gray-600 text-sm">{audience.attitudinal}</p>
          </div>
        )}
        {visibleFields.includes("self_concept") && (
          <div className="mt-2">
            <h3 className="font-semibold">Self Concept:</h3>
            <p className="text-gray-600 text-sm">{audience.self_concept}</p>
          </div>
        )}
        {visibleFields.includes("lifestyle") && (
          <div className="mt-2">
            <h3 className="font-semibold">Lifestyle:</h3>
            <p className="text-gray-600 text-sm">{audience.lifestyle}</p>
          </div>
        )}
        {visibleFields.includes("media_habits") && (
          <div className="mt-2">
            <h3 className="font-semibold">Media Habits:</h3>
            <p className="text-gray-600 text-sm">{audience.media_habits}</p>
          </div>
        )}
        {visibleFields.includes("general_keywords") && (
          <div className="mt-2">
            <h3 className="font-semibold">General Keywords:</h3>
            <p className="text-gray-600 text-sm">{audience.general_keywords}</p>
          </div>
        )}
        {visibleFields.includes("brand_keywords") && (
          <div className="mt-2">
            <h3 className="font-semibold">Brand Keywords:</h3>
            <p className="text-gray-600 text-sm">{audience.brand_keywords}</p>
          </div>
        )}
        {visibleFields.includes("key_tags") && (
          <div className="mt-2 flex flex-col gap-1 flex-wrap">
            <h3 className="font-semibold">Key Tags:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {keyTags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudienceSegmentCard;
