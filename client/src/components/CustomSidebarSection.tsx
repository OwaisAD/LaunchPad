import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

type CustomSidebarSectionProps = {
  items: { id: string; title: string }[];
  sectionTitle: string;
  seeMoreLink?: string;
};

export const CustomeSidebarSection = ({ items, sectionTitle, seeMoreLink }: CustomSidebarSectionProps) => {
  // get pathname ...
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-md">
        {sectionTitle}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={location.pathname === `${seeMoreLink}/${item.id}`}
                onClick={() => {}}
                className="cursor-pointer"
              >
                <Link to={`${seeMoreLink}/${item.id}`} className="flex items-center gap-4">
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {seeMoreLink && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="See more"
                asChild
                isActive={location.pathname === seeMoreLink}
                onClick={() => {}}
                className="cursor-pointer"
              >
                <Link to={seeMoreLink} className="flex items-center gap-4">
                  <span className="text-sm">See more</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
