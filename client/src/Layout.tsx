import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Right section: Header + Content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-white p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
