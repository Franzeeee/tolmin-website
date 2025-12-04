'use client'

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image';
import Loading from '@/components/Loading';
import axios from 'axios';

interface News {
  _id: string;
  title: string;
  description: string;
  image: string;
  content: string;
  publishedAt: Date;
  source?: "facebook" | "website";
}

export default function Page() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<News[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadAllNews();
  }, []);

  const loadAllNews = async () => {
    try {
      setLoading(true);

      // Fetch website news
      const websiteRes = await axios.get('/api/news');
      const websiteNews: News[] = websiteRes.data.map((n: News) => ({
        ...n,
        source: "website"
      }));

      // Fetch Facebook posts
      const fbRes = await fetch("https://graph.facebook.com/v19.0/246298295547553/posts?fields=id,message,created_time,full_picture&access_token=EAAZASw9eWtiYBQFszCz9r44eb3v2gAxID4ZCKqgXOMcc1qLRA1rmYI7HFrpAbeMKN3zfWCsOFllcFTvNZBHHLfooKb0uTCseHSZAeaunZAZAIrWZBykNk83b5Y9iTGbKNhZB2bRMUyMOHuchSk8Q04Xgtwvt5O7SFgqBisTZAc5SFHEJXB6h4mOGxMO5ZBZCOdzLV4IIxGHK8Y562NtVyXWhDcZD");
      const fbJson = await fbRes.json();

      const fbPosts: News[] = ((fbJson?.data as Array<{
        id?: string;
        message?: string;
        created_time?: string;
        full_picture?: string;
      }>) || []).map((post, index) => {
        const msg = post.message ?? "";
        const [title, ...bodyParts] = msg.split("\n");
        const body = bodyParts.join("\n") || "";

        return {
          _id: post.id ?? `fb-${index}`,
          title: title || "(no title)",
          description: body,
          image: post.full_picture ?? "/news.png",
          content: msg,
          publishedAt: post.created_time ? new Date(post.created_time) : new Date(),
          source: "facebook",
        };
      });

      // Merge + sort by date
      const merged = [...websiteNews, ...fbPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      setData(merged);
    } catch (err) {
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Featured & latest sorting
  const featured = data.length > 0 ? data[0] : undefined;
  const latestNews = data.slice(1);

  // Pagination
  const totalPages = Math.ceil(latestNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = latestNews.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="w-full bg-gradient-to-r from-black via-red-700 to-black flex flex-col items-center justify-center relative overflow-hidden">
        <MainNav />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black opacity-60 pointer-events-none" />
        <div className="relative mt-20 z-10 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase mb-4 text-center drop-shadow-lg"
          >
            Novice
          </motion.h1>
        </div>
      </header>

      {loading && <Loading />}

      <main className="w-full h-fit max-w-[70rem] bg-gray-50 border-t-4 border-red-600 mx-auto">

        {/* FEATURED */}
        {featured && (
          <section className="w-full px-5 py-6 border-b border-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="w-full aspect-[16/9] relative">
                <Image
                  src={featured.image || '/news.png'}
                  alt={featured.title}
                  fill
                  className="object-cover rounded-md"
                  priority
                />
              </div>

              <div className="flex flex-col justify-start items-start">
                <span className="text-xs font-bold px-2 py-1 bg-red-600 text-white rounded mb-2">
                  {featured.source === "facebook" ? "Facebook" : "Website News"}
                </span>

                <span className="text-sm text-red-500 font-medium mb-1">
                  NK Tolmin • {formatDate(featured.publishedAt)}
                </span>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {featured.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {featured.description || <em className="text-gray-400">No description available.</em>}
                </p>

                <a href={`novice/${featured._id}`} className="text-sm text-red-600 mt-3 hover:underline">
                  Preberi več
                </a>
              </div>
            </div>
          </section>
        )}

        {/* LATEST NEWS */}
        <section className="w-full px-5 pt-6 pb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-5">Latest News</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {paginatedNews.length > 0 ? (
              paginatedNews.map((news, i) => (
                <div key={i} className="bg-white overflow-hidden border border-gray-200">

                  {/* Image */}
                  <div className="relative">
                    <Image
                      src={news.image || '/news.png'}
                      alt={news.title}
                      className="w-full h-40 object-cover"
                      width={400}
                      height={300}
                    />

                    {/* Source Badge */}
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {news.source === "facebook" ? "Facebook" : "Website"}
                    </span>
                  </div>

                  <div className="p-3">
                    <span className="text-xs text-gray-500 block mb-1">
                      NK Tolmin • {formatDate(news.publishedAt)}
                    </span>

                    <h4 className="text-md font-semibold text-gray-700 leading-snug mb-1">
                      {news.title}
                    </h4>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {news.description || <em className="text-gray-400">No description available.</em>}
                    </p>

                    <a
                      href={`/novice/${news._id}`}
                      className="inline-block mt-2 text-sm text-red-600 hover:underline font-medium"
                    >
                      Preberi več
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No latest news.
              </div>
            )}
          </div>
        </section>

        {/* PAGINATION */}
        {totalPages > 1 && (
            <div className="flex justify-center pb-10">
            <nav className="inline-flex items-center space-x-1 text-sm">
              <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700 disabled:text-gray-400"
              >
              &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`px-3 py-1 border border-gray-300 rounded text-gray-700 ${
                currentPage === idx + 1
                  ? 'bg-red-600 text-white'
                  : 'hover:bg-gray-100'
                }`}
              >
                {idx + 1}
              </button>
              ))}

              <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700 disabled:text-gray-400"
              >
              &raquo;
              </button>
            </nav>
            </div>
        )}
      </main>
    </div>
  );
}

// Helper function
function formatDate(date: Date | string) {
  if (!date) return '';
  const published = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - published.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays >= 1) {
    return published.toLocaleDateString('sl-SI', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } else if (diffHours >= 1) {
    return `${diffHours} h nazaj`;
  } else {
    return `${diffMins} min nazaj`;
  }
}
