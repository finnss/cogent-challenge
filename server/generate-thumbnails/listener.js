const JOB_STATUSES = require('../models/Job');
const mongoose = require('mongoose');
const Job = mongoose.model('Job');

module.exports = async (redisJob, result) => {
  console.log('\nListener! redisJob Completed. redisJob:', redisJob, 'Result: ', result);
  const dbJob = await Job.findById(redisJob.data.job.id).populate('image').exec();
  if (result) {
    dbJob.status = JOB_STATUSES.COMPLETE;
  } else {
    dbJob.status = JOB_STATUSES.FAILURE;
  }
  dbJob.save();
};
