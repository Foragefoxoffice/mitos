import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";

const guestAllowedRoutes = [
  "/user/dashboard",
  "/",
  "/login",
  "/register",
];

export default function RouteGuard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();

    if (
      role === "guest" &&
      !guestAllowedRoutes.some((route) =>
        location.pathname.startsWith(route)
      )
    ) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [location, navigate]);

  return children;
}
