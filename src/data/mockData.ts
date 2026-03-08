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
  mileage: number;
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
}

export const companyInfo = {
  name: "RV Market",
  phone: "+1 (940) 882-1140",
  email: "info@rvmarket.com",
  address: "1234 Highway 66",
  city: "Denver",
  state: "CO",
  country: "USA",
  hours: "Mon-Sat 9AM-6PM",
  textNumber: "+1 (940) 882-1140",
  whatsapp: "+19408821140",
  tiktok: "https://tiktok.com/@rvmarket",
  yearsInBusiness: 25,
};

export const DISCLAIMER = `*Vehicle stock images are for illustration purposes. Motorhomes may differ from the stock images shown. Please contact your local sales center for actual images and or availability.\n\nGovernment fees, taxes, title fees, registration fees, temporary tag fees, local emission fees, and dealer document fees are not included in the price.\n\nPrices and promotions are subject to change without notice. We have made every effort to ensure accuracy in the information provided. Specifications, equipment, technical data, photographs, and illustrations are based on information available at the time of posting and are subject to change without notice.`;

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
  ];

  for (let i = 0; i < 25; i++) {
    const cfg = configs[i % configs.length];
    const country = countries[i % countries.length];
    const locs = locations[country];
    const loc = locs[i % locs.length];
    const year = 2019 + (i % 5);
    const price = cfg.priceRange[0] + Math.round(((i * 3571) % (cfg.priceRange[1] - cfg.priceRange[0])));
    const mileage = 1000 + ((i * 2731) % 50000);
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
      mileage,
      sleeps,
      transmission: transmissions[i % 2],
      condition: conditions[i % conditions.length],
      type: cfg.type,
      description: `This ${year} ${cfg.brand} ${cfg.model} is in ${conditions[i % conditions.length].toLowerCase()} condition with ${mileage.toLocaleString()} miles. Features include a fully equipped kitchen, comfortable sleeping quarters for ${sleeps}, and all the amenities you need for your next adventure. Located in ${loc}, ${country}. Contact us today to schedule a viewing or learn more about financing options.`,
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
