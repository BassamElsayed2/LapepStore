import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const CustomSelect = ({
  options,
  isLoading = false,
}: {
  options?: any[];
  isLoading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options?.[0]);
  const router = useRouter();
  const locale = useLocale();

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    toggleDropdown();

    // Navigate to shop page with category filter
    if (option.value !== "0") {
      router.push(`/${locale}/shop?category=${option.value}`);
    } else {
      router.push(`/${locale}/shop`);
    }
  };

  // Update selected option when options change
  useEffect(() => {
    if (options && options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: any) {
      if (!event.target.closest(".dropdown-content")) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="dropdown-content custom-select relative hidden lg:block"
      style={{ width: "200px" }}
    >
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={isLoading ? undefined : toggleDropdown}
      >
        {isLoading ? "جاري التحميل..." : selectedOption.label}
      </div>
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options?.slice(1, -1).map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${
              selectedOption === option ? "same-as-selected" : ""
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
