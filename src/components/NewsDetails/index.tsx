"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Breadcrumb from "../Common/Breadcrumb";
import { getBlogById } from "@/services/apiBlogs";
import { BlogData } from "@/types/blogItem";

const NewsDetails = () => {
  const searchParams = useSearchParams();
  const newsId = searchParams.get("id");
  const t = useTranslations("news");
  const locale = useLocale();
  const [newsItem, setNewsItem] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!newsId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getBlogById(newsId);
        setNewsItem(data);
      } catch (error) {
        console.error("Error fetching news item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [newsId]);

  if (loading) {
    return (
      <section className="py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!newsItem) {
    return (
      <>
        <Breadcrumb
          title={locale === "ar" ? "الخبر غير موجود" : "News Not Found"}
          pages={[
            locale === "ar" ? "الأخبار" : "News",
            locale === "ar" ? "غير موجود" : "Not Found",
          ]}
        />
        <section className="py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
              <h2 className="text-2xl font-semibold text-dark mb-4">
                {locale === "ar" ? "الخبر غير موجود" : "News Not Found"}
              </h2>
              <p className="text-dark-5">
                {locale === "ar"
                  ? "عذراً، الخبر المطلوب غير موجود أو تم حذفه."
                  : "Sorry, the requested news article was not found or has been removed."}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  const displayTitle = locale === "ar" ? newsItem.title_ar : newsItem.title_en;
  const displayContent =
    locale === "ar" ? newsItem.content_ar : newsItem.content_en;

  return (
    <>
      <Breadcrumb
        title={displayTitle}
        pages={[locale === "ar" ? "الأخبار" : "News", displayTitle]}
      />

      <section className="py-20 bg-gray-2">
        <div className="max-w-[870px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] overflow-hidden">
            {/* News Image */}
            {newsItem.images && newsItem.images.length > 0 && (
              <div className="w-full h-[400px] relative">
                <Image
                  src={newsItem.images[0]}
                  alt={displayTitle}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* News Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Date */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 1V3M11 1V3M2 7H14M3 5H13C13.5523 5 14 5.44772 14 6V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V6C2 5.44772 2.44772 5 3 5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {newsItem.created_at
                  ? new Date(newsItem.created_at).toLocaleDateString(
                      locale === "ar" ? "ar-SA" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : ""}
              </div>

              {/* Author */}
              {newsItem.author && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                      fill="currentColor"
                    />
                  </svg>
                  {newsItem.author}
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-dark mb-6">
                {displayTitle}
              </h1>

              {/* Content */}
              <div className="prose prose-lg max-w-none text-dark-5 leading-relaxed">
                {displayContent ? (
                  <div
                    className="space-y-4"
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                  />
                ) : (
                  <div className="space-y-4">
                    <p>
                      {locale === "ar"
                        ? "المحتوى غير متوفر حالياً."
                        : "Content is not available at the moment."}
                    </p>
                  </div>
                )}
              </div>

              {/* Back to News Button */}
              <div className="mt-8 pt-6 border-t border-gray-3">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-dark transition-colors"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.89775 4.10225C8.11742 3.88258 8.11742 3.52642 7.89775 3.30675C7.67808 3.08708 7.32192 3.08708 7.10225 3.30675L2.60225 7.80675C2.38258 8.02642 2.38258 8.38258 2.60225 8.60225L7.10225 13.1023C7.32192 13.3219 7.67808 13.3219 7.89775 13.1023C8.11742 12.8826 8.11742 12.5264 7.89775 12.3068L4.35825 8.76725H15C15.3107 8.76725 15.5625 8.51541 15.5625 8.20475C15.5625 7.89409 15.3107 7.64225 15 7.64225H4.35825L7.89775 4.10225Z"
                      fill=""
                    />
                  </svg>
                  {locale === "ar" ? "العودة للأخبار" : "Back to News"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsDetails;
