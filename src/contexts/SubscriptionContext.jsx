import React, { createContext, useState, useEffect, useContext } from 'react';
import { validateSubscription, startFreeTrial as startTrialAPI, verifyRazorpayPayment as verifyRazorpayPaymentAPI } from '../utils/api';
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
    const navigate = useNavigate();

    const checkStatus = async () => {
        try {
            // Only set loading if we don't have a status yet
            if (subscriptionStatus === 'loading') setIsLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                setSubscriptionStatus('REGISTERED');
                localStorage.removeItem('subscriptionStatus');
                setIsLoading(false);
                return;
            }

            const data = await validateSubscription();
            console.log('DEBUG: Backend Subscription Data:', data);

            const status = data.status ? data.status.toUpperCase() : 'REGISTERED';
            setSubscriptionStatus(status);
            localStorage.setItem('subscriptionStatus', status); // Cache status

            setPremiumExpiry(data.premiumExpiry ? new Date(data.premiumExpiry) : null);
            setTrialEndsAt(data.trialEndsAt ? new Date(data.trialEndsAt) : null);

            // Determine current plan based on expiry date
            if (data.premiumExpiry) {
                const expiry = new Date(data.premiumExpiry);
                const plan = Object.values(NEET_PLANS).find(p =>
                    p.expiryDate.getTime() === expiry.getTime()
                );
                setCurrentPlan(plan || null);
            }
        } catch (error) {
            console.error('Failed to check subscription status:', error);
            // Fallback to REGISTERED on error, or keep existing if network fails?
            // Safer to fallback to what we had or REGISTERED. 
            // If we have local storage value, maybe keep it? But if 401/403, clear it.
            // For now, let's play safe and default to REGISTERED but DON'T verify just yet to avoid locking valid users offline.
            // Actually, if validateSubscription fails, it might be auth error.

            // Let's stick to simple logic:
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

    return (
        <SubscriptionContext.Provider
            value={{
                subscriptionStatus,
                premiumExpiry,
                trialEndsAt,
                currentPlan,
                isLoading,
                isPremium,
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
