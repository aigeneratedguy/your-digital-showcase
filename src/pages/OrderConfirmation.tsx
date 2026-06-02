import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, MapPin, Phone, ArrowLeft, User } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatINR } from "@/lib/format";

const OrderConfirmation = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [stage, setStage] = useState<"details" | "confirmed">("details");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [form, setForm] = useState({ name: "", mobile: "", address: "" });

  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const deliveryFee = items.length > 0 ? 49 : 0;
  const total = subtotal + tax + deliveryFee;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("name, mobile, address")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm((f) => ({
            name: f.name || data.name || "",
            mobile: f.mobile || data.mobile || "",
            address: f.address || data.address || "",
          }));
        }
      });
  }, [user]);

  if (!authLoading && !user) return <Navigate to="/signin" replace />;

  const placeOrder = async () => {
    if (!user) return;
    if (!form.name.trim() || !form.mobile.trim() || !form.address.trim()) {
      toast.error("Please fill all delivery details");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        delivery_fee: Number(deliveryFee.toFixed(2)),
        total: Number(total.toFixed(2)),
        delivery_name: form.name.trim(),
        delivery_mobile: form.mobile.trim(),
        delivery_address: form.address.trim(),
      })
      .select()
      .single();

    if (error || !order) {
      setSubmitting(false);
      toast.error(error?.message || "Failed to place order");
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_item_name: item.name,
      quantity: item.qty,
      price: item.price,
    }));
    await supabase.from("order_items").insert(orderItems);

    setOrderNumber(`FD-${order.id.slice(0, 8).toUpperCase()}`);
    setStage("confirmed");
    setSubmitting(false);
    toast.success("Order placed successfully!");
  };

  if (stage === "details") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 max-w-2xl">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">Confirm your delivery details to place the order.</p>

          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">Delivery Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <div>
                <Label>Delivery Address</Label>
                <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Flat, street, city, pincode" rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No items in your cart.</p>
              ) : (
                <>
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name} × {item.qty}</span>
                      <span className="font-medium">{formatINR(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (8%)</span><span>{formatINR(tax)}</span></div>
                  <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery Fee</span><span>{formatINR(deliveryFee)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatINR(total)}</span></div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
            </Button>
            <Button onClick={placeOrder} disabled={submitting || items.length === 0} className="flex-1">
              {submitting ? "Placing order..." : "Place Order"}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your order. Your food is being prepared.</p>
          <Badge className="mt-3 bg-primary/15 text-primary border-primary/30 text-sm px-4 py-1">
            Order #{orderNumber}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Order Status</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {["Confirmed", "Preparing", "On the Way", "Delivered"].map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs mt-2 text-center ${i === 0 ? "text-primary font-semibold" : "text-muted-foreground"}`}>{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-card">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-semibold">{formatINR(item.price * item.qty)}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax (8%)</span><span>{formatINR(tax)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Delivery Fee</span><span>{formatINR(deliveryFee)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatINR(total)}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle className="text-lg">Delivery Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3"><User className="w-5 h-5 text-primary" /><p>{form.name}</p></div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /><p>{form.mobile}</p></div>
            <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><p>{form.address}</p></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><p className="text-sm text-muted-foreground">Estimated delivery: 30–45 minutes</p></div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/" onClick={clearCart}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
          </Button>
          <Button onClick={clearCart} asChild>
            <Link to="/">Order Again</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
