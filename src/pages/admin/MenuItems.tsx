import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, emptyFoodForm } from "./shared";

const MenuItems = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyFoodForm);
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
    setForm(emptyFoodForm);
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

export default MenuItems;
