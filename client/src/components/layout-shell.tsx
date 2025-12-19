import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LineChart,
  LogOut,
  Settings,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Predictions", href: "/predictions", icon: LineChart },
    { name: "Admin", href: "/admin", icon: ShieldCheck },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-r border-border">
      <div className="p-6 border-b border-border/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tighter uppercase font-display">
          Crypto<span className="text-foreground">Mind</span>
        </h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">AI-DRIVEN ANALYTICS</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary animate-pulse" : "group-hover:text-accent"}`} />
                <span className="font-medium tracking-wide">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            {user?.firstName?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.firstName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate font-mono">PRO MEMBER</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-950/30"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-body selection:bg-primary/20 selection:text-primary">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="text-xl font-bold font-display text-primary">CryptoMind</div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 bg-background border-r border-border">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 h-full flex-shrink-0">
          <NavContent />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
          <div className="p-4 md:p-8 max-w-[1920px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
