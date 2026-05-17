import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !roleLoading && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, roleLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    // Verify admin role after sign-in
    const { data: sessionData } = await supabase.auth.getUser();
    const uid = sessionData.user?.id;
    if (!uid) {
      setLoading(false);
      toast.error("Could not verify session");
      return;
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();

    setLoading(false);

    if (!roleRow) {
      await supabase.auth.signOut();
      toast.error("This account does not have admin access");
      return;
    }

    toast.success("Welcome back, admin");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>

        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground italic">
              Admin Sign In
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Restricted area. Authorized personnel only.
            </p>
            <div className="section-divider mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? "Verifying..." : "Sign In to Admin Panel"}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-muted-foreground">
            Not an admin?{" "}
            <Link to="/signin" className="text-primary font-semibold hover:underline">
              Customer sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
