import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
  const year = new Date().getFullYear();
  const locale = useLocale();
  const t = useTranslations("footer");
  const commonT = useTranslations("common");

  return (
    <footer className="overflow-hidden">
      {/* <!-- footer bottom start --> */}
      <div className="py-5 xl:py-7.5 bg-gray-1 mt-5">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-dark font-medium">
              &copy; {year}. {t("allRightsReserved")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <p className="font-medium">{t("weAccept")}</p>

              <div className="flex flex-wrap items-center gap-6">
                {/* <a href="#" aria-label="payment system with visa card">
                  <Image
                    src="/images/payment/payment-01.svg"
                    alt="visa card"
                    width={66}
                    height={22}
                  />
                </a> */}
                {/* <a href="#" aria-label="payment system with paypal">
                  <Image
                    src="/images/payment/payment-02.svg"
                    alt="paypal"
                    width={18}
                    height={21}
                  />
                </a> */}
                <a href="#" aria-label="payment system with master card">
                  <Image
                    src="/images/payment/payment-03.svg"
                    alt="master card"
                    width={33}
                    height={24}
                  />
                </a>
                {/* <a href="#" aria-label="payment system with apple pay">
                  <Image
                    src="/images/payment/payment-04.svg"
                    alt="apple pay"
                    width={52.94}
                    height={22}
                  />
                </a>
                <a href="#" aria-label="payment system with google pay">
                  <Image
                    src="/images/payment/payment-05.svg"
                    alt="google pay"
                    width={56}
                    height={22}
                  />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- footer bottom end --> */}
    </footer>
  );
};

export default Footer;
