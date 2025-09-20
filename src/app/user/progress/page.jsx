// src/pages/ResultPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchResultByUser } from "@/utils/api";
import { format } from "date-fns";
import ResultsByMonth from "@/components/ResultsByMonth";
import ChartResultsByWeek from "@/components/ChartByMonth";
import CommonLoader from "@/components/commonLoader";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

/**
 * ResultPage using Swiper instead of react-slick
 * - Fractional slides supported
 * - Responsive breakpoints
 * - Custom nav buttons (hidden on small screens)
 */

export default function ResultPage() {
  const [weeklyResults, setWeeklyResults] = useState([]);
  const [results, setResults] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const navigate = useNavigate();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // inject minimal CSS tweaks (ensures slides behave correctly)
  useEffect(() => {
    const css = `
      .swiper-slide { display: block !important; }
      .swiper-wrapper { align-items: stretch; }
      .result-nav-btn { background: rgba(255,255,255,0.95); border-radius: 9999px; padding: 6px; display:flex; align-items:center; justify-content:center; box-shadow: 0 6px 20px rgba(0,0,0,0.08); cursor:pointer; }
      .result-nav-btn svg { width: 22px; height: 22px; color: #35095e; }
      @media (max-width: 768px) {
        .result-nav-btn { display: none; }
      }
    `;
    const styleEl = document.createElement("style");
    styleEl.id = "result-page-swiper-fixes";
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
    return () => {
      const existing = document.getElementById("result-page-swiper-fixes");
      if (existing) existing.remove();
    };
  }, []);

  // Get userId
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      // keep same behavior as before (parseInt)
      setUserId(parseInt(storedUserId, 10));
    } else {
      setHasFetched(true);
      setLoading(false);
    }
  }, []);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await fetchResultByUser(userId);
        const data = response?.data || [];
        setResults(data);
        setWeeklyResults(groupResultsByWeek(data));
      } catch (err) {
        console.error("Error fetching results:", err);
        setResults([]);
        setWeeklyResults([]);
      } finally {
        setHasFetched(true);
        setLoading(false);
      }
    };
    fetchResults();
  }, [userId]);

  // Loader
  if (loading || !hasFetched) {
    return (
      <div className="container pt-6">
        <CommonLoader />
      </div>
    );
  }

  // Empty State
  if (weeklyResults.length === 0) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src="/images/progress.png"
          alt="No Results"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-70"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            No results available
          </h2>
          <p className="text-md text-gray-600 mt-2">
            Please take the test to see your results.
          </p>
          <button
            onClick={() => navigate("/user/dashboard/test/portions")}
            className="mt-6 px-6 py-2 bg-[#35095e] text-white font-medium rounded-lg hover:bg-[#35095e]/80 transition"
          >
            Take the Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-2 mx-auto">
      <div className="mt-2 md:mt-12">
        <ChartResultsByWeek results={results} />
      </div>

      <div className="mt-12">
        <ResultsByMonth results={results} />
      </div>

      <div className="relative py-6 sm:py-12">
        {/* Left nav */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 -translate-x-3">
          <button
            ref={prevRef}
            className="result-nav-btn hidden md:inline-flex"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Right nav */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 translate-x-3">
          <button
            ref={nextRef}
            className="result-nav-btn hidden md:inline-flex"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            // link navigation with our refs
            if (typeof swiper.params !== "undefined") {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          onSwiper={(s) => {
            swiperRef.current = s;
            // init nav once swiper & refs are present
            setTimeout(() => {
              if (s && s.navigation) {
                s.navigation.init();
                s.navigation.update();
              }
            }, 0);
          }}
          spaceBetween={16}
          slidesPerView={4} // default for larger screens
          breakpoints={{
            1280: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 2.2, spaceBetween: 12 },
            0: { slidesPerView: 1.2, spaceBetween: 8 },
          }}
          grabCursor={true}
        >
          {weeklyResults.map((week, index) => (
            <SwiperSlide key={index}>
              <div className="px-2 outline-none">
                <div className="bg-white p-4 rounded-3xl border border-[#007ACC40] transition duration-300 h-full flex flex-col">
                  <div className="bg-[#F7941D] py-3 mb-4 rounded-xl text-center">
                    <h2 className="text-xl font-extrabold text-white">
                      {week.weekLabel}
                    </h2>
                  </div>

                  <div className="grid gap-3 text-sm mt-auto">
                    <StatRow label="Answered" value={`${week.totalAnswered} Qus`} />
                    <StatRow
                      label="Correct"
                      value={`${week.totalCorrect} Ans`}
                      icon="/images/menuicon/up.png"
                    />
                    <StatRow
                      label="Wrong"
                      value={`${week.totalWrong} Ans`}
                      icon="/images/menuicon/down.png"
                    />
                    <StatRow
                      label="Unanswered"
                      value={`${week.totalUnanswered} Ans`}
                    />
                    <StatRow label="Total Score" value={week.totalScore} />
                    <StatRow
                      label="Accuracy"
                      value={
                        week.totalAnswered > 0
                          ? `${((week.totalCorrect / week.totalAnswered) * 100).toFixed(2)}%`
                          : "0%"
                      }
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

/* Small presentational row */
const StatRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center">
    <p className="font-semibold w-[60%] text-[#282c35]">{label}</p>
    <p className="text-lg w-[40%] flex justify-end items-center gap-2 text-[#282c35]">
      {icon && (
        <img
          className="w-5 h-5 ml-[-20px]"
          referrerPolicy="no-referrer"
          src={icon}
          alt={`${label} icon`}
        />
      )}
      {value}
    </p>
  </div>
);

/* Group results by week (keeps your original logic) */
const groupResultsByWeek = (results) => {
  const weeksMap = new Map();

  const startDayFor = (d) =>
    d <= 7 ? 1 : d <= 14 ? 8 : d <= 21 ? 15 : d <= 28 ? 22 : 29;

  const today = new Date();
  const currentMonthStr = format(today, "MMM");
  const currentStartDay = startDayFor(today.getDate());
  const lastDayOfCurrent = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const currentWeekLabel =
    currentStartDay === 29
      ? `${currentMonthStr} 29 - ${lastDayOfCurrent}`
      : `${currentMonthStr} ${currentStartDay} - ${
          currentStartDay === 1
            ? 7
            : currentStartDay === 8
            ? 14
            : currentStartDay === 15
            ? 21
            : 28
        }`;

  results.forEach((test) => {
    if (!test.createdAt) return;

    const dt = new Date(test.createdAt);
    const y = dt.getFullYear();
    const mIdx = dt.getMonth();
    const monthStr = format(dt, "MMM");

    const startDay = startDayFor(dt.getDate());
    const endDay =
      startDay === 1
        ? 7
        : startDay === 8
        ? 14
        : startDay === 15
        ? 21
        : startDay === 22
        ? 28
        : new Date(y, mIdx + 1, 0).getDate();

    const weekLabel = `${monthStr} ${startDay} - ${endDay}`;
    const weekStartDate = new Date(y, mIdx, startDay);

    if (!weeksMap.has(weekLabel)) {
      weeksMap.set(weekLabel, {
        weekLabel,
        totalScore: 0,
        totalMarks: 0,
        totalAnswered: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalUnanswered: 0,
        isCurrent: weekLabel === currentWeekLabel,
        startTs: weekStartDate.getTime(),
      });
    }

    const bucket = weeksMap.get(weekLabel);
    bucket.totalScore += test.score || 0;
    bucket.totalMarks += test.totalMarks || 0;
    bucket.totalAnswered += test.answered || 0;
    bucket.totalCorrect += test.correct || 0;
    bucket.totalWrong += test.wrong || 0;
    bucket.totalUnanswered += test.unanswered || 0;
  });

  return Array.from(weeksMap.values()).sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (b.isCurrent && !a.isCurrent) return 1;
    return b.startTs - a.startTs;
  });
};
