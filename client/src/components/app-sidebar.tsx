import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { MainSection } from "@/components/MainSection";
import { Separator } from "./ui/separator";
import { UserButton } from "@clerk/clerk-react";
import { SidebarDropdownMenu } from "./SidebarDropdown";
import { CustomeSidebarSection } from "./CustomSidebarSection";

export function AppSidebar() {
  const { open } = useSidebar();

  // should be fetched and cached maybe stored in local storage
  const recentOrganizations = [
    { id: "1", title: "Organization 1" },
    { id: "2", title: "Organization 2" },
    { id: "3", title: "Organization 3" },
  ];

  const recentProjects = [
    { id: "1", title: "Full Stack Project 1" },
    { id: "2", title: "Full Stack Project 2" },
    { id: "3", title: "Full Stack Project 3" },
  ];

  return (
    <Sidebar collapsible="icon" className="relative">
      <SidebarHeader className={`flex ${!open && "items-center"} p-4 bg-[#F1F5F9]`}>
        <div className="z-[99999]">
          <UserButton userProfileMode="modal" showName={open} />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#F2F5F9] relative">
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-col-resize absolute h-full w-1 bg-gray-200 right-0 top-0" />
        <MainSection />
        <div className="mx-4">
          <Separator decorative />
        </div>
        {/* Latest Organizations */}
        <CustomeSidebarSection
          items={recentOrganizations}
          sectionTitle="Recent Organizations"
          seeMoreLink="/organizations"
        />
        <div className="mx-4">
          <Separator decorative />
        </div>
        <CustomeSidebarSection items={recentProjects} sectionTitle="Recent Projects" seeMoreLink="/projects" />

        {/* Latest Projects */}
      </SidebarContent>
      <SidebarFooter className="bg-[#F1F5F9]">
        <SidebarDropdownMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
