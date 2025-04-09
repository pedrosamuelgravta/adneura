import React from "react";
import {
  Card as BaseCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CardProps {
  title: string;
  title_position?: "center" | "start" | "end";
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  title_position = "start",
  ...rest
}) => {
  return (
    <BaseCard
      className={`w-full bg-white rounded-md shadow-md ${rest.className}`}
    >
      <CardHeader className="p-4 pb-0">
        <CardTitle
          className={`text-md justify-${title_position} w-full flex items-end gap-4 pb-2`}
        >
          <span className="text-black text-lg">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-1">{children}</CardContent>
    </BaseCard>
  );
};

export default Card;
