import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { emptyFoodForm } from "./shared";

const AddFood = () => {
  const [form, setForm] = useState(emptyFoodForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast({ title: "Missing fields", description: "Name, category and price are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("menu_items").insert({
      name: form.name,
      category: form.category,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      available: form.available,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Food item added", description: `${form.name} is now on the menu.` });
    setForm(emptyFoodForm);
    navigate("/admin/menu");
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-primary" /> Add New Food Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Margherita Pizza" />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Pizza" />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="299" />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
          </div>

          {form.image_url && (
            <div className="rounded-lg overflow-hidden border border-border max-w-xs">
              <img src={form.image_url} alt="preview" className="w-full h-40 object-cover" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
            <Label>Available for ordering</Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving}>
              <Plus className="w-4 h-4 mr-1" /> {saving ? "Adding..." : "Add to Menu"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setForm(emptyFoodForm)}>
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFood;
