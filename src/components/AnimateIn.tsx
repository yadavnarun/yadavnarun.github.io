import { useEffect, useRef, useState } from "react";

const isMobileCheck = () =>
  typeof window !== "undefined" && window.innerWidth <= 768;

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "p" | "span" | "section";
  style?: React.CSSProperties;
  onClick?: () => void;
}

const AnimateIn = ({
  children,
  className = "",
  as = "div",
  style,
  onClick,
}: AnimateInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mobile = isMobileCheck();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: mobile ? 0.1 : 0.15,
        rootMargin: mobile ? "-10px 0px" : "-40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as any}
      className={`${className} ${visible ? "animate-in" : "animate-out"}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

export default AnimateIn;
