import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useSEO from "@/hooks/useSEO";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectOutcomes from "@/components/ProjectOutcomes";
import PhotoLightbox from "@/components/PhotoLightbox";
import { Camera, Facebook, Images, Trash2 } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61584975957822";
const GALLERY_HERO_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/6ca555bf7_generated_image.png";

const CATEGORIES = [
  "All",
  "Roofing",
  "Siding",
  "Gutters",
  "Decks & Outdoor Living",
  "Windows",
  "Doors",
  "Storm Damage",
];

export default function Gallery() {
  useSEO({
    title: "Project Gallery | Demore Exterior Solutions | Mentor OH | Northeast Ohio",
    description:
      "Browse our project gallery: completed roofs, siding, gutters, decks, and storm damage restorations from homes across Northeast Ohio communities.",
    keywords:
      "roofing project photos Mentor Ohio, siding installation gallery Northeast Ohio, deck project photos Ohio, gutter installation pictures, storm damage restoration before after, Demore Exterior Solutions portfolio",
    canonical: "/gallery",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Demore Exterior Solutions Project Gallery",
      description:
        "Photos of completed roofing, siding, gutter, deck, window, door, and storm damage projects by Demore Exterior Solutions across Northeast Ohio.",
      url: "https://www.demoreexteriorsolutions.com/gallery",
      image: {
        "@type": "ImageObject",
        contentUrl: "https://media.base44.com/images/public/user_6a22dc88783b484dd6ef2b08/899ea39b7_Demorelogo.jpg",
        name: "Demore Exterior Solutions Project Gallery",
      },
    },
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    base44.entities.ProjectPhoto
      .list("-created_date", 200)
      .then(setPhotos)
      .catch(() => {})
      .finally(() => setLoading(false));

    base44.auth
      .isAuthenticated()
      .then(setCanManage)
      .catch(() => setCanManage(false));
  }, []);

  const handleDelete = async (photo) => {
    if (!window.confirm("Delete this photo from the gallery?")) return;
    await base44.entities.ProjectPhoto.delete(photo.id);
    setPhotos((prev) => prev.filter((x) => x.id !== photo.id));
  };

  const filtered =
    active === "All" ? photos : photos.filter((p) => p.category === active);

  const navigate = useCallback(
    (dir) => {
      setLightboxIndex((i) => {
        if (i == null) return i;
        const next = dir === "next" ? i + 1 : i - 1;
        return Math.min(Math.max(next, 0), filtered.length - 1);
      });
    },
    [filtered.length]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={GALLERY_HERO_IMG}
            alt="Completed roofing, siding, window, door, and gutter projects by Demore Exterior Solutions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            <Images className="w-4 h-4" />
            Project Gallery
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-heading font-bold mb-4"
          >
            Our Work in Northeast Ohio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6"
          >
            Real roofing, siding, gutter, and deck projects completed by the
            Demore Exterior Solutions team. Click any photo to view it larger.
          </motion.p>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 border border-primary/40 hover:bg-primary/10 text-primary font-heading font-bold text-sm px-5 py-2.5 rounded-md transition-colors">
              <Facebook className="w-4 h-4" /> See More on Facebook
            </button>
          </a>
        </div>
      </section>

      <ProjectOutcomes />
      {/* Filters */}
      <section className="pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? photos.length
                  : photos.filter((p) => p.category === cat).length;
              if (cat !== "All" && count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-colors ${
                    active === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border/50 text-muted-foreground hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground mb-1 font-heading font-semibold text-lg">
                Project photos coming soon
              </p>
              <p className="text-muted-foreground/80 text-sm mb-6">
                We're adding photos of our completed roofing, siding, gutter, and
                deck projects. In the meantime, see our latest work on Facebook.
              </p>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                <button className="inline-flex items-center gap-2 border border-primary/40 hover:bg-primary/10 text-primary font-heading font-bold text-sm px-5 py-2.5 rounded-md transition-colors">
                  <Facebook className="w-4 h-4" /> See Our Work on Facebook
                </button>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${p.title} larger`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  onClick={() => setLightboxIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setLightboxIndex(i);
                  }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 text-left cursor-pointer"
                >
                  <img
                    src={p.image_url}
                    alt={p.title || `${p.category || "Project"} by Demore Exterior Solutions`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  {canManage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p);
                      }}
                      aria-label="Delete photo"
                      className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/60 text-white/80 hover:text-red-400 hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {p.facebook_post_url && (
                      <a
                        href={p.facebook_post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-primary mt-1.5 transition-colors"
                      >
                        <Facebook className="w-3.5 h-3.5" /> View on Facebook
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PhotoLightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigate}
        onDelete={
          canManage
            ? (photo) => {
                handleDelete(photo);
                setLightboxIndex(null);
              }
            : undefined
        }
      />

      <Footer />
    </div>
  );
}