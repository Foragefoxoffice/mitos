import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PremiumPopup from "../PremiumPopup";
import {
  FiHome,
  FiTrendingUp,
  FiAward,
  FiHeart,
  FiHelpCircle,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiTarget,
  FiFileText, // ✅ News
} from "react-icons/fi";

const navItems = [
  {
    title: "Menus",
    items: [
      {
        title: "Home",
        icon: <FiHome size={18} />,
        href: "/user/dashboard",
        allowedRoles: ["guest", "user", "admin"],
      },
      {
        title: "Free Materials",
        icon: <FiAward size={18} />,
        href: "/user/free-materials",
        allowedRoles: ["guest", "user", "admin"],
      },
      {
        title: "Mark Booster",
        icon: <FiTrendingUp size={18} />,
        href: "/user/progress",
        allowedRoles: ["user", "admin"],
      },
      {
        title: "Score Predictor",
        icon: <FiTarget size={18} />,
        href: "/user/neet-score-predictor",
        allowedRoles: ["user", "admin"],
      },
      {
        title: "Leader Board",
        icon: <FiAward size={18} />,
        href: "/user/leaderboard",
        allowedRoles: ["user", "admin"],
      },
      {
        title: "Favorites",
        icon: <FiHeart size={18} />,
        href: "/user/favorites",
        allowedRoles: ["user", "admin"],
      },
      {
        title: "FAQ's",
        icon: <FiHelpCircle size={18} />,
        href: "/user/faq",
        allowedRoles: ["user", "admin"],
      },
      {
        title: "News",
        icon: <FiFileText size={18} />,
        href: "/user/news",
        allowedRoles: ["user", "admin"],
      },
      {
        title: "Notifications",
        icon: <FiBell size={18} />,
        href: "/user/notifications",
        allowedRoles: ["user", "admin"],
      },
      {
        title: "Settings",
        icon: <FiSettings size={18} />,
        href: "/user/settings",
        allowedRoles: ["user", "admin"],
      },
    ],
  },
];



// ... (navItems def) ...

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { isPremium, subscriptionStatus } = useSubscription(); // Removed Context usage
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState("guest");
  const [user, setUser] = useState(null); // Local user state
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const handlePremiumClick = (e) => {
    e.preventDefault();
    setShowPremiumPopup(true);
  };

  useEffect(() => {
    const role = localStorage.getItem("role") || "guest";
    setUserRole(role);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch updated user status from DB
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("https://mitoslearning.in/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("DEBUG: Menu User Fetch:", data);
          console.log("DEBUG: User Status:", data?.status);
          setUser(data);
          if (data.role) setUserRole(data.role); // ✅ Sync role from DB to ensure access
        } else {
          console.error("DEBUG: Menu Fetch Failed", response.status);
        }
      } catch (e) {
        console.error("Menu fetch user error", e);
      }
    };
    fetchUser();
  }, []); // Run once on mount

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const isActive = (href) =>
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <div
          className={`md:hidden fixed left-4 z-80 ${isMobileMenuOpen ? "top-2 left-[15rem]" : "relative"
            }`}
        >
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-purple-700 text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-70 transform" : "relative"}
          ${isMobileMenuOpen
            ? "translate-x-0 w-[80%] sidebar"
            : "-translate-x-full"
          }
          md:translate-x-0 transition-transform duration-300 ease-in-out
          text-white h-screen
        `}
      >
        <div className="space-y-1 pt-16 md:pt-6">
          {navItems.map((navGroup) => (
            <div key={navGroup.title} className="overflow-hidden">
              <div className="py-1">
                {navGroup.items.map((item) => {
                  let isAllowed = item.allowedRoles.includes(userRole);

                  // EXTRA RESTRICTION FOR 'REGISTERED' USERS (Not Premium/Trial)
                  // Use DB status
                  const status = user?.status ? user.status.toUpperCase() : 'REGISTERED';
                  const isPremiumOrTrial = status === 'PREMIUM' || status === 'TRIALED' || status === 'TRIAL';

                  // If registered (not premium/trial), only allow 'Home' and 'Free Materials'
                  if (!isPremiumOrTrial && userRole !== 'guest') {
                    const alwaysOpen = ["/user/dashboard", "/user/free-materials"];
                    if (!alwaysOpen.includes(item.href)) {
                      isAllowed = false;
                    }
                  }

                  return isAllowed ? (
                    <Link
                      key={item.title}
                      to={item.href}
                      onClick={() => {
                        if (isMobile) setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 pt-3 pb-3 px-3 rounded-lg  group
                        transition-all duration-300 ease-in-out
                        ${isActive(item.href)
                          ? "bg-white text-black font-bold mb-2"
                          : "hover:bg-white mb-2"
                        }
                      `}
                    >
                      <span
                        className={`transition-all duration-300 ease-in-out ${isActive(item.href)
                          ? "text-[#000] font-bold"
                          : "text-white group-hover:text-black group-hover:font-bold"
                          }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`transition-all duration-300 ease-in-out ${isActive(item.href)
                          ? "text-[#000] font-bold"
                          : "text-white group-hover:text-black group-hover:font-bold"
                          }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  ) : (
                    <button
                      key={item.title}
                      onClick={handlePremiumClick}
                      className={`w-full navbutton flex justify-baseline gap-2 items-center pt-3 mb-3 pb-3 px-2 rounded-lg group
                        transition-all duration-300 ease-in-out ${isActive(item.href)
                          ? "bg-white text-[#35095E]"
                          : "text-white hover:bg-purple-800"
                        } 
                        ${isMobileMenuOpen ? " mx-2 w-[90%]" : " mx-0"}
                        opacity-50`}
                    >
                      <span className="text-white text-[12px]">{item.icon}</span>
                      <span className="text-white text-[13px]">
                        {item.title}
                        <span className="text-[12px] ml-2 text-xs text-yellow-300">
                          (Locked)
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Popup */}
      {showPremiumPopup && (
        <PremiumPopup onClose={() => setShowPremiumPopup(false)} />
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-60 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Menu;
