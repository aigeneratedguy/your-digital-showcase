import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import foodBreakfast from "@/assets/food-breakfast.jpg";
import foodLunch from "@/assets/food-lunch.jpg";
import foodDinner from "@/assets/food-dinner.jpg";
import foodPasta from "@/assets/food-pasta.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodBeverage from "@/assets/food-beverage.jpg";

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Beverages", "Desserts"];

const menuItems = [
  { name: "Herb Omelette", category: "Breakfast", rating: 4.3, price: "₹149", image: foodBreakfast },
  { name: "Club Sandwich", category: "Lunch", rating: 5.0, price: "₹199", image: foodLunch },
  { name: "Fruit Salad Bowl", category: "Dinner", rating: 5.0, price: "₹179", image: foodDinner },
  { name: "Chicken Pasta", category: "Lunch", rating: 4.7, price: "₹249", image: foodPasta },
  { name: "Chocolate Lava Cake", category: "Desserts", rating: 4.9, price: "₹159", image: foodDessert },
  { name: "Fresh Smoothies", category: "Beverages", rating: 4.5, price: "₹129", image: foodBeverage },
];

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-secondary/30" id="menu">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary text-sm font-medium mb-4">
            OUR MENU
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold italic text-foreground">
            Wake Up Early,
            <br />
            Eat Fresh & Healthy
          </h2>
          <div className="section-divider mt-3" />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground border border-border hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center group"
            >
              <div className="w-56 h-56 rounded-full overflow-hidden shadow-lg border-4 border-card group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={640}
                  height={640}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-heading font-bold text-lg text-foreground">{item.name}</h3>
                <p className="text-primary font-bold mt-1">{item.price}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-primary font-semibold">{item.rating}</span>
                  <Star className="w-4 h-4 fill-primary text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
