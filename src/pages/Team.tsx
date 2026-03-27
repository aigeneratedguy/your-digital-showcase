import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
  { name: "Chef Maria Lopez", role: "Head Chef", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop" },
  { name: "James Carter", role: "Operations Manager", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
  { name: "Aisha Patel", role: "Nutritionist", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
  { name: "David Kim", role: "Delivery Lead", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 bg-secondary">
        <div className="container text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Our Team</h1>
          <p className="text-muted-foreground text-lg">Meet the passionate people behind every meal we serve.</p>
        </div>
      </section>

      <section className="py-16 container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm text-center">
              <img src={member.image} alt={member.name} className="w-full h-56 object-cover" loading="lazy" />
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
