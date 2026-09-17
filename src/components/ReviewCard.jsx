import React from "react";
import StarRating from "./StarRating";

export default function ReviewCard({ review }) {
  const date = review.review_date
    ? new Date(review.review_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <StarRating value={review.rating} readonly size={18} />
        {review.source === "google" && (
          <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded">
            Google
          </span>
        )}
      </div>
      <p className="text-foreground/90 text-sm leading-relaxed mb-4 flex-1">
        “{review.comment}”
      </p>
      <div className="flex items-center gap-3 pt-3 border-t border-border/40">
        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-heading font-bold">
          {review.author_name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="font-heading font-semibold text-sm">{review.author_name}</p>
          {date && <p className="text-xs text-muted-foreground">{date}</p>}
        </div>
      </div>
    </div>
  );
}