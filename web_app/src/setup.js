import { createRoot } from 'react-dom/client';
import App from '/App';

export const createStore = () => {
  return; /* store */
};

export const createRouter = () => {
  return; /* router */
};

export const createApp = () => {
  return createRoot(document.getElementById('main')).render(<App />);
};
