import React, { createContext, useState, useEffect, useContext } from 'react';
import { validateSubscription, startFreeTrial as startTrialAPI, verifyRazorpayPayment as verifyRazorpayPaymentAPI, getMe } from '../utils/api';
import { useNavigate } from "react-router-dom";

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

// NEET Plan Configurations
export const NEET_PLANS = {
    NEET_2026: {
        id: 'neet_2026_plan',
        name: 'NEET 2026 Plan',
        price: 1399,
        originalPrice: 2499,
        expiryDate: new Date('2026-06-01'),
        description: 'Access until June 1, 2026',
        features: [
            "Full Syllabus Coverage",
            "Unlimited Practice Tests",
            "Performance Analytics",
            "Priority Support",
        ],
    },
    NEET_2027: {
        id: 'neet_2027_plan',
        name: 'NEET 2027 Plan',
        price: 3599,
        originalPrice: 4999,
        expiryDate: new Date('2027-06-01'),
        description: 'Access until June 1, 2027',
        features: [
            "Everything in 2026 Plan",
            "Extended Access",
            "Advanced Study Materials",
            "1-on-1 Mentorship",
        ],
    },
    NEET_2028: {
        id: 'neet_2028_plan',
        name: 'NEET 2028 Plan',
        price: 6299,
        originalPrice: 7999,
        expiryDate: new Date('2028-06-01'),
        description: 'Access until June 1, 2028',
        features: [
            "Everything in 2027 Plan",
            "Maximum Savings",
            "Long-term Strategy",
            "Exclusive Workshops",
        ],
    },
};

export const SubscriptionProvider = ({ children }) => {
    // Initialize from localStorage if available
    const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
        const stored = localStorage.getItem('subscriptionStatus');
        const token = localStorage.getItem('token');
        return stored && token ? stored : 'loading';
    });

    const [premiumExpiry, setPremiumExpiry] = useState(null);
    const [trialEndsAt, setTrialEndsAt] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ NEW: User data state (centralized)
    const [userData, setUserData] = useState(() => {
        const stored = localStorage.getItem('user');
        // Handle null, undefined, or string "undefined"
        if (!stored || stored === 'undefined' || stored === 'null') {
            return null;
        }
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Failed to parse user data from localStorage:', error);
            return null;
        }
    });

    const navigate = useNavigate();

    // ✅ NEW: Fetch user data using getMe API (centralized, cached)
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUserData(null);
                localStorage.removeItem('user');
                return null;
            }

            const response = await getMe();
            const data = response.data;

            // Cache user data in state and localStorage
            setUserData(data);
            localStorage.setItem('user', JSON.stringify(data));

            return data;
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            return null;
        }
    };

    const checkStatus = async () => {
        try {
            // Only set loading if we don't have a status yet
            if (subscriptionStatus === 'loading') setIsLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                setSubscriptionStatus('REGISTERED');
                localStorage.removeItem('subscriptionStatus');
                setUserData(null);
                localStorage.removeItem('user');
                setIsLoading(false);
                return;
            }

            // ✅ Fetch user data first (single API call)
            const user = await fetchUserData();

            if (user) {
                // Use user data from getMe instead of validateSubscription
                const status = user.status ? user.status.toUpperCase() : 'REGISTERED';
                setSubscriptionStatus(status);
                localStorage.setItem('subscriptionStatus', status);

                setPremiumExpiry(user.premiumExpiry ? new Date(user.premiumExpiry) : null);
                setTrialEndsAt(user.trialEndsAt ? new Date(user.trialEndsAt) : null);

                // Determine current plan based on expiry date
                if (user.premiumExpiry) {
                    const expiry = new Date(user.premiumExpiry);
                    const plan = Object.values(NEET_PLANS).find(p =>
                        p.expiryDate.getTime() === expiry.getTime()
                    );
                    setCurrentPlan(plan || null);
                }
            } else {
                // Fallback if getMe fails
                const data = await validateSubscription();
                const status = data.status ? data.status.toUpperCase() : 'REGISTERED';
                setSubscriptionStatus(status);
                localStorage.setItem('subscriptionStatus', status);

                setPremiumExpiry(data.premiumExpiry ? new Date(data.premiumExpiry) : null);
                setTrialEndsAt(data.trialEndsAt ? new Date(data.trialEndsAt) : null);
            }
        } catch (error) {
            console.error('Failed to check subscription status:', error);
            if (!localStorage.getItem('subscriptionStatus')) {
                setSubscriptionStatus('REGISTERED');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const activateTrial = async () => {
        try {
            setIsLoading(true);
            await startTrialAPI();
            await checkStatus();
            return true;
        } catch (error) {
            console.error('Failed to activate trial:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyPayment = async (paymentData) => {
        try {
            setIsLoading(true);
            await verifyRazorpayPaymentAPI(paymentData);

            // ✅ Optimistic Update: Assume success prevents race conditions/delay
            setSubscriptionStatus('PREMIUM');
            localStorage.setItem('subscriptionStatus', 'PREMIUM');

            // Re-validate with backend
            await checkStatus();
            return true;
        } catch (error) {
            console.error('Failed to verify purchase:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate days remaining
    const getDaysRemaining = () => {
        if (subscriptionStatus === 'TRIALED' && trialEndsAt) {
            const diff = trialEndsAt.getTime() - new Date().getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        if (subscriptionStatus === 'PREMIUM' && premiumExpiry) {
            const diff = premiumExpiry.getTime() - new Date().getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    const isPremium = subscriptionStatus === 'PREMIUM' || subscriptionStatus === 'TRIALED';

    const isTrialActive = subscriptionStatus === 'TRIALED' && trialEndsAt && trialEndsAt > new Date();
    const isTrialExpired = subscriptionStatus === 'TRIALED' && trialEndsAt && trialEndsAt < new Date();

    return (
        <SubscriptionContext.Provider
            value={{
                subscriptionStatus,
                premiumExpiry,
                trialEndsAt,
                currentPlan,
                isLoading,
                isPremium,
                isTrialActive,
                isTrialExpired,
                userData,              // ✅ NEW: Expose user data
                fetchUserData,         // ✅ NEW: Expose fetch function
                checkStatus,
                activateTrial,
                verifyPayment,
                getDaysRemaining,
                NEET_PLANS,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};
