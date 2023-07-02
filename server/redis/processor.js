var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var Image = mongoose.model('Image');
var Thumbnail = mongoose.model('Thumbnail');
const path = require('path');

// const consumer = function (thumbnailGenerationQueue) {
//   thumbnailGenerationQueue.process(async function (job) {
//     console.log('\nProcessing job! job.id', job.id);

//     // longRunningFunction(job.data.imageURL);

//     return { result: 'OK' };
//   });
// };

// module.exports = consumer;

module.exports = async function (job, done) {
  console.log('\nProcessing job! job.id', job.id, 'job.data.image', job.data.image);

  const thumbnail = await Thumbnail();
  thumbnail.filename = path.parse(job.data.image.filename).name + '-thumbnail' + path.extname(job.data.image.filename);
  await thumbnail.save();

  const forJob = await Job.findOne({ 'image.id': job.data.image._id }).populate('image').exec();

  console.log('forJob', forJob);
  if (forJob) {
    forJob.thumbnail = thumbnail;
    await forJob.save();

    done(null, { result: 'OK' });

    return { result: 'OK' };
  }
  // FIXME Error
};
