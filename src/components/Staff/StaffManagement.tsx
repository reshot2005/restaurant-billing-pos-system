import { Users, Clock, Shield, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { motion } from "motion/react";

const staff = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Manager",
    status: "active",
    hoursToday: 6.5,
    email: "sarah@restaurant.com",
    phone: "+1 234 567 8900",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Chef",
    status: "active",
    hoursToday: 5.2,
    email: "mike@restaurant.com",
    phone: "+1 234 567 8901",
  },
  {
    id: 3,
    name: "Anna Martinez",
    role: "Waiter",
    status: "active",
    hoursToday: 4.8,
    email: "anna@restaurant.com",
    phone: "+1 234 567 8902",
  },
  {
    id: 4,
    name: "Tom Williams",
    role: "Cashier",
    status: "active",
    hoursToday: 7.1,
    email: "tom@restaurant.com",
    phone: "+1 234 567 8903",
  },
  {
    id: 5,
    name: "Emily Davis",
    role: "Waiter",
    status: "off-duty",
    hoursToday: 0,
    email: "emily@restaurant.com",
    phone: "+1 234 567 8904",
  },
];

const roles = [
  { name: "Owner", color: "#7DD3FC", permissions: ["Full Access"] },
  { name: "Manager", color: "#FBCFE8", permissions: ["View Reports", "Manage Orders", "Manage Staff"] },
  { name: "Chef", color: "#BBF7D0", permissions: ["View KDS", "Mark Orders Ready"] },
  { name: "Waiter", color: "#FDE68A", permissions: ["Create Orders", "View Tables"] },
  { name: "Cashier", color: "#C4B5FD", permissions: ["Process Payments", "View Orders"] },
];

export function StaffManagement() {
  const activeStaff = staff.filter((s) => s.status === "active");

  const getRoleBadge = (role: string) => {
    const roleConfig = roles.find((r) => r.name === role);
    if (!roleConfig) return <Badge>{role}</Badge>;
    return (
      <Badge style={{ backgroundColor: roleConfig.color, color: "#000" }}>{role}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Staff Management</h1>
          <p className="text-muted-foreground">Manage team members, roles, and schedules</p>
        </div>
        <Button className="gap-2 bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black">
          <Plus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#7DD3FC]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{staff.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {activeStaff.length} on duty
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#BBF7D0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Hours Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {staff.reduce((sum, s) => sum + s.hoursToday, 0).toFixed(1)}h
            </div>
            <div className="text-sm text-muted-foreground mt-1">Across all staff</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FBCFE8]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{roles.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Defined roles</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staff.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-[#7DD3FC] to-[#FBCFE8]">
                      <AvatarFallback className="text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{member.name}</span>
                        {member.status === "active" && (
                          <div className="w-2 h-2 rounded-full bg-[#BBF7D0]" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getRoleBadge(member.role)}
                    {member.status === "active" && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {member.hoursToday}h today
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role, index) => (
                <motion.div
                  key={role.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge style={{ backgroundColor: role.color, color: "#000" }}>
                      {role.name}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {role.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
                        {permission}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activeStaff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-[#7DD3FC] to-[#FBCFE8]">
                    <AvatarFallback className="text-white text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</span>
                  <Badge className="bg-[#BBF7D0] text-[#047857]">
                    {member.hoursToday}h
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
