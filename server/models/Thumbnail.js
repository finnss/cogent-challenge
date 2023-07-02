var mongoose = require('mongoose');

var ThumbnailSchema = new mongoose.Schema(
  {
    data: Buffer,
    contentType: String,
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    // job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  },
  { timestamps: true }
);

ThumbnailSchema.methods.toJSONForJob = function (job) {
  return {
    id: this._id,
    data: this.data,
    contentType: this.contentType,
    createdAt: this.createdAt,
    image: this.image.toJSONForJob(job),
  };
};

mongoose.model('Thumbnail', ThumbnailSchema);
