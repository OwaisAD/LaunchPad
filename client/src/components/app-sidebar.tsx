import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { MainSection } from "@/components/MainSection";
import { Separator } from "./ui/separator";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import { DropdownMenuDemo } from "./DropdownMenu";

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="relative">
      <SidebarHeader className={`flex ${!open && "items-center"} p-4 bg-[#F1F5F9]`}>
        <div className="z-[99999]">
          <UserButton userProfileMode="modal" showName={open} />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#F2F5F9] relative">
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-col-resize absolute h-full w-1 bg-gray-200 right-0 top-0" />
        <SidebarTrigger className="cursor-pointer absolute right-0 top-4 z-[99999]" />
        <MainSection />
        <Separator />
        {/* Latest Organizations */}

        {/* Latest Projects */}
      </SidebarContent>
      <SidebarFooter className="bg-[#F1F5F9]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Settings"}
              asChild
              isActive={location.pathname === "/settings"}
              onClick={() => {}}
              className="cursor-pointer"
            >
              <Link to={"/settings"} className="flex items-center gap-4">
                <CiSettings />
                <span className="text-sm">Settings</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton>
              <DropdownMenuDemo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
