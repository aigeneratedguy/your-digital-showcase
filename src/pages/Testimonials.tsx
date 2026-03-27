import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", rating: 5, text: "Absolutely love FoodServe! The food is always fresh and arrives hot. Their butter chicken is to die for!" },
  { name: "Raj K.", rating: 5, text: "Best online food service I've used. The menu variety is incredible and ordering is so easy." },
  { name: "Emily T.", rating: 4, text: "Great quality meals at reasonable prices. The delivery is always on time. Highly recommend!" },
  { name: "Michael B.", rating: 5, text: "As a busy professional, FoodServe has been a lifesaver. Healthy, delicious meals delivered right to my door." },
  { name: "Priya S.", rating: 4, text: "The vegetarian options are fantastic. Finally a service that takes veggie meals seriously!" },
  { name: "Tom W.", rating: 5, text: "I've tried many food delivery services and FoodServe is hands down the best. The pasta dishes are restaurant quality." },
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 bg-secondary">
        <div className="container text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Testimonials</h1>
          <p className="text-muted-foreground text-lg">What our customers say about us.</p>
        </div>
      </section>

      <section className="py-16 container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < t.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
              <p className="font-heading font-semibold text-foreground">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
