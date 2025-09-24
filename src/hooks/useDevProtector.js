import { useEffect } from "react";

export default function useDevProtector() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return; // only run in production

    let protectionEnabled = true;

    // Disable right click
    const handleContextMenu = (e) => {
      if (protectionEnabled) e.preventDefault();
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    const handleKeyDown = (e) => {
      if (
        protectionEnabled &&
        (e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
          (e.ctrlKey && e.key.toLowerCase() === "u"))
      ) {
        e.preventDefault();
      }

      // Secret unlock: Ctrl + Alt + D
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "d") {
        protectionEnabled = false;
        alert("✅ Dev mode enabled: protections disabled.");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
