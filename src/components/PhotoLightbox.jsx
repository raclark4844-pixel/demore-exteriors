import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Facebook, Trash2 } from "lucide-react";

export default function PhotoLightbox({ photos, index, onClose, onNavigate, onDelete }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate("next");
      if (e.key === "ArrowLeft") onNavigate("prev");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate]);

  if (index == null) return null;
  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>

      {onDelete && (
        <button
          className="absolute top-4 right-16 text-white/80 hover:text-red-400 p-2"
          onClick={(e) => { e.stopPropagation(); onDelete(photo); }}
          aria-label="Delete photo"
        >
          <Trash2 className="w-7 h-7" />
        </button>
      )}

      <button
        className="absolute left-4 text-white/80 hover:text-white p-2 disabled:opacity-30"
        onClick={(e) => { e.stopPropagation(); onNavigate("prev"); }}
        disabled={index === 0}
        aria-label="Previous"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.image_url}
          alt={photo.title || `${photo.category || "Project"} by Demore Exterior Solutions`}
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
        />
        <div className="text-center mt-4 text-white">
          {photo.facebook_post_url && (
            <a
              href={photo.facebook_post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-primary mt-3 transition-colors"
            >
              <Facebook className="w-4 h-4" /> View on Facebook
            </a>
          )}
        </div>
      </div>

      <button
        className="absolute right-4 text-white/80 hover:text-white p-2 disabled:opacity-30"
        onClick={(e) => { e.stopPropagation(); onNavigate("next"); }}
        disabled={index === photos.length - 1}
        aria-label="Next"
      >
        <ChevronRight className="w-10 h-10" />
      </button>
    </div>
  );
}