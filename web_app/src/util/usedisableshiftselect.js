import { useEffect } from 'react';

/**
 * Hook that disables selection of text when the shift key is pressed
 */
export default function useDisableShiftSelect() {
  useEffect(() => {
    const onShiftDown = (e) => {
      if (e.keyCode === 16) document.onselectstart = () => false;
    };

    const onShiftUp = (e) => {
      if (e.keyCode === 16) document.onselectstart = null;
    };

    window.addEventListener('keydown', onShiftDown);
    window.addEventListener('keyup', onShiftUp);
    return () => {
      window.removeEventListener('keydown', onShiftDown);
      window.removeEventListener('keyup', onShiftUp);
    };
  }, []);
}
