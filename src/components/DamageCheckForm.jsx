import React, { useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, X, Phone, Loader2, ShieldCheck, Sparkles, CalendarCheck } from "lucide-react";

const MAX_PHOTOS = 3;

export default function DamageCheckForm() {
  const formId = useId();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState("");
  const [lead, setLead] = useState({ name: "", phone: "", email: "", address: "", message: "" });
  const [leadSending, setLeadSending] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState("");
  const fileInputRef = useRef(null);

  const uploadFiles = async (files) => {
    if (!files.length || uploading) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const res = await base44.integrations.Core.UploadFile({ file });
          return { url: res.file_url || res.data?.file_url, name: file.name };
        })
      );
      setPhotos((prev) => [...prev, ...uploaded].slice(0, MAX_PHOTOS));
    } catch {
      setError("One or more photos failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - photos.length);
    e.target.value = "";
    uploadFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - photos.length);
    uploadFiles(files);
  };

  const analyze = async () => {
    if (!photos.length || analyzing) return;
    setAnalyzing(true);
    setError("");
    setAssessment(null);
    try {
      const res = await base44.functions.invoke("analyzeStormDamagePhoto", {
        image_urls: photos.map((p) => p.url),
      });
      const text = res.data?.assessment;
      if (!text) throw new Error("Empty assessment");
      setAssessment(text);
    } catch {
      setError("Sorry, we couldn't analyze your photos right now. Please try again or call (440) 920-6133.");
    } finally {
      setAnalyzing(false);
    }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (!lead.name.trim() || !lead.phone.trim()) return;
    setLeadSending(true);
    setLeadError("");
    try {
      await base44.entities.ContactLead.create({
        name: lead.name.trim(),
        phone: lead.phone.trim(),
        email: lead.email.trim(),
        address: lead.address.trim(),
        service_type: "storm_damage",
        status: "new",
        message: [
          lead.message.trim(),
          assessment ? "Lead came from the AI Damage Check page after a photo assessment." : "",
        ]
          .filter(Boolean)
          .join(" — "),
      });
      setLeadSent(true);
    } catch {
      setLeadError("We couldn't submit your request. Please call us at (440) 920-6133.");
    } finally {
      setLeadSending(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Upload + assessment */}
      <div className="space-y-5">
        <div
          onClick={() => !uploading && photos.length < MAX_PHOTOS && fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/60 transition-colors bg-card/50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          {uploading ? (
            <Loader2 className="w-10 h-10 mx-auto text-primary mb-3 animate-spin" />
          ) : (
            <CloudUpload className="w-10 h-10 mx-auto text-primary mb-3" />
          )}
          <p className="font-heading font-bold mb-1">
            {uploading ? "Uploading your photos…" : "Upload photos of the damage"}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag & drop or click — up to {MAX_PHOTOS} photos of your roof, siding, or gutters
          </p>
        </div>

        {photos.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {photos.map((p, i) => (
              <div key={p.url} className="relative">
                <img src={p.url} alt={p.name} className="w-24 h-24 rounded-lg object-cover border border-border" />
                <button
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 hover:text-primary transition-colors"
                  aria-label="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={analyze}
          disabled={!photos.length || analyzing || uploading}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold h-11"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your photos…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Get My Free Damage Assessment
            </>
          )}
        </Button>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        {assessment && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-primary/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold">Preliminary AI Assessment</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_p]:mb-2">
              <ReactMarkdown>{assessment}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>

      {/* CTA + lead capture */}
      <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 sm:p-8">
        <ShieldCheck className="w-8 h-8 text-primary mb-3" />
        <h3 className="font-heading font-bold text-xl sm:text-2xl mb-2">
          Claim Your FREE Inspection
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          Let our team verify the damage in person — at no cost, no obligation. If it's
          storm related, we'll walk you through the insurance claim and you owe us
          nothing unless the claim is approved.
        </p>

        {leadSent ? (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <CalendarCheck className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-heading font-bold mb-1">You're on the schedule board!</p>
            <p className="text-sm text-muted-foreground mb-4">
              We received your request and will call you shortly to confirm your free
              inspection.
            </p>
            <a href="tel:4409206133" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Phone className="w-4 h-4" /> Need it sooner? Call (440) 920-6133
            </a>
          </div>
        ) : (
          <form onSubmit={submitLead} className="space-y-3">
            <div className="space-y-1.5">
            <label htmlFor={`${formId}-name`} className="block text-sm font-medium">Full name (required)</label>
            <Input
              id={`${formId}-name`}
              name="name"
              autoComplete="name" required
              placeholder="Full name *"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className="bg-card border-border/60 text-base md:text-sm"
            />
            </div>
            <div className="space-y-1.5">
            <label htmlFor={`${formId}-phone`} className="block text-sm font-medium">Phone (required)</label>
            <Input
              id={`${formId}-phone`}
              name="phone"
              autoComplete="tel" inputMode="tel" required
              placeholder="Phone *"
              type="tel"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              className="bg-card border-border/60 text-base md:text-sm"
            />
            </div>
            <div className="space-y-1.5">
            <label htmlFor={`${formId}-email`} className="block text-sm font-medium">Email (optional)</label>
            <Input
              id={`${formId}-email`}
              name="email"
              autoComplete="email"
              placeholder="Email"
              type="email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className="bg-card border-border/60 text-base md:text-sm"
            />
            </div>
            <div className="space-y-1.5">
            <label htmlFor={`${formId}-address`} className="block text-sm font-medium">Property address (optional)</label>
            <Input
              id={`${formId}-address`}
              name="address"
              autoComplete="street-address"
              placeholder="Property address"
              value={lead.address}
              onChange={(e) => setLead({ ...lead, address: e.target.value })}
              className="bg-card border-border/60 text-base md:text-sm"
            />
            </div>
            <div className="space-y-1.5">
            <label htmlFor={`${formId}-message`} className="block text-sm font-medium">Anything we should know? (optional)</label>
            <Textarea
              id={`${formId}-message`}
              name="message"
              
              placeholder="Anything we should know? (optional)"
              rows={2}
              value={lead.message}
              onChange={(e) => setLead({ ...lead, message: e.target.value })}
              className="bg-card border-border/60 text-base md:text-sm"
            />
            </div>
            <Button
              type="submit"
              disabled={leadSending || !lead.name.trim() || !lead.phone.trim()}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold h-11"
            >
              {leadSending ? "Sending…" : "Book My Free Inspection"}
            </Button>
            {leadError && <p role="alert" className="text-sm text-destructive text-center">{leadError}</p>}
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Phone className="w-3 h-3" /> Prefer to talk now? Call{" "}
              <a href="tel:4409206133" className="text-primary font-semibold">(440) 920-6133</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}