// Date and time utility functions
import {
    addDays,
    format,
    isPast,
    isToday,
    isTomorrow,
    parseISO,
    startOfDay,
} from "date-fns";

/**
 * Format date to readable string
 * @param date - Date to format
 * @param formatString - Optional format string (default: 'dd MMM yyyy')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  formatString: string = "dd MMM yyyy",
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatString);
};

/**
 * Format date with Today/Tomorrow labels
 * @param date - Date to format
 * @returns Formatted date string with special labels
 */
export const formatDateWithLabel = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) return "Today";
  if (isTomorrow(dateObj)) return "Tomorrow";

  return formatDate(dateObj, "EEE, dd MMM");
};

/**
 * Format time to 12-hour format
 * @param time - Time string in HH:mm format
 * @returns Formatted time string (e.g., "6:00 AM")
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  if (minutes === 0) {
    return `${hour12} ${period}`;
  }
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/**
 * Format turf timing object to 12-hour range string
 * @param timing - Object with start and end times
 * @returns string (e.g., "6 AM to 11 PM")
 */
export const formatTurfTiming = (timing: {
  start: string;
  end: string;
}): string => {
  return `${formatTime(timing.start)} to ${formatTime(timing.end)}`;
};

/**
 * Format time range
 * @param startTime - Start time in HH:mm format
 * @param endTime - End time in HH:mm format
 * @returns Formatted time range (e.g., "6:00 AM - 7:00 AM")
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Generate time slots for a day
 * @param startHour - Start hour (24-hour format, default: 6)
 * @param endHour - End hour (24-hour format, default: 23)
 * @param intervalMinutes - Interval in minutes (default: 60)
 * @returns Array of time slot strings
 */
export const generateTimeSlots = (
  startHour: number = 6,
  endHour: number = 23,
  intervalMinutes: number = 60,
): string[] => {
  const slots: string[] = [];

  // Normalize endHour if it's earlier than startHour (indicates next day)
  // Also handle 00:00 as 24:00
  let normalizedEndHour = endHour;
  if (endHour <= startHour) {
    normalizedEndHour = endHour + 24;
  }

  for (let hour = startHour; hour < normalizedEndHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const currentHour = hour % 24;
      const startTime = `${currentHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

      const totalMinutes = hour * 60 + minute + intervalMinutes;
      const endHourCalc = Math.floor(totalMinutes / 60) % 24;
      const endMinuteCalc = totalMinutes % 60;

      const endTime = `${endHourCalc.toString().padStart(2, "0")}:${endMinuteCalc.toString().padStart(2, "0")}`;

      // Prevent adding a slot that starts exactly at the closing time if closing is exactly on the hour
      if (
        hour < normalizedEndHour ||
        (hour === normalizedEndHour && minute === 0)
      ) {
        slots.push(`${startTime} - ${endTime}`);
      }
    }
  }

  return slots;
};

/**
 * Check if a time slot is in the past
 * @param date - Date string (YYYY-MM-DD)
 * @param time - Time string (HH:mm - HH:mm)
 * @returns boolean
 */
export const isSlotInPast = (date: string, time: string): boolean => {
  const [startTime] = time.split(" - ");
  const [hours, minutes] = startTime.split(":").map(Number);

  const slotDate = parseISO(date);
  slotDate.setHours(hours, minutes, 0, 0);

  return isPast(slotDate);
};

/**
 * Get next N days as array of dates
 * @param count - Number of days to generate (default: 7)
 * @returns Array of Date objects
 */
export const getNextDays = (count: number = 7): Date[] => {
  const days: Date[] = [];
  const today = startOfDay(new Date());

  for (let i = 0; i < count; i++) {
    days.push(addDays(today, i));
  }

  return days;
};

/**
 * Convert Date to YYYY-MM-DD string
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export const toDateString = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

/**
 * Calculate duration between two time slots
 * @param startTime - Start time (HH:mm)
 * @param endTime - End time (HH:mm)
 * @returns Duration in hours
 */
export const calculateDuration = (
  startTime: string,
  endTime: string,
): number => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return (endMinutes - startMinutes) / 60;
};
