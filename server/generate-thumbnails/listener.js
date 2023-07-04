const JOB_STATUSES = require('../models/Job');
const mongoose = require('mongoose');
const Job = mongoose.model('Job');

/**
 * This is the listener for the completion of redis jobs. After a produced task (producer.js) has been
 * fully processed (consumer.js), a completion is event is triggered and picked up here. At this point,
 * the redis task has left the queue and is no longer stored in the redis database.
 *
 * For now, the only processing we do at this stage is to update our custom Job model's status to reflect
 * the result of the task – complete or failure.
 **/
module.exports = async (redisJob, result) => {
  const dbJob = await Job.findById(redisJob.data.job.id).populate('image').exec();
  if (result) {
    dbJob.status = JOB_STATUSES.COMPLETE;
  } else {
    dbJob.status = JOB_STATUSES.FAILURE;
  }
  dbJob.save();
};
