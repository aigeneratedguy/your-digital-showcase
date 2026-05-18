import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSignUp = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", adminCode: "",
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const change = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.adminCode) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error: signUpErr } = await signUp(form.email, form.password, { name: form.name });
    if (signUpErr) {
      setLoading(false);
      toast.error(signUpErr.message);
      return;
    }
    // Ensure session for RPC (auto-confirm is enabled)
    const { error: signInErr } = await signIn(form.email, form.password);
    if (signInErr) {
      setLoading(false);
      toast.error("Account created but auto sign-in failed. Try signing in.");
      navigate("/admin/signin");
      return;
    }

    const { error: rpcErr } = await supabase.rpc("claim_admin_role", { _code: form.adminCode });
    setLoading(false);
    if (rpcErr) {
      await supabase.auth.signOut();
      toast.error(rpcErr.message || "Invalid admin access code");
      return;
    }
    toast.success("Admin account created!");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-4 py-10">
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
              Admin Sign Up
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Requires a valid admin access code.
            </p>
            <div className="section-divider mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={change("name")}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={change("email")}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={change("password")}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={change("confirmPassword")}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Admin Access Code"
                value={form.adminCode}
                onChange={change("adminCode")}
                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? "Creating admin..." : "Create Admin Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-muted-foreground">
            Already an admin?{" "}
            <Link to="/admin/signin" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
