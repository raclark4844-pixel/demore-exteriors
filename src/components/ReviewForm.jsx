import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "./StarRating";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ReviewForm({ onSubmitted }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (rating === 0) return setError("Please select a star rating.");
    if (!comment.trim()) return setError("Please write a comment.");
    setSubmitting(true);
    try {
      await base44.entities.Review.create({
        author_name: name.trim(),
        rating,
        comment: comment.trim(),
        source: "website",
        review_date: new Date().toISOString().slice(0, 10),
      });
      setSuccess(true);
      setName("");
      setRating(0);
      setComment("");
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError("Something went wrong submitting your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center max-w-xl mx-auto">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-heading font-bold text-xl mb-2">Thank you for your review!</h3>
        <p className="text-muted-foreground mb-6">
          Your feedback helps other Northeast Ohio homeowners.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          Write another review
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 space-y-5 max-w-xl mx-auto"
    >
      <div>
        <Label htmlFor="rev-name">Your Name *</Label>
        <Input
          id="rev-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John D."
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Rating (0–5 stars) *</Label>
        <div className="mt-2">
          <StarRating value={rating} onChange={setRating} size={28} />
        </div>
      </div>
      <div>
        <Label htmlFor="rev-comment">Your Review *</Label>
        <Textarea
          id="rev-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience with Demore Exterior Solutions..."
          className="mt-1.5 min-h-[120px]"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        disabled={submitting}
        className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold w-full sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}