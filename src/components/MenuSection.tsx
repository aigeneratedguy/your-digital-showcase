import { useEffect, useMemo, useState } from "react";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
const placeholder = "/placeholder.svg";

type DbMenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number | null;
  image_url: string | null;
  available: boolean | null;
};

const MenuSection = () => {
  const [items, setItems] = useState<DbMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem } = useCart();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: false });
    setItems((data as DbMenuItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("menu_items_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

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

        {loading ? (
          <p className="text-center text-muted-foreground">Loading menu...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No items available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => {
              const image = item.image_url || placeholder;
              return (
                <div key={item.id} className="flex flex-col items-center group">
                  <div className="w-56 h-56 rounded-full overflow-hidden shadow-lg border-4 border-card group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 bg-muted">
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={640}
                      height={640}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-heading font-bold text-lg text-foreground">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">{formatINR(Number(item.price))}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="text-primary font-semibold">{Number(item.rating ?? 0).toFixed(1)}</span>
                      <Star className="w-4 h-4 fill-primary text-primary" />
                    </div>
                    <button
                      onClick={() => {
                        addItem({ name: item.name, price: Number(item.price), image });
                        toast.success(`${item.name} added to cart`);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/90 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
