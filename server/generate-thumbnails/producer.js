const mongoose = require('mongoose');
const Job = mongoose.model('Job');
const Bull = require('bull');
const JOB_STATUSES = require('../models/Job');

/**
 * This is the producer of redis jobs, ie where long-running tasks to generate thumbnails
 * are enqueued and put into the redis database / Bull queue. It acts as the published in the
 * pub/sub infrastructure used by redis and Bull.
 *
 * This function is currently only called in 'api/images' after an image has been uploaded.
 * When this happens, we first create an instance of our custom Job model to represent this
 * long-running task. We then create the actual redis job by putting this job into our Bull queue.
 * When this job reached the front of the queue, it is processed in './consumer.js'.
 **/
const startGenerateThumbnailJob = async (image) => {
  const thumbnailGenerationQueue = new Bull('thumbnail-generation', process.env.REDIS_URI || 'redis://127.0.0.1:6379');

  const job = new Job();
  job.image = image;
  job.status = JOB_STATUSES.PENDING;
  await job.save();

  await thumbnailGenerationQueue.add({ job });

  return job;
};

module.exports = startGenerateThumbnailJob;
