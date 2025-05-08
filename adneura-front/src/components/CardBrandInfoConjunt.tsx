import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import BrandInfoEditModal from "./BrandInfoEditModal";
import { formatStep } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CardBrandInfoProps {
  cards: Array<{ step: string; content: string }>;
  brand_id?: number;
  disabled?: boolean;
  status?: string;
  onSave?: () => void;
}

const CardBrandInfoConjunt = ({
  cards,
  brand_id,
  disabled,
  onSave,
  status,
}: CardBrandInfoProps) => {
  const [displayedContents, setDisplayedContents] = useState(
    cards.map(() => "")
  );
  const [contentIndices, setContentIndices] = useState(cards.map(() => 0));
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    // Se o status for "complete", exibe todo o conteúdo de todos os cards
    if (status === "complete") {
      setDisplayedContents(cards.map((card) => card.content));
      return;
    }

    // Se já animamos todos os cards, não faz nada
    if (currentCard >= cards.length) return;

    const currentContent = cards[currentCard].content;

    // Se o card atual ainda não terminou a animação, atualiza o conteúdo
    if (contentIndices[currentCard] < currentContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedContents((prev) => {
          const newContents = [...prev];
          newContents[currentCard] = currentContent.slice(
            0,
            contentIndices[currentCard] + 1
          );
          return newContents;
        });
        setContentIndices((prev) => {
          const newIndices = [...prev];
          newIndices[currentCard] = contentIndices[currentCard] + 1;
          return newIndices;
        });
      }, 15);
      return () => clearTimeout(timeout);
    } else {
      // Quando o card atual terminou, avança para o próximo card
      setCurrentCard(currentCard + 1);
    }
  }, [cards, status, currentCard, contentIndices]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="w-full">
        <CardContent className="p-4">
          {cards.slice(0, 3).map((card, idx) => (
            <div key={idx} className="mb-1 last:mb-0">
              <CardHeader className="p-0 pt-4 pb-0">
                <CardTitle className="text-md justify-between w-full flex items-end gap-4 pb-2">
                  <span className="text-black text-lg">
                    {formatStep(card.step)}
                  </span>
                  <BrandInfoEditModal
                    id={brand_id!}
                    disabled={disabled!}
                    step={card.step}
                    content={card.content}
                    onSave={onSave}
                  />
                </CardTitle>
              </CardHeader>
              <div className="p-0 pt-1 ml-4">
                <p>
                  {displayedContents[idx]
                    .split("\n")
                    .map((line: string, lineIdx: number) => (
                      <span key={lineIdx}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default CardBrandInfoConjunt;
