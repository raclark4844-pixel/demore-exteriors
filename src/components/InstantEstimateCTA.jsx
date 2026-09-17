import { Link } from 'react-router-dom';

export default function InstantEstimateCTA() {
  return <section className="px-4 py-10 bg-primary/5 border-y border-primary/20" aria-label="Roof budget calculator"><div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-6 justify-between"><div><h2 className="text-2xl font-heading font-bold">Wondering what a new roof could cost?</h2><p className="text-muted-foreground mt-2 max-w-xl">Try our Instant Satellite Estimate. Satellite data where available, or your property details. A preliminary range, not a bid.</p></div><Link to="/instant-estimate" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground px-5 py-3 font-bold">Get an instant estimate</Link></div></section>;
}
