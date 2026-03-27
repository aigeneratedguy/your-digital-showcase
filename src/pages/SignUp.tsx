import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "", address: "", email: "", mobile: "", password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
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
    const { error } = await signUp(form.email, form.password, {
      name: form.name,
      address: form.address,
      mobile: form.mobile,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please check your email to verify.");
      navigate("/signin");
    }
  };

  const fields = [
    { key: "name", placeholder: "Enter your Name", type: "text" },
    { key: "address", placeholder: "Enter your Address", type: "text" },
    { key: "email", placeholder: "Enter your Email ID", type: "email" },
    { key: "mobile", placeholder: "Enter your Mobile number", type: "tel" },
    { key: "password", placeholder: "Enter your Password", type: "password" },
    { key: "confirmPassword", placeholder: "Re-Enter your Password", type: "password" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md px-6">
          <h1 className="font-heading text-4xl font-bold text-center text-foreground italic">Sign Up</h1>
          <div className="section-divider mt-2 mb-8" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <input
                key={f.key}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={handleChange(f.key)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground"
              />
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground font-heading italic">
            Already Registered?{" "}
            <Link to="/signin" className="text-primary font-semibold hover:underline">
              Click Here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
