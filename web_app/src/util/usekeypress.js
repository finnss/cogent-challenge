import { useEffect } from 'react';

export default function useKeyPress(key, action, deps) {
  useEffect(() => {
    const onKeyUp = (e) => e.key === key && action();

    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, deps || []);
}
