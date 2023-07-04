import API from '../api';

const GET_IMAGES_BEGIN = 'GET_IMAGES_BEGIN';
const GET_IMAGES_SUCCESS = 'GET_IMAGES_SUCCESS';
const GET_IMAGE_BEGIN = 'GET_IMAGE_BEGIN';
const GET_IMAGE_SUCCESS = 'GET_IMAGE_SUCCESS';
const UPLOAD_IMAGE_BEGIN = 'UPLOAD_IMAGE_BEGIN';
const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
const DELETE_IMAGE_BEGIN = 'DELETE_IMAGE_BEGIN';
const DELETE_IMAGE_SUCCESS = 'DELETE_IMAGE_BEGIN';

const initialState = {
  images: [],
  loading: false,
};

export const getImages =
  (doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_IMAGES_BEGIN, doInBackground });
    const images = await API.images.getImages();
    dispatch({ type: GET_IMAGES_SUCCESS, images });
    return images;
  };

export const getImage =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_IMAGE_BEGIN, doInBackground });
    const image = await API.images.getImage(id);
    dispatch({ type: GET_IMAGE_SUCCESS, image });
    return image;
  };

export const uploadImage =
  (newImage, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: UPLOAD_IMAGE_BEGIN, doInBackground });
    const image = await API.images.uploadImage(newImage);
    dispatch({ type: UPLOAD_IMAGE_SUCCESS, image });
    return image;
  };

export const deleteImage =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: DELETE_IMAGE_BEGIN, doInBackground });
    await API.images.deleteImage(id);
    dispatch({ type: DELETE_IMAGE_SUCCESS, id });
    return id;
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_IMAGE_BEGIN:
    case UPLOAD_IMAGE_BEGIN:
    case GET_IMAGES_BEGIN:
    case DELETE_IMAGE_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case GET_IMAGES_SUCCESS:
      return {
        ...state,
        images: action.images,
        loading: false,
      };

    case GET_IMAGE_SUCCESS:
      return {
        ...state,
        images: state.images.map((p) => p.id).includes(action.image.id)
          ? state.images.map((image) => (image.id === action.image.id ? action.image : image))
          : [...state.images, action.image],
        loading: false,
      };

    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        images: [...state.images, action.image],
        loading: false,
      };

    case DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        images: state.images.filter((hp) => hp.id !== action.id),
        loading: false,
      };

    default:
      return state;
  }
}
