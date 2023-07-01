import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that returns all query params from the current location URL
 * @returns {Object<string, string>}
 */
function useQueryParams() {
  const { search } = useLocation();

  const queryParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams(search);
    const params = {};

    for (const [key, value] of urlSearchParams.entries()) {
      params[key] = value;
    }

    return params;
  }, [search]);

  return queryParams;
}

export default useQueryParams;
