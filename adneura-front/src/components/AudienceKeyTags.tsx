export const AudienceKeyTags = ({ keyTags }: { keyTags: string[] }) => {
  return (
    <section className="flex justify-between w-full items-center gap-4">
      <div className="flex gap-4 flex-wrap">
        <h3 className="font-semibold">Key Tags:</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {keyTags.map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 text-xs font-semibold  px-2.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
