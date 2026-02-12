import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";
import { useGuestTimer } from "../contexts/GuestTimerContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import PremiumPopup from "./PremiumPopup";

// Define route categories
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/pricing",
  "/privacy-policy",
  "/terms-and-conditions",
  "/about",
  "/playstore-terms",
  "/applestore-terms",
  "/applestore-privacy",
  "/playstore-privacy",
];

const GUEST_ALLOWED_ROUTES = [
  ...PUBLIC_ROUTES,
  "/user/dashboard",
  "/user/practice",
  "/user/free-materials",
];

const REGISTERED_ALLOWED_ROUTES = [
  ...PUBLIC_ROUTES,
  "/user/dashboard",
  "/user/free-materials",
  "/user/subscription",     // Critical for upgrading
  "/user/settings",
  "/user/faq",
  "/user/news",
  "/user/subscription",
];

// Routes that require Premium or Trial
const PREMIUM_ROUTES = [
  "/user/test",
  "/user/study",
  "/user/progress",
  "/user/neet-score-predictor",
  "/user/leaderboard",
  "/user/favorites",
  "/user/subscription",
];

export default function RouteGuard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuestTimeExpired } = useGuestTimer();
  const { isPremium, subscriptionStatus, isLoading: subLoading } = useSubscription(); // subscriptionStatus: REGISTERED, TRIAL, PREMIUM
  const [showTimeExpiredPopup, setShowTimeExpiredPopup] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const role = getUserRole(); // 'guest', 'user', 'admin'

  useEffect(() => {
    const path = location.pathname;

    // 0. Guest Expiry -> Skip (handled by render)
    if (role === 'guest' && isGuestTimeExpired) {
      return;
    }

    // 1. Always allow public routes
    if (PUBLIC_ROUTES.some(r => path === r || path.startsWith(r + '/'))) {
      setIsAuthorized(true);
      return;
    }

    // 2. Guest Logic (Route Allow/Block)
    if (role === 'guest') {
      // Check allowed routes
      const isAllowed = GUEST_ALLOWED_ROUTES.some(r => path === r || path.startsWith(r));
      if (!isAllowed) {
        navigate("/user/dashboard", { replace: true });
        return;
      }
      setIsAuthorized(true);
      return;
    }

    // 3. Registered User Logic (Logged in but no Premium/Trial)
    if (!subLoading) { // Wait for subscription status
      // If Premium or Trial -> Allow ALL
      if (isPremium) {
        setIsAuthorized(true);
        return;
      }

      // If 'REGISTERED' status (no trial, no premium)
      if (subscriptionStatus === 'REGISTERED') {
        const isAllowed = REGISTERED_ALLOWED_ROUTES.some(r => path === r || path.startsWith(r));

        if (!isAllowed) {
          // Logic: if trying to access Premium content, suggest Subscription.
          // If just trying to access unknown/admin route, go to Dashboard.
          if (PREMIUM_ROUTES.some(r => path.startsWith(r))) {
            if (!path.startsWith("/user/subscription")) {
              navigate("/user/subscription", { replace: true });
              return;
            }
          } else {
            // Blocked route that isn't explicitly Premium (maybe future admin/other) -> Dashboard
            navigate("/user/dashboard", { replace: true });
            return;
          }
        }
        setIsAuthorized(true);
      }
    }

    if (subLoading) {
      return;
    }

    setIsAuthorized(true);

  }, [location, isGuestTimeExpired, isPremium, subscriptionStatus, subLoading, navigate, role]);

  const isPublicRoute = PUBLIC_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r + '/'));

  if (role === 'guest' && isGuestTimeExpired && !isPublicRoute) {
    return <PremiumPopup timeExpired={true} onClose={() => navigate("/login")} />;
  }

  if (showTimeExpiredPopup) {
    return <PremiumPopup timeExpired={true} onClose={() => navigate("/login")} />;
  }

  return children;
}
