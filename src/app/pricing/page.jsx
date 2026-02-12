import React from "react";
import { Check, Shield, ArrowRight, Copy, CheckCircle2, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import NEET_PLANS from SubscriptionContext
const NEET_PLANS = {
    NEET_2026: {
        id: 'neet_2026_plan',
        name: 'NEET 2026 Plan',
        price: 1399,
        originalPrice: 2499,
        expiryDate: new Date('2026-06-01'),
        description: 'Access until June 1, 2026',

    },
    NEET_2027: {
        id: 'neet_2027_plan',
        name: 'NEET 2027 Plan',
        price: 3599,
        originalPrice: 4999,
        expiryDate: new Date('2027-06-01'),
        description: 'Access until June 1, 2027',

    },
    NEET_2028: {
        id: 'neet_2028_plan',
        name: 'NEET 2028 Plan',
        price: 6299,
        originalPrice: 7999,
        expiryDate: new Date('2028-06-01'),
        description: 'Access until June 1, 2028',

    },
};

const PricingPage = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = React.useState(false);

    const handlePlanClick = () => {
        // Navigate to login page when user clicks on any plan
        navigate("/login");
    };

    const handleCopyCoupon = () => {
        navigator.clipboard.writeText("MLNEW50");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="bg-white text-gray-800 overflow-hidden mt-3">
            {/* Header - Same as Home Page */}
            <section className="bg-white md:mr-16 md:ml-16 mr-2 ml-2 md:mb-2 mb-4">
                <div className="mx-auto gap-4 px-5 py-3">
                    {/* Logo */}
                    <div className="flex justify-center align-center md:mb-0 mb-3">
                        <a href="/" className="align-center flex justify-center">
                            <img
                                src="/images/practice/header-logo.png"
                                alt="MITOS LEARNING"
                                referrerPolicy="no-referrer"
                                className="md:w-[60%] w-[60%] align-center"
                            />
                        </a>
                    </div>

                </div>
            </section>

             {/* Coupon Section */}
                    <div className="mb-5 md:mb-10 md:mt-10 mt-5 px-6 max-w-6xl mx-auto">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6D3093] via-[#8B4DB8] to-[#bf6af4] p-8 shadow-2xl">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-center mb-4">
<span className="bg-white text-[#6D3093] font-black px-4 py-2 rounded-full text-2xl shadow-lg">
    50% OFF
</span>
                                    
                                    {/* <Gift className="w-12 h-12 text-white" /> */}
                                </div>
                                <h3 className="text-3xl font-bold text-white text-center mb-3">
                                    Exclusive Festival Discount
                                </h3>
                                <p style={{color: "white"}} className="text-white/90 text-center mb-6 text-lg">
                                    Limited Offer - Don't Miss Out
                                </p>

                                {/* Coupon Code Box */}
                                <div className="bg-white rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-[200px]">
                                            <p className="text-sm text-gray-600 mb-1">Coupon Code</p>
                                            <p className="text-3xl font-bold bg-gradient-to-r from-[#6D3093] to-[#bf6af4] bg-clip-text text-transparent tracking-wider">
                                                MLNEW50
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleCopyCoupon}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6D3093] to-[#8B4DB8] text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-5 h-5" />
                                                    Copy Code
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Success message */}
                                    {copied && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            <p className="text-sm text-green-700 font-medium">
                                                Coupon code copied to clipboard!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 text-center">
                                    <p style={{color: "white"}}  className="text-white/80 text-lg">
                                        💡 Apply this code during checkout to unlock your discount
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

            {/* Pricing Content */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 md:mr-16 md:ml-16 mr-2 ml-2">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                            Choose Your <span className="bg-gradient-to-r from-[#2f1042] to-[#bf6af4] bg-clip-text text-transparent">NEET Plan</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Unlock your potential with comprehensive NEET preparation. Select the plan that fits your timeline.
                        </p>
                    </div>

                      {/* Pricing Plans Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-[#2f1042] to-[#bf6af4] bg-clip-text text-transparent">
                            Our Plans
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {Object.entries(NEET_PLANS).map(([key, plan], index) => (
                                <div
                                    key={key}
                                    className={`bg-white border-2 rounded-3xl shadow-lg p-8 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${index === 1 ? 'border-[#6D3093] relative' : 'border-gray-200'
                                        }`}
                                >
                                    {/* Popular Badge */}
                                    {index === 1 && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-[#6D3093] text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-sm text-gray-500">{plan.description}</p>
                                    </div>

                                    <div className="text-center mb-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-5xl font-extrabold text-gray-900">₹{plan.price}</span>
                                        </div>
                                        <span className="text-lg text-gray-400 line-through">₹{plan.originalPrice}</span>
                                        <p className="text-sm text-green-600 font-semibold mt-1">
                                            Save ₹{plan.originalPrice - plan.price}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handlePlanClick}
                                        className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${index === 1
                                            ? 'bg-[#6D3093] text-white hover:bg-[#5a2678] shadow-md hover:shadow-lg'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}
                                    >
                                        Get Started
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>


 {/* Trust Badge */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span className="text-gray-700 font-medium">Secure Payment via Razorpay</span>
                        </div>
                    </div>

                    {/* What You'll Get Section */}
                    <div className="mb-16 mt-16">
                        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#2f1042] to-[#bf6af4] bg-clip-text text-transparent">
                            What You'll Get
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                { icon: "🎁", title: "Bonus: Free Downloadable NEET DPPs, NCERT Exemplar", message: "Solved Examples and Questions" },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#B887C1]">
                                    <div className="text-3xl flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                                        <p className="text-gray-600 text-sm">{item.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                  
                   

                   
                </div>
            </div>

            {/* Footer - Same as Home Page */}
            <footer className="text-sm text-center py-12 bg-gray-900 text-gray-400">
                <div className="container mx-auto px-6 md:px-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                            <div className="text-2xl font-bold text-white mb-4 md:mb-0">
                                <img
                                    src="/images/practice/header-logo.png"
                                    alt="MITOS LEARNING"
                                    referrerPolicy="no-referrer"
                                    className="md:w-[60%] w-[50%]"
                                />
                            </div>
                            <div className="flex md:flex-row flex-col md:gap-16 gap-6 max-md:w-100 max-md:px-3">
                                <div className="flex items-start flex-col gap-6">
                                    <a href="/about" className="hover:text-white">
                                        About
                                    </a>
                                    <a href="/privacy-policy" className="hover:text-white">
                                        Privacy Policy
                                    </a>
                                    <a href="/terms-and-conditions" className="hover:text-white">
                                        Terms & Conditions
                                    </a>
                                </div>
                                <div className="flex items-start flex-col gap-6">
                                    <a href="/playstore-terms" className="hover:text-white">
                                        Playstore Terms & Conditions
                                    </a>
                                    <a href="/applestore-terms" className="hover:text-white">
                                        Appstore Terms & Conditions
                                    </a>
                                    <a href="/applestore-privacy" className="hover:text-white">
                                        Appstore Privacy Policy
                                    </a>
                                </div>
                                <div className="flex items-start flex-col gap-6">
                                    <a href="/playstore-privacy" className="hover:text-white">
                                        Playstore Privacy Policy
                                    </a>
                                </div>
                            </div>
                        </div>
                        <p className="text-white" style={{ color: "#fff" }}>
                            © {new Date().getFullYear()} Mitos Learning (OPC) Private Limited. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default PricingPage;
