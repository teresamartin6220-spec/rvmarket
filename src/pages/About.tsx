import { motion } from "framer-motion";
import { Award, Users, Shield, Heart, Truck } from "lucide-react";
import { companyInfo } from "@/data/mockData";

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      {/* Hero with background image */}
      <div className="relative">
        <img src="https://i.ibb.co/Z6gH67J0/IMG-1315.jpg" alt="" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">About RV Market</h1>
            <p className="text-white/80 mt-2 max-w-xl">
              Over {companyInfo.yearsInBusiness} years of passion, integrity, and excellence in the RV industry.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-16">
        {/* Story */}
        <section className="max-w-3xl mx-auto text-center">
          <Award className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            For over {companyInfo.yearsInBusiness} years, RV Market has been a trusted name in the pre-owned RV industry. 
            What started as a small family operation has grown into a nationwide marketplace serving customers 
            across the United States. Our passion for the open road and commitment to quality have made us 
            one of the most respected names in the business.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We believe that every family deserves the freedom to explore, and we work tirelessly to make RV 
            ownership accessible and enjoyable. Every vehicle in our inventory undergoes rigorous inspection 
            to ensure it meets our high standards of quality and safety.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold font-heading text-foreground text-center mb-8">What Sets Us Apart</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Shield, title: "Trust & Transparency", desc: "Every listing is honest and every price is fair. No hidden fees, no surprises." },
              { icon: Users, title: "Nationwide Presence", desc: "Operating across the United States with dedicated support." },
              { icon: Users, title: "Customer First", desc: "Our dedicated team provides personalized service from browsing to purchase and beyond." },
              { icon: Heart, title: "Passion for RVs", desc: "We're not just sellers — we're RV enthusiasts who understand the lifestyle." },
              { icon: Truck, title: "Trade-In Program", desc: "Looking to upgrade? We offer competitive trade-in values for your current RV." },
              { icon: Award, title: `${companyInfo.yearsInBusiness}+ Years Legacy`, desc: "Decades of building relationships and delivering quality RVs." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border bg-card p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default About;
