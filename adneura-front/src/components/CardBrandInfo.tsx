import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import BrandInfoEditModal from "./BrandInfoEditModal";
import { formatStep } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CardBrandInfoProps {
  card: { step: string; content: string };
  brand_id?: number;
  index?: number;
  disabled?: boolean;
  status?: string;
  onSave?: () => void;
}

const CardBrandInfo = ({
  card,
  brand_id,
  index,
  disabled,
  onSave,
  status,
}: CardBrandInfoProps) => {
  const [displayedContent, setDisplayedContent] = useState(""); // Estado para o texto exibido gradualmente
  const [contentIndex, setContentIndex] = useState(0); // Índice atual do texto

  useEffect(() => {
    if (status === "complete") {
      setDisplayedContent(card.content); // Se o status for "complete", exibe o conteúdo completo
    } else if (contentIndex < card.content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent((prev) => prev + card.content[contentIndex]); // Adiciona uma letra por vez
        setContentIndex((prev) => prev + 1); // Atualiza o índice
      }, 15); // Ajuste a velocidade do efeito (50ms por letra)

      return () => clearTimeout(timeout); // Limpa o timeout anterior
    }
  }, [contentIndex, card.content, status]);

  return (
    <Card key={index} className="w-full">
      <CardHeader title={card.step} className="p-4 pb-0">
        <CardTitle className="text-md justify-between w-full flex items-end gap-4 pb-2">
          <span className="text-black text-lg">{formatStep(card.step)}</span>
          <BrandInfoEditModal
            id={brand_id!}
            disabled={disabled!}
            step={card.step}
            content={card.content}
            onSave={onSave}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 ml-4">
        <p>
          {displayedContent.split("\n").map((line: string, idx: number) => (
            <span key={idx}>
              {line.split("**").map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
              <br />
            </span>
          ))}
        </p>
      </CardContent>
    </Card>
  );
};

export default CardBrandInfo;
