import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format date in a human-friendly way
 * Examples: "2 hours ago", "Yesterday", "Dec 4, 2025"
 */
export const formatDate = (date) => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  return format(dateObj, 'MMM d, yyyy');
};

/**
 * Format date with time
 * Example: "Dec 4, 2025 at 3:30 PM"
 */
export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a');
};

/**
 * Format date as relative time
 * Example: "2 hours ago", "3 days ago"
 */
export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Format date in full format
 * Example: "December 4, 2025"
 */
export const formatFullDate = (date) => {
  return format(new Date(date), 'MMMM d, yyyy');
};