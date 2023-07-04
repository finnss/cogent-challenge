const mongoose = require('mongoose');

/*
 * Job: A model used to represent a long-running job to generate a thumbnail from an
 * uploaded image. Not to be confused with a redis job, which is the terminology used
 * by redis / Bull for tasks that are enqueued. Instead, this Job model acts as a binding
 * glue between images and thumbnails, and most of the frontend's requests are expected to
 * be for jobs.
 * Also includes a status (pending, completed, etc) for a better user experience.
 */
const JobSchema = new mongoose.Schema(
  {
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Thumbnail' },
    status: String,
  },
  { timestamps: true }
);

JobSchema.methods.toJSON = function () {
  return {
    id: this._id,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    image: this.image?.toJSON(),
    thumbnail: this.thumbnail?.toJSON(),
  };
};

mongoose.model('Job', JobSchema);

const JOB_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  FAILURE: 'failure',
};

module.exports = JOB_STATUSES;
