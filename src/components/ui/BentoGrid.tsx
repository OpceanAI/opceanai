"use client";

interface BentoCell {
  id: string;
  title: string;
  description?: string;
  variant?: "glass" | "solid" | "gradient" | "image";
  size?: "default" | "featured" | "wide" | "tall";
  image?: string;
  content?: React.ReactNode;
  interactive?: boolean;
  animated?: boolean;
}

interface BentoGridProps {
  cells: BentoCell[];
  className?: string;
}

export default function BentoGrid({ cells, className = "" }: BentoGridProps) {
  return (
    <div className={`bento-grid ${className}`}>
      {cells.map((cell) => {
        const sizeClass = {
          default: "",
          featured: "bento-cell-featured",
          wide: "bento-cell-wide",
          tall: "bento-cell-tall",
        }[cell.size || "default"];

        const variantClass = {
          glass: "bento-cell-glass",
          solid: "bento-cell-solid",
          gradient: "bento-cell-gradient",
          image: "bento-cell-image",
        }[cell.variant || "glass"];

        return (
          <div
            key={cell.id}
            className={`bento-cell ${sizeClass} ${variantClass} ${cell.interactive ? "bento-cell-interactive" : ""} ${cell.animated ? "bento-cell-animated" : ""} ${cell.image ? "bento-cell-image" : ""}`}
            style={cell.image ? { backgroundImage: `url(${cell.image})` } : undefined}
          >
            <h3 className="font-display text-lg font-medium text-text-primary mb-2">{cell.title}</h3>
            {cell.description && (
              <p className="text-sm text-text-tertiary leading-relaxed">{cell.description}</p>
            )}
            {cell.content}
          </div>
        );
      })}
    </div>
  );
}
