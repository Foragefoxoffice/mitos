import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CommonLoader from "../../../../components/commonLoader";

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`https://mitoslearning.in/api/news/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNews();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CommonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error: {error}</div>
        <Link to="/user/news" className="mt-4 btn inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </Link>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-gray-500 bg-gray-50 rounded-lg">
          News article not found
        </div>
        <Link to="/user/news" className="mt-4 btn inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/user/news"
          className="btn inline-flex items-center"
          style={{ display: "inline-flex" }}
        >
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </Link>
      </div>

      <article className="bg-white rounded-xl shadow-md overflow-hidden">
        {news.image && (
          <div className="h-96 overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
                referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Image+Not+Available";
              }}
            />
          </div>
        )}

        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
            <p className="text-gray-500 text-sm">
              Published on {formatDate(news.createdAt)}
            </p>
          </div>

          <div
            className="prose max-w-none mt-6"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </article>
    </div>
  );
}
