import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, ExternalLink, FileCheck2, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";

const RULE_URL = "https://codes.ohio.gov/ohio-administrative-code/rule-3901-1-54";
const ODI_COMPLAINT_URL = "https://gateway.insurance.ohio.gov/UI/ODI.Enf.Public.UI/Complaint/DisplayComplaintInformation";

const TOPICS = {
  supplements: {
    title: "What Is an Insurance Supplement?",
    shortTitle: "Insurance Supplements",
    description: "A contractor supplement is documentation asking an insurer to review additional repair scope or cost not included in its original property estimate.",
    keywords: "insurance supplement Ohio roof claim, roofing supplement Northeast Ohio, siding insurance supplement, contractor supplement property claim Ohio",
    answer: "A supplement is a request for the insurance carrier to review additional documented repair scope or cost that was not included, or was not fully included, in the carrier's original estimate. It does not guarantee additional payment; the carrier reviews the documentation under the policy.",
    sections: [
      ["Why supplements happen", "Initial estimates can miss measurements, required components, access needs, material availability, code-related work, labor operations or damage that becomes clear once work is planned or opened up."],
      ["What Demore can provide", "As the contractor, Demore can provide measurements, photographs, material information, invoices, estimates and a construction explanation of why a repair operation is needed."],
      ["What Demore does not decide", "The insurance carrier decides coverage and claim payment under the policy. Demore does not act as the insurer, attorney or public adjuster."],
      ["Best homeowner recordkeeping", "Keep the carrier estimate, claim number, adjuster contact, photographs, contractor estimate, material reports and written carrier responses together. That makes any scope discussion easier to follow."]
    ],
    faqs: [
      ["Does a supplement mean the first estimate was wrong?", "Not necessarily. A supplement can address new information, omitted operations, updated measurements, material availability or repair details that were not reflected in the first estimate."],
      ["Who submits the supplement?", "Depending on the carrier and claim, the homeowner or contractor may send contractor documentation for review. The insurer still makes the coverage and payment decision."],
      ["Can Demore document a supplement?", "Yes. We can document the construction scope, measurements, photos, materials and pricing for work we believe is required to perform the repair properly."]
    ],
    sourceLabel: "Ohio claims-settlement standards",
    sourceUrl: RULE_URL
  },
  "ohio-matching": {
    title: "Ohio Matching for Siding, Roofing & Exterior Materials",
    shortTitle: "Ohio Matching",
    description: "Ohio Administrative Code 3901-1-54 includes a reasonably-comparable-appearance standard for certain replacement-cost property losses.",
    keywords: "Ohio matching rule siding, Ohio matching law roofing, reasonably comparable appearance Ohio 3901-1-54, siding match insurance Ohio",
    answer: "Ohio Administrative Code 3901-1-54(I)(1)(b) states that when a covered interior or exterior replacement-cost loss requires replacement of an item and the replacement does not match the quality, color or size of the damaged item, the insurer shall replace as much as needed to result in a reasonably comparable appearance. The rule applies in the circumstances described by the rule and policy; it is not a blanket promise of whole-house replacement in every claim.",
    sections: [
      ["The key phrase", "The Ohio rule uses the standard “reasonably comparable appearance.” That is more specific than simply asking whether a replacement product can physically fit."],
      ["Why material availability matters", "Discontinued profiles, different exposure, texture, gloss, color, thickness or weathering can affect whether a spot repair creates a reasonably comparable appearance."],
      ["Useful contractor evidence", "Clear elevation photos, a physical test fit, manufacturer or distributor availability information, ITEL or similar material reports when appropriate, and measurements can help document the construction issue."],
      ["Important limitation", "The rule itself says it does not create or imply a private cause of action. Coverage also depends on the policy and facts of the loss. Homeowners with legal questions should consult a qualified attorney or the Ohio Department of Insurance."]
    ],
    faqs: [
      ["Does Ohio require every elevation to be replaced if one piece is damaged?", "The rule does not say that automatically. It says the insurer shall replace as much as needed to result in a reasonably comparable appearance when the rule's replacement-cost matching provision applies."],
      ["Is “paint to match” always enough?", "Not automatically. Appearance involves the actual result, and texture, profile, size and material characteristics can matter in addition to color."],
      ["What can Demore document?", "We can document the existing product, replacement options, test-fit results, elevation conditions, measurements and the repair scope from a contractor's perspective."]
    ],
    sourceLabel: "Ohio Administrative Code 3901-1-54",
    sourceUrl: RULE_URL
  },
  "acv-vs-rcv": {
    title: "ACV vs. RCV on an Ohio Property Claim",
    shortTitle: "ACV vs. RCV",
    description: "Actual cash value and replacement cost value are different property-claim valuation concepts. Here is the plain-English difference for Ohio homeowners.",
    keywords: "ACV vs RCV Ohio roof claim, actual cash value replacement cost Ohio insurance, roof depreciation Ohio claim",
    answer: "Replacement cost value (RCV) generally refers to the cost to replace damaged property with new property of like kind and quality, subject to the policy. Actual cash value (ACV) is a depreciated value. Ohio Rule 3901-1-54(I)(2)(a), for losses settled on an ACV basis under the rule, describes ACV as replacement cost at the time of loss, including sales tax, less depreciation.",
    sections: [
      ["Why the first payment may be lower", "On policies with recoverable depreciation, a carrier may initially pay an ACV amount and hold back eligible depreciation until policy conditions for replacement or repair are satisfied."],
      ["RCV does not mean every cost is automatically covered", "Coverage, deductibles, limits, exclusions, code coverage and policy conditions still control what the insurer pays."],
      ["ACV documentation in Ohio", "Under Ohio Rule 3901-1-54(I)(2)(a), when the rule's ACV provision applies, the insured may request documentation detailing the depreciation deductions."],
      ["Contractor role", "Demore can provide a repair/replacement estimate and completion documentation. We do not determine the carrier's coverage obligation."]
    ],
    faqs: [
      ["Is ACV the same as market value?", "Not under the Ohio rule's stated ACV calculation for the covered property losses it addresses. The rule describes replacement cost at the time of loss, including sales tax, less depreciation."],
      ["Can I ask the carrier how it calculated depreciation?", "Yes. Ohio Rule 3901-1-54(I)(2)(a) says the insurer shall provide documentation detailing depreciation deductions upon the insured's request when that provision applies."],
      ["What does Demore need from me?", "The carrier estimate and scope are helpful. We can compare them with field measurements and the construction scope required for the project."]
    ],
    sourceLabel: "Ohio Administrative Code 3901-1-54",
    sourceUrl: RULE_URL
  },
  depreciation: {
    title: "Depreciation & Depreciation Release After Repairs",
    shortTitle: "Depreciation Release",
    description: "Understand withheld or recoverable depreciation, completion documentation and the difference between contractor paperwork and carrier coverage decisions.",
    keywords: "depreciation release roof claim Ohio, recoverable depreciation roofing, withheld depreciation insurance Ohio, certificate of completion insurance claim",
    answer: "Depreciation is a reduction in value based on factors such as age and condition. On some replacement-cost policies, part of that depreciation may be recoverable after eligible repair or replacement work is completed and policy requirements are met. The exact release process comes from the policy and carrier, not from the contractor.",
    sections: [
      ["What may be requested after completion", "Carriers commonly request proof that covered work was completed, such as a final invoice, completion documentation, photographs or other records. Requirements vary by policy and carrier."],
      ["Ask for the depreciation breakdown", "Ohio Rule 3901-1-54(I)(2)(a) says that when its ACV provision applies, the insurer shall provide documentation detailing all depreciation deductions upon the insured's request."],
      ["Recoverable vs. nonrecoverable depreciation", "Whether depreciation is recoverable depends on the policy and the item. Do not assume all withheld depreciation will be released."],
      ["Demore's role", "We can provide final construction invoices, scope information and completion documentation for work we performed. The carrier decides whether additional claim funds are payable."]
    ],
    faqs: [
      ["When is recoverable depreciation paid?", "Timing depends on the policy and carrier process. It is commonly reviewed after eligible work is completed and requested documentation is submitted."],
      ["Can Demore request the release paperwork?", "We can provide contractor completion documents and invoices and can send them to the claim contact when authorized by the homeowner."],
      ["What if the carrier's depreciation calculation is unclear?", "The insured can request the depreciation documentation described in Ohio Rule 3901-1-54(I)(2)(a) when that rule provision applies."]
    ],
    sourceLabel: "Ohio Administrative Code 3901-1-54",
    sourceUrl: RULE_URL
  },
  "odi-complaint": {
    title: "How to File an Ohio Department of Insurance Complaint",
    shortTitle: "ODI Complaint",
    description: "Ohio consumers can submit an insurance complaint to the Ohio Department of Insurance and provide supporting documentation for review.",
    keywords: "Ohio Department Insurance complaint property claim, ODI insurance complaint Ohio, file complaint insurance company Ohio roof claim",
    answer: "Ohio consumers can submit an insurance complaint through the Ohio Department of Insurance's online complaint form. The form asks for consumer contact information, insurance company or agent information, policy information and a description of the complaint, and it allows supporting documentation to be submitted after the complaint is started.",
    sections: [
      ["What to organize first", "Have the policy and claim number, insurer and adjuster information, the carrier estimate, denial or coverage letters, photographs, contractor estimates, material reports and a short dated timeline of communications."],
      ["Write a factual timeline", "A concise chronology is usually easier to review than a long narrative. Identify what happened, what documentation was provided, what response was received and what specific issue remains unresolved."],
      ["Use the official ODI process", "The Ohio Department of Insurance publishes the consumer complaint form and lists Consumer Services at 800-686-1526."],
      ["What Demore can contribute", "We can supply construction records related to our inspection or work: photographs, measurements, estimates, material availability information and repair-scope explanations. We cannot give legal advice or represent a homeowner as a public adjuster."]
    ],
    faqs: [
      ["Can I upload documents with an ODI complaint?", "The official complaint form states that supporting documentation can be submitted after the complaint is submitted."],
      ["What phone number does ODI list for consumers?", "The Ohio Department of Insurance complaint page lists Consumer Services at 800-686-1526."],
      ["Can Demore write the complaint for me?", "We can provide factual contractor documentation and help organize our project records. For legal representation or public-adjusting services, use an appropriately licensed or qualified professional."]
    ],
    sourceLabel: "Ohio Department of Insurance complaint form",
    sourceUrl: ODI_COMPLAINT_URL
  }
};

