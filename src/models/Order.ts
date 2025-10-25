export interface Order {
  id: string;
  table: string;
  items: { name: string; qty: number; price: number }[];
  status: "active" | "done";
  timestamp: number;
  totalAmount: number;
  profit: number;
}
