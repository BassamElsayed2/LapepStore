import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useLocale, useTranslations } from "next-intl";

const Contact = () => {
  const locale = useLocale();

  return (
    <>
      <Breadcrumb
        title={locale === "ar" ? "تواصل معنا" : "Contact Us"}
        pages={["contact"]}
      />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex justify-center items-center gap-7.5">
            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <div className="text-center">
                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4">
                  {locale === "ar"
                    ? "تواصل معنا مباشرة"
                    : "Contact Us Directly"}
                </h2>

                {/* Description */}
                <p className="text-base sm:text-lg text-dark-5 mb-8 max-w-2xl mx-auto">
                  {locale === "ar"
                    ? "نحن هنا للإجابة على استفساراتكم وخدمتكم. يمكنكم التواصل معنا مباشرة عبر الهاتف أو واتساب"
                    : "We're here to answer your questions and serve you. Contact us directly via phone or WhatsApp"}
                </p>

                {/* Contact Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  {/* Phone Button */}
                  <a
                    href="tel:+201270127380"
                    className="flex items-center gap-3 bg-[#92b18c] hover:bg-[#1d9350] text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto justify-center"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm opacity-90">
                        {locale === "ar" ? "اتصل الآن" : "Call Now"}
                      </p>
                      <p className="font-bold text-lg" dir="ltr">
                        +20 127 012 7380
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href="https://wa.me/201270127380"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1fb855] text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto justify-center"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm opacity-90">
                        {locale === "ar" ? "واتساب" : "WhatsApp"}
                      </p>
                      <p className="font-bold text-lg" dir="ltr">
                        +20 127 012 7380
                      </p>
                    </div>
                  </a>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-1 rounded-lg p-6 text-center">
                  <p className="text-dark-5 mb-2">
                    {locale === "ar"
                      ? "📞 فريق الدعم متاح للرد على استفساراتكم"
                      : "📞 Our support team is available to answer your questions"}
                  </p>
                  <p className="text-sm text-dark-4">
                    {locale === "ar"
                      ? "نسعد بخدمتكم في أي وقت"
                      : "We're happy to serve you anytime"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
