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
  id?: number;
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishedAt: Date;
  source?: "website" | "facebook";
  fbLink?: string;
}

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
}


export default function Page() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [article, setArticle] = React.useState<News | null>(null);
  const [suggestions, setSuggestions] = React.useState<News[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch main article (website)
        const response = await axios.get(`/api/news/${id}`);
        const mainArticle = { ...response.data, source: "website" };
        setArticle(mainArticle);

        // Fetch all website news
        const websiteRes = await axios.get("/api/news");
        const websiteNews: News[] = websiteRes.data.map((n: News) => ({
          ...n,
          source: "website",
        }));

        // Fetch Facebook posts
        const fbRes = await fetch(
          "https://graph.facebook.com/v19.0/246298295547553/posts?fields=id,message,created_time,full_picture&access_token=EAAZASw9eWtiYBQFszCz9r44eb3v2gAxID4ZCKqgXOMcc1qLRA1rmYI7HFrpAbeMKN3zfWCsOFllcFTvNZBHHLfooKb0uTCseHSZAeaunZAZAIrWZBykNk83b5Y9iTGbKNhZB2bRMUyMOHuchSk8Q04Xgtwvt5O7SFgqBisTZAc5SFHEJXB6h4mOGxMO5ZBZCOdzLV4IIxGHK8Y562NtVyXWhDcZD"
        );

        const fbJson = await fbRes.json();

        const fbPosts: News[] = (fbJson.data || []).map((post: FacebookPost) => {
          const msg = post.message ?? "";
          const [title, ...bodyParts] = msg.split("\n");
          const body = bodyParts.join("\n");
          const [pageId, postId] = post.id.split("_");

          return {
            _id: post.id,
            title: title || "(ni naslova)",
            description: body,
            content: msg,
            image: post.full_picture ?? "/news.png",
            publishedAt: new Date(post.created_time),
            source: "facebook",
            fbLink: `https://www.facebook.com/${pageId}/posts/${postId}`,
          };
        });

        // MERGE + REMOVE DUPLICATE IDs
        const allNews: News[] = [...websiteNews, ...fbPosts].filter(
          (n) => n._id !== id // remove current article
        );

        // SORT suggestions by date
        const sortedSuggestions = allNews.sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        setSuggestions(sortedSuggestions.slice(0, 5));

      } catch (error) {
        console.error("Error fetching news:", error);
        window.location.href = "/404";
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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
            Novice - {article?.title ?? 'Loading...'}
          </motion.h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full h-fit max-w-[95rem] mx-auto bg-gray-50 border-t-4 border-red-600">
        <section className="w-full px-4 pb-12 flex flex-col lg:flex-row gap-8 justify-center md:mt-4 lg:mt-6">
          
          {/* MAIN ARTICLE */}
          {loading ? (
            <Loading />
          ) : (
            <article className="w-full lg:w-2/3 p-4 flex flex-col items-center">
              <div className="relative w-full h-56 sm:h-72 md:h-96 xl:h-[500px] overflow-hidden">
                <Image
                  src={article?.image || '/news.png'}
                  alt={article?.title || 'News image'}
                  className="object-cover"
                  fill
                  priority
                />
              </div>

              <div className="w-full mt-6">
                <span className="text-xs font-bold px-2 py-1 bg-red-600 text-white rounded">
                  {article?.source === "facebook" ? "Facebook" : "Website"}
                </span>

                <h1 className="text-3xl font-bold mb-4 text-red-600 mt-4">
                  {article?.title}
                </h1>

                <p className="text-gray-500 mb-4 text-sm text-justify">
                  <span className="text-red-600">NK Tolmin</span> • {formatDate(article?.publishedAt ?? '')}
                </p>

                {/* FB CONTENT SHOULD NOT BE PARSED AS HTML */}
                <div
                  className="text-lg text-gray-800 mb-4 whitespace-pre-line"
                >
                  {article?.content}
                </div>

                {article?.source === "facebook" && article?.fbLink && (
                  <a
                    href={article.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-lg mt-4 inline-block"
                  >
                    Odpri originalni Facebook post →
                  </a>
                )}
              </div>
            </article>
          )}

          {/* SUGGESTIONS */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="text-xl font-bold border-b pb-2 text-red-600">Zadnje Novice</h2>

            <div className="grid gap-4">
              {suggestions.map((s) => (
                s.source === "facebook" ? (
                  // FACEBOOK SUGGESTION
                  <a
                    key={s._id}
                    href={s.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image src={s.image} alt={s.title} fill className="object-cover" />
                    </div>
                    <div className="p-2 flex flex-col justify-between py-4">
                      <h3 className="text-sm font-semibold text-blue-600">{s.title}</h3>
                      <span className="text-xs text-gray-500">Facebook • Odpri post</span>
                    </div>
                  </a>
                ) : (
                  // WEBSITE SUGGESTION
                  <Link
                    key={s._id}
                    href={`/novice/${s._id}`}
                    className="flex gap-4 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image src={s.image} alt={s.title} fill className="object-cover" />
                    </div>
                    <div className="p-2 flex flex-col justify-between py-4">
                      <h3 className="text-sm font-semibold text-red-500">{s.title}</h3>
                      <span className="text-xs text-gray-500">Preberi več</span>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </aside>

        </section>
      </main>
    </div>
  );
}

// DATE FORMATTER
function formatDate(date: Date | string) {
  if (!date) return '';
  const published = new Date(date);
  return published.toLocaleDateString('sl-SI', { day: 'numeric', month: 'short', year: 'numeric' });
}
