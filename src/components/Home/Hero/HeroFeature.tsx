import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title_en: "Free Shipping",
    title_ar: "الشحن مجاني",
    description_en: "For all orders $200",
    description_ar: "لجميع الطلبات 200 ج.م",
  },
  {
    img: "/images/icons/icon-02.svg",
    title_en: "1 & 1 Returns",
    title_ar: "الإسترجاع والإستبدال",
    description_en: "Cancellation after 1 day",
    description_ar: "الإلغاء بعد يوم واحد",
  },
  {
    img: "/images/icons/icon-03.svg",
    title_en: "100% Secure Payments",
    title_ar: "الدفع الآمن 100%",
    description_en: "Gurantee secure payments",
    description_ar: "الدفع الآمن 100%",
  },
  {
    img: "/images/icons/icon-04.svg",
    title_en: "24/7 Dedicated Support",
    title_ar: "الدعم الفني 24/7",
    description_en: "Anywhere & anytime",
    description_ar: "في أي وقت وفي أي مكان",
  },
];

const HeroFeature = () => {
  const locale = useLocale();
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">
                {locale === "en" ? item.title_en : item.title_ar}
              </h3>
              <p className="text-sm">
                {locale === "en" ? item.description_en : item.description_ar}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
