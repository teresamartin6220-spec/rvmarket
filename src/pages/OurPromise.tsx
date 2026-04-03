import { motion } from "framer-motion";
import { Shield, Award, Truck, Headphones, CheckCircle } from "lucide-react";
import { companyInfo } from "@/data/mockData";

const promises = [
  {
    icon: Shield,
    title: "Quality Guaranteed",
    desc: "Every RV in our inventory undergoes a rigorous multi-point inspection. We check mechanical systems, electrical, plumbing, appliances, and structural integrity so you can buy with confidence.",
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800",
  },
  {
    icon: Award,
    title: "Nationwide Reach",
    desc: "We serve customers across the entire United States. Whether you're in Texas, Florida, California, or anywhere in between, we'll help you find and deliver your perfect RV.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
  },
  {
    icon: Truck,
    title: "Trade-In Program",
    desc: "Looking to upgrade or simply sell your current RV? We offer competitive, fair-market trade-in values with a fast, hassle-free process. Apply your trade value towards any listing.",
    image: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=800",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our dedicated customer care team is available around the clock. From initial questions to post-purchase support, we're here every step of the way.",
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800",
  },
];

const OurPromise = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1400" alt="" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">Our Promise</h1>
            <p className="text-white/80 mt-2 max-w-xl">
              Over {companyInfo.yearsInBusiness} years of delivering trust, quality, and exceptional service to RV buyers nationwide.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-16">
        {promises.map(({ icon: Icon, title, desc, image }, i) => (
          <section key={title} className={`grid gap-8 lg:grid-cols-2 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
            <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-foreground">{title}</h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">{desc}</p>
            </div>
            <div className={`rounded-xl overflow-hidden ${i % 2 === 1 ? "lg:col-start-1" : ""}`}>
              <img src={image} alt={title} className="w-full h-64 lg:h-80 object-cover" loading="lazy" />
            </div>
          </section>
        ))}

        <section className="rounded-xl bg-muted/50 p-8">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-6 text-center">What You Can Expect</h2>
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            {[
              "Thoroughly inspected vehicles",
              "Transparent, no-surprise pricing",
              "Flexible financing options",
              "Competitive trade-in values",
              "Nationwide delivery available",
              "Dedicated post-purchase support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default OurPromise;
