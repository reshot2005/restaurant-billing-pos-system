import { useState } from "react";
import { Search, Filter, Download, RefreshCcw, Printer, Eye } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { motion } from "motion/react";

const orders = [
  {
    id: "#1240",
    date: "2025-01-18 14:30",
    table: "T-12",
    items: 4,
    amount: 85.50,
    status: "completed",
    staff: "Sarah",
    paymentMethod: "Card",
  },
  {
    id: "#1239",
    date: "2025-01-18 14:15",
    table: "T-08",
    items: 2,
    amount: 42.00,
    status: "completed",
    staff: "Mike",
    paymentMethod: "Cash",
  },
  {
    id: "#1238",
    date: "2025-01-18 14:00",
    table: "Takeaway",
    items: 6,
    amount: 127.80,
    status: "refunded",
    staff: "Anna",
    paymentMethod: "Card",
  },
  {
    id: "#1237",
    date: "2025-01-18 13:45",
    table: "T-05",
    items: 3,
    amount: 58.90,
    status: "completed",
    staff: "Tom",
    paymentMethod: "Card",
  },
  {
    id: "#1236",
    date: "2025-01-18 13:30",
    table: "T-15",
    items: 5,
    amount: 96.20,
    status: "cancelled",
    staff: "Sarah",
    paymentMethod: "Cash",
  },
  {
    id: "#1235",
    date: "2025-01-18 13:15",
    table: "T-03",
    items: 2,
    amount: 45.60,
    status: "completed",
    staff: "Mike",
    paymentMethod: "Card",
  },
];

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-[#BBF7D0] text-[#047857]">Completed</Badge>;
      case "refunded":
        return <Badge className="bg-[#FDE68A] text-[#92400E]">Refunded</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/20 text-destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Orders Management</h1>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-0"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Table/Type</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.table}</Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-[#7DD3FC]">${order.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.staff}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found matching your criteria</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#BBF7D0]">
          <div className="text-sm text-muted-foreground mb-1">Total Orders</div>
          <div className="text-2xl">{orders.length}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#7DD3FC]">
          <div className="text-sm text-muted-foreground mb-1">Completed</div>
          <div className="text-2xl">
            {orders.filter((o) => o.status === "completed").length}
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#FDE68A]">
          <div className="text-sm text-muted-foreground mb-1">Refunded</div>
          <div className="text-2xl">
            {orders.filter((o) => o.status === "refunded").length}
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#FBCFE8]">
          <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
          <div className="text-2xl">
            ${orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
          </div>
        </Card>
      </div>
    </div>
  );
}
