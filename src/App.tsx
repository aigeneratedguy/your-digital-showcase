import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import AdminOrders from "./pages/admin/Orders.tsx";
import AdminMenuItems from "./pages/admin/MenuItems.tsx";
import AdminAddFood from "./pages/admin/AddFood.tsx";
import AdminCustomers from "./pages/admin/Customers.tsx";
import AdminSignIn from "./pages/AdminSignIn.tsx";
import AdminSignUp from "./pages/AdminSignUp.tsx";
import About from "./pages/About.tsx";
import Team from "./pages/Team.tsx";
import Testimonials from "./pages/Testimonials.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/admin/signin" element={<AdminSignIn />} />
              <Route path="/admin/signup" element={<AdminSignUp />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="menu" element={<AdminMenuItems />} />
                <Route path="add-food" element={<AdminAddFood />} />
                <Route path="customers" element={<AdminCustomers />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
