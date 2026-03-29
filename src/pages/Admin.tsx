import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, Settings,
  TrendingUp, Clock, CheckCircle, XCircle, ArrowLeft, Menu, X, ShieldAlert,
} from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Orders", icon: ShoppingBag, id: "orders" },
  { label: "Menu Items", icon: UtensilsCrossed, id: "menu" },
  { label: "Customers", icon: Users, id: "customers" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const stats = [
  { label: "Total Orders", value: "1,284", icon: ShoppingBag, change: "+12%" },
  { label: "Revenue", value: "$24,580", icon: TrendingUp, change: "+8.2%" },
  { label: "Pending Orders", value: "23", icon: Clock, change: "-3%" },
  { label: "Active Customers", value: "846", icon: Users, change: "+5.4%" },
];

const recentOrders = [
  { id: "#FD-0042", customer: "John Doe", items: 3, total: "$56.94", status: "Preparing" },
  { id: "#FD-0041", customer: "Jane Smith", items: 2, total: "$29.98", status: "Delivered" },
  { id: "#FD-0040", customer: "Mike Johnson", items: 5, total: "$78.50", status: "On the Way" },
  { id: "#FD-0039", customer: "Sarah Wilson", items: 1, total: "$14.99", status: "Cancelled" },
  { id: "#FD-0038", customer: "Tom Brown", items: 4, total: "$62.96", status: "Delivered" },
];

const menuItems = [
  { name: "Grilled Chicken Salad", category: "Lunch", price: "$12.99", available: true },
  { name: "Margherita Pizza", category: "Dinner", price: "$14.99", available: true },
  { name: "Chocolate Lava Cake", category: "Desserts", price: "$8.99", available: false },
  { name: "Fresh Orange Juice", category: "Beverages", price: "$4.99", available: true },
  { name: "Eggs Benedict", category: "Breakfast", price: "$11.99", available: true },
];

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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
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

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
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

const DashboardView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-green-600">{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.slice(0, 4).map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{o.items}</TableCell>
                <TableCell>{o.total}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColor(o.status)}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

const OrdersView = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">All Orders</CardTitle>
      <Badge className="bg-primary/15 text-primary border-primary/30">{recentOrders.length} orders</Badge>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{o.id}</TableCell>
              <TableCell>{o.customer}</TableCell>
              <TableCell>{o.items}</TableCell>
              <TableCell>{o.total}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColor(o.status)}>{o.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded hover:bg-muted"><CheckCircle className="w-4 h-4 text-green-600" /></button>
                  <button className="p-1.5 rounded hover:bg-muted"><XCircle className="w-4 h-4 text-destructive" /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const MenuView = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Menu Items</CardTitle>
      <Button size="sm">+ Add Item</Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <Badge variant="outline" className={item.available ? "bg-green-100 text-green-700 border-green-200" : "bg-destructive/15 text-destructive border-destructive/30"}>
                  {item.available ? "Yes" : "No"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const CustomersView = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Customers</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-center py-12">Customer management coming soon.</p>
    </CardContent>
  </Card>
);

const SettingsView = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Settings</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-center py-12">Settings panel coming soon.</p>
    </CardContent>
  </Card>
);

export default Admin;
