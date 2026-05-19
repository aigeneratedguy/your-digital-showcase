export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number | null;
  image_url: string | null;
  available: boolean | null;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  created_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  mobile: string | null;
  address: string | null;
  created_at: string;
};

export const ORDER_STATUSES = ["Preparing", "On the Way", "Delivered", "Cancelled"];

export const statusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-700 border-green-200";
    case "Preparing": return "bg-primary/15 text-primary border-primary/30";
    case "On the Way": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Cancelled": return "bg-destructive/15 text-destructive border-destructive/30";
    default: return "bg-muted text-muted-foreground";
  }
};

export const emptyFoodForm = { name: "", category: "", price: "", image_url: "", available: true };
