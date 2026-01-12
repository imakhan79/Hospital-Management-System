
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Users,
  Stethoscope,
  Pill,
  Receipt,
  Package,
  FlaskConical,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  Menu,
  X,
  Home,
  Phone,
  Calendar,
  Bed,
  Truck,
  Video,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

interface SidebarLink {
  name: string;
  href: string;
  icon: ReactNode;
  roles: string[];
}

const MainLayout = ({ children, noPadding = false }: MainLayoutProps) => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const sidebarLinks: SidebarLink[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse", "lab", "pharmacy", "billing", "receptionist"],
    },
    {
      name: "Registration",
      href: "/patients/register",
      icon: <UserPlus className="h-5 w-5" />,
      roles: ["admin", "receptionist"],
    },
    {
      name: "Emergency",
      href: "/emergency",
      icon: <AlertTriangle className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse", "receptionist"],
    },
    {
      name: "OPD",
      href: "/opd",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse", "receptionist"],
    },
    {
      name: "Find a Doctor",
      href: "/find-doctor",
      icon: <Stethoscope className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse", "receptionist", "lab", "pharmacy", "billing"],
    },
    {
      name: "Patients",
      href: "/patients",
      icon: <User className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse", "receptionist"],
    },
    {
      name: "Surgery",
      href: "/surgery",
      icon: <Stethoscope className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse"],
    },
    {
      name: "IPD",
      href: "/ipd",
      icon: <Bed className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse", "receptionist"],
    },
    {
      name: "Staff",
      href: "/staff",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      name: "Clinical",
      href: "/clinical",
      icon: <Stethoscope className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse"],
    },
    {
      name: "Telemedicine",
      href: "/telemedicine",
      icon: <Video className="h-5 w-5" />,
      roles: ["admin", "doctor", "nurse"],
    },
    {
      name: "Pharmacy",
      href: "/pharmacy",
      icon: <Pill className="h-5 w-5" />,
      roles: ["admin", "pharmacy", "doctor"],
    },
    {
      name: "Billing",
      href: "/billing",
      icon: <Receipt className="h-5 w-5" />,
      roles: ["admin", "billing", "receptionist"],
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: <Package className="h-5 w-5" />,
      roles: ["admin", "nurse", "pharmacy"],
    },
    {
      name: "Supply Chain",
      href: "/supply-chain",
      icon: <Truck className="h-5 w-5" />,
      roles: ["admin", "nurse", "pharmacy"],
    },
    {
      name: "Laboratory",
      href: "/laboratory",
      icon: <FlaskConical className="h-5 w-5" />,
      roles: ["admin", "lab", "doctor"],
    },
    {
      name: "Nurse Call System",
      href: "/nurse-call",
      icon: <Phone className="h-5 w-5" />,
      roles: ["admin", "nurse", "doctor"],
    },
    {
      name: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["admin", "doctor"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];

  const filteredLinks = sidebarLinks.filter((link) => {
    if (!user) return false;
    return link.roles.includes(user.role) || user.role === "admin";
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Toggle Button for Mobile */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-16 items-center justify-center py-6">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white">XI HIMS</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <nav className="space-y-1.5">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                    location.pathname === link.href
                      ? "text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  {location.pathname === link.href && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full" />
                  )}
                  <div className={cn(
                    "p-1 rounded-md transition-colors",
                    location.pathname === link.href ? "text-white" : "text-white/40 group-hover:text-white"
                  )}>
                    {link.icon}
                  </div>
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2 px-2 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs capitalize">{user?.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-800">
                {filteredLinks.find((link) => link.href === location.pathname)
                  ?.name || "Dashboard"}
              </h1>
            </div>

            {/* Header Actions */}
            <div className="ml-auto flex items-center gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-auto">
                    <DropdownMenuItem className="flex items-start gap-2 p-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Critical Alert</p>
                        <p className="text-xs text-gray-500">
                          Patient #1042 needs immediate attention in Room 305
                        </p>
                        <p className="text-xs text-gray-400 mt-1">5 min ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start gap-2 p-3">
                      <FileText className="mt-0.5 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Lab Results Ready</p>
                        <p className="text-xs text-gray-500">
                          Blood work results for Patient #2371 are available
                        </p>
                        <p className="text-xs text-gray-400 mt-1">20 min ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start gap-2 p-3">
                      <MessageSquare className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">New Message</p>
                        <p className="text-xs text-gray-500">
                          Dr. Johnson requested a consultation for Patient #3091
                        </p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-center">
                    View All Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-gray-50",
          noPadding ? "p-0" : "p-4 md:p-6"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
