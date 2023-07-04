// Truncates a string and add ellipsis at the end if the string length exceeds limit
export function truncate(str, limit = 120) {
  if (str?.length > limit) {
    return str.substring(0, limit) + '...';
  }
  return str;
}

// Combines a given path and the app's API_HOST to generate a valid image url
export const getImageUrl = (path) => path && `${API_HOST.replace('/api', '')}/${path}`;

export const TABLE_PAGINATION_ALL = 9999;
