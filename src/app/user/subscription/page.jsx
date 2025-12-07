import React, { useState } from "react";
import { Check, Shield, Zap, Clock, Calendar, AlertCircle } from "lucide-react";
import { createRazorpayOrder } from "../../../utils/api";
import { useSubscription } from "../../../contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const SubscriptionPage = () => {
    const {
        subscriptionStatus,
        premiumExpiry,
        trialEndsAt,
        currentPlan,
        isLoading: isSubLoading,
        activateTrial,
        verifyPayment,
        getDaysRemaining,
        NEET_PLANS,
    } = useSubscription();

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubscribe = async (planKey) => {
        const plan = NEET_PLANS[planKey];
        if (!plan) return;

        setLoading(true);
        try {
            // 1. Create Order
            const orderData = await createRazorpayOrder(planKey);

            // 2. Options
            const rzpKey = orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID;

            if (!rzpKey) {
                alert("Payment configuration missing (Key ID). Please contact support.");
                setLoading(false);
                return;
            }

            const options = {
                key: rzpKey,
                amount: orderData.amount * 100, // Amount is in paise
                currency: "INR",
                name: "Mitos Learning",
                description: `Subscription for ${plan.name}`,
                image: "https://mitoslearning.in/logo.png",
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            plan: planKey,
                        });
                        alert("Subscription Successful!");
                        navigate("/user/dashboard");
                    } catch (verifyError) {
                        console.error("Payment Verification Failed", verifyError);
                        alert("Payment Verification Failed. Please contact support.");
                    }
                },
                prefill: {
                    name: localStorage.getItem("userName") || "",
                    email: localStorage.getItem("userEmail") || "",
                    contact: localStorage.getItem("userPhone") || "",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", function (response) {
                alert(response.error.description);
            });
            rzp1.open();
        } catch (error) {
            console.error("Error initiating subscription:", error);
            alert("Failed to initiate subscription. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStartTrial = async () => {
        setLoading(true);
        try {
            await activateTrial();
            alert("Trial Activated! Enjoy your 10-day free access.");
            navigate("/user/dashboard");
        } catch (error) {
            console.error("Error activating trial:", error);
            alert("Failed to activate trial. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isSubLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <PulseLoader color="#4F46E5" />
            </div>
        );
    }

    const isPremiumOrTrial = subscriptionStatus === 'PREMIUM' || subscriptionStatus === 'TRIALED';
    const daysLeft = getDaysRemaining();
    const expiryDate = subscriptionStatus === 'TRIALED' ? trialEndsAt : premiumExpiry;

    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pb-0 bg-transparent">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-12">
                    {isPremiumOrTrial ? (
                        <div className={`p-8 rounded-3xl shadow-lg text-white mb-8 bg-gradient-to-r ${subscriptionStatus === 'TRIALED' ? 'from-emerald-500 to-teal-600' : 'from-indigo-600 to-purple-700'}`}>
                            <div className="flex justify-center mb-4">
                                {subscriptionStatus === 'TRIALED' ? <Clock className="w-16 h-16" /> : <Check className="w-16 h-16" />}
                            </div>
                            <h2 className="text-3xl font-extrabold sm:text-4xl mb-2">
                                {subscriptionStatus === 'TRIALED' ? 'Trial Active' : "You're Premium!"}
                            </h2>
                            <p className="text-xl opacity-90 mb-4">
                                {daysLeft} days remaining • Expires on {formatDate(expiryDate)}
                            </p>
                            {currentPlan && (
                                <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
                                    {currentPlan.name}
                                </span>
                            )}
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Choose Your Learning Journey
                            </h2>
                            <p className="mt-4 text-xl text-gray-600">
                                Unlock your full potential with our premium subscription plans
                            </p>
                        </>
                    )}
                </div>

                {/* --- CONTENT SECTION --- */}
                <div className="space-y-12">

                    {/* Trial Activation for Registered Users */}
                    {subscriptionStatus === 'REGISTERED' && !trialEndsAt && (
                        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center max-w-3xl mx-auto">
                            <div className="flex justify-center mb-4 text-emerald-500">
                                <Zap className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h3>
                            <p className="text-gray-600 mb-6">Get 10 days of unlimited access to premium features. No credit card required.</p>
                            <button
                                onClick={handleStartTrial}
                                disabled={loading}
                                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                            >
                                {loading ? "Activating..." : "Start 10-Day Free Trial"}
                            </button>
                        </div>
                    )}

                    {/* Plans Section (Show if Registered OR Trial) */}
                    {(subscriptionStatus === 'REGISTERED' || subscriptionStatus === 'TRIALED') && (
                        <div>
                            {subscriptionStatus === 'TRIALED' && (
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h3>
                                    <p className="text-gray-600">Keep your access after the trial ends.</p>
                                </div>
                            )}

                            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
                                {Object.entries(NEET_PLANS).map(([key, plan]) => (
                                    <div
                                        key={key}
                                        className={`border rounded-2xl shadow-sm divide-y divide-gray-200 bg-white flex flex-col relative transition-all hover:shadow-md ${plan.id === 'neet_2027_plan' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                                    >
                                        {plan.id === 'neet_2027_plan' && (
                                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide transform">
                                                Popular
                                            </div>
                                        )}
                                        <div className="p-6 flex-1">
                                            <h3 className="text-lg leading-6 font-bold text-gray-900">
                                                {plan.name}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-500 h-10">{plan.description}</p>
                                            <p className="mt-6 flex items-baseline">
                                                <span className="text-4xl font-extrabold text-gray-900">
                                                    ₹{plan.price}
                                                </span>
                                                <span className="text-base font-medium text-gray-500 line-through ml-2">
                                                    ₹{plan.originalPrice}
                                                </span>
                                            </p>
                                            <ul className="mt-6 space-y-4">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <div className="flex-shrink-0">
                                                            <Check className="h-5 w-5 text-green-500" />
                                                        </div>
                                                        <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-b-2xl">
                                            <button
                                                onClick={() => handleSubscribe(key)}
                                                disabled={loading}
                                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                                            >
                                                {loading ? "Processing..." : "Subscribe Now"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Security Badge */}
                <div className="mt-12 text-center text-sm text-gray-500 pb-8">
                    <p className="flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" />
                        Secure Payment via Razorpay
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
