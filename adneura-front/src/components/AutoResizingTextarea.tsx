import React, { useRef, useEffect, ChangeEvent } from "react";
import { Textarea } from "./ui/textarea";

interface AutoResizingTextareaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const AutoResizingTextarea: React.FC<AutoResizingTextareaProps> = ({
  value,
  onChange,
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `calc(${textareaRef.current.scrollHeight}px + 1rem)`;
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={className}
      spellCheck={false}
    />
  );
};

export default AutoResizingTextarea;
