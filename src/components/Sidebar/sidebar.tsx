import {
  Home,
  User,
  FileText,
  BarChart3,
  MessageCircleQuestion,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { SupportWidget } from "./supportWidget";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, clinic } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const NavLink = ({
    to,
    icon,
    label,
    handleClick,
  }: {
    to?: string;
    icon: React.ReactNode;
    label: string;
    handleClick?: () => void;
  }) => {
    const isActive = pathname === to;
    return (
      <a
        onClick={handleClick ? handleClick : () => router.push(to ?? "/")}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-default",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-gray-700 hover:bg-secondary hover:text-primary font-medium"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </a>
    );
  };

  // Helper function to safely get logo URL
  const getLogoUrl = () => {
    if (!clinic?.logo) return null;
    return clinic.logo;
  };

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen border-r bg-white p-4 shadow-sm transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between pb-6">
        {!isCollapsed && (
          <div className="flex flex-col">
            <h2 className="font-bold text-primary text-xl text-left">
              clinitt.ai
            </h2>
            <p className="text-muted-foreground text-left mx-0 my-0 px-0 py-0 text-xs">
              Orçamentos Odontológicos Estratégicos
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? "→" : "←"}
        </Button>
      </div>

      {!isCollapsed && clinic?.logo && (
        <div className="mb-8 flex justify-center">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-primary/10 shadow-sm">
            <img
              src={getLogoUrl() || ""}
              alt={clinic.name}
              className="h-full w-full object-cover"
              style={{
                background: "transparent",
              }}
            />
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col  gap-2 ">
        <NavLink to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
        <NavLink
          to="/dashboard/profile"
          icon={<User size={20} />}
          label="Perfil da Clínica"
        />
        <NavLink
          to="/dashboard/treatments"
          icon={<FileText size={20} />}
          label="Tratamentos"
        />
        <NavLink
          to="/dashboard/quote/new-quote"
          icon={<FileText size={20} />}
          label="Gerar Orçamento"
        />
        <NavLink
          to="/dashboard/reports"
          icon={<BarChart3 size={20} />}
          label="Relatórios"
        />
      </nav>

      <div className="space-y-2 mt-2 ">
        <SupportWidget isCollapsed={isCollapsed} />

        <div className="mt-auto pt-2 border-t">
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer",
              isCollapsed && "justify-center"
            )}
            onClick={() => logout(router)}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};
