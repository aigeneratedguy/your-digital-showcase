import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatINR } from "@/lib/format";

const CartDrawer = () => {
  const { items, updateQty, removeItem, clearCart, totalItems, subtotal, isOpen, setIsOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tax = subtotal * 0.08;
  const deliveryFee = items.length > 0 ? 49 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) {
      toast.info("Please sign in to checkout and add your delivery details.");
      navigate("/signin");
      return;
    }
    navigate("/order-confirmation");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-foreground hover:text-primary transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Browse Menu</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.name} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-card shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                    <p className="text-primary font-semibold text-sm">{formatINR(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.name, item.qty - 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.name, item.qty + 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.name)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span><span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (8%)</span><span>{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery Fee</span><span>{formatINR(deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg text-foreground">
                <span>Total</span><span>{formatINR(total)}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={clearCart} className="flex-1">Clear</Button>
                <Button onClick={handleCheckout} className="flex-1">
                  {user ? "Checkout" : "Sign in to Checkout"}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
