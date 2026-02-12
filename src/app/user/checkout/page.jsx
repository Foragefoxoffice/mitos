import React, { useState } from "react";
import { Check, Tag, AlertCircle, Loader } from "lucide-react";
import { message } from "antd";
import {
    validateCoupon,
    createRazorpayOrder,
    verifyRazorpayPayment,
} from "../../../utils/api";

const PLAN_PRICE = {
    NEET_2026: 1399,
    NEET_2027: 3599,
    NEET_2028: 6299,
};

const CheckoutPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlanKey =
        urlParams.get("plan") ||
        localStorage.getItem("selectedPlan") ||
        "NEET_2026";

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    const [couponCode, setCouponCode] = useState("");
    const [couponData, setCouponData] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const originalPrice = PLAN_PRICE[selectedPlanKey];
    const discount = couponData?.discountAmount || 0;
    const finalPrice = couponData?.finalAmount || originalPrice;

    /* =============================
       APPLY COUPON
    ============================== */
    const handleApplyCoupon = async () => {
        if (!couponCode) return;

        setIsApplying(true);
        setCouponError("");

        try {
            const res = await validateCoupon({
                code: couponCode,
                plan: selectedPlanKey,
            });

            setCouponData(res);
            setCouponCode("");
            message.success("Coupon applied successfully");
        } catch (e) {
            setCouponError(e.response?.data?.message || "Invalid coupon");
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponData(null);
        setCouponCode("");
        setCouponError("");
    };

    /* =============================
       RAZORPAY
    ============================== */
    const loadRazorpay = () =>
        new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleProceedToPayment = async () => {
        setIsProcessing(true);

        const loaded = await loadRazorpay();
        if (!loaded) {
            message.error("Failed to load Razorpay");
            setIsProcessing(false);
            return;
        }

        try {
            const orderData = await createRazorpayOrder({
                plan: selectedPlanKey,
                coupon: couponData?.code || null,
            });

            console.log("Razorpay Order Data:", orderData);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: "INR",
                name: "Mitos Learning",
                description: `Subscription - ${selectedPlanKey}`,
                order_id: orderData.id || orderData.orderId,
                image: "https://mitoslearning.com/images/logo/logo1.png",

                handler: async (response) => {
                    await verifyRazorpayPayment({
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        plan: selectedPlanKey,
                    });

                    message.success("Payment Successful 🎉");
                    window.location.href = "/user/dashboard";
                },

                prefill: {
                    name: storedUser.name || "",
                    email: storedUser.email || "",
                },

                theme: { color: "#6D3093" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            message.error("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your subscription</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="md:col-span-2 space-y-6">
                        {/* PLAN */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Selected Plan</h2>
                            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                                <h3 className="text-lg font-bold">{selectedPlanKey}</h3>
                                <p className="text-sm text-gray-600">NEET Subscription</p>
                            </div>
                        </div>

                        {/* COUPON */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-purple-600" />
                                Apply Coupon Code
                            </h2>

                            {!couponData ? (
                                <>
                                    <div className="flex gap-3">
                                        <input
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(e.target.value.toUpperCase())
                                            }
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-4 py-2 border rounded-lg"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={!couponCode || isApplying}
                                            className="px-6 py-2 bg-purple-600 text-white rounded-lg"
                                        >
                                            {isApplying ? (
                                                <Loader className="animate-spin" />
                                            ) : (
                                                "Apply"
                                            )}
                                        </button>
                                    </div>

                                    {couponError && (
                                        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            {couponError}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Check className="text-green-600" />
                                                <b>{couponData.code}</b>
                                            </div>
                                            <p className="text-sm text-green-700">
                                                You save ₹{couponData.discountAmount}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-4">Price Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span>Plan Price</span>
                                    <span>₹{originalPrice}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{discount}</span>
                                    </div>
                                )}

                                <div className="border-t pt-3 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-purple-600 text-xl">
                                        ₹{finalPrice}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                disabled={isProcessing}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg"
                            >
                                {isProcessing ? "Processing..." : "Proceed to Payment"}
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
