import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import AppRoutes from "./AppRoutes";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
