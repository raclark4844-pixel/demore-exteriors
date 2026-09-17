import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstantEstimateWidget from '@/components/InstantEstimateWidget';
import useSEO from '@/hooks/useSEO';

export default function InstantEstimate() {
  useSEO({ title: 'Instant Roof Estimate | Mentor & Northeast Ohio | Demore', description: 'Get a preliminary roof replacement range with satellite data where available or homeowner size inputs. Not a bid. Free inspection from Demore in Northeast Ohio.', canonical: '/instant-estimate', geoCity: 'Mentor, Ohio', schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Instant Satellite Estimate', description: 'Preliminary roof replacement planning range, not a bid. Measurements and pricing require inspection.', url: 'https://www.demoreexteriorsolutions.com/instant-estimate' } });
  return <div className="min-h-screen bg-background text-foreground"><Navbar /><main className="pt-28"><h1 className="text-center text-3xl font-heading font-bold px-4">Explore your roof replacement budget</h1><InstantEstimateWidget /></main><Footer /></div>;
}
