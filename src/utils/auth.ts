import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique GUID for user identification
 * @returns {string} A unique GUID string
 */
export const generateUserGuid = (): string => {
  return uuidv4();
};

/**
 * Password strength levels
 */
export enum PasswordStrength {
  VERY_WEAK = 0,
  WEAK = 1,
  FAIR = 2,
  GOOD = 3,
  STRONG = 4,
}

/**
 * Password validation result interface
 */
export interface PasswordValidation {
  isValid: boolean;
  strength: PasswordStrength;
  score: number;
  missingRequirements: string[];
  feedback: {
    ar: string;
    en: string;
  };
}

/**
 * Check if password meets all requirements
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 * @param {string} password - The password to validate
 * @returns {PasswordValidation} Validation result with feedback
 */
export const validatePassword = (password: string): PasswordValidation => {
  const requirements = [
    {
      regex: /.{8,}/,
      message: { ar: "على الأقل 8 أحرف", en: "At least 8 characters" },
      key: "length",
    },
    {
      regex: /[A-Z]/,
      message: {
        ar: "حرف كبير واحد على الأقل",
        en: "At least one uppercase letter",
      },
      key: "uppercase",
    },
    {
      regex: /[a-z]/,
      message: {
        ar: "حرف صغير واحد على الأقل",
        en: "At least one lowercase letter",
      },
      key: "lowercase",
    },
    {
      regex: /[0-9]/,
      message: { ar: "رقم واحد على الأقل", en: "At least one number" },
      key: "number",
    },
    {
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      message: {
        ar: "رمز خاص واحد على الأقل (!@#$%^&*)",
        en: "At least one special character (!@#$%^&*)",
      },
      key: "special",
    },
  ];

  const missingRequirements: string[] = [];
  let metRequirements = 0;

  requirements.forEach((req) => {
    if (!req.regex.test(password)) {
      missingRequirements.push(req.key);
    } else {
      metRequirements++;
    }
  });

  const score = (metRequirements / requirements.length) * 100;

  let strength: PasswordStrength;
  let feedback: { ar: string; en: string };

  if (metRequirements === 0) {
    strength = PasswordStrength.VERY_WEAK;
    feedback = {
      ar: "كلمة مرور ضعيفة جداً",
      en: "Very weak password",
    };
  } else if (metRequirements === 1) {
    strength = PasswordStrength.WEAK;
    feedback = {
      ar: "كلمة مرور ضعيفة",
      en: "Weak password",
    };
  } else if (metRequirements === 2 || metRequirements === 3) {
    strength = PasswordStrength.FAIR;
    feedback = {
      ar: "كلمة مرور متوسطة",
      en: "Fair password",
    };
  } else if (metRequirements === 4) {
    strength = PasswordStrength.GOOD;
    feedback = {
      ar: "كلمة مرور جيدة",
      en: "Good password",
    };
  } else {
    strength = PasswordStrength.STRONG;
    feedback = {
      ar: "كلمة مرور قوية",
      en: "Strong password",
    };
  }

  const isValid = missingRequirements.length === 0;

  return {
    isValid,
    strength,
    score,
    missingRequirements,
    feedback,
  };
};

/**
 * Get password strength color for UI
 * @param {PasswordStrength} strength - Password strength level
 * @returns {string} CSS color class
 */
export const getPasswordStrengthColor = (
  strength: PasswordStrength
): string => {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return "text-red-600";
    case PasswordStrength.WEAK:
      return "text-red-500";
    case PasswordStrength.FAIR:
      return "text-yellow-500";
    case PasswordStrength.GOOD:
      return "text-blue-500";
    case PasswordStrength.STRONG:
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

/**
 * Get password strength background color for progress bar
 * @param {PasswordStrength} strength - Password strength level
 * @returns {string} CSS background color class
 */
export const getPasswordStrengthBgColor = (
  strength: PasswordStrength
): string => {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return "bg-red-600";
    case PasswordStrength.WEAK:
      return "bg-red-500";
    case PasswordStrength.FAIR:
      return "bg-yellow-500";
    case PasswordStrength.GOOD:
      return "bg-blue-500";
    case PasswordStrength.STRONG:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};
