export const SERVICE_AREAS = [
  {
    county: "Cuyahoga",
    slug: "cuyahoga",
    cities: [
      "Bay Village","Beachwood","Bedford","Bedford Heights","Berea","Broadview Heights",
      "Brooklyn","Brook Park","Cleveland","Cleveland Heights","East Cleveland","Euclid",
      "Fairview Park","Garfield Heights","Highland Heights","Independence","Lakewood","Lyndhurst","Maple Heights",
      "Mayfield Heights","Middleburg Heights","North Olmsted","North Royalton","Olmsted Falls",
      "Parma","Parma Heights","Pepper Pike","Richmond Heights","Rocky River","Seven Hills",
      "Shaker Heights","Solon","South Euclid","Strongsville","University Heights",
      "Warrensville Heights","Westlake","North Ridgeville","Avon","Avon Lake","Sheffield Lake","Vermilion"
    ],
    villages: [
      "Bratenahl","Brooklyn Heights","Chagrin Falls","Gates Mills","Glenwillow",
      "Highland Hills","Hunting Valley","Linndale","Mayfield","Moreland Hills",
      "Newburgh Heights","North Randall","Orange","Valley View","Walton Hills","Woodmere"
    ],
    unincorporated: ["White Oak","Pleasant Valley","Columbia Station"]
  },
  {
    county: "Lake",
    slug: "lake",
    cities: [
      "Eastlake","Kirtland","Mentor","Mentor-on-the-Lake","Painesville",
      "Wickliffe","Willoughby","Willoughby Hills","Madison","Perry"
    ],
    villages: ["Grand River","North Perry","Timberlake","Waite Hill"],
    unincorporated: [
      "Concord Township","Perry Township","Leroy Township","Painesville Township",
      "Fairport Harbor","Lakeline","Thompson","North Madison","Mentor Headlands"
    ]
  },
  {
    county: "Geauga",
    slug: "geauga",
    cities: ["Chardon"],
    villages: ["Burton","Hunting Valley","Middlefield","South Russell"],
    unincorporated: [
      "Bainbridge","Chesterland","Auburn Township","Claridon","Hambden","Munson",
      "Newbury","Parkman","Russell Township","Thompson","Troy Township","Montville","Middlefield Township"
    ]
  },
  {
    county: "Summit",
    slug: "summit",
    cities: [
      "Akron","Barberton","Cuyahoga Falls","Fairlawn","Green","Hudson","Macedonia",
      "Munroe Falls","Norton","Stow","Tallmadge","Twinsburg","Rittman","Doylestown"
    ],
    villages: ["Lakemore","Mogadore","Northfield","Peninsula","Reminderville","Richfield","Silver Lake"],
    unincorporated: [
      "Bath Township","Boston Heights","Springfield Township","Coventry Township",
      "Portage Lakes","Northfield Center"
    ]
  },
  {
    county: "Medina",
    slug: "medina",
    cities: ["Brunswick","Medina","Wadsworth","Rittman","Seville"],
    villages: ["Gloria Glens Park","Lodi","Seville","Spencer","Westfield Center"],
    unincorporated: [
      "Hinckley","Granger Township","Liverpool Township","Montville Township",
      "Sharon Township","York Township","Lafayette Township","Chatham","Valley City"
    ]
  },
  {
    county: "Portage",
    slug: "portage",
    cities: ["Aurora","Kent","Ravenna","Streetsboro","Tallmadge"],
    villages: ["Garrettsville","Hiram","Mantua","Mogadore","Sugar Bush Knolls","Windham"],
    unincorporated: [
      "Brimfield","Rootstown","Atwater","Charlestown","Deerfield","Edinburg",
      "Freedom","Nelson","Randolph","Shalersville","Suffield"
    ]
  },
  {
    county: "Ashtabula",
    slug: "ashtabula",
    cities: ["Ashtabula","Conneaut","Geneva"],
    villages: [
      "Andover","Geneva-on-the-Lake","Jefferson","Kingsville","North Kingsville",
      "Orwell","Rock Creek","Roaming Shores"
    ],
    unincorporated: [
      "Austinburg","Dorset","Harpersfield","Pierpont","Saybrook",
      "Sheffield Township","Unionville","Williamsfield"
    ]
  },
  {
    county: "Trumbull",
    slug: "trumbull",
    cities: ["Girard","Niles","Warren","Hubbard","Newton Falls"],
    villages: ["Bolindale","Lordstown","McDonald","West Farmington"],
    unincorporated: [
      "Bazetta","Brookfield","Champion","Cortland","Howland","Hubbard Township",
      "Johnston","Kinsman","Liberty","Mecca","Southington","Vienna","Weathersfield","Fowler"
    ]
  }
];

export function slugify(name) {
  return name.toLowerCase().replace(/[\s(),.]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function getAllCommunities(countyData) {
  return [
    ...countyData.cities.map(c => ({ name: c, type: "City" })),
    ...countyData.villages.map(v => ({ name: v, type: "Village" })),
    ...countyData.unincorporated.map(u => ({ name: u, type: "Community" }))
  ].sort((a, b) => a.name.localeCompare(b.name));
}

export function findCounty(countySlug) {
  return SERVICE_AREAS.find(c => c.slug === countySlug);
}

export function findCommunity(countySlug, communitySlug) {
  const county = findCounty(countySlug);
  if (!county) return null;
  const all = getAllCommunities(county);
  return all.find(c => slugify(c.name) === communitySlug) || null;
}