import rv1 from "@/assets/rv-1.jpg";
import rv2 from "@/assets/rv-2.jpg";
import rv3 from "@/assets/rv-3.jpg";
import rv4 from "@/assets/rv-4.jpg";
import rvInterior1 from "@/assets/rv-interior-1.jpg";
import rvInterior2 from "@/assets/rv-interior-2.jpg";

export const RV_TYPES = [
  "COACHMEN APEX 16 TRAVEL TRAILER",
  "THOR MAJESTIC 19G",
  "THOR MAJESTIC 23A",
  "THOR MAJESTIC 28A",
  "TIFFIN ADVENTURE 23TM",
  "TIFFIN ADVENTURE 28TM",
  "WINNEBAGO MINNIE WINNIE 325AR",
  "WINNEBAGO MINNIE WINNIE 328QR",
  "ULTRA-LIGHT TRAVEL TRAILER",
  "FIFTH WHEEL",
  "TRAVEL TRAILER",
  "FIFTH WHEEL",
  "CLASS A MOTORHOME",
  "FIFTH WHEEL TOY HAULER",
  "DESTINATION TRAILER",
  "TRAVEL TRAILER (Bunkhouse)",
  "TRAVEL TRAILER (Ultra-Lite)",
  "TRAVEL TRAILER / FIFTH WHEEL",
] as const;

export type RVType = typeof RV_TYPES[number];

export interface RVSpecs {
  sleepingCapacity?: number;
  generator?: string;
  fuelTankCapacity?: string;
  freshWaterCapacity?: string;
  lpgCapacity?: string;
  greyTankCapacity?: string;
  blackTankCapacity?: string;
  hotWaterCapacity?: string;
  gvwr?: string;
  exteriorLength?: string;
  exteriorHeight?: string;
  exteriorWidth?: string;
}

export interface RVFeatures {
  coachFeatures?: string[];
  chassisFeatures?: string[];
  coachConstruction?: string[];
  safetyFeatures?: string[];
}

export interface RV {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  stockNumber: string;
  vin: string;
  price: number;
  sleeps: number;
  transmission: string;
  condition: string;
  type: RVType;
  description: string;
  location: string;
  country: string;
  images: string[];
  specs?: RVSpecs;
  features?: RVFeatures;
  isFavorite?: boolean;
  isSuperSpecial?: boolean;
}

export const companyInfo = {
  name: "RV Market",
  phone: "+1 (940) 882-1140",
  email: "rvmarketused@gmail.com",
  address: "850 S Northlake Rd",
  city: "Coppell",
  state: "TX 75019",
  country: "USA",
  hours: "Mon-Sat 8AM-6PM",
  textNumber: "+1 (940) 882-1140",
  whatsapp: "+19408821140",
  tiktok: "https://tiktok.com/@rvmarkt",
  yearsInBusiness: 25,
};

export const DISCLAIMER = `The photographs shown are of the actual vehicle listed for sale. Government fees, taxes, title fees, registration fees, temporary tag fees, local emission fees, and dealer document fees are not included in the listed price.\n\nPrices and promotions are subject to change without notice. Specifications and equipment are based on information available at the time of posting and may be subject to change.`;

const defaultSpecs: RVSpecs = {
  sleepingCapacity: 6,
  generator: "4KW Onan Microlite",
  fuelTankCapacity: "55 gal.",
  freshWaterCapacity: "40 gal.",
  lpgCapacity: "12.2 gal.",
  greyTankCapacity: "22 gal.",
  blackTankCapacity: "25 gal.",
  hotWaterCapacity: "6 gal.",
  gvwr: "12,500 lbs.",
  exteriorLength: "25 ft.",
  exteriorHeight: "10.7 ft.",
  exteriorWidth: "8.3 ft.",
};

const defaultFeatures: RVFeatures = {
  coachFeatures: [
    "Majestic Graphics Package",
    "Microwave",
    "Gas Range",
    "LP Gas Hot Water Heater",
    "Furnace",
    "Commercial Grade Upholstery & Fabrics",
    "Stainless Steel Kitchen & Bath Sinks",
    "Refrigerator/Freezer",
    "Central Vehicle Monitor Panel",
    "Integrated Entry Door Steps",
    "LED Interior Lighting",
    'Exterior "Basement" Storage',
    "Rooftop Air Conditioner",
  ],
  chassisFeatures: [
    "4-Wheel ABS Brakes",
    "Cruise Control",
    "Air Conditioning",
    "Power Steering",
    "Tilt Steering Column",
    "Full Size Spare",
    "Power Windows",
    "Power Door Locks",
    "Power Exterior Mirrors",
    "Emergency Start Switch",
    "Trailer Hitch",
    "Velvac Electric Sideview Mirrors",
    "Tow-Haul Mode",
    "12 Volt Auxiliary Dash Plugs",
    "Auxiliary Input",
    "AM/FM Stereo",
  ],
  coachConstruction: [
    "Laminated Rubber Roof",
    "High Density Insulated Wall",
    "Tongue-n-Groove Floor",
    "Gel-Glass Exterior Sidewalls",
  ],
  safetyFeatures: [
    "Driver & Passenger Air Bags",
    "Fire Extinguisher",
    "Carbon Monoxide Detector",
    "Smoke Detector",
  ],
};

