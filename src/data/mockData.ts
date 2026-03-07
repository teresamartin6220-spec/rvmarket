import rv1 from "@/assets/rv-1.jpg";
import rv2 from "@/assets/rv-2.jpg";
import rv3 from "@/assets/rv-3.jpg";
import rv4 from "@/assets/rv-4.jpg";
import rvInterior1 from "@/assets/rv-interior-1.jpg";
import rvInterior2 from "@/assets/rv-interior-2.jpg";

export interface RV {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  stockNumber: string;
  price: number;
  mileage: number;
  sleeps: number;
  length: string;
  fuelType: string;
  transmission: string;
  condition: string;
  type: "Class C" | "Travel Trailer" | "Camper" | "Class A";
  description: string;
  location: string;
  state: string;
  images: string[];
  dealerId: string;
  isFavorite?: boolean;
}

export interface Dealer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  hours: string;
  textNumber: string;
}

export const dealers: Dealer[] = [
  {
    id: "d1",
    name: "Freedom RV Sales",
    phone: "(800) 555-0123",
    email: "sales@freedomrv.com",
    address: "1234 Highway 66",
    city: "Denver",
    state: "CO",
    hours: "Mon-Sat 9AM-6PM, Sun 10AM-4PM",
    textNumber: "(800) 555-0124",
  },
  {
    id: "d2",
    name: "Sunshine RV Center",
    phone: "(800) 555-0456",
    email: "info@sunshinerv.com",
    address: "5678 Coastal Blvd",
    city: "Orlando",
    state: "FL",
    hours: "Mon-Sat 8AM-7PM, Sun 11AM-5PM",
    textNumber: "(800) 555-0457",
  },
  {
    id: "d3",
    name: "Mountain View RV",
    phone: "(800) 555-0789",
    email: "hello@mountainviewrv.com",
    address: "9012 Pine Ridge Rd",
    city: "Phoenix",
    state: "AZ",
    hours: "Mon-Fri 9AM-6PM, Sat 9AM-5PM",
    textNumber: "(800) 555-0790",
  },
];

export const rvListings: RV[] = [
  {
    id: "rv-001",
    title: "Coachmen Apex 16 Travel Trailer",
    brand: "Coachmen",
    model: "Apex 16",
    year: 2022,
    stockNumber: "STK-4521",
    price: 24999,
    mileage: 8500,
    sleeps: 4,
    length: "21 ft",
    fuelType: "N/A",
    transmission: "N/A",
    condition: "Excellent",
    type: "Travel Trailer",
    description: "This gently used Coachmen Apex 16 Travel Trailer is perfect for couples or small families seeking weekend getaways. Features include a fully equipped kitchen with a 3-burner stove, microwave, and refrigerator. The dinette converts into additional sleeping space. Equipped with air conditioning, furnace, and an awning for outdoor relaxation. Low mileage and meticulously maintained — ready for your next adventure.",
    location: "Denver, CO",
    state: "CO",
    images: [rv2, rvInterior1, rvInterior2, rv2],
    dealerId: "d1",
  },
  {
    id: "rv-002",
    title: "Thor Motor Coach Four Winds 28A",
    brand: "Thor",
    model: "Four Winds 28A",
    year: 2021,
    stockNumber: "STK-3318",
    price: 67500,
    mileage: 22000,
    sleeps: 6,
    length: "29 ft",
    fuelType: "Gasoline",
    transmission: "Automatic",
    condition: "Good",
    type: "Class C",
    description: "Spacious Class C motorhome with sleeping for 6. Features a cab-over bunk, rear queen bed, and convertible dinette. Full bathroom with shower. Upgraded entertainment system with backup camera. Ford E-450 chassis with reliable V10 engine.",
    location: "Orlando, FL",
    state: "FL",
    images: [rv1, rvInterior1, rvInterior2, rv1],
    dealerId: "d2",
  },
  {
    id: "rv-003",
    title: "Winnebago Travato 59KL",
    brand: "Winnebago",
    model: "Travato 59KL",
    year: 2023,
    stockNumber: "STK-7742",
    price: 112000,
    mileage: 5200,
    sleeps: 2,
    length: "21 ft",
    fuelType: "Diesel",
    transmission: "Automatic",
    condition: "Like New",
    type: "Camper",
    description: "Nearly new Winnebago Travato built on the Ram ProMaster chassis. Features a power sofa that converts to a bed, wet bath, and a well-appointed galley. Perfect for adventurous couples who want the freedom to explore without the bulk of a larger RV.",
    location: "Phoenix, AZ",
    state: "AZ",
    images: [rv3, rvInterior1, rvInterior2, rv3],
    dealerId: "d3",
  },
  {
    id: "rv-004",
    title: "Tiffin Allegro Open Road 32SA",
    brand: "Tiffin",
    model: "Allegro Open Road 32SA",
    year: 2020,
    stockNumber: "STK-1190",
    price: 142000,
    mileage: 35000,
    sleeps: 6,
    length: "34 ft",
    fuelType: "Gasoline",
    transmission: "Automatic",
    condition: "Good",
    type: "Class A",
    description: "Luxury Class A motorhome from Tiffin. This Allegro Open Road features a spacious interior with dual slide-outs, residential refrigerator, and king-size bed. Full-body paint exterior with premium graphics. Equipped with Onan generator and leveling jacks.",
    location: "Austin, TX",
    state: "TX",
    images: [rv4, rvInterior1, rvInterior2, rv4],
    dealerId: "d1",
  },
  {
    id: "rv-005",
    title: "Forest River Rockwood Mini Lite 2104S",
    brand: "Forest River",
    model: "Rockwood Mini Lite 2104S",
    year: 2023,
    stockNumber: "STK-5501",
    price: 29995,
    mileage: 1200,
    sleeps: 4,
    length: "24 ft",
    fuelType: "N/A",
    transmission: "N/A",
    condition: "Like New",
    type: "Travel Trailer",
    description: "Lightweight and easy to tow, the Rockwood Mini Lite is ideal for first-time RV owners. Features include a murphy bed, full kitchen, and outdoor shower. Frameless windows provide panoramic views. Solar panel ready.",
    location: "Nashville, TN",
    state: "TN",
    images: [rv2, rvInterior2, rvInterior1, rv2],
    dealerId: "d2",
  },
  {
    id: "rv-006",
    title: "Jayco Greyhawk 29MV",
    brand: "Jayco",
    model: "Greyhawk 29MV",
    year: 2021,
    stockNumber: "STK-8833",
    price: 89900,
    mileage: 18500,
    sleeps: 8,
    length: "31 ft",
    fuelType: "Gasoline",
    transmission: "Automatic",
    condition: "Good",
    type: "Class C",
    description: "Family-friendly Class C with sleeping for 8. Features include a cab-over bunk, rear bunk beds, and convertible dinette and sofa. Full bathroom, outdoor kitchen, and electric awning. Perfect for families who love to travel together.",
    location: "Seattle, WA",
    state: "WA",
    images: [rv1, rvInterior1, rvInterior2, rv1],
    dealerId: "d3",
  },
];

export function getDealerById(id: string): Dealer | undefined {
  return dealers.find((d) => d.id === id);
}

export function getRVById(id: string): RV | undefined {
  return rvListings.find((rv) => rv.id === id);
}
