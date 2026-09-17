import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Star, ArrowRight, PenLine } from "lucide-react";
import ReviewCard from "./ReviewCard";

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Review.list("-review_date", 50)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;
  const latest = reviews.slice(0, 2);

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">
            Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2 mb-4">
            What Our Customers Say
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= Math.round(avg)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/60"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                {avg.toFixed(1)} from {reviews.length} reviews
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : latest.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No reviews yet — be the first to share your experience!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {latest.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ReviewCard review={r} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/reviews">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors">
              Read All Reviews <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/reviews#write">
            <button className="inline-flex items-center gap-2 border border-primary/40 hover:bg-primary/10 text-primary font-heading font-bold text-sm px-6 py-3 rounded-md transition-colors">
              <PenLine className="w-4 h-4" /> Write a Review
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}