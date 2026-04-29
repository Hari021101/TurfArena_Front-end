// Validation utility functions

/**
 * Validate phone number (Indian format)
 * @param phone - Phone number to validate
 * @returns boolean
 */
export const validatePhone = (phone: string): boolean => {
  // Remove all spaces and hyphens
  const cleaned = phone.replace(/[\s-]/g, "");

  // Check if it starts with +91 and has 10 digits after
  const withCountryCode = /^\+91[6-9]\d{9}$/.test(cleaned);

  // Check if it's just 10 digits starting with 6-9
  const withoutCountryCode = /^[6-9]\d{9}$/.test(cleaned);

  return withCountryCode || withoutCountryCode;
};

/**
 * Format phone number to include country code
 * @param phone - Phone number
 * @returns Formatted phone number with +91
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, "");

  if (cleaned.startsWith("+91")) {
    return cleaned;
  }

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return "+" + cleaned;
  }

  return "+91" + cleaned;
};

/**
 * Validate OTP code
 * @param otp - OTP code to validate
 * @returns boolean
 */
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate email
 * @param email - Email to validate
 * @returns boolean
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate name
 * @param name - Name to validate
 * @returns boolean
 */
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Validate price
 * @param price - Price to validate
 * @returns boolean
 */
export const validatePrice = (price: number): boolean => {
  return price > 0 && !isNaN(price);
};

/**
 * Get error message for phone validation
 * @param phone - Phone number
 * @returns Error message or empty string
 */
export const getPhoneError = (phone: string): string => {
  if (!phone) return "Phone number is required";
  if (!validatePhone(phone))
    return "Please enter a valid 10-digit phone number";
  return "";
};

/**
 * Get error message for OTP validation
 * @param otp - OTP code
 * @returns Error message or empty string
 */
export const getOTPError = (otp: string): string => {
  if (!otp) return "OTP is required";
  if (!validateOTP(otp)) return "Please enter a valid 6-digit OTP";
  return "";
};

/**
 * Get error message for name validation
 * @param name - Name
 * @returns Error message or empty string
 */
export const getNameError = (name: string): string => {
  if (!name) return "Name is required";
  if (!validateName(name)) return "Name must be at least 2 characters";
  return "";
};
