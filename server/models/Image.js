var mongoose = require('mongoose');
// var nanoid = require('nanoid');
var uniqueValidator = require('mongoose-unique-validator');
var Thumbnail = mongoose.model('Thumbnail');

var ImageSchema = new mongoose.Schema(
  {
    data: Buffer,
    filename: { type: String, unique: true },
    originalName: String,
    path: String,
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
    data: this.data,
    filename: this.filename,
    originalName: this.originalName,
    path: this.path,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
    thumbnail: thumbnail.toJSONFor(this),
    // job: this.job,
  };
};

ImageSchema.methods.toJSONFor = function (job) {
  return {
    filename: this.filename,
    size: this.data?.length || 0,
    contentType: this.contentType,
    createdAt: this.createdAt,
    // job: this.job,
  };
};

mongoose.model('Image', ImageSchema);
