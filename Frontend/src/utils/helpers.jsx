// ==========================================
// FORMATTING UTILITIES
// ==========================================

/**
 * Format price to Indian Rupees
 * @param {number} price - Price amount
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date with time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  try {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid Date';
  }
};

/**
 * Get time ago (e.g., "2 hours ago")
 * @param {Date|string} date - Date to calculate from
 * @returns {string} Time ago string
 */
export const timeAgo = (date) => {
  if (!date) return 'N/A';
  
  try {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
      const years = Math.floor(interval);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
    
    interval = seconds / 2592000;
    if (interval > 1) {
      const months = Math.floor(interval);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    
    interval = seconds / 86400;
    if (interval > 1) {
      const days = Math.floor(interval);
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
      const hours = Math.floor(interval);
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    
    interval = seconds / 60;
    if (interval > 1) {
      const minutes = Math.floor(interval);
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }
    
    return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'N/A';
  }
};

// ==========================================
// TEXT UTILITIES
// ==========================================

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title cased string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate slug from text
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ==========================================
// VALIDATION UTILITIES
// ==========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Validate Indian pincode
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid pincode
 */
export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength level
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 'weak',
    message: '',
  };

  if (!password) {
    result.message = 'Password is required';
    return result;
  }

  if (password.length < 6) {
    result.message = 'Password must be at least 6 characters';
    return result;
  }

  if (password.length < 8) {
    result.strength = 'weak';
    result.message = 'Password is weak';
  } else if (password.length < 12) {
    result.strength = 'medium';
    result.message = 'Password is medium strength';
  } else {
    result.strength = 'strong';
    result.message = 'Password is strong';
  }

  result.isValid = true;
  return result;
};

// ==========================================
// CART & ORDER UTILITIES
// ==========================================

/**
 * Calculate cart total
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total cart value
 */
export const calculateCartTotal = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return 0;
  
  return cartItems.reduce((total, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);
};

/**
 * Calculate cart item count
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total number of items
 */
export const calculateCartItemCount = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return 0;
  
  return cartItems.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);
};

/**
 * Calculate order subtotal
 * @param {Array} items - Order items
 * @returns {number} Subtotal
 */
export const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

/**
 * Calculate shipping cost
 * @param {number} subtotal - Order subtotal
 * @param {number} freeShippingThreshold - Minimum for free shipping
 * @param {number} shippingCost - Standard shipping cost
 * @returns {number} Shipping cost
 */
export const calculateShipping = (subtotal, freeShippingThreshold = 5000, shippingCost = 100) => {
  return subtotal >= freeShippingThreshold ? 0 : shippingCost;
};

/**
 * Calculate tax (GST)
 * @param {number} amount - Amount to calculate tax on
 * @param {number} taxRate - Tax rate (default 18% GST)
 * @returns {number} Tax amount
 */
export const calculateTax = (amount, taxRate = 0.18) => {
  return amount * taxRate;
};

/**
 * Calculate order total
 * @param {number} subtotal - Subtotal
 * @param {number} shipping - Shipping cost
 * @param {number} tax - Tax amount
 * @returns {number} Total amount
 */
export const calculateTotal = (subtotal, shipping, tax) => {
  return subtotal + shipping + tax;
};

// ==========================================
// STATUS & BADGE UTILITIES
// ==========================================

/**
 * Get status badge color class
 * @param {string} status - Status value
 * @returns {string} CSS class name for badge
 */
export const getStatusColor = (status) => {
  const statusMap = {
    // Order statuses
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-info',
    delivered: 'badge-success',
    cancelled: 'badge-danger',
    
    // Payment statuses
    paid: 'badge-success',
    unpaid: 'badge-warning',
    failed: 'badge-danger',
    refunded: 'badge-info',
    
    // Approval statuses
    approved: 'badge-success',
    rejected: 'badge-danger',
    
    // Stock statuses
    'in-stock': 'badge-success',
    'low-stock': 'badge-warning',
    'out-of-stock': 'badge-danger',
  };
  
  return statusMap[status?.toLowerCase()] || 'badge-primary';
};

/**
 * Get status display text
 * @param {string} status - Status value
 * @returns {string} Display text
 */
export const getStatusText = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    paid: 'Paid',
    unpaid: 'Unpaid',
    failed: 'Failed',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  
  return statusMap[status.toLowerCase()] || capitalizeFirst(status);
};

// ==========================================
// ARRAY & OBJECT UTILITIES
// ==========================================

/**
 * Group array items by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  if (!array || !Array.isArray(array)) return {};
  
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  if (!array || !Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Remove duplicates from array
 * @param {Array} array - Array with possible duplicates
 * @param {string} key - Key to check for duplicates (optional)
 * @returns {Array} Array without duplicates
 */
export const removeDuplicates = (array, key = null) => {
  if (!array || !Array.isArray(array)) return [];
  
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
};

// ==========================================
// LOCAL STORAGE UTILITIES
// ==========================================

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage with JSON stringification
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setInStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

/**
 * Clear all localStorage
 * @returns {boolean} Success status
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// ==========================================
// FILE & IMAGE UTILITIES
// ==========================================

/**
 * Format file size to readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if file is valid image
 * @param {File} file - File to check
 * @returns {boolean} True if valid image
 */
export const isValidImage = (file) => {
  if (!file) return false;
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Check if file size is within limit
 * @param {File} file - File to check
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} True if within limit
 */
export const isFileSizeValid = (file, maxSizeMB = 5) => {
  if (!file) return false;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// ==========================================
// MISCELLANEOUS UTILITIES
// ==========================================

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Wait for specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after wait time
 */
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};