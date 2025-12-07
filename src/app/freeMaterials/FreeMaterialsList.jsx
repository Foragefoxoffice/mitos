// src/pages/FreeMaterialsList.jsx
import React, { useEffect, useState } from "react";
import { fetchFreeMaterialsByChapter } from "../../utils/api";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
    IoArrowBack,
    IoDocumentTextOutline,
    IoEyeOutline,
    IoDownloadOutline,
    IoDocumentsOutline,
    IoCheckmark
} from "react-icons/io5";

const FreeMaterialsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chapterId } = useParams();

    const chapterName = location.state?.chapterName || "Chapter";
    const subjectName = location.state?.subjectName || "Subject";

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const BASE_URL = "https://mitoslearning.in";

    const loadMaterials = async () => {
        try {
            setLoading(true);
            const data = await fetchFreeMaterialsByChapter(chapterId);
            setMaterials(data);
        } catch (err) {
            console.error("Error fetching materials:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMaterials();
    }, [chapterId]);

    const getFileUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const handleView = (item) => {
        window.open(getFileUrl(item.fileUrl), "_blank");
    };

   const handleDownload = async (item) => {
    try {
        setDownloadingId(item.id);

        const fileUrl = getFileUrl(item.fileUrl);
        const fileName = item.title.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf";

        // Fetch the file as a blob to prevent browser from opening it
        const response = await fetch(fileUrl, { mode: "cors" });
        const blob = await response.blob();

        // Create a download link for the PDF blob
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);

        setTimeout(() => {
            setDownloadingId(null);
            setSuccessMessage("File downloaded successfully.");
            setShowSuccess(true);
        }, 600);

    } catch (err) {
        console.error("Download failed:", err);
        setDownloadingId(null);
    }
};

    return (
        <div className="min-h-screen ">
            {/* SUCCESS MODAL */}
            {showSuccess && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
                    <div className="bg-white w-80 md:w-96 rounded-2xl p-6 text-center shadow-xl animate-fadeIn">
                        <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                            <IoCheckmark size={36} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Success!</h2>
                        <p className="text-gray-600 mt-2">{successMessage}</p>

                        <button
                            onClick={() => setShowSuccess(false)}
                            className="mt-6 w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
                        >
                            Awesome
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white/80 rounded-xl backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="flex items-center px-4 py-4  mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <IoArrowBack size={24} className="text-gray-700" />
                    </button>

                    <div className="flex-1 ml-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                            {chapterName}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500">{subjectName}</p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="px-4 py-8 md:py-12 mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center mt-16">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="flex flex-col justify-center items-center mt-24">
                        <IoDocumentsOutline size={80} className="text-gray-300" />
                        <p className="text-gray-500 text-lg font-medium mt-4">
                            No materials found
                        </p>
                    </div>
                ) : (
                    <>
                        {/* TITLE */}
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Free Study Materials
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base">
                                Tap a material to view or download
                            </p>
                        </div>

                        {/* MATERIAL GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                            {materials.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 group"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:scale-110 transition">
                                            <IoDocumentTextOutline size={24} className="text-blue-600" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm">PDF Document</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-3">
                                        <button
                                            onClick={() => handleView(item)}
                                            className="flex-1 flex items-center justify-center py-2.5 border border-blue-600 bg-blue-50 text-blue-600 rounded-xl gap-2 font-semibold hover:bg-blue-100 transition"
                                        >
                                            <IoEyeOutline size={20} />
                                            View
                                        </button>

                                        <button
                                            onClick={() => handleDownload(item)}
                                            disabled={downloadingId === item.id}
                                            className="flex-1 flex items-center justify-center py-2.5 bg-blue-600 text-white rounded-xl gap-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {downloadingId === item.id ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <IoDownloadOutline size={20} />
                                            )}
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FreeMaterialsList;
