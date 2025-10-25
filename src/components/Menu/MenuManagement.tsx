import { useState } from "react";
import { Plus, Search, Edit, Trash2, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { motion } from "motion/react";
import { useCart } from "../Cart/CartContext";
import { toast } from "sonner@2.0.3";

const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 15.99,
    cost: 6.50,
    image: "🍕",
    sales: 145,
    status: "active",
    allergens: ["Dairy", "Gluten"],
  },
  {
    id: 2,
    name: "Caesar Salad",
    category: "Salads",
    price: 10.99,
    cost: 4.20,
    image: "🥗",
    sales: 98,
    status: "active",
    allergens: ["Dairy"],
  },
  {
    id: 3,
    name: "Classic Burger",
    category: "Burgers",
    price: 12.99,
    cost: 5.80,
    image: "🍔",
    sales: 87,
    status: "active",
    allergens: ["Gluten"],
  },
  {
    id: 4,
    name: "Pasta Carbonara",
    category: "Pasta",
    price: 14.99,
    cost: 5.50,
    image: "🍝",
    sales: 76,
    status: "active",
    allergens: ["Dairy", "Gluten", "Eggs"],
  },
];

export function MenuManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart, getCartCount } = useCart();

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getMargin = (price: number, cost: number) => {
    return (((price - cost) / price) * 100).toFixed(0);
  };

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
      modifiers: [],
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Menu Management</h1>
          <p className="text-muted-foreground">Manage your menu items, pricing, and recipes</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black">
              <Plus className="w-4 h-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input placeholder="e.g., Margherita Pizza" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Pizza" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" placeholder="15.99" />
                </div>
                <div className="space-y-2">
                  <Label>Cost ($)</Label>
                  <Input type="number" placeholder="6.50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe the item..." />
              </div>
              <div className="space-y-2">
                <Label>Allergens (comma separated)</Label>
                <Input placeholder="Dairy, Gluten" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black">
                  Save Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-0"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="Pizza">Pizza</TabsTrigger>
            <TabsTrigger value="Burgers">Burgers</TabsTrigger>
            <TabsTrigger value="Salads">Salads</TabsTrigger>
            <TabsTrigger value="Pasta">Pasta</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7DD3FC]/20 to-[#FBCFE8]/20 flex items-center justify-center text-2xl">
                        {item.image}
                      </div>
                      <div>
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="text-[#7DD3FC]">${item.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cost</span>
                      <span>${item.cost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Margin</span>
                      <Badge className="bg-[#BBF7D0] text-[#047857]">
                        {getMargin(item.price, item.cost)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        Sales
                      </div>
                      <span className="text-sm">{item.sales} orders</span>
                    </div>
                    {item.allergens.length > 0 && (
                      <div className="pt-2">
                        <div className="text-xs text-muted-foreground mb-1">Allergens:</div>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen) => (
                            <Badge key={allergen} variant="outline" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      className="w-full bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black gap-2 mt-3"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
