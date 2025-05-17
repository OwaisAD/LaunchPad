import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { MainSection } from "@/components/MainSection";
import { Separator } from "./ui/separator";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { SidebarDropdownMenu } from "./SidebarDropdown";
import { CustomeSidebarSection } from "./CustomSidebarSection";

export function AppSidebar() {
  const { open } = useSidebar();
  const { userId } = useAuth();

  // TODO: should be fetched and cached maybe stored in local storage
  // Get and filter recent organizations by userId
  const storedOrganizations = localStorage.getItem("recentOrganizations");
  const parsedOrganizations = storedOrganizations ? JSON.parse(storedOrganizations) : [];
  const recentOrganizations = parsedOrganizations.filter((org: { userId: string }) => org.userId === userId);

  // Get and filter recent projects by userId
  const storedProjects = localStorage.getItem("recentProjects");
  const parsedProjects = storedProjects ? JSON.parse(storedProjects) : [];
  const recentProjects = parsedProjects.filter((project: { userId: string }) => project.userId === userId);

  return (
    <Sidebar collapsible="icon" className="relative">
      <SidebarHeader className={`flex ${!open && "items-center"} bg-[#F1F5F9] ${open ? "p-6" : "py-6"}`}>
        <div className="z-[99999]">
          <UserButton userProfileMode="modal" showName={open} />
        </div>
      </SidebarHeader>
      <SidebarContent className={`bg-[#F2F5F9] relative ${open ? "px-4" : ""} `}>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-col-resize absolute h-full w-1 bg-gray-200 right-0 top-0" />
        <MainSection />
        <Separator decorative />
        {/* Latest Organizations */}
        {recentOrganizations.length > 0 && (
          <>
            <CustomeSidebarSection
              items={recentOrganizations}
              sectionTitle="Recent Organizations"
              seeMoreLink="/organizations"
            />
            <Separator decorative />
          </>
        )}
        {recentProjects.length > 0 && (
          <>
            <CustomeSidebarSection items={recentProjects} sectionTitle="Recent Projects" seeMoreLink="/projects" />
            <Separator decorative />
          </>
        )}

        {/* Latest Projects */}
      </SidebarContent>
      <SidebarFooter className="bg-[#F1F5F9]">
        <SidebarDropdownMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
