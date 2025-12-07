import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserRole } from "../utils/auth"; // Assuming getUserRole is reusable

const GuestTimerContext = createContext();

export const useGuestTimer = () => useContext(GuestTimerContext);

const GUEST_TIME_LIMIT_MS = 10 * 60 * 1000; // 10 minutes

export const GuestTimerProvider = ({ children }) => {
    const [isGuestTimeExpired, setIsGuestTimeExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GUEST_TIME_LIMIT_MS);

    useEffect(() => {
        const checkTimer = () => {
            const role = getUserRole();
            if (role !== "guest") {
                setIsGuestTimeExpired(false);
                return;
            }

            const storedStartTime = localStorage.getItem("guestStartTime");
            const now = Date.now();

            if (!storedStartTime) {
                // Start timer for new guest session logic
                // We only set it if it doesn't exist.
                // For a stricter approach, we might want to set it on first app load in a useEffect elsewhere,
                // but lazy initialization here is fine for "access start".
                localStorage.setItem("guestStartTime", String(now));
            }

            const startTime = parseInt(storedStartTime || String(now), 10);
            const elapsed = now - startTime;
            const remaining = GUEST_TIME_LIMIT_MS - elapsed;

            if (elapsed >= GUEST_TIME_LIMIT_MS) {
                setIsGuestTimeExpired(true);
                setTimeLeft(0);
            } else {
                setIsGuestTimeExpired(false);
                setTimeLeft(remaining);
            }
        };

        // Check immediately
        checkTimer();

        // Check every second to update UI or validity
        const interval = setInterval(checkTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const resetTimer = () => {
        localStorage.removeItem("guestStartTime");
        setIsGuestTimeExpired(false);
        setTimeLeft(GUEST_TIME_LIMIT_MS);
    };

    return (
        <GuestTimerContext.Provider value={{ isGuestTimeExpired, timeLeft, resetTimer }}>
            {children}
        </GuestTimerContext.Provider>
    );
};
