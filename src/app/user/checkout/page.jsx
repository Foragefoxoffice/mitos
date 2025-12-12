import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Tag, AlertCircle, Loader } from "lucide-react";
import { message } from "antd";
import { useSubscription } from "../../../contexts/SubscriptionContext";
import { createRazorpayOrder } from "../../../utils/api";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { NEET_PLANS, verifyPayment } = useSubscription();

    // Get selected plan from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlanKey = urlParams.get('plan') || localStorage.getItem('selectedPlan') || 'NEET_2026';

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const selectedPlan = NEET_PLANS[selectedPlanKey];

    // Coupon codes configuration (you can move this to backend later)
    const COUPONS = {
        "OM15": { discount: 15, type: "percentage", description: "Flat 15% off" },
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;

        const coupon = COUPONS[appliedCoupon];
        if (coupon.type === "flat") {
            return coupon.discount;
        } else {
            return Math.round((selectedPlan.price * coupon.discount) / 100);
        }
    };

    const discount = calculateDiscount();
    const finalPrice = selectedPlan.price - discount;

    const handleApplyCoupon = () => {
        setIsApplying(true);
        setCouponError("");

        // Simulate API call
        setTimeout(() => {
            const code = couponCode.toUpperCase().trim();

            if (COUPONS[code]) {
                setAppliedCoupon(code);
                message.success(`Coupon "${code}" applied successfully! 🎉`);
                setCouponCode("");
            } else {
                setCouponError("Invalid coupon code");
                message.error("Invalid coupon code");
            }
            setIsApplying(false);
        }, 500);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
        message.info("Coupon removed");
    };

    const handleProceedToPayment = async () => {
        setIsProcessing(true);

        try {
            const storedUser = JSON.parse(localStorage.getItem("user")) || {};

            // Create order with final price
            const orderData = await createRazorpayOrder(selectedPlanKey, finalPrice);
            const rzpKey = orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID;

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


            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", function (response) {
                message.error(`Payment failed: ${response.error.description}`);
                setIsProcessing(false);
            });

            rzp.open();
        } catch (e) {
            console.error("Payment error:", e);
            message.error("Payment initiation failed. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your subscription</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left - Order Summary */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Selected Plan */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Selected Plan</h2>

                            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{selectedPlan.name}</h3>
                                        <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate("/user/subscription")}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Change
                                    </button>
                                </div>

                                {/* <ul className="space-y-2">
                                    {selectedPlan.features.slice(0, 3).map((feature, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-700">
                                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul> */}
                            </div>
                        </div>

                        {/* Coupon Code */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-purple-600" />
                                Apply Coupon Code
                            </h2>

                            {!appliedCoupon ? (
                                <div>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponError("");
                                            }}
                                            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={!couponCode.trim() || isApplying}
                                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                        >
                                            {isApplying ? <Loader className="h-5 w-5 animate-spin" /> : "Apply"}
                                        </button>
                                    </div>

                                    {couponError && (
                                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{couponError}</span>
                                        </div>
                                    )}

                                    {/* Available Coupons */}

                                </div>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <span className="font-bold text-green-900">{appliedCoupon}</span>
                                            </div>
                                            <p className="text-sm text-green-700">{COUPONS[appliedCoupon].description}</p>
                                            <p className="text-sm text-green-600 font-semibold mt-1">
                                                You save ₹{discount}!
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Price Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-4">Price Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Plan Price</span>
                                    <span>₹{selectedPlan.originalPrice}</span>
                                </div>

                                {selectedPlan.originalPrice > selectedPlan.price && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Plan Discount</span>
                                        <span>-₹{selectedPlan.originalPrice - selectedPlan.price}</span>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Coupon Discount</span>
                                        <span>-₹{discount}</span>
                                    </div>
                                )}

                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-purple-600">₹{finalPrice}</div>

                                        </div>
                                    </div>
                                </div>

                                {discount > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                        <p className="text-sm font-semibold text-green-800">
                                            🎉 You're saving ₹{(selectedPlan.originalPrice - finalPrice)}!
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                disabled={isProcessing}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transition-all"
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    `Proceed to Payment`
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                Secure payment powered by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
