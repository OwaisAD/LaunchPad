import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

// should be fetched and cached maybe stored in local storage
const items = [{ title: "Full Stack Project 1" }, { title: "Full Stack Project 2" }, { title: "Full Stack Project 3" }];
 
export const MainSection = () => {
  // get pathname ...
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-md">Quick Access</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={location.pathname === item.url}
                onClick={() => {}}
                className="cursor-pointer"
              >
                <Link to={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
