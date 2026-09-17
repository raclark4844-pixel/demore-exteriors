import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useSEO from "@/hooks/useSEO";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { Star, PenLine } from "lucide-react";

export default function Reviews() {
  useSEO({
    title: "Customer Reviews | Demore Exterior Solutions | Mentor OH | Northeast Ohio",
    description:
      "Read real customer reviews of Demore Exterior Solutions and leave your own star rating for our roofing, siding, and gutter work across Northeast Ohio.",
    keywords:
      "Demore Exterior Solutions reviews, roofing contractor reviews Mentor Ohio, siding reviews Lake County, gutter installation reviews Northeast Ohio, deck builder reviews Ohio, customer reviews roofing Mentor",
    canonical: "/reviews",
    geoCity: "Mentor, Ohio",
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    base44.entities.Review
      .list("-review_date", 200)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            <Star className="w-4 h-4 fill-primary" />
            Customer Reviews
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-heading font-bold mb-4"
          >
            What Northeast Ohio Homeowners Say
          </motion.h1>
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i <= Math.round(avg)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/60"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground font-medium">
                {avg.toFixed(1)} out of 5 · {reviews.length} reviews
              </span>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/review-us">
              <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors">
                <PenLine className="w-4 h-4" /> Write a Review
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* All Reviews */}
      <section id="all-reviews" className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No reviews yet. Be the first to share your experience below!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                >
                  <ReviewCard review={r} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Write a Review */}
      <section id="write" className="py-20 bg-secondary/20 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">
              Share Your Experience
            </span>
            <h2 className="text-3xl font-heading font-bold mt-2 mb-3">
              Write a Review
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Worked with us recently? Let other Northeast Ohio homeowners know
              how it went. Rate us 0–5 stars and leave a comment.
            </p>
          </div>
          <ReviewForm onSubmitted={load} />
        </div>
      </section>

      <Footer />
    </div>
  );
}