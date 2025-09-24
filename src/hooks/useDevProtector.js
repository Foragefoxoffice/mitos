import { useEffect } from "react";

export default function useDevProtector() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return; // only run in production

    let protectionEnabled = true;

    const handleContextMenu = (e) => {
      if (protectionEnabled) e.preventDefault();
    };

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

        // 🟢 remove blockers completely
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);

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
