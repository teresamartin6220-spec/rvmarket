import { motion } from "framer-motion";
import { Award, Globe, Users, Shield, Heart, Truck } from "lucide-react";
import { companyInfo } from "@/data/mockData";

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-hero">
        <div className="container py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-primary-foreground">About Us</h1>
          <p className="text-primary-foreground/70 mt-2 max-w-xl">
            Over {companyInfo.yearsInBusiness} years of passion, integrity, and excellence in the RV industry.
          </p>
        </div>
      </div>

      <div className="container py-16 space-y-16">
        {/* Story */}
        <section className="max-w-3xl mx-auto text-center">
          <Award className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            For over {companyInfo.yearsInBusiness} years, RV Market has been a trusted name in the pre-owned RV industry. 
            What started as a small family operation has grown into an international marketplace serving customers 
            across the United States, Canada, United Kingdom, and Australia. Our passion for the open road and 
            commitment to quality have made us one of the most respected names in the business.
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
              { icon: Globe, title: "Global Presence", desc: "Operating across 4 countries with dedicated local support in each region." },
              { icon: Users, title: "Customer First", desc: "Our dedicated team provides personalized service from browsing to purchase and beyond." },
              { icon: Heart, title: "Passion for RVs", desc: "We're not just sellers — we're RV enthusiasts who understand the lifestyle." },
              { icon: Truck, title: "Trade-In Program", desc: "Looking to upgrade? We offer competitive trade-in values for your current RV." },
              { icon: Award, title: "25+ Years Legacy", desc: "A quarter century of building relationships and delivering quality RVs." },
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

        {/* Stats */}
        <section className="rounded-xl bg-gradient-hero p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "25+", label: "Years in Business" },
              { value: "10,000+", label: "RVs Sold" },
              { value: "4", label: "Countries" },
              { value: "98%", label: "Happy Customers" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold font-heading text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default About;
