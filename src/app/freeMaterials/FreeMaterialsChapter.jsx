import React, { useEffect, useState } from "react";
import { fetchChaptersBySubject } from "../../utils/api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
    IoArrowBack,
    IoChevronForward,
    IoFolderOpenOutline,
    IoBook,
} from "react-icons/io5";

const FreeMaterialsChapter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { subjectId } = useParams();

    const subjectName = location.state?.subjectName || "Subject";

    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadChapters = async () => {
        try {
            setLoading(true);
            const data = await fetchChaptersBySubject(subjectId);
            setChapters(data);
        } catch (error) {
            console.error("Error fetching chapters:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChapters();
    }, [subjectId]);

    const colors = [
        { bg: "from-blue-500 to-cyan-500" },
        { bg: "from-purple-500 to-pink-500" },
        { bg: "from-indigo-500 to-blue-500" },
        { bg: "from-emerald-500 to-teal-500" },
        { bg: "from-orange-500 to-red-500" },
    ];

    return (
        <div className="min-h-screen">
            {/* HEADER */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 rounded-xl shadow-sm">
                <div className="flex items-center px-4  py-4 ">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                    >
                        <IoArrowBack size={24} className="text-gray-700 group-hover:text-blue-600" />
                    </button>

                    <div className="flex-1 ml-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <IoBook size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                                    {subjectName}
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500 font-medium">Chapters & Topics</p>
                            </div>
                        </div>
                    </div>

                    {/* Chapter count */}
                    <div className="ml-4 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-semibold">
                        {chapters.length} Chapters
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="px-0 pb-0 pt-6">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24">
                        <div className="relative w-16 h-16 mb-4">
                            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                        </div>
                        <p className="text-gray-500 font-medium">Loading chapters...</p>
                    </div>
                ) : chapters.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-24">
                        <div className="p-6 bg-white rounded-3xl mb-4 shadow-sm">
                            <IoFolderOpenOutline size={80} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-semibold text-lg">No chapters available</p>
                        <p className="text-gray-400 text-sm mt-2">Check back soon for new content</p>
                    </div>
                ) : (
                    <>
                        {/* Title */}
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Study Chapters
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base">
                                Select a chapter to explore materials
                            </p>
                        </div>

                        {/* DESKTOP GRID / MOBILE STACK */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {chapters.map((item, index) => {
                                const color = colors[index % colors.length];

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            navigate(`/user/free-materials/chapter/${item.id}`, {
                                                state: {
                                                    chapterName: item.name,
                                                    subjectName: subjectName,
                                                },
                                            })
                                        }
                                        className="group relative overflow-hidden bg-white rounded-2xl p-5 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 text-left"
                                    >
                                        {/* Hover background animation */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                        ></div>

                                        <div className="relative z-10 flex items-center">
                                            {/* Number Box */}
                                            <div
                                                className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}
                                            >
                                                <span className="text-white font-bold text-lg md:text-xl">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 ml-4">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Tap to view materials
                                                </p>
                                            </div>

                                            {/* Chevron */}
                                            <div className="ml-4 p-2 bg-gray-100 group-hover:bg-blue-100 rounded-lg transition-colors hidden sm:block">
                                                <IoChevronForward
                                                    size={20}
                                                    className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FreeMaterialsChapter;
