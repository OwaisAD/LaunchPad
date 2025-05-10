import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { SiAwsorganizations } from "react-icons/si";
import { GoProjectSymlink } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: RxDashboard },
  {
    title: "Organizations",
    url: "/organizations",
    icon: SiAwsorganizations,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: GoProjectSymlink,
  },
];

export const MainSection = () => {
  // get pathname ...
  const location = useLocation();

  return (
    <SidebarGroup>
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
