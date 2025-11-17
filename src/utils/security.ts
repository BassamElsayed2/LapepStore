/**
 * Security Utility Functions
 * Additional security helpers for the application
 */

/**
 * Check if a URL is safe (same origin or whitelisted)
 * Prevents open redirect vulnerabilities
 */
export function isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    
    // Allow same origin
    if (parsedUrl.origin === window.location.origin) {
      return true;
    }
    
    // Check against whitelist
    return allowedDomains.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch {
    // If URL parsing fails, it's not safe
    return false;
  }
}

/**
 * Safely redirect to a URL (prevents open redirect)
 */
export function safeRedirect(url: string, fallbackUrl: string = '/', allowedDomains: string[] = []) {
  if (isSafeUrl(url, allowedDomains)) {
    window.location.href = url;
  } else {
    console.warn('Unsafe redirect blocked:', url);
    window.location.href = fallbackUrl;
  }
}

/**
 * Escape HTML special characters
 * Use when you need to display user input as text (not HTML)
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Generate a cryptographically secure random string
 * Useful for CSRF tokens, nonces, etc.
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate and sanitize file uploads
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
    };
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension ${extension} is not allowed`,
    };
  }

  return { isValid: true };
}

/**
 * Securely store data in localStorage with encryption (basic)
 * Note: This is NOT cryptographically secure, just obfuscation
 * For real security, use backend storage
 */
export function secureStorage() {
  // Simple XOR encryption for obfuscation
  const xorEncrypt = (text: string, key: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result);
  };

  const xorDecrypt = (encoded: string, key: string): string => {
    const text = atob(encoded);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  };

  const getKey = () => {
    // Use a combination of factors for the key
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    return `${userAgent}${language}`.substring(0, 32);
  };

  return {
    setItem: (key: string, value: string) => {
      try {
        const encrypted = xorEncrypt(value, getKey());
        localStorage.setItem(key, encrypted);
      } catch (error) {
        console.error('Failed to store item:', error);
      }
    },
    getItem: (key: string): string | null => {
      try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return xorDecrypt(encrypted, getKey());
      } catch (error) {
        console.error('Failed to retrieve item:', error);
        return null;
      }
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key);
    },
  };
}

/**
 * Rate limiting for client-side actions
 * Prevents spam/abuse of API endpoints
 */
export class ClientRateLimiter {
  private actions: Map<string, number[]> = new Map();

  /**
   * Check if an action is allowed
   * @param actionId Unique identifier for the action
   * @param maxAttempts Maximum number of attempts
   * @param windowMs Time window in milliseconds
   */
  canPerform(actionId: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.actions.get(actionId) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Record this attempt
    recentAttempts.push(now);
    this.actions.set(actionId, recentAttempts);
    
    return true;
  }

  /**
   * Reset rate limit for an action
   */
  reset(actionId: string) {
    this.actions.delete(actionId);
  }
}

/**
 * Content Security helpers
 */
export const ContentSecurity = {
  /**
   * Check if content contains potentially malicious patterns
   */
  containsSuspiciousPatterns(content: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // Event handlers like onclick=
      /eval\(/i,
      /expression\(/i,
      /<iframe/i,
      /<embed/i,
      /<object/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(content));
  },

  /**
   * Sanitize URLs (remove javascript: and data: schemes)
   */
  sanitizeUrl(url: string): string {
    const trimmed = url.trim().toLowerCase();
    if (
      trimmed.startsWith('javascript:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('vbscript:')
    ) {
      return '#';
    }
    return url;
  },
};

/**
 * Check if the application is running in a secure context
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true;
  return window.isSecureContext;
}

/**
 * Warn developers if security best practices are not followed
 */
export function securityAudit() {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔒 Security Audit');
    
    if (!isSecureContext()) {
      console.warn('⚠️ Not running in secure context (HTTPS)');
    }
    
    if (typeof window !== 'undefined') {
      // Check for sensitive data in localStorage
      const sensitiveKeys = ['password', 'secret', 'token', 'key'];
      Object.keys(localStorage).forEach(key => {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          console.warn(`⚠️ Potentially sensitive data in localStorage: ${key}`);
        }
      });
    }
    
    console.groupEnd();
  }
}

