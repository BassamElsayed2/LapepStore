import React from "react";
import { TestimonialData } from "@/types/testimonial";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/app/i18n/navigation";

const SingleItem = ({ testimonial }: { testimonial: TestimonialData }) => {
  const locale = useLocale();
  const displayReview =
    locale === "ar"
      ? testimonial.message_ar || testimonial.message_en
      : testimonial.message_en || testimonial.message_ar;
  const displayName =
    locale === "ar"
      ? testimonial.name_ar || testimonial.name_en
      : testimonial.name_en || testimonial.name_ar;
  return (
    <div className="shadow-testimonial bg-white rounded-[10px] py-7.5 px-4 sm:px-8.5 m-1">
      <div className="flex items-center gap-1 mb-5">
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
      </div>

      <p className="text-dark mb-6">{displayReview}</p>

      <div className="flex items-center gap-4">
        <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
          <Image
            src={testimonial.image || "/images/users/user-01.jpg"}
            alt="author"
            className="w-12.5 h-12.5 rounded-full overflow-hidden"
            width={50}
            height={50}
          />
        </div>

        <div>
          <h3 className="font-medium text-dark">{displayName}</h3>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
