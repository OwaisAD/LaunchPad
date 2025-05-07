import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import Routes from "./routes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
