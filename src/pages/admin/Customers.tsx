import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Profile, Order, ORDER_STATUSES, statusColor } from "./shared";
import { formatINR } from "@/lib/format";

const Customers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { toast } = useToast();

  const loadProfiles = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => { loadProfiles(); }, []);

  const openOrders = async (p: Profile) => {
    setSelected(p);
    setOpen(true);
    setOrdersLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", p.user_id)
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setOrdersLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order updated" });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  return (
    <>
      <Card>
        <CardHeader><CardTitle className="text-lg">Customers</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : profiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No customers yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name || "—"}</TableCell>
                    <TableCell>{p.mobile || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">{p.address || "—"}</TableCell>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openOrders(p)}>
                        <Eye className="w-4 h-4 mr-1" /> Orders
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.name || "Customer"}'s Orders</DialogTitle>
          </DialogHeader>
          {ordersLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders for this customer.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id.slice(0, 8)}</TableCell>
                    <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{formatINR(Number(o.total))}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColor(o.status)}>{o.status}</Badge>
                        <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Customers;
