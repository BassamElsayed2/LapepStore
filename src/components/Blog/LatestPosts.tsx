"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { BlogData } from "@/types/blogItem";
import { useLocale } from "next-intl";

const LatestPosts = ({ blogs }: { blogs?: BlogData[] }) => {
  const locale = useLocale();
  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Recent Posts</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* <!-- post item --> */}

          {blogs?.slice(0, 3).map((blog, key) => {
            const displayTitle =
              locale === "ar" ? blog.title_ar : blog.title_en;
            const displayDate = blog.created_at
              ? new Date(blog.created_at).toLocaleDateString(
                  locale === "ar" ? "ar-SA" : "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";
            const displayImage =
              blog.images && blog.images.length > 0
                ? blog.images[0]
                : "/images/blog/blog-01.jpg";

            return (
              <div className="flex items-center gap-4" key={key}>
                <Link
                  href={`/news-details?id=${blog.id}`}
                  className="max-w-[110px] w-full rounded-[10px] overflow-hidden"
                >
                  <Image
                    src={displayImage}
                    alt={displayTitle}
                    className="rounded-[10px] w-full"
                    width={110}
                    height={80}
                  />
                </Link>

                <div>
                  <h3 className="text-dark leading-[22px] ease-out duration-200 mb-1.5 hover:text-blue">
                    <Link href={`/news-details?id=${blog.id}`}>
                      {displayTitle}
                    </Link>
                  </h3>

                  <span className="flex items-center gap-3">
                    <a
                      href="#"
                      className="text-custom-xs ease-out duration-200 hover:text-blue"
                    >
                      {displayDate}
                    </a>

                    {/* <!-- divider --> */}
                    <span className="block w-px h-4 bg-gray-4"></span>

                    {blog.author && (
                      <a
                        href="#"
                        className="text-custom-xs ease-out duration-200 hover:text-blue"
                      >
                        {blog.author}
                      </a>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestPosts;
