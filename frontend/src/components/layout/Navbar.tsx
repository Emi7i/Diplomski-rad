import { NavLink } from "react-router";
import { cn } from "@lib/utils.ts";
import { LayoutDashboard } from "lucide-react";
import icon from "@icons/icons.svg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.tsx";

const navItems = [{ path: "/dashboard", label: "Pi Control", icon: LayoutDashboard }];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--bg)/80 backdrop-blur-md">
      <div className="flex h-14 items-center px-4 max-w-7xl mx-auto">
        <img src={icon} className="base" width="70" height="70" alt="website icon" />
        <div className="mr-6 font-semibold text-(--text-h) tracking-tight select-none">
          Raspberry Pi Connect Portal
        </div>

        <NavigationMenu className="flex-1 justify-start">
          <NavigationMenuList className="gap-1 space-x-0">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavigationMenuItem key={path} className="group relative">
                <NavigationMenuLink asChild>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      cn(
                        "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                        isActive ? "text-(--accent)" : "text-(--text) group-hover:text-(--accent)",
                      )
                    }
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-md transition-all duration-200 ease-out pointer-events-none",
                        "bg-(--accent-bg) scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                        "aria-[aria-current='page']:scale-100 aria-[aria-current='page']:opacity-100",
                      )}
                    />

                    <Icon className="relative h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px" />

                    <span className="relative">{label}</span>
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
