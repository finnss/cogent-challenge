var mongoose = require('mongoose');

const JOB_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  FAILURE: 'failure',
};

var JobSchema = new mongoose.Schema(
  {
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Thumbnail' },
    // queueId: String,
    status: String,
  },
  { timestamps: true }
);

JobSchema.methods.toJSON = function () {
  console.log('JobSchema.methods.toJSON this.image.toJSONFor', this.thumbnail, this.thumbnail?.toJSONFor);
  return {
    id: this._id,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    image: (this.image && this.image.toJSONFor && this.image?.toJSONFor(this)) || null,
    thumbnail: (this.thumbnail && this.thumbnail.toJSONFor && this.thumbnail?.toJSONFor(this)) || null,
  };
};

mongoose.model('Job', JobSchema);
module.exports = JOB_STATUSES;
