import { Route, Routes as ReactRouterRoutes } from "react-router-dom";
import Error from "./pages/Error";
import Login from "./pages/Login";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route index path="/" element={<div>Home</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/contact" element={<div>Contact</div>} />
      <Route path="*" element={<Error />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
