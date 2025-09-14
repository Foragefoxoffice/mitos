import { useEffect, useState } from "react";
import UserDropdown from "../UserDropdown";

const TestNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("https://mitoslearning.in/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in the header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <div className="test_header flex justify-between items-center">
        <h1 className="font-bold text-2xl text-[#35095e] md:text-3xl">Test</h1>

        {/* ✅ Regular <img> instead of Next.js <Image> */}
        <a href="/user/dashboard">
          <img
            src="/images/logo/logo.png"
            className="hidden md:block"
            alt="logo"
              referrerPolicy="no-referrer"
            width={150}
            height={80}
          />
        </a>

        <UserDropdown user={user} />
      </div>
    </div>
  );
};

export default TestNavbar;
