import { useEffect, useState } from "react";
import { Eye, Truck, User, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Order, Profile, ORDER_STATUSES, statusColor } from "./shared";
import { formatINR } from "@/lib/format";

type OrderItem = {
  id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
};

type OrderWithDelivery = Order & {
  delivery_name: string | null;
  delivery_mobile: string | null;
  delivery_address: string | null;
};

const Orders = () => {
  const [orders, setOrders] = useState<OrderWithDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDelivery | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<Profile | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setOrders((data as OrderWithDelivery[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order updated" });
      load();
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const openDetail = async (order: OrderWithDelivery) => {
    setSelectedOrder(order);
    setDetailOpen(true);
    setDetailLoading(true);
    setOrderItems([]);
    setCustomer(null);
    const [{ data: items }, { data: profile }] = await Promise.all([
      supabase.from("order_items").select("*").eq("order_id", order.id),
      supabase.from("profiles").select("*").eq("user_id", order.user_id).maybeSingle(),
    ]);
    setOrderItems((items as OrderItem[]) || []);
    setCustomer((profile as Profile) || null);
    setDetailLoading(false);
  };

  const dispatchOrder = (id: string) => updateStatus(id, "On the Way");

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Order History</CardTitle>
          <Badge className="bg-primary/15 text-primary border-primary/30">{orders.length} orders</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id.slice(0, 8)}</TableCell>
                    <TableCell>{o.delivery_name || "—"}</TableCell>
                    <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{formatINR(Number(o.total))}</TableCell>
                    <TableCell>
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openDetail(o)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order #{selectedOrder?.id.slice(0, 8)}
              {selectedOrder && (
                <Badge variant="outline" className={statusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {detailLoading || !selectedOrder ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : (
            <div className="space-y-5 py-2">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Delivery To</h3>
                <div className="space-y-2 text-sm bg-muted/40 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 mt-0.5 text-primary" />
                    <span className="font-medium">{selectedOrder.delivery_name || customer?.name || "—"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 text-primary" />
                    <span>{selectedOrder.delivery_mobile || customer?.mobile || "—"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                    <span>{selectedOrder.delivery_address || customer?.address || "—"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Items</h3>
                {orderItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell className="font-medium">{it.menu_item_name}</TableCell>
                          <TableCell className="text-center">{it.quantity}</TableCell>
                          <TableCell className="text-right">{formatINR(Number(it.price))}</TableCell>
                          <TableCell className="text-right">{formatINR(Number(it.price) * it.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="space-y-1 text-sm border-t pt-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(Number(selectedOrder.subtotal))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatINR(Number(selectedOrder.tax))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatINR(Number(selectedOrder.delivery_fee))}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>{formatINR(Number(selectedOrder.total))}</span></div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
            {selectedOrder && selectedOrder.status === "Preparing" && (
              <Button onClick={() => dispatchOrder(selectedOrder.id)}>
                <Truck className="w-4 h-4 mr-2" /> Dispatch Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Orders;
