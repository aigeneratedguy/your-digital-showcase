import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, Settings,
  TrendingUp, Clock, ArrowLeft, Menu, X, ShieldAlert, Plus, Trash2, Pencil,
} from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number | null;
  image_url: string | null;
  available: boolean | null;
};

type Order = {
  id: string;
  user_id: string;
  status: string;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  created_at: string;
};

type Profile = {
  id: string;
  user_id: string;
  name: string;
  mobile: string | null;
  address: string | null;
  created_at: string;
};

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Orders", icon: ShoppingBag, id: "orders" },
  { label: "Menu Items", icon: UtensilsCrossed, id: "menu" },
  { label: "Customers", icon: Users, id: "customers" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const ORDER_STATUSES = ["Preparing", "On the Way", "Delivered", "Cancelled"];

const statusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-700 border-green-200";
    case "Preparing": return "bg-primary/15 text-primary border-primary/30";
    case "On the Way": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Cancelled": return "bg-destructive/15 text-destructive border-destructive/30";
    default: return "bg-muted text-muted-foreground";
  }
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <ShieldAlert className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Link to="/" className="text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <span className="font-heading text-xl font-bold text-foreground">🍽️ Admin</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Site</Link>
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <header className="border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-heading font-bold text-foreground capitalize">
            {activeTab}
          </h1>
        </header>

        <div className="p-6">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "orders" && <OrdersView />}
          {activeTab === "menu" && <MenuView />}
          {activeTab === "customers" && <CustomersView />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

const DashboardView = () => {
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

const OrdersView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setOrders(data || []);
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
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">All Orders</CardTitle>
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
                <TableHead>Date</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">#{o.id.slice(0, 8)}</TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${Number(o.subtotal).toFixed(2)}</TableCell>
                  <TableCell>${Number(o.total).toFixed(2)}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const emptyForm = { name: "", category: "", price: "", image_url: "", available: true };

const MenuView = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("menu_items").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      image_url: item.image_url || "",
      available: item.available ?? true,
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      available: form.available,
    };
    const { error } = editing
      ? await supabase.from("menu_items").update(payload).eq("id", editing.id)
      : await supabase.from("menu_items").insert(payload);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Item updated" : "Item added" });
      setOpen(false);
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Item deleted" }); load(); }
  };

  const toggleAvailable = async (item: MenuItem) => {
    const { error } = await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Menu Items</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label>Price</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
                <Label>Available</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name || !form.category || !form.price}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No menu items yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Switch checked={!!item.available} onCheckedChange={() => toggleAvailable(item)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const CustomersView = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      setProfiles(data || []);
      setLoading(false);
    })();
  }, []);

  return (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name || "—"}</TableCell>
                  <TableCell>{p.mobile || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{p.address || "—"}</TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const SettingsView = () => {
  const { user } = useAuth();
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Settings</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-muted-foreground text-xs">Signed in as</Label>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <Label className="text-muted-foreground text-xs">User ID</Label>
          <p className="font-mono text-sm break-all">{user?.id}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
