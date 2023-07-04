const mongoose = require('mongoose');

/*
 * Thumbnail: A model used to represent 100x100 versions of uploaded
 * images. These are the result of Jobs.
 */
const ThumbnailSchema = new mongoose.Schema(
  {
    path: String,
    filename: { type: String, unique: true },
    contentType: String,
    size: Number,
  },
  { timestamps: true }
);

ThumbnailSchema.methods.toJSON = function () {
  return {
    path: this.path,
    filename: this.filename,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
  };
};

mongoose.model('Thumbnail', ThumbnailSchema);
