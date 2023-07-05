import API from './api';

export const getImages = () => API.GET('images');

export const getImage = (id) => API.GET(`images/${id}`);

export const uploadImage = (image) => {
  return API.POST('images', {
    headers: {},
    body: image,
  });
};

export const updateImage = (image) => {
  return API.PATCH(`images/${image.id}`, image);
};

export const deleteImage = (id) => API.DELETE(`images/${id}`);
