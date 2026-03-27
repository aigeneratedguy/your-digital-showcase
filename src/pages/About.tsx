import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Utensils, Heart, Leaf } from "lucide-react";

const values = [
  { icon: Utensils, title: "Quality Food", description: "We use only the freshest ingredients sourced from local farms and trusted suppliers." },
  { icon: Heart, title: "Made with Love", description: "Every dish is prepared with passion and care by our experienced chefs." },
  { icon: Leaf, title: "Sustainability", description: "We are committed to eco-friendly practices and reducing our environmental footprint." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 bg-secondary">
        <div className="container text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">About FoodServe</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Founded with a simple mission — to bring restaurant-quality meals to your doorstep. We believe great food should be accessible, convenient, and always delicious.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 container max-w-4xl">
        <h2 className="font-heading text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          FoodServe started in 2020 as a small kitchen with big dreams. What began as a local delivery service quickly grew into a beloved food platform trusted by thousands. Our journey has been fueled by a love of cooking and the joy of seeing satisfied customers.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Today, we partner with talented chefs and source ingredients responsibly to craft a diverse menu that caters to every palate. From classic comfort food to healthy gourmet options, we have something for everyone.
        </p>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-10 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-xl p-8 text-center shadow-sm border border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
