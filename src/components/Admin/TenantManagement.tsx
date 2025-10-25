import { Building2, CreditCard, Users, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { motion } from "motion/react";

const tenants = [
  {
    id: 1,
    name: "Pizza Paradise",
    outlets: 3,
    plan: "Professional",
    status: "active",
    mrr: 299,
    users: 12,
    orders: 1245,
    joinDate: "2024-03-15",
  },
  {
    id: 2,
    name: "Burger King Downtown",
    outlets: 1,
    plan: "Starter",
    status: "active",
    mrr: 99,
    users: 5,
    orders: 456,
    joinDate: "2024-06-22",
  },
  {
    id: 3,
    name: "Pasta House Chain",
    outlets: 8,
    plan: "Enterprise",
    status: "active",
    mrr: 999,
    users: 42,
    orders: 4567,
    joinDate: "2023-11-10",
  },
  {
    id: 4,
    name: "Salad Express",
    outlets: 2,
    plan: "Professional",
    status: "trial",
    mrr: 0,
    users: 7,
    orders: 89,
    joinDate: "2025-01-10",
  },
  {
    id: 5,
    name: "Coffee & More",
    outlets: 1,
    plan: "Starter",
    status: "cancelled",
    mrr: 0,
    users: 3,
    orders: 234,
    joinDate: "2024-08-05",
  },
];

export function TenantManagement() {
  const totalMRR = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + t.mrr, 0);
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const trialTenants = tenants.filter((t) => t.status === "trial").length;

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return <Badge className="bg-[#7DD3FC] text-black">Enterprise</Badge>;
      case "Professional":
        return <Badge className="bg-[#FBCFE8] text-black">Professional</Badge>;
      case "Starter":
        return <Badge className="bg-[#BBF7D0] text-[#047857]">Starter</Badge>;
      default:
        return <Badge>{plan}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-[#BBF7D0] text-[#047857] gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        );
      case "trial":
        return <Badge className="bg-[#FDE68A] text-[#92400E]">Trial</Badge>;
      case "cancelled":
        return (
          <Badge className="bg-destructive/20 text-destructive gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>SaaS Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage tenants, subscriptions, and platform metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-l-4 border-l-[#7DD3FC]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{tenants.length}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {activeTenants} active, {trialTenants} trial
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-[#BBF7D0]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">${totalMRR.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-sm text-[#10B981] mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% MoM</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-[#FBCFE8]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {tenants.reduce((sum, t) => sum + t.users, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Across all tenants</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-[#FDE68A]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {tenants.reduce((sum, t) => sum + t.orders, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Platform-wide</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tenant Overview</CardTitle>
            <Button className="bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black">
              Add Tenant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Tenant</TableHead>
                  <TableHead>Outlets</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant, index) => (
                  <motion.tr
                    key={tenant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7DD3FC] to-[#FBCFE8] flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div>{tenant.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {tenant.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.outlets}</TableCell>
                    <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                    <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                    <TableCell className="text-[#7DD3FC]">
                      {tenant.mrr > 0 ? `$${tenant.mrr}` : "-"}
                    </TableCell>
                    <TableCell>{tenant.users}</TableCell>
                    <TableCell>{tenant.orders.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(tenant.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tenant: "Pizza Paradise", action: "Upgraded to Professional", time: "2 hours ago" },
                { tenant: "Salad Express", action: "Started trial", time: "5 hours ago" },
                { tenant: "Coffee & More", action: "Cancelled subscription", time: "1 day ago" },
                { tenant: "Burger King Downtown", action: "Added new user", time: "2 days ago" },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="w-2 h-2 rounded-full bg-[#7DD3FC]" />
                  <div className="flex-1">
                    <div className="text-sm">{activity.tenant}</div>
                    <div className="text-xs text-muted-foreground">{activity.action}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { plan: "Enterprise", count: 1, color: "#7DD3FC" },
                { plan: "Professional", count: 2, color: "#FBCFE8" },
                { plan: "Starter", count: 2, color: "#BBF7D0" },
              ].map((item) => (
                <div key={item.plan} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.plan}</span>
                    <span className="text-muted-foreground">
                      {item.count} tenant{item.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${(item.count / tenants.length) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
