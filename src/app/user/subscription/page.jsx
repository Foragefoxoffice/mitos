import React, { useState } from "react";
import { Check, Shield, Zap, Clock, AlertCircle } from "lucide-react";
import { createRazorpayOrder } from "../../../utils/api";
import { useSubscription } from "../../../contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { message } from "antd";

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

    // Read from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const hasUsedTrial = storedUser.hasUsedTrial || false;
    const userStatus = storedUser.status;

    const isRegistered = userStatus === "REGISTERED";
    const isTrialActive = subscriptionStatus === "TRIALED";
    const isPremium = subscriptionStatus === "PREMIUM";

    const daysLeft = getDaysRemaining();
    const expiryDate = isTrialActive ? trialEndsAt : premiumExpiry;

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleSubscribe = async (planKey) => {
        const plan = NEET_PLANS[planKey];
        if (!plan) return;

        setLoading(true);

        try {
            console.log("🔵 Creating Razorpay order for plan:", planKey);
            const orderData = await createRazorpayOrder(planKey);
            console.log("🟢 Order created successfully:", orderData);

            const rzpKey = orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
            console.log("🔑 Using Razorpay key:", rzpKey);

            const options = {
                key: rzpKey,                               // Razorpay Key ID
                amount: orderData.amount,                  // amount in paise from backend
                currency: "INR",
                name: "Mitos Learning",
                description: `Subscription for ${selectedPlan.name}`,
                image: "https://mitoslearning.com/images/logo/logo.png",
                order_id: orderData.orderId,               // IMPORTANT (Orders API)

                handler: async function (response) {
                    console.log("PAYMENT SUCCESS:", response);

                    await verifyPayment({
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        plan: selectedPlanKey,
                    });

                    message.success("Payment Successful! 🎉");
                    setTimeout(() => {
                        window.location.href = "/user/dashboard";
                    }, 1000);
                },

                prefill: {
                    name: storedUser.name || "",
                    email: storedUser.email || "",
                    contact: storedUser.phoneNumber || "",
                },

                theme: {
                    color: "#6D3093",
                },
            };


            console.log("📋 Razorpay options:", options);

            const rzp = new window.Razorpay(options);

            // V2 Error handling
            rzp.on("payment.failed", function (response) {
                console.error("❌ Payment failed:", response.error);
                message.error(`Payment failed: ${response.error.description}`);
                setLoading(false);
            });

            console.log("🚀 Opening Razorpay checkout...");
            rzp.open();
        } catch (e) {
            console.error("❌ Payment initiation error:", e);
            message.error("Payment initiation failed. Please try again.");
            setLoading(false);
        }
    };

    const handleStartTrial = async () => {
        setLoading(true);
        try {
            await activateTrial();
            alert("Trial Activated 🎉");
            navigate("/user/dashboard");
        } catch (err) {
            alert("Trial activation failed.");
        } finally {
            setLoading(false);
        }
    };

    if (isSubLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <PulseLoader color="#4F46E5" />
            </div>
        );
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">

                {/* PREMIUM BANNER */}
                {isPremium && (
                    <div className="text-center mb-12">
                        <div className="p-8 rounded-3xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-700">
                            <Check className="w-16 h-16 mx-auto mb-4" />
                            <h2 className="text-3xl font-extrabold">You're Premium!</h2>
                            <p className="text-xl opacity-90 mt-2">
                                Access until {formatDate(premiumExpiry)}
                            </p>
                            {currentPlan && (
                                <span className="inline-block bg-white/20 px-4 py-1 mt-4 rounded-full text-sm font-semibold">
                                    {currentPlan.name}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* REGISTERED USERS – TRIAL SECTION */}
                {isRegistered && (
                    <>
                        {/* Already used trial */}
                        {hasUsedTrial ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-3xl mx-auto mb-10 text-center">
                                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                                <h3 className="text-xl font-bold">You Already Used Your Trial</h3>
                                <p className="text-gray-600 mt-1">Choose a premium plan to continue learning.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center max-w-3xl mx-auto">
                                <div className="flex justify-center mb-4 text-emerald-500">
                                    <Zap className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h3>
                                <p className="text-gray-600 mb-6">10 days of unlimited access. No card required.</p>

                                <button
                                    onClick={handleStartTrial}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    {loading ? "Activating..." : "Start 10-Day Free Trial"}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* ACTIVE TRIAL SECTION */}
                {isTrialActive && (
                    <div className="text-center mb-12">
                        {daysLeft > 0 ? (
                            <div className="p-8 rounded-3xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600">
                                <Clock className="w-16 h-16 mx-auto mb-4" />
                                <h2 className="text-3xl font-extrabold">Trial Active</h2>
                                <p className="text-xl opacity-90 mt-2">
                                    {daysLeft} days remaining • Expires on {formatDate(expiryDate)}
                                </p>
                            </div>
                        ) : (
                            <div className="p-8 rounded-3xl shadow-lg text-white bg-gradient-to-r from-red-500 to-orange-600">
                                <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                                <h2 className="text-3xl font-extrabold">Trial Ended</h2>
                                <p className="text-xl opacity-90 mt-2">
                                    Your trial has expired on {formatDate(expiryDate)}. Please upgrade to continue.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* WHAT YOU'LL GET (your screenshot section) */}
                {/* ---------------------------------------------------- */}
                <div className="mx-auto mt-12">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">What You’ll Get</h2>

                    <div className="space-y-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
                        {[
                            { icon: "📘", title: "36,000+ NCERT Line-by-Line Questions", message: "Master every concept — no gaps." },
                            { icon: "📈", title: "Personalised Weak Area Analytics", message: "Instant insights to improve faster." },
                            { icon: "🧩", title: "Unlimited Custom & Full Tests", message: "Practice what you want, anytime." },
                            { icon: "🚀", title: "Mark Booster", message: "Turn weak areas into strengths." },
                            { icon: "❓", title: "10+ Question Types", message: "Be ready for every NEET twist." },
                            { icon: "📅", title: "34+ Years NEET PYQs", message: "Learn patterns. Score smarter." },
                            { icon: "🔍", title: "100+ A & R Questions per Chapter", message: "Sharpen logic & reasoning skills." },
                            { icon: "📄", title: "HD Study Notes", message: "Fast and clear revision support." },
                            { icon: "🎯", title: "NEET Score Predictor", message: "Track your rank potential." },
                            { icon: "🏆", title: "Leaderboard Rankings", message: "See where you stand nationwide." },
                            { icon: "🎁", title: "Bonus: Free Downloadable NEET DPPs, NCERT Exemplar:", message: " Solved Examples and Questions" },
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg m-0">
                                <div className="p-3 rounded-xl bg-gray-100 text-xl ">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{item.title}</p>
                                    <p className="text-gray-500 text-sm">{item.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SHOW PLANS */}
                {(isRegistered || isTrialActive) && !isPremium && (
                    <div className="mt-12">
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Object.entries(NEET_PLANS).map(([key, plan]) => (
                                <div key={key} className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col">
                                    <h3 className="text-lg font-bold">{plan.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>

                                    <p className="text-4xl font-extrabold mt-4">
                                        ₹{plan.price}
                                        <span className="text-base text-gray-400 line-through ml-2">
                                            ₹{plan.originalPrice}
                                        </span>
                                    </p>



                                    <button
                                        onClick={() => {
                                            // if (isTrialActive) {
                                            //     alert("Please wait to complete your trial period.");
                                            //     return;
                                            // }
                                            // if (isRegistered && !hasUsedTrial && !isTrialActive) {
                                            //     alert("Please try or click the trial option.");
                                            //     return;
                                            // }
                                            localStorage.setItem('selectedPlan', key);
                                            navigate(`/user/checkout?plan=${key}`);
                                        }}
                                        disabled={loading}
                                        className="mt-6 w-full py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Continue to Checkout
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