export default function InsuranceHelpTopic() {
  const { topic } = useParams();
  const item = TOPICS[topic];
  if (!item) return <Navigate to="/insurance-claims/help" replace />;

  const canonical = `/insurance-claims/help/${topic}`;
  useSEO({
    title: `${item.title} | Ohio Homeowners | Demore Exterior Solutions`,
    description: item.description,
    keywords: item.keywords,
    canonical,
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: item.title,
          description: item.description,
          url: `https://www.demoreexteriorsolutions.com${canonical}`,
          author: { "@type": "Organization", name: "Demore Exterior Solutions" },
          publisher: { "@type": "Organization", name: "Demore Exterior Solutions" },
          about: "Ohio property insurance claim education"
        },
        {
          "@type": "FAQPage",
          mainEntity: item.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.demoreexteriorsolutions.com/" },
            { "@type": "ListItem", position: 2, name: "Insurance Claims", item: "https://www.demoreexteriorsolutions.com/insurance-claims" },
            { "@type": "ListItem", position: 3, name: "Claim Help", item: "https://www.demoreexteriorsolutions.com/insurance-claims/help" },
            { "@type": "ListItem", position: 4, name: item.shortTitle, item: `https://www.demoreexteriorsolutions.com${canonical}` }
          ]
        }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/insurance-claims/help" className="text-sm text-primary font-heading font-bold hover:underline">← Ohio Claim Help</Link>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight mt-5">{item.title}</h1>
          <p className="text-lg text-muted-foreground mt-5 leading-relaxed">{item.description}</p>
        </div>
      </section>

      <main className="pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-primary font-heading font-bold text-sm uppercase tracking-widest"><FileCheck2 className="w-4 h-4" /> Direct answer</div>
            <p className="text-lg sm:text-xl leading-relaxed mt-4">{item.answer}</p>
          </div>

          <div className="space-y-8 mt-12">
            {item.sections.map(([heading, text]) => (
              <article key={heading}>
                <h2 className="text-2xl font-heading font-bold">{heading}</h2>
                <p className="text-muted-foreground leading-relaxed mt-3">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border/50 bg-card p-6">
            <div className="flex gap-3 items-start">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-heading font-bold text-lg">Primary source</h2>
                <p className="text-sm text-muted-foreground mt-1">This page is educational and summarizes the cited Ohio source. Policy language and claim facts matter.</p>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary font-heading font-bold text-sm mt-3">{item.sourceLabel} <ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 mt-12 bg-secondary/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-center">Common questions</h2>
            <div className="space-y-4 mt-8">
              {item.faqs.map(([q, a]) => (
                <article key={q} className="rounded-2xl border border-border/50 bg-card p-6">
                  <h3 className="font-heading font-bold text-lg">{q}</h3>
                  <p className="text-muted-foreground leading-relaxed mt-2">{a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
          <h2 className="text-3xl font-heading font-bold">Need contractor documentation?</h2>
          <p className="text-muted-foreground mt-3">Demore can inspect the exterior, document conditions and prepare a construction estimate or repair scope.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link to="/storm-damage"><Button className="font-heading font-bold">Storm Damage Help <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
            <a href="tel:+14409206133"><Button variant="outline" className="font-heading font-bold"><Phone className="w-4 h-4 mr-2" /> (440) 920-6133</Button></a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">General educational information only. Demore Exterior Solutions is a contractor, not a law firm, insurer or public adjuster.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
