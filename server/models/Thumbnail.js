const mongoose = require('mongoose');

const ThumbnailSchema = new mongoose.Schema(
  {
    path: String,
    // data: Buffer,
    filename: { type: String, unique: true },
    contentType: String,
    size: Number,
    // image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    // job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  },
  { timestamps: true }
);

ThumbnailSchema.methods.toJSONFor = function (job) {
  return {
    // data: this.data.toString('base64'),
    path: this.path,
    filename: this.filename,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
    // image: this.image.toJSONForJob(job),
  };
};

mongoose.model('Thumbnail', ThumbnailSchema);
