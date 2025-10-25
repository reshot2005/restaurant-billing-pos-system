import { UserCircle, Phone, Mail, Gift, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { motion } from "motion/react";

const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    orders: 24,
    totalSpent: 1240,
    loyaltyPoints: 485,
    lastVisit: "2025-01-17",
    status: "vip",
  },
  {
    id: 2,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 234 567 8901",
    orders: 18,
    totalSpent: 980,
    loyaltyPoints: 320,
    lastVisit: "2025-01-16",
    status: "regular",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234 567 8902",
    orders: 16,
    totalSpent: 850,
    loyaltyPoints: 280,
    lastVisit: "2025-01-15",
    status: "regular",
  },
  {
    id: 4,
    name: "Sarah Davis",
    email: "sarah@example.com",
    phone: "+1 234 567 8903",
    orders: 14,
    totalSpent: 720,
    loyaltyPoints: 215,
    lastVisit: "2025-01-18",
    status: "regular",
  },
  {
    id: 5,
    name: "David Lee",
    email: "david@example.com",
    phone: "+1 234 567 8904",
    orders: 3,
    totalSpent: 145,
    loyaltyPoints: 45,
    lastVisit: "2025-01-10",
    status: "new",
  },
];

export function CustomerCRM() {
  const vipCustomers = customers.filter((c) => c.status === "vip").length;
  const totalCustomers = customers.length;
  const avgLifetimeValue = customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip":
        return <Badge className="bg-[#7DD3FC] text-black">VIP</Badge>;
      case "regular":
        return <Badge className="bg-[#BBF7D0] text-[#047857]">Regular</Badge>;
      case "new":
        return <Badge className="bg-[#FBCFE8] text-black">New</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Customer CRM</h1>
          <p className="text-muted-foreground">Manage customer relationships and loyalty programs</p>
        </div>
        <Button className="gap-2 bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#7DD3FC]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalCustomers}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {vipCustomers} VIP members
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#BBF7D0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg LTV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${avgLifetimeValue.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground mt-1">Per customer</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FBCFE8]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Loyalty Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {customers.reduce((sum, c) => sum + c.loyaltyPoints, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total distributed</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FDE68A]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Repeat Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {Math.round((customers.filter((c) => c.orders > 5).length / totalCustomers) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Customer retention</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer List</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Send Campaign
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-[#7DD3FC] to-[#FBCFE8]">
                    <AvatarFallback className="text-white">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{customer.name}</span>
                      {getStatusBadge(customer.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Orders</div>
                      <div className="text-center">{customer.orders}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Spent</div>
                      <div className="text-[#7DD3FC]">${customer.totalSpent}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Points</div>
                      <div className="flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        {customer.loyaltyPoints}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers.slice(0, 5).map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-[#7DD3FC] to-[#FBCFE8]">
                      <AvatarFallback className="text-white text-xs">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Ordered {Math.floor(Math.random() * 3) + 1} items
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(customer.lastVisit).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loyalty Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Welcome Bonus", active: true, enrolled: 45 },
                { name: "Birthday Special", active: true, enrolled: 28 },
                { name: "Refer a Friend", active: true, enrolled: 12 },
                { name: "VIP Rewards", active: false, enrolled: 8 },
              ].map((campaign, index) => (
                <motion.div
                  key={campaign.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div>
                    <div className="text-sm">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.enrolled} customers enrolled
                    </div>
                  </div>
                  <Badge
                    className={
                      campaign.active
                        ? "bg-[#BBF7D0] text-[#047857]"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {campaign.active ? "Active" : "Inactive"}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
