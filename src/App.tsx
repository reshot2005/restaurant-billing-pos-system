import { useState, useEffect } from "react";
import { Sidebar } from "./components/Layout/Sidebar";
import { Topbar } from "./components/Layout/Topbar";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { POSScreenNew } from "./components/POS/POSScreenNew";
import { KitchenDisplay } from "./components/KDS/KitchenDisplay";
import { OrdersManagement } from "./components/Orders/OrdersManagement";
import { MenuManagement } from "./components/Menu/MenuManagement";
import { InventoryManagement } from "./components/Inventory/InventoryManagement";
import { StaffManagement } from "./components/Staff/StaffManagement";
import { Analytics } from "./components/Reports/Analytics";
import { CustomerCRM } from "./components/Customers/CustomerCRM";
import { TenantManagement } from "./components/Admin/TenantManagement";
import { Settings } from "./components/Settings/Settings";
import { MyAccount } from "./components/Profile/MyAccount";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { CartProvider } from "./components/Cart/CartContext";
import { CartIndicator } from "./components/Cart/CartIndicator";
import { BackgroundDecoration } from "./components/Layout/BackgroundDecoration";
import { AuthProvider, useAuth } from "./components/Auth/AuthContext";
import { Login } from "./components/Auth/Login";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-order":
        setActiveView("pos");
        toast.success("Opening POS...");
        break;
      case "open-drawer":
        toast.info("Cash drawer opened");
        break;
      default:
        break;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "pos":
        return <POSScreenNew />;
      case "kds":
        return <KitchenDisplay />;
      case "orders":
        return <OrdersManagement />;
      case "menu":
        return <MenuManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "staff":
        return <StaffManagement />;
      case "reports":
        return <Analytics />;
      case "customers":
        return <CustomerCRM />;
      case "admin":
        return <TenantManagement />;
      case "settings":
        return <Settings />;
      case "profile":
        return <MyAccount />;
      case "help":
        return (
          <div className="space-y-6">
            <div>
              <h1>Help & Support</h1>
              <p className="text-muted-foreground">Get help with RestaurantOS</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border hover:shadow-lg transition-shadow cursor-pointer">
                <h3>📚 Documentation</h3>
                <p className="text-muted-foreground mt-2">
                  Browse our comprehensive guides and tutorials
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border hover:shadow-lg transition-shadow cursor-pointer">
                <h3>💬 Live Chat</h3>
                <p className="text-muted-foreground mt-2">
                  Chat with our support team in real-time
                </p>
              </div>
              <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <aside className="w-64 bg-white border-r fixed h-screen z-20">
               {/* your sidebar component */}
               </aside>

                {/* Main Content Area */}
              <div className="flex-1 flex flex-col ml-64">
                 {/* Top Bar */}
              <header className="h-16 bg-white border-b fixed w-[calc(100%-16rem)] z-10">
                 {/* your top bar component */}
              </header>

                  {/* Scrollable Page Content */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden mt-16 bg-muted/10 p-6">
                   {/* your page content goes here (Dashboard, POS, etc.) */}
              </main>
              </div>
              </div>
              <div className="p-6 rounded-xl border border-border hover:shadow-lg transition-shadow cursor-pointer">
                <h3>📧 Email Support</h3>
                <p className="text-muted-foreground mt-2">
                  Send us an email at support@restaurantos.com
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border hover:shadow-lg transition-shadow cursor-pointer">
                <h3>📞 Phone Support</h3>
                <p className="text-muted-foreground mt-2">
                  Call us at +1 (800) 123-4567
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <AppContent 
        activeView={activeView} 
        setActiveView={setActiveView}
        isLoaded={isLoaded}
        handleQuickAction={handleQuickAction}
        renderView={renderView}
      />
    </AuthProvider>
  );
}

function AppContent({ activeView, setActiveView, isLoaded, handleQuickAction, renderView }: any) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <CartProvider>
      <motion.div 
        className="min-h-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackgroundDecoration />
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <Topbar 
          onQuickAction={handleQuickAction} 
          onNavigateToPOS={() => setActiveView("pos")}
          onNavigate={setActiveView}
        />
        
        <main className="ml-64 mt-16 p-6 relative z-10 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden custom-scroll">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Toaster position="top-right" />
        {activeView !== "pos" && <CartIndicator onNavigateToPOS={() => setActiveView("pos")} />}
      </motion.div>
    </CartProvider>
  );
}
