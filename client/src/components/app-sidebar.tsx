import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
