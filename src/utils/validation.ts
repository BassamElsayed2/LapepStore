/**
 * Validation utilities for forms
 */

// List of common fake/disposable email domains
const FAKE_EMAIL_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'trashmail.com',
  'yopmail.com',
  'fakeinbox.com',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'spam4.me',
  'example.com',
  'test.com',
];

/**
 * Validate if email is real (not fake/disposable)
 */
export function isRealEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Extract domain
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  // Check if domain is in fake list
  if (FAKE_EMAIL_DOMAINS.includes(domain)) return false;

  // Check for suspicious patterns
  if (domain.includes('temp') || domain.includes('disposable') || domain.includes('fake')) {
    return false;
  }

  return true;
}

/**
 * Validate Egyptian phone number
 * Accepts formats:
 * - 01xxxxxxxxx (11 digits starting with 01)
 * - +2001xxxxxxxxx (with country code)
 * - 002001xxxxxxxxx (with international prefix)
 */
export function isEgyptianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Check different formats
  const patterns = [
    /^01[0125]\d{8}$/, // 01xxxxxxxxx (11 digits)
    /^\+2001[0125]\d{8}$/, // +2001xxxxxxxxx
    /^002001[0125]\d{8}$/, // 002001xxxxxxxxx
  ];

  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Normalize Egyptian phone number to standard format (01xxxxxxxxx)
 */
export function normalizeEgyptianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Remove country code prefixes
  if (cleaned.startsWith('+20')) {
    return '0' + cleaned.substring(3);
  }
  if (cleaned.startsWith('0020')) {
    return '0' + cleaned.substring(4);
  }
  if (cleaned.startsWith('20')) {
    return '0' + cleaned.substring(2);
  }

  return cleaned;
}

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  FAIR = 'fair',
  GOOD = 'good',
  STRONG = 'strong',
}

/**
 * Password validation result
 */
export interface PasswordValidation {
  isValid: boolean;
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: {
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  message: string;
}

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character (!@#$%^&*(),.?":{}|<>)
 */
export function validatePassword(password: string): PasswordValidation {
  const feedback = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Calculate score (0-100)
  let score = 0;
  if (feedback.hasMinLength) score += 20;
  if (feedback.hasUpperCase) score += 20;
  if (feedback.hasLowerCase) score += 20;
  if (feedback.hasNumber) score += 20;
  if (feedback.hasSpecialChar) score += 20;

  // Determine strength
  let strength: PasswordStrength;
  if (score < 40) {
    strength = PasswordStrength.WEAK;
  } else if (score < 60) {
    strength = PasswordStrength.FAIR;
  } else if (score < 80) {
    strength = PasswordStrength.GOOD;
  } else {
    strength = PasswordStrength.STRONG;
  }

  // Check if valid (all requirements met)
  const isValid = Object.values(feedback).every(Boolean);

  // Generate message
  const missing: string[] = [];
  if (!feedback.hasMinLength) missing.push('8 characters');
  if (!feedback.hasUpperCase) missing.push('uppercase letter');
  if (!feedback.hasLowerCase) missing.push('lowercase letter');
  if (!feedback.hasNumber) missing.push('number');
  if (!feedback.hasSpecialChar) missing.push('special character');

  let message = '';
  if (!isValid) {
    message = `Password must contain: ${missing.join(', ')}`;
  } else {
    message = 'Password is strong';
  }

  return {
    isValid,
    strength,
    score,
    feedback,
    message,
  };
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.WEAK:
      return '#ef4444'; // red
    case PasswordStrength.FAIR:
      return '#f59e0b'; // orange
    case PasswordStrength.GOOD:
      return '#3b82f6'; // blue
    case PasswordStrength.STRONG:
      return '#10b981'; // green
    default:
      return '#9ca3af'; // gray
  }
}

/**
 * Get password strength text
 */
export function getPasswordStrengthText(
  strength: PasswordStrength,
  locale: string = 'en'
): string {
  const texts = {
    en: {
      [PasswordStrength.WEAK]: 'Weak',
      [PasswordStrength.FAIR]: 'Fair',
      [PasswordStrength.GOOD]: 'Good',
      [PasswordStrength.STRONG]: 'Strong',
    },
    ar: {
      [PasswordStrength.WEAK]: 'ضعيفة',
      [PasswordStrength.FAIR]: 'مقبولة',
      [PasswordStrength.GOOD]: 'جيدة',
      [PasswordStrength.STRONG]: 'قوية',
    },
  };

  return texts[locale as 'en' | 'ar']?.[strength] || texts.en[strength];
}

/**
 * Validate if identifier is email or phone
 */
export function identifyLoginType(identifier: string): 'email' | 'phone' | null {
  if (!identifier || typeof identifier !== 'string') return null;

  // Check if it's an email
  if (identifier.includes('@')) {
    return 'email';
  }

  // Check if it's a phone number
  if (isEgyptianPhone(identifier)) {
    return 'phone';
  }

  return null;
}

/**
 * Customer data type for checkout
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

/**
 * Validation errors type
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Create empty customer data object
 */
export function createEmptyCustomerData(): CustomerData {
  return {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    postcode: '',
  };
}

/**
 * Sanitize customer data by trimming whitespace
 */
export function sanitizeCustomerData(data: CustomerData): CustomerData {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    streetAddress: data.streetAddress.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    postcode: data.postcode.trim(),
  };
}

/**
 * Validate customer data
 */
export function validateCustomerData(data: CustomerData): ValidationErrors {
  const errors: ValidationErrors = {};

  // First name validation
  if (!data.firstName || data.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Last name validation
  if (!data.lastName || data.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Phone validation
  if (!data.phone) {
    errors.phone = 'Phone number is required';
  } else if (!isEgyptianPhone(data.phone)) {
    errors.phone = 'Please enter a valid Egyptian phone number';
  }

  // Email validation (optional but must be valid if provided)
  if (data.email && !isRealEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Street address validation
  if (!data.streetAddress || data.streetAddress.length < 5) {
    errors.streetAddress = 'Street address must be at least 5 characters';
  }

  // City validation
  if (!data.city || data.city.length < 2) {
    errors.city = 'City is required';
  }

  // State validation
  if (!data.state || data.state.length < 2) {
    errors.state = 'State/Region is required';
  }

  // Postcode validation
  if (!data.postcode || data.postcode.length < 4) {
    errors.postcode = 'Postcode must be at least 4 characters';
  }

  return errors;
}

/**
 * Check if validation errors object has any errors
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}