import { Route, Routes as ReactRouterRoutes } from "react-router-dom";
import Error from "./pages/Error";
import Login from "./pages/SignIn";
import CreateAccount from "./pages/SignUp";

function Routes() {
  return (
    <ReactRouterRoutes>
      <Route index path="/" element={<div>Home</div>} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<CreateAccount />} />
      <Route path="/about" element={<div>About</div>} />
      <Route path="/contact" element={<div>Contact</div>} />
      <Route path="*" element={<Error />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
