import React, { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ value = 0, onChange, size = 20, readonly = false }) {
  const [hover, setHover] = useState(null);
  const display = hover ?? value;
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((i) => {
        const filled = i <= display;
        const icon = (
          <Star
            style={{ width: size, height: size }}
            className={`${filled ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/60"} transition-colors`}
            strokeWidth={1.5}
          />
        );
        if (readonly) return <span key={i}>{icon}</span>;
        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange && onChange(i === value ? 0 : i)}
            className="transition-transform hover:scale-110"
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}