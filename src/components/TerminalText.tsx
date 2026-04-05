import { useState, useEffect } from "react";

interface TerminalTextProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

const TerminalText = ({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  className = "",
  onComplete,
}: TerminalTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [displayedText, text, speed, hasStarted, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className={`cursor ${isComplete ? "cursor--blink" : ""}`} />
      )}
    </span>
  );
};

export default TerminalText;
