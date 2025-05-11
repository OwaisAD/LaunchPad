import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
          <main className="flex-1 overflow-y-auto bg-white p-14 relative">
            <div className="bg-[#F1F5F9] w-10 h-10 absolute left-0 top-4 rounded-br-xl rounded-tr-xl shadow-sm">
              <SidebarTrigger className="cursor-pointer" />
            </div>

            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
