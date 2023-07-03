const mongoose = require('mongoose');
const Job = mongoose.model('Job');
const Bull = require('bull');
const JOB_STATUSES = require('../models/Job');
const Image = mongoose.model('Image');

const startGenerateThumbnailJob = async (image) => {
  const thumbnailGenerationQueue = new Bull('thumbnail-generation');
  console.log('\nstartGenerateThumbnailJob image.filename', image.filename);
  console.log('typeof image', typeof image);
  console.log('image.toJSONFor', image.toJSONFor);
  console.log('image[0]', image[0]);

  const job = new Job();
  job.image = image;
  // job.queueId = redisJob.id;
  job.status = JOB_STATUSES.PENDING;
  await job.save();
  console.log('job', job);

  const redisJob = await thumbnailGenerationQueue.add({ job });
  //   console.log('redisJob', redisJob);
  console.log('redisJob.toKey()', redisJob.toKey());

  return job;
};

module.exports = startGenerateThumbnailJob;
