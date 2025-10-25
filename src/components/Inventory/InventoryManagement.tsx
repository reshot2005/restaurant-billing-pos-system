import { Package, AlertTriangle, TrendingDown, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { motion } from "motion/react";

const inventoryItems = [
  { id: 1, name: "Tomatoes", current: 5, unit: "kg", threshold: 10, max: 50, status: "low" },
  { id: 2, name: "Mozzarella Cheese", current: 12, unit: "kg", threshold: 8, max: 30, status: "ok" },
  { id: 3, name: "Flour", current: 3, unit: "kg", threshold: 15, max: 60, status: "critical" },
  { id: 4, name: "Lettuce", current: 18, unit: "kg", threshold: 10, max: 40, status: "ok" },
  { id: 5, name: "Ground Beef", current: 22, unit: "kg", threshold: 15, max: 50, status: "ok" },
  { id: 6, name: "Olive Oil", current: 4, unit: "L", threshold: 5, max: 20, status: "low" },
];

export function InventoryManagement() {
  const lowStockItems = inventoryItems.filter((item) => item.status !== "ok");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return { bg: "bg-destructive/10", text: "text-destructive", badge: "bg-destructive" };
      case "low":
        return { bg: "bg-[#FDE68A]/30", text: "text-[#92400E]", badge: "bg-[#FDE68A]" };
      default:
        return { bg: "bg-[#BBF7D0]/30", text: "text-[#047857]", badge: "bg-[#BBF7D0]" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground">Track stock levels and manage ingredients</p>
        </div>
        <Button className="gap-2 bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {inventoryItems.filter((i) => i.status === "critical").length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Immediate action needed</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FDE68A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {inventoryItems.filter((i) => i.status === "low").length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Below threshold</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#BBF7D0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{inventoryItems.length}</div>
            <div className="text-sm text-muted-foreground mt-1">In inventory</div>
          </CardContent>
        </Card>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-l-4 border-l-[#FDE68A]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                Low Stock Alerts
              </CardTitle>
              <Button variant="outline" size="sm">
                Create PO Draft
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${getStatusColor(item.status).bg}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span>{item.name}</span>
                    <Badge className={`${getStatusColor(item.status).badge} text-black`}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {item.current} {item.unit} / {item.max} {item.unit}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryItems.map((item, index) => {
              const percentage = (item.current / item.max) * 100;
              const colors = getStatusColor(item.status);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7DD3FC]/20 to-[#FBCFE8]/20 flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.current} {item.unit} available
                        </div>
                      </div>
                    </div>
                    <Badge className={`${colors.badge} text-black`}>{item.status}</Badge>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Threshold: {item.threshold} {item.unit}</span>
                    <span>Max: {item.max} {item.unit}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
