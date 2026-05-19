import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AdminSettings = () => {
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

export default AdminSettings;
