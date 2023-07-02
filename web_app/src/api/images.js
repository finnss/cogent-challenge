import API from './api';

export const getImages = () => API.GET('images');

export const getImage = (id) => API.GET(`images/${id}`);

export const uploadImage = (image) => {
  console.log('uploadImage image', image);
  return API.POST('images', {
    // headers: { 'Content-Type': 'multipart/form-data' },
    headers: {},
    body: image,
  });
};

export const updateImage = (image) => {
  return API.PATCH(`images/${image.id}`, image);
};

export const deleteImage = (id) => API.DELETE(`images/${id}`);
