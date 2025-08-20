'use client'

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainNav from '@/components/layout/MainNav';
import Image from 'next/image'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Loading from '@/components/Loading';

interface News {
    id: number;
    _id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    publishedAt: Date;
}

export default function Page() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [article, setArticle] = React.useState<News | null>(null);
  const [suggestions, setSuggestions] = React.useState<Array<{ _id: string; title: string; image: string }>>([]);

  useEffect(() => {
    setLoading(true);
    const fetchNews = async () => {
        try {
            const response = await axios.get(`/api/news/${id}`);

            setArticle(response.data);
        } catch (error) {
            console.error("Error fetching news:", error);
            window.location.href = "/404";
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(`/api/news`);
            // Filter out the current article from suggestions
            setSuggestions(
                response.data.filter((news: { _id: string }) => news._id !== id)
            );
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    fetchNews();
    fetchSuggestions();
  }, [id]);


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <header className="w-screen max-h-[500px] h-screen grid grid-rows-[auto_1fr] bg-white landing-header md:max-h-[700px]  lg:max-h-[900px]">
        <MainNav />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 max-h-[500px] md:max-h-[700px]  lg:max-h-[900px]"
        >
          <source src="/tolmin-header.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-55 z-10 max-h-[500px] md:max-h-[700px] lg:max-h-[900px]" />
        <div className="flex items-end pb-2 justify-center h-screen max-h-[500px] lg:max-h-[900px] md:max-h-[700px]  z-20 relative overflow-hidden">
            <motion.h1
            initial={{ x: typeof window !== "undefined" && window.innerWidth < 640 ? '200vw' : '100vw' }}
            animate={{ x: typeof window !== "undefined" && window.innerWidth < 640 ? '-120vw' : '-60vw' }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 16,
              ease: "linear"
            }}
            className="text-9xl z-20 font-extrabold text-white opacity-60 header-text select-none text-nowrap pointer-events-none uppercase poppins"
            >
            Novice - {article?.title}
            </motion.h1>
        </div>
      </header>

      {/* MAIN SECTION */}
    <main className="w-full h-fit max-w-[95rem] mx-auto bg-gray-50 border-t-4 border-red-600">
      <section className="w-full px-4 pb-12 flex flex-col lg:flex-row gap-8 justify-center md:mt-4 lg:mt-6">
        
        {/* Main Article */}
        { loading ? <Loading /> : (
          <article className="w-full lg:w-2/3 p-4 flex flex-col items-center">
            <div className="relative w-full h-56 sm:h-72 md:h-96 xl:h-[500px] overflow-hidden">
              <Image 
                src={article?.image || '/zgodovina/p1.png'}
                alt="Example"
                className="object-cover"
                fill
                priority
              />
            </div>

            <div className="w-full mt-6">
              <h1 className="text-3xl font-bold mb-4 text-red-600">
                {article?.title || 'Loading...'}
              </h1>
              <p className=" text-gray-500 mb-4 text-sm text-justify">
                <span className='text-red-600'>NK Tolmin</span> • {formatDate(article?.publishedAt ?? '') || 'Loading...'}
              </p>
              <div
                className="text-lg text-gray-800 mb-4 text-justify"
                dangerouslySetInnerHTML={{ __html: article?.content || 'Loading...' }}
              />

              {/* <div className="relative w-full h-56 sm:h-72 md:h-96 xl:h-[500px] mt-6 overflow-hidden">
                <Image 
                  src={article?.image || '/zgodovina/p2.png'}
                  alt="Example"
                  className="object-cover"
                  fill
                  priority
                />
              </div> */}
            </div>
          </article>
        )}

        {/* Sidebar - Latest Articles */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-4">
          <h2 className="text-xl font-bold border-b pb-2 text-red-600">Latest Articles</h2>
          <div className="grid gap-4">
            {suggestions.slice(0, 5).map(article => (
              <Link 
                key={article._id} 
                href={`/novice/${article._id}`}
                className="flex gap-4 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image 
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 flex flex-col justify-between py-4">
                  <h3 className="text-sm font-semibold text-red-500">{article.title}</h3>
                  <span className="text-xs text-gray-500">Read more</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>

      </section>
    </main>
    </div>
  );
}

// Helper function for date formatting
function formatDate(date: Date | string) {
    if (!date) return '';
    const published = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - published.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    const formattedDate = published.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (diffDays >= 1) {
        return formattedDate;
    } else if (diffHours >= 1) {
        return `${diffHours}h ago • ${formattedDate}`;
    } else {
        return `${diffMins}min ago • ${formattedDate}`;
    }
}
