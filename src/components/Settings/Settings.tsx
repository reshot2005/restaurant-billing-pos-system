import { Settings as SettingsIcon, DollarSign, Printer, CreditCard, Globe, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">Configure your restaurant system preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="tax">Tax & Charges</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Restaurant Name</Label>
                  <Input defaultValue="Main Street Outlet" />
                </div>
                <div className="space-y-2">
                  <Label>Outlet Name</Label>
                  <Input defaultValue="Downtown Location" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="123 Main Street, Downtown, NY 10001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+1 234 567 8900" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="contact@restaurant.com" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                (day) => (
                  <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <Switch defaultChecked />
                      <span className="text-sm">{day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input className="w-32" type="time" defaultValue="09:00" />
                      <span className="text-muted-foreground">-</span>
                      <Input className="w-32" type="time" defaultValue="22:00" />
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tax Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tax Name</Label>
                <Input defaultValue="Sales Tax" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" defaultValue="8.0" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Number</Label>
                  <Input defaultValue="TAX-12345-NY" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm">Apply tax to all items</div>
                  <div className="text-xs text-muted-foreground">
                    Automatically include tax in all orders
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Charge (%)</Label>
                  <Input type="number" defaultValue="5.0" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Order Amount</Label>
                  <Input type="number" defaultValue="10.00" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <div className="text-sm">Enable service charge</div>
                  <div className="text-xs text-muted-foreground">
                    Add service charge to dine-in orders
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Gateways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#7DD3FC]/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#7DD3FC]" />
                    </div>
                    <div>
                      <div className="text-sm">Stripe</div>
                      <div className="text-xs text-muted-foreground">Connected</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FBCFE8]/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#FBCFE8]" />
                    </div>
                    <div>
                      <div className="text-sm">Razorpay</div>
                      <div className="text-xs text-muted-foreground">Not connected</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <div className="text-sm">Accept Cash</div>
                    <div className="text-xs text-muted-foreground">Allow cash payments</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <div className="text-sm">Accept Card</div>
                    <div className="text-xs text-muted-foreground">Accept card payments</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Thermal Printers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Printer Name</Label>
                <Input defaultValue="Kitchen Printer #1" />
              </div>
              <div className="space-y-2">
                <Label>IP Address</Label>
                <Input defaultValue="192.168.1.100" />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input defaultValue="9100" />
              </div>
              <Button variant="outline">Test Print</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="text-sm">WhatsApp Receipts</div>
                  <div className="text-xs text-muted-foreground">
                    Send receipts via WhatsApp (Twilio)
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <div className="text-sm">Make.com Automation</div>
                  <div className="text-xs text-muted-foreground">
                    Workflow automation integration
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                White-Label Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input defaultValue="RestaurantOS" />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input type="color" defaultValue="#7DD3FC" className="w-20" />
                  <Input defaultValue="#7DD3FC" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Domain</Label>
                <Input placeholder="yourbrand.restaurantos.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
