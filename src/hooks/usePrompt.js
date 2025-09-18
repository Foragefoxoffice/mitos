// src/hooks/useNavigationBlock.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useNavigationBlock(shouldBlock, onBlock) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shouldBlock) return;

    const handlePopState = (e) => {
      e.preventDefault();
      onBlock(() => {
        // retry back navigation
        navigate(-1);
      });
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [shouldBlock, onBlock, navigate, location.pathname]);
}
