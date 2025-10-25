import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, DollarSign, Percent, Save, Archive } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { Separator } from '../ui/separator';
import { useAuth } from '../Auth/AuthContext';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { DiscountModal } from './DiscountModal';
import { SplitBillModal } from './SplitBillModal';
import { PaymentModal } from './PaymentModal';
import { ParkedOrdersPanel } from './ParkedOrdersPanel';
import { ReceiptModal } from './ReceiptModal';
import localMenu from "../../data/menuItems.json"

interface MenuItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  tax: number;
  category: string;
  qty: number;
  kitchen_display: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export function POSScreenNew() {
  const { accessToken, user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [tableNumber, setTableNumber] = useState('T-1');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showParkedOrders, setShowParkedOrders] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
  setIsLoading(true);
  try {
    // ✅ Use local JSON instead of Supabase API
    const data = localMenu;

    const items = data.map((row: any) => ({
      id: String(row.id),
      sku: row.sku,
      name: row.name,
      price: Number(row.price),
      tax: Number(row.tax),
      category: row.category,
      qty: Number(row.qty),
      kitchen_display: Boolean(row.kitchen_display),
    }));

    setMenuItems(items);
    const cats = ["All", ...new Set(items.map((i) => i.category))];
    setCategories(cats);
  } catch (err) {
    console.error("Error loading mock menu:", err);
  } finally {
    setIsLoading(false);
  }
};

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let orderDiscount = 0;
  if (discountValue > 0) {
    if (discountType === 'percentage') {
      orderDiscount = (subtotal * discountValue) / 100;
    } else {
      orderDiscount = Math.min(discountValue, subtotal);
    }
  }

  const tax = cart.reduce((sum, item) => {
    const itemTotal = (item.price * item.quantity);
    return sum + (itemTotal * item.tax / 100);
  }, 0);

  const total = subtotal + tax - orderDiscount;

  const handleApplyDiscount = (type: 'percentage' | 'fixed', value: number) => {
    setDiscountType(type);
    setDiscountValue(value);
    toast.success(`Discount applied: ${type === 'percentage' ? value + '%' : '$' + value.toFixed(2)}`);
  };

  const handleSaveAndClose = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      // Create order
      const orderItems = cart.map(item => ({
        item_id: item.id,
        qty: item.quantity,
        discount: 0,
      }));

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1b17e9b2/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            items: orderItems,
            discount: orderDiscount,
            discount_type: discountType,
            table_number: orderType === 'dine-in' ? tableNumber : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

      // Park the order
      const parkResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1b17e9b2/api/orders/${data.order.id}/park`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!parkResponse.ok) {
        throw new Error('Failed to park order');
      }

      toast.success('Order saved and parked');
      clearCart();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    }
  };

  const handlePayNow = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (method: string, transactionId: string) => {
  try {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Generate mock order ID
    const orderId = `DEMO-${Math.floor(Math.random() * 100000)}`;

    // Create local order data
    const orderData = {
      id: orderId,
      table: orderType === "dine-in" ? tableNumber : orderType,
      items: cart.map((item) => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal,
      tax,
      discount: orderDiscount,
      totalAmount: total,
      profit: total * 0.25,
      status: "completed",
      payment: {
        method,
        transactionId,
        paidAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    // ✅ Save locally to localStorage (so receipt works)
    const prevOrders = JSON.parse(localStorage.getItem("demo_orders") || "[]");
    prevOrders.push(orderData);
    localStorage.setItem("demo_orders", JSON.stringify(prevOrders));

    // ✅ Show receipt
    setReceiptData({
      orderId: orderData.id,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      discount: orderData.discount,
      total: orderData.totalAmount,
      paymentMethod: orderData.payment.method,
      transactionId: orderData.payment.transactionId,
      timestamp: orderData.createdAt,
      tableNumber: orderData.table,
    });

    setShowPaymentModal(false);
    setShowReceipt(true);
    clearCart();

    toast.success("✅ Payment Successful! Receipt generated locally.");
  } catch (error) {
    console.error("Error processing payment:", error);
    toast.error("Failed to generate receipt. Try again.");
  }
};

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
  };

  const handleResumeOrder = (order: any) => {
    // Convert order items to cart format
    const cartItems: CartItem[] = order.items.map((item: any) => {
      const menuItem = menuItems.find(m => m.id === item.item_id);
      return {
        ...menuItem!,
        quantity: item.qty,
      };
    }).filter((item: CartItem) => item !== undefined);

    setCart(cartItems);
    setShowParkedOrders(false);
    toast.success('Order resumed');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4 p-4">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col">
        {/* Order Type Tabs */}
        <Tabs value={orderType} onValueChange={(v: any) => setOrderType(v)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-white/50">
            <TabsTrigger value="dine-in">Dine In</TabsTrigger>
            <TabsTrigger value="takeaway">Takeaway</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Table */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 backdrop-blur-sm bg-white/70"
            />
          </div>
          {orderType === 'dine-in' && (
            <Input
              placeholder="Table"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-24 backdrop-blur-sm bg-white/70"
            />
          )}
          <Button
            variant="outline"
            onClick={() => setShowParkedOrders(true)}
            className="gap-2 backdrop-blur-sm bg-white/70"
          >
            <Archive className="w-4 h-4" />
            Parked
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white whitespace-nowrap'
                  : 'whitespace-nowrap backdrop-blur-sm bg-white/70'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading menu...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/80 border-white/40"
                    onClick={() => addToCart(item)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center text-4xl mb-3">
                        {item.category === 'Pizza' && '🍕'}
                        {item.category === 'Burgers' && '🍔'}
                        {item.category === 'Salads' && '🥗'}
                        {item.category === 'Sides' && '🍟'}
                        {item.category === 'Beverages' && '🥤'}
                        {item.category === 'Desserts' && '🍨'}
                        {!['Pizza', 'Burgers', 'Salads', 'Sides', 'Beverages', 'Desserts'].includes(item.category) && '🍽️'}
                      </div>
                      <h4 className="text-sm mb-1 line-clamp-2">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sky-600">${item.price.toFixed(2)}</span>
                        {item.qty > 0 ? (
                          <Badge variant="outline" className="text-xs bg-green-50">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-red-50">
                            Out
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 flex flex-col backdrop-blur-xl bg-white/80 rounded-xl border border-white/40 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3>Current Order</h3>
          <Badge className="bg-gradient-to-r from-pink-300 to-pink-400 text-black border-0">
            {orderType === 'dine-in' ? tableNumber : orderType}
          </Badge>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mb-6 -mx-6 px-6">
          <AnimatePresence>
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No items in cart</p>
                <p className="text-sm mt-2">Start adding items from the menu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 p-3 rounded-lg bg-white/70"
                  >
                    <div className="flex-1">
                      <div className="text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <Separator className="my-4" />

        {/* Totals */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {orderDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({discountType === 'percentage' ? discountValue + '%' : 'Fixed'})</span>
              <span>-${orderDiscount.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between">
            <span>Total</span>
            <span className="text-xl text-sky-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowDiscountModal(true)}
            disabled={cart.length === 0}
          >
            <Percent className="w-4 h-4" />
            Discount
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowSplitBillModal(true)}
            disabled={cart.length === 0}
          >
            <DollarSign className="w-4 h-4" />
            Split Bill
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            disabled={cart.length === 0}
            onClick={handleSaveAndClose}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button
            className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 gap-2"
            disabled={cart.length === 0}
            onClick={handlePayNow}
          >
            <CreditCard className="w-4 h-4" />
            Pay Now
          </Button>
        </div>
      </div>

      {/* Modals */}
      <DiscountModal
        open={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApply={handleApplyDiscount}
        currentSubtotal={subtotal}
      />

      <SplitBillModal
        open={showSplitBillModal}
        onClose={() => setShowSplitBillModal(false)}
        cartItems={cart}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ParkedOrdersPanel
        open={showParkedOrders}
        onClose={() => setShowParkedOrders(false)}
        onResumeOrder={handleResumeOrder}
      />

      <ReceiptModal
        open={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          setReceiptData(null);
        }}
        receipt={receiptData}
      />
    </div>
  );
}
