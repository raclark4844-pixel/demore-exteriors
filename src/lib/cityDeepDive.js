// Deep-dive local content for priority city pages. Keyed by the city URL
// slug (matching serviceAreaData slugs) and rendered by CityLocalDetail.
// Each city's copy is intentionally unique — do not clone between cities.

export const CITY_DEEP_DIVE = {
  mentor: {
    weather:
      "Mentor sits close enough to Lake Erie to catch full-strength lake-effect snow — the same bands that hammer the Headlands. Roofs here cycle through heavy snow load, freeze-thaw, and spring hail, so attic ventilation and ice & water shield do the real long-term work.",
    neighborhoods: [
      {
        name: "Mentor Headlands",
        text: "Lakefront cottages and newer builds take wind and spray head-on. Corrosion-resistant fasteners, enhanced wind-rated shingles, and heavier-gauge flashing are worth every dollar this close to open water.",
      },
      {
        name: "Old Mentor (Center Street corridor)",
        text: "A mix of century homes and civic buildings. Slate-era rooflines and original woodwork mean materials get matched, not just swapped — and pre-1978 homes follow full lead-safe tear-off practices.",
      },
      {
        name: "Post-war subdivisions (Hopkins Rd / Route 84)",
        text: "Colonials and ranches built in the 1960s–80s, mostly on their second or third roof. Original decking near the end of its life is the most common surprise we plan for before tear-off.",
      },
    ],
    codePoints: [
      "Permits are filed with the City of Mentor Building Department, with final sign-off scheduled before the project closes out.",
      "Mentor is our home city — our crews work here daily, so material deliveries and inspections are typically arranged within days, not weeks.",
    ],
  },

  willoughby: {
    weather:
      "Willoughby sits just inland of the lakeshore, where the Chagrin River cuts through on its way to Lake Erie. Weather here trends wetter than snowy — heavy rain, spring hail, and the occasional straight-line wind line — so drainage, valleys, and flashing get the most scrutiny.",
    neighborhoods: [
      {
        name: "Historic Downtown Willoughby (Erie St / Vine St)",
        text: "Pre-1900 homes around the medical district downtown. Original slate and cedar survivors hide plank and skip-sheathing decks underneath — we check deck condition before quoting, not after tear-off.",
      },
      {
        name: "Chagrin River corridor",
        text: "Homes along the river valley catch afternoon wind channeled downslope. Kick-out flashing at roof-to-sidewall junctions is the single most common failure point we repair here.",
      },
      {
        name: "East Willoughby",
        text: "1950s–60s ranches and splits. Most are finishing their second shingle cycle — original 3-tab systems at end of life are being upgraded to architectural shingles with proper ventilation.",
      },
    ],
    codePoints: [
      "Willoughby Building Department permit required; Class A fire-rated shingles are standard on every replacement.",
      "Historic homes downtown often need material pre-approval — we handle the paperwork before materials are ordered.",
    ],
  },

  eastlake: {
    weather:
      "Eastlake hugs the Lake Erie shoreline at the mouth of the Chagrin River — first in line for northeast gales. Wind-lifted ridge caps and ice-dam backups at lake-facing eaves are the two most common calls we get from this city.",
    neighborhoods: [
      {
        name: "Lakeshore Boulevard strip",
        text: "Lakefront and near-lake homes face open-water wind with no buffer. Enhanced nailing patterns, wind-rated shingles, and sealed ridge caps are the difference between a 15-year roof and a 30-year one here.",
      },
      {
        name: "Harbor area near the ballpark",
        text: "Compact 1940s–50s housing stock on small lots. Tight side yards mean tear-off protection and debris containment get planned into every project.",
      },
      {
        name: "Dellwood / northeast neighborhoods",
        text: "Post-1970 splits and colonials. First-generation roofs installed at build time are aging out at once — a typical Eastlake replacement includes decking spot-repair at the eaves.",
      },
    ],
    codePoints: [
      "Eastlake requires a permit for roofing over 25 sq ft; ice & water shield and drip edge are verified at inspection.",
      "On lake-facing slopes we run a full starter course and seal ridge caps against northeast wind uplift — a code-minimum roof does not survive this shoreline.",
    ],
  },

  wickliffe: {
    weather:
      "Wickliffe sits one ridge inland from the lake, so it escapes the worst shoreline wind but still sits squarely in the snowbelt's daily commute. Freeze-thaw along the older Euclid Avenue sections usually surfaces first — often as stained fascia before anyone thinks to look up.",
    neighborhoods: [
      {
        name: "Euclid Avenue corridor",
        text: "1950s–60s ranches and bungalows under mature tree cover. Maple and oak canopies mean gutters, not shingles, fail first — we size up and add leaf protection on almost every Wickliffe gutter job.",
      },
      {
        name: "Rockwell / Andrews Road area",
        text: "Post-war housing with original fascia and soffit reaching replacement age. We inspect fascia before hanging seamless gutters so the new system attaches to solid wood.",
      },
      {
        name: "North Wickliffe (I-90 exchange area)",
        text: "Newer construction from the 1980s–90s. Mostly first-generation roof replacements now — ventilation upgrades matter here since original systems were often vented to minimum.",
      },
    ],
    codePoints: [
      "Wickliffe permits run through the city's building department; ice & water shield and drip edge follow the Ohio Residential Code minimums we exceed.",
      "Mature tree canopies here mean gutter systems get sized up — standard runs overflow fast under maple leaf load.",
    ],
  },

  painsville: {
    weather:
      "Painesville sits east of the metro core, deep enough into the lake-effect corridor that winter totals swing wildly from one storm track to the next. Near the Grand River valley, humidity and morning fog linger — venting attic moisture correctly matters as much here as keeping water out.",
    neighborhoods: [
      {
        name: "Historic Downtown Square",
        text: "Victorian-era homes ringing the county seat's square. Steep pitches, ornate trim, and historic-district review all shape the material plan — pre-approval happens before anything is ordered.",
      },
      {
        name: "Grand River valley edges",
        text: "Properties near the river deal with valley-humidity and morning fog. Attic ventilation and downspout discharge placement are the two upgrades that prevent repeat moisture problems.",
      },
      {
        name: "East side mid-century neighborhoods",
        text: "Colonials and ranches from the 1950s–70s, mostly on their second roofs. Siding is often original here — we check wall flashing whenever a roof meets an aging exterior.",
      },
    ],
    codePoints: [
      "City of Painesville Building Department permit; historic-district sections require material pre-approval.",
      "Pre-1978 homes follow full RRP lead-safe practices during tear-off — common on the square's older housing stock.",
    ],
  },

  chardon: {
    weather:
      "Chardon is the snow capital of the Ohio snowbelt — seasonal totals regularly clear 100 inches, and some of the state's single-storm snowfall records were set here. A roof in Chardon lives or dies by attic ventilation and ice & water shield; we treat both as structural, not optional.",
    neighborhoods: [
      {
        name: "Chardon Square",
        text: "Nineteenth-century homes around the historic courthouse. Steep pitches shed snow fast — onto walkways, driveways, and porches. Snow guards above entry points are a near-universal add here.",
      },
      {
        name: "South-side school corridors",
        text: "Subdivisions built in the 1970s–2000s. Truss systems designed to minimum snow-load specs benefit from deck and ventilation review before any Chardon reroof.",
      },
      {
        name: "Surrounding farm and rural properties",
        text: "Farmhouses, pole barns, and outbuildings across Geauga's township roads. Long driveways change logistics — staging and delivery get planned around weather windows, not against them.",
      },
    ],
    codePoints: [
      "City of Chardon Building Department permits; snow-load review on older trusses is standard practice before replacement.",
      "We extend ice & water shield well past code minimums on every Chardon roof — this climate punishes the bare minimum.",
    ],
  },

  "mayfield-heights": {
    weather:
      "Mayfield Heights sits on the Cuyahoga side of the snow line — lighter lake-effect than Lake County, but the same spring hail tracks. Roofs here are more often done in by age and hail bruising than by snow load, which makes impact-resistant shingles a genuinely smart upgrade.",
    neighborhoods: [
      {
        name: "Mayfield Road corridor",
        text: "Post-war frame homes and duplexes near the commercial strip. Compact lots mean work is staged tight — protection for neighboring property is part of the plan, not an afterthought.",
      },
      {
        name: "Lander / Brainard streets",
        text: "1950s–60s colonials and splits in the Hillcrest-adjacent streets. Second-generation roofs and original aluminum siding are aging together, so roof-to-sidewall flashing gets special attention.",
      },
      {
        name: "East end near Hillcrest Hospital",
        text: "Medical-corridor homes and small professional buildings. Projects here often coordinate with landlord or office schedules — after-hours and weekend work is available when needed.",
      },
    ],
    codePoints: [
      "City of Mayfield Heights Building Department permit required for roofing and siding, with final inspection before closeout.",
      "Two-layer maximum before full tear-off applies; hail-rated shingles are worth considering given this corridor's storm history.",
    ],
  },

  parma: {
    weather:
      "Parma is the biggest suburb between Cleveland and the snowbelt — heavy spring hail tracks cross it regularly, and much of its post-war housing stock is aging onto its second or third roof at the same time. Storm years here are busy for a reason.",
    neighborhoods: [
      {
        name: "Polish Village (Ridge Road area)",
        text: "Early-20th-century frame homes and brick bungalows. Close lot lines mean tear-off debris control and neighbor property protection are planned into every job.",
      },
      {
        name: "Snow Road / Ridge Road mid-century corridors",
        text: "The mass of 1950s ranches and colonials built in one post-war wave. Whole streets are replacing original-era roofs together — we document scope thoroughly for insurance-driven projects.",
      },
      {
        name: "West Creek Reservation edges",
        text: "Homes near the creek valley get shaded north slopes where moss and algae accelerate shingle wear. Ventilation and algae-resistant shingles are the standard recommendation here.",
      },
    ],
    codePoints: [
      "City of Parma Building Department permit; two layers of shingles maximum before full tear-off, and sealed valleys are mandatory.",
      "Parma's mix of long-time owners and rental conversions means we regularly coordinate scheduling around occupied units.",
    ],
  },
};