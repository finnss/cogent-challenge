const SHOW_TOAST = 'SHOW_TOAST';

const initialState = {
  toast: { open: false },
};

export const showToast = (message, duration, variant = 'success') => ({
  type: SHOW_TOAST,
  toast: { message, duration, variant, open: true },
});

export const dismissToast = () => ({ type: SHOW_TOAST, toast: { open: false } });

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        toast: action.toast,
      };
    default:
      return state;
  }
}
