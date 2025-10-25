import { Bell, Search, ChevronDown, Plus, DollarSign, ShoppingCart, User as UserIcon, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCart } from "../Cart/CartContext";
import { useAuth } from "../Auth/AuthContext";

interface TopbarProps {
  onQuickAction: (action: string) => void;
  onNavigateToPOS: () => void;
  onNavigate?: (view: string) => void;
}

export function Topbar({ onQuickAction, onNavigateToPOS, onNavigate }: TopbarProps) {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const cartCount = getCartCount();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-border/50 fixed top-0 right-0 left-64 z-10 flex items-center px-6 gap-6 shadow-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <div className="text-left">
              <div className="text-sm">Main Street Outlet</div>
              <div className="text-xs text-muted-foreground">Downtown Location</div>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Select Outlet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div>
              <div>Main Street Outlet</div>
              <div className="text-xs text-muted-foreground">Downtown Location</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div>
              <div>Airport Terminal</div>
              <div className="text-xs text-muted-foreground">Terminal 2, Gate 5</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div>
              <div>Food Court Express</div>
              <div className="text-xs text-muted-foreground">Mall Level 3</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search orders, customers, menu items..."
          className="pl-10 bg-input-background border-0"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="default"
          className="gap-2 bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-black"
          onClick={() => onQuickAction("new-order")}
        >
          <Plus className="w-4 h-4" />
          New Order
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => onQuickAction("open-drawer")}
        >
          <DollarSign className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={onNavigateToPOS}
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-[#7DD3FC] text-black text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>

        <Button variant="outline" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-[#FBCFE8] text-black text-xs">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} alt={user?.display_name} />
                <AvatarFallback className="bg-gradient-to-br from-[#7DD3FC] to-[#FBCFE8] text-white">
                  {user?.display_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-sm">{user?.display_name || 'User'}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.role || 'Staff'}</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
