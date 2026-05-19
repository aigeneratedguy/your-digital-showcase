import { useEffect, useState } from "react";
import { ShoppingBag, TrendingUp, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order, statusColor } from "./shared";

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: o } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      setOrders(o || []);
      setCustomerCount(count || 0);
    })();
  }, []);

  const revenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + Number(o.total), 0);
  const pending = orders.filter(o => o.status === "Preparing" || o.status === "On the Way").length;

  const stats = [
    { label: "Total Orders", value: String(orders.length), icon: ShoppingBag },
    { label: "Revenue", value: `$${revenue.toFixed(2)}`, icon: TrendingUp },
    { label: "Pending Orders", value: String(pending), icon: Clock },
    { label: "Customers", value: String(customerCount), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet.</p>
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
                {orders.slice(0, 5).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id.slice(0, 8)}</TableCell>
                    <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>${Number(o.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(o.status)}>{o.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
