const mongoose = require('mongoose');
const Job = mongoose.model('Job');
const Thumbnail = mongoose.model('Thumbnail');
const fs = require('fs');
const path = require('path');
const JOB_STATUSES = require('../models/Job');
const imageThumbnail = require('image-thumbnail');

/**
 * This is the consumer of the redis queue, ie where long-running jobs are actually processed.
 * The items in the queue are Jobs as defined by our custom Job model, including a reference to
 * the image to process.
 **/
module.exports = async function (redisJob, done) {
  // We need to execute a find command in order to populate the image.
  const dbJob = await Job.findById(redisJob.data.job.id).populate('image').exec();
  if (!dbJob) {
    done(new Error('Found no database job for the given redis job'));
    return;
  }
  // Before the real processing begins, update the job's status to "processing". This lets
  // the frontend know that this job's turn has come, and it can display status accordingly.
  dbJob.status = JOB_STATUSES.PROCESSING;
  dbJob.save();
  const image = dbJob.image;

  try {
    // We use the image-thumbnail library to actually generate the thumbnail. The dimensions are 100px x 100px,
    // the file type is the same as the input image's, and the fill-strategy is 'contain'. In case the input image's
    // proportions are of AND it is a PNG, the background is set to transparent.
    const imgThumbnail = await imageThumbnail(image.path, { width: 100, height: 100, background: { alpha: 0 } });

    // Once we have generated the thumbnail we get its data as a Buffer. We store this as a file in the /thumbnails
    // folder.
    const filename = path.parse(dbJob.image.filename).name + '-thumbnail' + path.extname(image.filename);
    const filepath = `thumbnails/${filename}`;
    fs.writeFile(`${filepath}`, imgThumbnail, (err) => console.error(err));

    // We then store the a referene to our newly generated Thumbnail in the database, along with some metadata.
    // Note that we do not store the actual data in the database.
    const dbThumbnail = new Thumbnail();
    dbThumbnail.filename = filename;
    dbThumbnail.path = filepath;
    dbThumbnail.size = imgThumbnail.length;
    dbThumbnail.contentType = image.contentType;
    await dbThumbnail.save();

    // We store a reference to the new thumbnail in the relevant job so that each thumbnail can be included
    // in the /jobs API endpoint response.
    dbJob.thumbnail = dbThumbnail;
    await dbJob.save();

    // Finally we indicate that processing is complete, and the redis job is entirely consumed. This event
    // is notices by './listener' for final clean-up.
    done(null, { result: 'OK' });
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    done(err);
  }
};
