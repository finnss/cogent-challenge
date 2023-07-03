const mongoose = require('mongoose');
// const nanoid = require('nanoid');
const uniqueValidator = require('mongoose-unique-validator');
const Thumbnail = mongoose.model('Thumbnail');

const ImageSchema = new mongoose.Schema(
  {
    // data: Buffer,
    path: String,
    filename: { type: String, unique: true },
    originalName: String,
    contentType: String,
    size: Number,
    // job: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

// FIXME Include thumbnail for image in JSON response
ImageSchema.methods.toDetailedJSON = async () => {
  const thumbnail = await Thumbnail.find({ 'image.filename': this.filename }).exec();
  return {
    // data: this.data,
    path: this.path,
    filename: this.filename,
    originalName: this.originalName,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
    thumbnail: thumbnail.toJSONFor(this),
    // job: this.job,
  };
};

ImageSchema.methods.toJSONFor = function (job) {
  return {
    path: this.path,
    filename: this.filename,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
    // job: this.job,
  };
};

mongoose.model('Image', ImageSchema);
