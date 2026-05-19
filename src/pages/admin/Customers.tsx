import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Profile } from "./shared";

const Customers = () => {
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

export default Customers;
