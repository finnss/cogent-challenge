const JOB_STATUSES = require('../models/Job');
var mongoose = require('mongoose');
var Job = mongoose.model('Job');

module.exports = async (redisJob, result) => {
  console.log('Listener! redisJob Completed. redisJob:', redisJob, 'Result: ', result);
  const dbJob = await Job.findById(redisJob.data.job._id).populate('image').exec();
  if (result) {
    dbJob.status = JOB_STATUSES.COMPLETE;
  } else {
    dbJob.status = JOB_STATUSES.FAILURE;
  }
  dbJob.save();
};
