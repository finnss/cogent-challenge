import { useCallback, useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

// Taken directly from https://gist.github.com/MarksCode/64e438c82b0b2a1161e01c88ca0d0355
// See the discussion in the following issue on why this custom code is needed in React Router 6:
// https://github.com/remix-run/react-router/issues/8139
const useConfirmExit = (confirmExit, when = true) => {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) {
      return;
    }

    const push = navigator.push;

    navigator.push = (...args) => {
      const result = confirmExit();
      if (result !== false) {
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, confirmExit, when]);
};

const useExitPagePrompt = (message, when = true) => {
  useEffect(() => {
    if (when) {
      window.onbeforeunload = function () {
        return message;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [message, when]);

  const confirmExit = useCallback(() => {
    const confirm = window.confirm(message);
    return confirm;
  }, [message]);
  useConfirmExit(confirmExit, when);
};

export default useExitPagePrompt;
