"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
}

interface GuestCheckoutFormProps {
  customerData: CustomerData;
  onCustomerDataChange: (data: CustomerData) => void;
  errors: Record<string, string>;
}

const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({
  customerData,
  onCustomerDataChange,
  errors,
}) => {
  const t = useTranslations("checkout");
  const handleInputChange = (field: keyof CustomerData, value: string) => {
    onCustomerDataChange({
      ...customerData,
      [field]: value,
    });
  };

  const inputClasses = (fieldName: string) =>
    `rounded-md border ${
      errors[fieldName] ? "border-red-500" : "border-gray-3"
    } bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
      errors[fieldName] ? "focus:ring-red/20" : "focus:ring-blue/20"
    }`;

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <div className="border-b border-gray-3 pb-6 mb-6">
        <h3 className="font-medium text-xl text-dark">
          {t("customerInformation")}
        </h3>
        <p className="text-sm text-dark-5 mt-2">
          {t("customerInfoDescription")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2.5 font-medium text-dark"
            >
              {t("firstName")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={customerData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder={t("enterFirstName")}
              className={inputClasses("firstName")}
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block mb-2.5 font-medium text-dark"
            >
              {t("lastName")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={customerData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder={t("enterLastName")}
              className={inputClasses("lastName")}
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block mb-2.5 font-medium text-dark"
            >
              {t("phoneNumber")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder={t("enterPhoneNumber")}
              className={inputClasses("phone")}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2.5 font-medium text-dark"
            >
              {t("emailAddress")}{" "}
              <span className="text-gray-500">({t("optional")})</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={customerData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={t("enterEmail")}
              className={inputClasses("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label
            htmlFor="streetAddress"
            className="block mb-2.5 font-medium text-dark"
          >
            {t("streetAddress")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={customerData.streetAddress}
            onChange={(e) => handleInputChange("streetAddress", e.target.value)}
            placeholder={t("enterStreetAddress")}
            className={inputClasses("streetAddress")}
            required
          />
          {errors.streetAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block mb-2.5 font-medium text-dark"
            >
              {t("city")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={customerData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder={t("enterCity")}
              className={inputClasses("city")}
              required
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="block mb-2.5 font-medium text-dark"
            >
              {t("state")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={customerData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder={t("enterState")}
              className={inputClasses("state")}
              required
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="postcode"
              className="block mb-2.5 font-medium text-dark"
            >
              {t("postalCode")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={customerData.postcode}
              onChange={(e) => handleInputChange("postcode", e.target.value)}
              placeholder={t("enterPostalCode")}
              className={inputClasses("postcode")}
              required
            />
            {errors.postcode && (
              <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckoutForm;
