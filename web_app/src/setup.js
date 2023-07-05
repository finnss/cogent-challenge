import { createRoot } from 'react-dom/client';
import App from '/App';

export const createApp = () => {
  return createRoot(document.getElementById('main')).render(<App />);
};
