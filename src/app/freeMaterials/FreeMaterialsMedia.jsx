// src/pages/FreeMaterialsMedia.jsx
import React, { useEffect, useState } from "react";
import { fetchFreeMaterialsByChapter } from "../../utils/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    IoArrowBack,
    IoChevronForward,
    IoFolderOpenOutline,
    IoDocumentTextOutline,
    IoPlayCircleOutline
} from "react-icons/io5";

const FreeMaterialsMedia = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chapterId } = useParams();

    const chapterName = location.state?.chapterName || "Chapter";
    const subjectName = location.state?.subjectName || "Subject";

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMaterials = async () => {
        try {
            setLoading(true);
            const data = await fetchFreeMaterialsByChapter(chapterId);
            setMaterials(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching materials:", err);
            setMaterials([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMaterials();
    }, [chapterId]);

    const openMaterial = (item) => {
        const fileUrl = item.fileUrl || item.videoUrl;

        if (!fileUrl) return;

        // PDF handling
        if (item.type === "PDF" || fileUrl.endsWith(".pdf")) {
            window.open(fileUrl, "_blank");
            return;
        }

        // Video handling
        if (item.type === "VIDEO" || item.videoUrl) {
            window.open(fileUrl, "_blank");
            return;
        }
    };

    const getIcon = (item) => {
        if (item.type === "PDF" || item.fileUrl?.endsWith(".pdf"))
            return <IoDocumentTextOutline size={26} className="text-blue-600" />;

        if (item.type === "VIDEO" || item.videoUrl)
            return <IoPlayCircleOutline size={28} className="text-red-500" />;

        return <IoDocumentTextOutline size={26} className="text-gray-600" />;
    };

    return (
        <div className="min-h-screen bg-blue-50">
            {/* HEADER */}
            <div className="flex items-center px-4 py-3 bg-white border-b border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 mr-3 hover:bg-gray-100 rounded-full"
                >
                    <IoArrowBack size={22} className="text-gray-800" />
                </button>

                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900">{chapterName}</h1>
                    <p className="text-xs text-gray-500">{subjectName}</p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 max-w-3xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="flex flex-col justify-center items-center mt-20">
                        <IoFolderOpenOutline size={70} className="text-gray-300" />
                        <p className="text-gray-400 font-medium text-lg mt-3">
                            No materials available
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {materials.map((item) => (
                            <button
                                key={item.id || Math.random()}
                                onClick={() => openMaterial(item)}
                                className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    {/* ICON */}
                                    <div
                                        className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                            item.type === "VIDEO"
                                                ? "bg-red-100"
                                                : "bg-blue-100"
                                        }`}
                                    >
                                        {getIcon(item)}
                                    </div>

                                    {/* TEXT */}
                                    <div className="text-left">
                                        <p className="text-gray-800 font-semibold text-base">
                                            {item.title || item.name}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {item.type === "VIDEO" ? "Video Class" : "PDF Document"}
                                        </p>
                                    </div>
                                </div>

                                <IoChevronForward size={22} className="text-gray-400" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeMaterialsMedia;
