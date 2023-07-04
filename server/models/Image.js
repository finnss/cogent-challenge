const mongoose = require('mongoose');

/*
 * Image: A model used to represent uploaded images. Note that we chose to not
 * store the image data in the database, but instead only a path to the location
 * of the file. This was chosen for simplicity as well as for easier
 * future to migration to proper hosting solutions like S3.
 */
const ImageSchema = new mongoose.Schema(
  {
    path: String,
    filename: { type: String, unique: true },
    originalName: String,
    contentType: String,
    size: Number,
  },
  { timestamps: true }
);

ImageSchema.methods.toJSON = function () {
  return {
    id: this._id,
    path: this.path,
    originalName: this.originalName,
    size: this.size,
    contentType: this.contentType,
  };
};

ImageSchema.methods.toDetailedJSON = function () {
  return {
    id: this._id,
    path: this.path,
    filename: this.filename,
    originalName: this.originalName,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
  };
};

mongoose.model('Image', ImageSchema);
