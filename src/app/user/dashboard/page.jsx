import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { TbBulb } from "react-icons/tb";
import { LuNotebookPen } from "react-icons/lu";
import { RiBook2Line } from "react-icons/ri";
import { HiArrowSmallLeft } from "react-icons/hi2";
import { FiSearch, FiX } from "react-icons/fi";

/* ----------------------- reusable search ----------------------- */
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative w-full max-w-xs md:max-w-md">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007acc]" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#cfe9fb] focus:outline-none focus:ring-2 focus:ring-[#007acc] text-[#00497a]"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label="Clear search"
      >
        <FiX className="text-[#4b6b86] bg-[#fff]" />
      </button>
    )}
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const tabDetails = {
    practice: {
      label: "Practice",
      icon: <TbBulb className="inline mr-1" />,
      path: "/user/dashboard/practice/subjects",
    },
    test: {
      label: "Test",
      icon: <LuNotebookPen className="inline mr-1" />,
      path: "/user/dashboard/test/portions",
    },
    study: {
      label: "Study Material",
      icon: <RiBook2Line className="inline mr-1" />,
      path: "/user/dashboard/study/subjects",
    },
  };

  // derive active tab directly from URL
  const getActiveTabFromUrl = () => {
    if (location.pathname.includes("/practice")) return "practice";
    if (location.pathname.includes("/test")) return "test";
    if (location.pathname.includes("/study")) return "study";
    return "practice"; // default
  };

  const activeTab = getActiveTabFromUrl();

  const handleTabClick = (tabKey) => {
    navigate(tabDetails[tabKey].path);
  };

  const handleBack = () => {
    navigate(-1); // browser-like back navigation
  };

  const getSearchPlaceholder = () => {
    if (activeTab === "practice") return "Search in practice...";
    if (activeTab === "test") return "Search in test...";
    if (activeTab === "study") return "Search in study material...";
    return "Search...";
  };

  return (
    <div className="pt-6">
      {/* ---------------- MOBILE HEADER ---------------- */}
      <div className="sticky top-0 z-50 ">
        <div className="flex items-center sm:hidden justify-between px-5 py-4 rounded-3xl bg-white shadow mb-2">
          {/* Back Button (mobile only) */}
          <button
            onClick={handleBack}
            className="flex items-center px-3 py-1.5 rounded-xl bg-[#007ACC] text-white"
          >
            <HiArrowSmallLeft className="text-lg" />
            <span className="ml-1 hidden sm:inline">Back</span>
          </button>

          {/* Search (mobile only) */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={getSearchPlaceholder()}
          />
        </div>
      

      {/* ---------------- TABS + DESKTOP/TABLET HEADER ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center rounded-4xl bg-white md:justify-between gap-3 px-5 py-6 shadow">
          <div className="hidden sm:flex items-center space-x-4">
         
        <button
            onClick={handleBack}
            className="flex items-center px-3 py-1.5 rounded-xl bg-[#007ACC] text-white"
          >
            <HiArrowSmallLeft className="text-lg" />
            <span className="ml-1">Back</span>
          </button>
       </div>
        {/* Tabs */}
       <div className="flex space-x-2 md:space-x-4">
  {Object.keys(tabDetails).map((tabKey) => (
    <button
      key={tabKey}
      className={`px-4 py-2 rounded-3xl font-semibold transform transition-all duration-200 
        ${
          activeTab === tabKey
            ? "bg-[#007ACC] text-white shadow-md scale-105"
            : "bg-[#dff4ff] text-[#00497A] hover:bg-[#bfe7ff] hover:scale-105 active:scale-95"
        }`}
      onClick={() => handleTabClick(tabKey)}
    >
      {tabDetails[tabKey].icon}
      {tabDetails[tabKey].label}
    </button>
  ))}
</div>


        {/* Back + Search visible only on tablet/desktop */}
        <div className="hidden sm:flex items-center space-x-4">
         
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={getSearchPlaceholder()}
          />
        </div>
      </div>
</div>
      {/* Nested content */}
      <div className="mt-6">
        <Outlet context={{ searchTerm }} />
      </div>
    </div>
  );
}
