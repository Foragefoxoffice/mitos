import { Outlet, useLocation } from "react-router-dom";
import Menu from "@/components/user/menu";
import UserComponent from "@/components/user/navbar";
import BannerComponent from "@/components/user/BannerComponent";
import useAuth from "@/contexts/useAuth";

export default function Layout() {
  const location = useLocation();
  const pathname = location.pathname;

  useAuth();

  // Remove layout for some pages
  if (
    pathname === "/user/test" ||
    pathname === "/user/flipbook" ||
    pathname === "/user/practice" ||
    pathname === "/user/customize"
  ) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen overflow-y-hidden relative bg-[#F0F8FF]">
      {/* Left Side */}
      <div className="w-[14%] md:w-[10%] lg:w-[16%] xl:w-[16%] md:p-6 p-2 pt-10 sidebar hidden md:block">
        <div className="bg-white rounded-md hidden md:flex md:p-5">
          <a href="/user/dashboard">
            <img src="/images/logo/logo.png"   referrerPolicy="no-referrer" alt="Logo" width={150} height={80} />
          </a>
        </div>
        <div className="bg-white rounded-md md:hidden">
          <a href="/user/dashboard">
            <img src="/images/logo/logo1.png"   referrerPolicy="no-referrer" alt="Logo" width={150} height={80} />
          </a>
        </div>
        <header>
          <Menu />
        </header>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-[90%] lg:w-[84%] xl:w-[84%] overflow-y-scroll no-scrollbar">
        <div className="p-0 md:p-10 mb-10 test-container-main">
          <div className="flex items-center justify-between md:justify-end">
            <div className="flex md:hidden items-center">
              <img
                src="/images/logo/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="rounded-full w-[120px]"
              />
              <Menu />
            </div>

            <UserComponent />
          </div>
          <BannerComponent />
          <Outlet />
        </div>

        <footer className="w-full bg-white p-4 pt-5 text-center text-gray-600">
          <p className="text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-[#017bcd]">
              Mitos Learning (OPC) Private Limited.
            </span>{" "}
            All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