const imagePool = [rv1, rv2, rv3, rv4, rvInterior1, rvInterior2];
const getImages = (seed: number): string[] => {
  const imgs: string[] = [];
  for (let i = 0; i < 7; i++) {
    imgs.push(imagePool[(seed + i) % imagePool.length]);
  }
  return imgs;
};

const countries = ["USA", "Canada", "UK", "Australia"];
const locations: Record<string, string[]> = {
  USA: ["Denver, CO", "Orlando, FL", "Dallas, TX", "Phoenix, AZ", "Seattle, WA", "Portland, OR", "Las Vegas, NV"],
  Canada: ["Toronto, ON", "Vancouver, BC", "Calgary, AB", "Montreal, QC"],
  UK: ["London", "Manchester", "Birmingham", "Edinburgh"],
  Australia: ["Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD", "Perth, WA"],
};

const conditions = ["Like New", "Excellent", "Good", "Fair"];
const transmissions = ["Automatic", "N/A"];

function generateVIN(seed: number): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let vin = "";
  for (let i = 0; i < 17; i++) {
    vin += chars[(seed * 7 + i * 13) % chars.length];
  }
  return vin;
}

function generateListings(): RV[] {
  const listings: RV[] = [];
  let id = 1;

  const configs = [
    { type: "COACHMEN APEX 16 TRAVEL TRAILER" as RVType, brand: "Coachmen", model: "Apex 16", priceRange: [22000, 35000] },
    { type: "THOR MAJESTIC 19G" as RVType, brand: "Thor", model: "Majestic 19G", priceRange: [55000, 85000] },
    { type: "THOR MAJESTIC 23A" as RVType, brand: "Thor", model: "Majestic 23A", priceRange: [65000, 95000] },
    { type: "THOR MAJESTIC 28A" as RVType, brand: "Thor", model: "Majestic 28A", priceRange: [75000, 110000] },
    { type: "TIFFIN ADVENTURE 23TM" as RVType, brand: "Tiffin", model: "Adventure 23TM", priceRange: [80000, 120000] },
    { type: "TIFFIN ADVENTURE 28TM" as RVType, brand: "Tiffin", model: "Adventure 28TM", priceRange: [95000, 145000] },
    { type: "WINNEBAGO MINNIE WINNIE 325AR" as RVType, brand: "Winnebago", model: "Minnie Winnie 325AR", priceRange: [90000, 135000] },
    { type: "WINNEBAGO MINNIE WINNIE 328QR" as RVType, brand: "Winnebago", model: "Minnie Winnie 328QR", priceRange: [95000, 150000] },
    { type: "ULTRA-LIGHT TRAVEL TRAILER" as RVType, brand: "Coachemn", model: "Clipper Cadet 17CBH", priceRange: [0, 40000] },
    { type: "ULTRA-LIGHT TRAVEL TRAILER" as RVType, brand: "Jayco", model: "Jay Feather 218", priceRange: [0, 40000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Grand Design", model: "Reflection 280RS", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "CrossRoads", model: "Volante 29RB", priceRange: [0, 40000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Prime Time", model: "Avenger 27DBS", priceRange: [0, 40000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Heartland", model: "Bighorn 3160EL", priceRange: [0, 40000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Heartland", model: "Sundance Ultra Lite 255BH", priceRange: [0, 40000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Forest River", model: "Tracer Air 255", priceRange: [0, 40000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "CrossRoads", model: "Zinger 260RL", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Forest River", model: "Puma 31RLQS", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Dutchment", model: "Denali 28RK", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Palomino", model: "Puma 26FKDS", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Gulf Stream", model: "Cavalier 6280", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Jayco", model: "Jay Flight SLX 250BHW", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Forest River", model: "Blue Ridge 2950RK", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Jayco", model: "Jay Flight SLX 210QBW", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Northwood", model: "Arctic Fox Grande Ronde 36-5VS", priceRange: [0, 80000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "East to West", model: "Della Terra 28KRD", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Jayco", model: "Jay Flight SLX 263HSW", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Lance Camper", model: "1985", priceRange: [0, 50000] },
    { type: "CLASS A MOTORHOME" as RVType, brand: "Thor Motor Coach", model: "Miramar 37.1", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL" as RVType, brand: "CrossRoads", model: "Cruiser 29RK", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL TOY HAULER" as RVType, brand: "Forest River", model: "Wolf Pack 325PACK13", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Gulf Stream", model: "Kingsport 281RL", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Forest River", model: "Vibe 6504", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Forest River (Rockwood)", model: "Rockwood Ultra Lite 2608BS", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Lifestyle Luxury", model: "Lifestyle LS37CKSL", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Starcraft", model: "Super Lite 233ML", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Dutchmen", model: "Kodiak Ultimate 292FKDS", priceRange: [0, 50000] },
    { type: "CLASS A MOTORHOME" as RVType, brand: "Newmar", model: "Bay Star Sport 2702", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL TOY HAULER" as RVType, brand: "Dutchmen", model: "Voltage 3950", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Keystone", model: "Springdale 260BH", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Grand Design", model: "Transcend Xplor 221RB", priceRange: [0, 50000] },
    { type: "CLASS A MOTORHOME" as RVType, brand: "Itasca", model: "Sunrise 31W", priceRange: [0, 50000] },
    { type: "CLASS A MOTORHOME" as RVType, brand: "Winnebago", model: "Adventurer 35U", priceRange: [0, 50000] },
    { type: "CLASS A MOTORHOME" as RVType, brand: "Coachmen (by Forest River)", model: "Catalina 240WB", priceRange: [0, 50000] },
    { type: "DESTINATION TRAILER" as RVType, brand: "Forest River (Cherokee)", model: "Timberwolf 39DL", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Starcraft", model: "Autumn Ridge 29RH", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "CrossRoads", model: "Zinger 280RB", priceRange: [0, 50000] },
    { type: "FIFTH WHEEL" as RVType, brand: "Forest River (Columbus)", model: "River Ranch 391MK", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Forest River (Salem)", model: "Salem 27RK", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER (Ultra-Lite)" as RVType, brand: "Keystone", model: "Bullet 261RBS", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Heartland", model: "Pioneer DS320", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER / FIFTH WHEEL" as RVType, brand: "Dutchmen", model: "Astoria", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER" as RVType, brand: "Coleman (by Dutchmen)", model: "Expedition CTS192RD", priceRange: [0, 50000] },
    { type: "TRAVEL TRAILER (Bunkhouse)" as RVType, brand: "Forest River (Vibe)", model: "Vibe 34BH", priceRange: [0, 50000] },    
  ];

  for (let i = 0; i < 25; i++) {
    const cfg = configs[i % configs.length];
    const country = countries[i % countries.length];
    const locs = locations[country];
    const loc = locs[i % locs.length];
    const year = 2019 + (i % 5);
    const price = cfg.priceRange[0] + Math.round(((i * 3571) % (cfg.priceRange[1] - cfg.priceRange[0])));
    const sleeps = [2, 4, 6, 8][i % 4];

    listings.push({
      id: `rv-${String(id).padStart(3, "0")}`,
      title: `${cfg.brand} ${cfg.model}`,
      brand: cfg.brand,
      model: cfg.model,
      year,
      stockNumber: `STK-${1000 + id}`,
      vin: generateVIN(id),
      price,
      sleeps,
      transmission: transmissions[i % 2],
      condition: conditions[i % conditions.length],
      type: cfg.type,
      description: `This ${year} ${cfg.brand} ${cfg.model} is in ${conditions[i % conditions.length].toLowerCase()} condition with. Features include a fully equipped kitchen, comfortable sleeping quarters for ${sleeps}, and all the amenities you need for your next adventure. Contact us today to learn more about financing options.`,
      location: loc,
      country,
      images: getImages(i),
      specs: {
        ...defaultSpecs,
        sleepingCapacity: sleeps,
        exteriorLength: `${20 + (i % 15)} ft.`,
        exteriorHeight: `${9 + (i % 3)}.${(i % 10)} ft.`,
        exteriorWidth: `${7 + (i % 2)}.${(i % 10)} ft.`,
      },
      features: defaultFeatures,
    });
    id++;
  }

  return listings;
}

export const rvListings: RV[] = generateListings();

export function getRVById(id: string): RV | undefined {
  return rvListings.find((rv) => rv.id === id);
}
