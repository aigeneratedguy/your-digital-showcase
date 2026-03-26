import { Link } from "react-router-dom";
import heroDrink from "@/assets/hero-drink.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="animate-fade-in-up">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Welcome To
            <br />
            Our Restaurant
          </h1>
          <p className="font-heading text-4xl md:text-5xl font-bold text-primary italic mt-2">
            Hungry To Eat
          </p>
          <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
            Wake up your taste buds. You'll wonder how you ever lived without us.
            So long as you have food in your mouth, you have solved all the problems for the time being.
          </p>
          <Link
            to="/order-confirmation"
            className="inline-block mt-8 px-8 py-3 rounded-full bg-card border border-border text-primary font-semibold shadow-md hover:shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Order Now
          </Link>
        </div>

        {/* Right image */}
        <div className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-card">
            <img
              src={heroDrink}
              alt="Orange Mojito cocktail"
              className="w-full h-full object-cover"
              width={800}
              height={800}
            />
          </div>
          <div className="text-center">
            <h3 className="font-heading font-bold text-lg text-foreground">Orange Mojito</h3>
            <p className="text-sm text-muted-foreground">
              A refreshing blend of citrus and mint
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
