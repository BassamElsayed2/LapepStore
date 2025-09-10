/**
 * Validation utilities for guest checkout form
 */

export interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Validates customer data for guest checkout
 */
export function validateCustomerData(data: CustomerData): ValidationErrors {
  const errors: ValidationErrors = {};

  // First Name validation
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
  }

  // Last Name validation
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
  }

  // Phone validation (Egyptian format + international)
  const phoneRegex = /^(\+?2)?01[0-9]{9}$|^\+?[1-9]\d{1,14}$/;
  if (!data.phone || !phoneRegex.test(data.phone.replace(/\s+/g, ""))) {
    errors.phone = "Please enter a valid phone number";
  }

  // Email validation (optional but must be valid if provided)
  if (data.email && data.email.trim()) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  // Street Address validation
  if (!data.streetAddress || data.streetAddress.trim().length < 5) {
    errors.streetAddress = "Street address must be at least 5 characters long";
  }

  // City validation
  if (!data.city || data.city.trim().length < 2) {
    errors.city = "City must be at least 2 characters long";
  }

  // State validation
  if (!data.state || data.state.trim().length < 2) {
    errors.state = "State/Governorate must be at least 2 characters long";
  }

  // Postcode validation
  if (!data.postcode || data.postcode.trim().length < 3) {
    errors.postcode = "Postal code must be at least 3 characters long";
  }

  return errors;
}

/**
 * Checks if there are any validation errors
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Sanitizes customer data by trimming whitespace
 */
export function sanitizeCustomerData(data: CustomerData): CustomerData {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phone: data.phone.replace(/\s+/g, ""), // Remove all whitespace from phone
    email: data.email.trim(),
    streetAddress: data.streetAddress.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    postcode: data.postcode.trim(),
  };
}

/**
 * Formats phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // If it's an Egyptian number, format it nicely
  if (cleaned.match(/^(\+?2)?01[0-9]{9}$/)) {
    const digits = cleaned.replace(/^\+?2?/, "");
    return `+2 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return cleaned;
}

/**
 * Creates initial empty customer data
 */
export function createEmptyCustomerData(): CustomerData {
  return {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    postcode: "",
  };
}
