import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductsIntro() {
  return (
    <section className="pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4 text-muted-foreground leading-relaxed"
      >
        <p>
          Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull
          Counties, including Mentor, Willoughby, Painesville, Stow, Kent, Ravenna, Medina,
          Brunswick, Ashtabula, Warren, and surrounding communities.
        </p>
        <p>
          Based in Mentor, Demore Exterior Solutions installs materials across all eight
          counties — not Mentor alone. The products below are lines we actually use on{" "}
          <Link to="/roofing" className="text-primary hover:underline">roofing</Link>,{" "}
          <Link to="/siding" className="text-primary hover:underline">siding</Link>,{" "}
          <Link to="/windows" className="text-primary hover:underline">windows</Link>, and{" "}
          <Link to="/doors" className="text-primary hover:underline">doors</Link> jobs.
          Materials are sourced through{" "}
          <strong className="text-foreground font-semibold">Apollo Supply Co., Willoughby, OH</strong>.
          For where we work, see{" "}
          <Link to="/service-areas" className="text-primary hover:underline">service areas</Link>,
          or start from the{" "}
          <Link to="/" className="text-primary hover:underline">home page</Link>.
        </p>
      </motion.div>
    </section>
  );
}