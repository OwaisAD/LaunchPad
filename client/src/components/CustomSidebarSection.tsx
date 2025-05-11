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
  items: { name: string; slug: string }[];
  sectionTitle: string;
  seeMoreLink?: string;
};

export const CustomeSidebarSection = ({ items, sectionTitle, seeMoreLink }: CustomSidebarSectionProps) => {
  // get pathname ...
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase font-medium text-gray-500 ">{sectionTitle}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                tooltip={item.name}
                asChild
                isActive={location.pathname === `${seeMoreLink}/${item.slug}`}
                onClick={() => {}}
                className="cursor-pointer"
              >
                <Link to={`${seeMoreLink}/${item.slug}`} className="flex items-center gap-4">
                  <span className="text-sm">{item.name}</span>
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
