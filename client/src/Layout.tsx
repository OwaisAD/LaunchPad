import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-4 mt-[80px]">
          <SidebarTrigger className="cursor-pointer" />
          <Header />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
