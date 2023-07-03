var mongoose = require('mongoose');

var ThumbnailSchema = new mongoose.Schema(
  {
    data: Buffer,
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
    data: this.data.toString('base64'),
    filename: this.filename,
    size: this.size,
    contentType: this.contentType,
    createdAt: this.createdAt,
    // image: this.image.toJSONForJob(job),
  };
};

mongoose.model('Thumbnail', ThumbnailSchema);
