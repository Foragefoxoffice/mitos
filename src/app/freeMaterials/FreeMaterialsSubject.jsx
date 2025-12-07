import React, { useEffect, useState } from "react";
import { fetchSubjects } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { IoBookOutline, IoChevronForward, IoLibraryOutline, IoSparkles } from "react-icons/io5";

const FreeMaterialsSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const data = await fetchSubjects();
            setSubjects(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    const colors = ["from-blue-500 to-blue-600", "from-purple-500 to-purple-600", "from-indigo-500 to-indigo-600", "from-cyan-500 to-cyan-600"];

    return (
        <div className=" md:px-6 ">
            <div className=" mx-auto">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <IoSparkles size={32} className="text-blue-600" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Free Materials</h1>
                    </div>
                    <p className="text-gray-600 text-lg ml-11">Explore comprehensive study resources for every subject</p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center mt-20">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {subjects.length === 0 ? (
                            <div className="flex flex-col justify-center items-center py-16 bg-white rounded-2xl border border-gray-100">
                                <IoLibraryOutline size={80} className="text-gray-200 mb-4" />
                                <p className="text-gray-400 font-semibold text-lg">No subjects available yet</p>
                                <p className="text-gray-400 text-sm mt-1">Check back soon for new content</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {subjects.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            navigate(`/user/free-materials/subject/${item.id}`, {
                                                state: { subjectName: item.name },
                                            })
                                        }
                                        className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 text-left"
                                    >
                                        {/* Background gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                                                    <IoBookOutline size={28} className="text-white" />
                                                </div>
                                                <IoChevronForward size={24} className="text-gray-300 group-hover:text-blue-600 transition-colors translate-x-1 group-hover:translate-x-2 duration-300" />
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-gray-500 text-sm">Tap to explore chapters</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeMaterialsSubject;