import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

export default function ContactSection({ mode = "estimate" }) {
  const inspectionMode = mode === "inspection";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    service_type: "",
    insurance_claim_filed: "not_sure",
    message: "",
    lead_source: "website",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [areaTab, setAreaTab] = useState("Residential");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await base44.entities.ContactLead.create({
        ...form,
        ...(inspectionMode ? { description: "Website inspection request" } : {}),
      });
      setSubmitted(true);
    } catch {
      setSubmitError("We couldn't submit your request. Please try again or call (440) 920-6133.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">Get Started</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3 mb-4">
            {inspectionMode ? "Request Your Free Inspection" : "Request Your Free Estimate"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {inspectionMode
              ? "Free, no-obligation inspection for Northeast Ohio homeowners. Give us the property address so we can prepare before we contact you."
              : "Fill out the form below or call us directly. We respond to all inquiries within 24 hours."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="bg-card border border-primary/30 rounded-2xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold mb-2">Thank You!</h3>
                <p className="text-muted-foreground">
                  {inspectionMode
                    ? "We’ve received your request and will contact you to schedule your free inspection."
                    : "We've received your request and will be in touch within 24 hours."}
                </p>
                {inspectionMode && (
                  <a href="tel:+14409206133" className="inline-flex items-center justify-center gap-2 mt-5 text-primary font-heading font-bold hover:underline">
                    <Phone className="w-4 h-4" /> Need us sooner? Call (440) 920-6133
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input id="name" required placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary/50 border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
                    <Input id="phone" required type="tel" placeholder="(440) 920-6133" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary/50 border-border/50" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary/50 border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-sm font-medium">Service Needed</Label>
                    <Select value={form.service_type} onValueChange={(v) => setForm({ ...form, service_type: v })}>
                      <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue placeholder="Select a service" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roofing">Roofing</SelectItem>
                        <SelectItem value="siding">Siding</SelectItem>
                        <SelectItem value="gutters">Gutters</SelectItem>
                        <SelectItem value="windows">Windows</SelectItem>
                        <SelectItem value="doors">Doors</SelectItem>
                        <SelectItem value="decks">Decks & Outdoor Living</SelectItem>
                        <SelectItem value="storm_damage">Storm Damage</SelectItem>
                        <SelectItem value="multiple">Multiple Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Property Address {inspectionMode ? "*" : ""}</Label>
                  <Input
                    id="address"
                    required={inspectionMode}
                    autoComplete="street-address"
                    placeholder="123 Main St, Mentor, OH 44060"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">Full address helps us prepare measurements, service-area details and storm context before we call.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance-claim" className="text-sm font-medium">Insurance claim already filed?</Label>
                  <Select value={form.insurance_claim_filed} onValueChange={(v) => setForm({ ...form, insurance_claim_filed: v })}>
                    <SelectTrigger id="insurance-claim" className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="not_sure">Not sure / not applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">Tell Us More</Label>
                  <Textarea id="message" rows={4} placeholder="Describe your project, storm date, active leak, or damage..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary/50 border-border/50 resize-none" />
                </div>

                {submitError && <p role="alert" className="text-red-600">{submitError}</p>}
                <Button type="submit" disabled={submitting} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base h-14">
                  {submitting ? "Submitting..." : inspectionMode ? "Request a Free Inspection" : "Request Free Estimate"}
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg mb-4">Contact Information</h3>
              <div className="space-y-4">
                <a href="tel:4409206133" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">(440) 920-6133</p>
                    <p className="text-xs text-muted-foreground">Office hours Mon–Sat, 7AM–7PM</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium">6348 Meldon Dr</p><p className="text-xs text-muted-foreground">Mentor, OH 44060</p></div>
                </div>

                <a href="mailto:ryan@demoreexteriorsolutions.com" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-sm font-medium group-hover:text-primary transition-colors">ryan@demoreexteriorsolutions.com</p><p className="text-xs text-muted-foreground">We reply within 24 hours</p></div>
                </a>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg mb-3">Service Area</h3>
              <div className="flex gap-2 mb-3">
                {["Residential", "Commercial"].map((type) => (
                  <button key={type} onClick={() => setAreaTab(type)} className={`text-xs px-3 py-1 rounded-full font-heading font-semibold transition-colors ${areaTab === type ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-primary"}`}>{type}</button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-2">Click a county to explore {areaTab.toLowerCase()} services:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Cuyahoga", slug: "cuyahoga" }, { name: "Lake", slug: "lake" }, { name: "Geauga", slug: "geauga" }, { name: "Summit", slug: "summit" },
                  { name: "Medina", slug: "medina" }, { name: "Portage", slug: "portage" }, { name: "Ashtabula", slug: "ashtabula" }, { name: "Trumbull", slug: "trumbull" }
                ].map(county => (
                  <Link key={county.slug} to={`/service-area/${county.slug}`} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">{county.name} County</Link>
                ))}
              </div>
            </div>

            <div className="bg-card border border-primary/20 rounded-2xl p-6 text-center">
              <p className="text-sm font-heading font-semibold text-primary mb-1">Emergency Storm Damage?</p>
              <p className="text-xs text-muted-foreground mb-3">Call now for storm intake and priority inspection routing</p>
              <a href="tel:4409206133"><Button className="bg-primary hover:bg-primary/90 font-heading font-bold w-full"><Phone className="w-4 h-4 mr-2" />(440) 920-6133</Button></a>
              <Link to="/storm-damage" className="inline-block mt-3 text-xs text-primary hover:underline">Storm damage help →</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}