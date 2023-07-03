var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var Image = mongoose.model('Image');
var Thumbnail = mongoose.model('Thumbnail');
const path = require('path');
const JOB_STATUSES = require('../models/Job');
const imageThumbnail = require('image-thumbnail');

module.exports = async function (redisJob, done) {
  console.log('\nProcessing redisJob! redisJob.id', redisJob.id, 'redisJob.data.job', redisJob.data.job);
  const dbJob = await Job.findById(redisJob.data.job.id).populate('image').exec();
  console.log('dbJob', dbJob);
  if (!dbJob) {
    done(new Error('Found no database job for the given redis job'));
    return;
  }
  dbJob.status = JOB_STATUSES.PROCESSING;
  dbJob.save();
  const image = dbJob.image;

  try {
    const dbThumbnail = await Thumbnail();
    console.log('trying to generate thumnail. path: ', image.path);
    const imgThumbnail = await imageThumbnail(image.path, { width: 100, height: 100 });
    console.log('imgThumbnail', imgThumbnail);

    dbThumbnail.filename = path.parse(dbJob.image.filename).name + '-thumbnail' + path.extname(image.filename);
    dbThumbnail.data = imgThumbnail;
    dbThumbnail.size = imgThumbnail.length;
    dbThumbnail.contentType = image.contentType;
    await dbThumbnail.save();

    dbJob.thumbnail = dbThumbnail;
    await dbJob.save();

    done(null, { result: 'OK' });

    return { result: 'OK+' };
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    done(err);
  }
};
