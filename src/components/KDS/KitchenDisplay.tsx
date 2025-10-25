import { useState } from "react";
import { Clock, CheckCircle, Printer, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion, AnimatePresence } from "motion/react";

interface KDSOrder {
  id: string;
  table: string;
  items: Array<{ name: string; quantity: number; notes?: string }>;
  time: number;
  station: string;
  priority: "normal" | "urgent";
  status: "pending" | "preparing" | "ready";
}

const mockOrders: KDSOrder[] = [
  {
    id: "#1234",
    table: "T-12",
    items: [
      { name: "Margherita Pizza", quantity: 2, notes: "Extra cheese" },
      { name: "Caesar Salad", quantity: 1 },
    ],
    time: 12,
    station: "grill",
    priority: "normal",
    status: "preparing",
  },
  {
    id: "#1235",
    table: "T-05",
    items: [
      { name: "Classic Burger", quantity: 1, notes: "No onions" },
      { name: "Fries", quantity: 1 },
    ],
    time: 8,
    station: "grill",
    priority: "normal",
    status: "preparing",
  },
  {
    id: "#1236",
    table: "Takeaway",
    items: [
      { name: "Pasta Carbonara", quantity: 2 },
      { name: "Garlic Bread", quantity: 1 },
    ],
    time: 18,
    station: "pasta",
    priority: "urgent",
    status: "pending",
  },
  {
    id: "#1237",
    table: "T-08",
    items: [{ name: "Greek Salad", quantity: 1 }, { name: "Lemonade", quantity: 2 }],
    time: 5,
    station: "cold",
    priority: "normal",
    status: "preparing",
  },
];

export function KitchenDisplay() {
  const [orders, setOrders] = useState<KDSOrder[]>(mockOrders);
  const [selectedStation, setSelectedStation] = useState("all");

  const filteredOrders = orders.filter(
    (order) => selectedStation === "all" || order.station === selectedStation
  );

  const markAsReady = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: "ready" as const } : order)));
  };

  const getPriorityColor = (time: number, priority: string) => {
    if (priority === "urgent" || time > 15) return "border-[#EF4444]";
    if (time > 10) return "border-[#FDE68A]";
    return "border-[#BBF7D0]";
  };

  const getTimeColor = (time: number) => {
    if (time > 15) return "text-[#EF4444]";
    if (time > 10) return "text-[#F59E0B]";
    return "text-[#10B981]";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Kitchen Display System</h1>
          <p className="text-muted-foreground">Real-time order management for kitchen stations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print All
          </Button>
        </div>
      </div>

      <Tabs value={selectedStation} onValueChange={setSelectedStation}>
        <TabsList>
          <TabsTrigger value="all">All Stations</TabsTrigger>
          <TabsTrigger value="grill">Grill</TabsTrigger>
          <TabsTrigger value="pasta">Pasta</TabsTrigger>
          <TabsTrigger value="cold">Cold Station</TabsTrigger>
          <TabsTrigger value="fryer">Fryer</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`border-l-4 ${getPriorityColor(
                  order.time,
                  order.priority
                )} hover:shadow-lg transition-shadow ${
                  order.status === "ready" ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{order.table}</Badge>
                        <Badge
                          className={
                            order.station === "grill"
                              ? "bg-[#FBCFE8] text-black"
                              : order.station === "pasta"
                              ? "bg-[#FDE68A] text-black"
                              : "bg-[#7DD3FC] text-black"
                          }
                        >
                          {order.station}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${getTimeColor(order.time)}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-xl">{order.time}</span>
                        <span className="text-sm">min</span>
                      </div>
                      {order.priority === "urgent" && (
                        <div className="flex items-center gap-1 text-[#EF4444] text-xs mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          Urgent
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="p-3 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm">{item.name}</span>
                          <Badge className="bg-[#7DD3FC] text-black text-xs">
                            x{item.quantity}
                          </Badge>
                        </div>
                        {item.notes && (
                          <div className="text-xs text-muted-foreground mt-2 p-2 bg-[#FDE68A]/20 rounded">
                            📝 {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.status === "ready" ? (
                    <Button variant="outline" className="w-full gap-2" disabled>
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      Ready for Pickup
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#BBF7D0] hover:bg-[#BBF7D0]/90 text-[#047857] gap-2"
                        onClick={() => markAsReady(order.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Done
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[#BBF7D0]/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#10B981]" />
          </div>
          <h3>All caught up!</h3>
          <p className="text-muted-foreground mt-2">
            No pending orders for this station
          </p>
        </div>
      )}
    </div>
  );
}
