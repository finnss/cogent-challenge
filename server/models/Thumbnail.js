var mongoose = require('mongoose');

var ThumbnailSchema = new mongoose.Schema(
  {
    data: Buffer,
    filename: { type: String, unique: true },
    originalName: String,
    path: String,
    contentType: String,
    size: Number,
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    // job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  },
  { timestamps: true }
);

ThumbnailSchema.methods.toJSONForJob = function (job) {
  return {
    data: this.data,
    filename: this.filename,
    originalName: this.originalName,
    path: this.path,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
    image: this.image.toJSONForJob(job),
  };
};

mongoose.model('Thumbnail', ThumbnailSchema);
