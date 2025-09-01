"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PaymentMethodProps {
  selectedPayment: string;
  onPaymentChange: (method: string) => void;
}

const PaymentMethod = ({
  selectedPayment,
  onPaymentChange,
}: PaymentMethodProps) => {
  const t = useTranslations("checkout");

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">{t("paymentMethod")}</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {/* Cash on Delivery - الخيار الوحيد المتاح */}
          <label
            htmlFor="cod"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="cod"
                value="cod"
                className="sr-only"
                checked={selectedPayment === "cod"}
                onChange={() => onPaymentChange("cod")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedPayment === "cod"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                selectedPayment === "cod"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="ps-2.5 pl-2">
                  <Image
                    src="/images/checkout/cash.svg"
                    alt="cash"
                    width={21}
                    height={21}
                  />
                </div>

                <div className="border-s border-gray-4 ps-2.5">
                  <p>{t("cashOnDelivery")}</p>
                </div>
              </div>
            </div>
          </label>

          {/* معلومات إضافية حول الدفع عند الاستلام */}
          <div className="mt-3 p-4 bg-gray-1 rounded-md border border-gray-3">
            <p className="text-sm text-dark-4">
              {selectedPayment === "cod" && (
                <span>
                  ستقوم بدفع قيمة الطلب نقداً عند استلام المنتجات من المندوب.
                  يرجى التأكد من توفر المبلغ كاملاً.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
