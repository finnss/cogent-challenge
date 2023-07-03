var router = require('express').Router();
var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var Image = mongoose.model('Image');
var Thumbnail = mongoose.model('Thumbnail');
var Bull = require('bull');

// const thumbnailGenerationQueue = new Bull('thumbnail-generation');

// const startGenerateThumbnailJob = async (image) => {
//   console.log('startGenerateThumbnailJob image.filename', image.filename);

//   const redisJob = await thumbnailGenerationQueue.add({ image });
//   console.log('redisJob', redisJob);
//   console.log('redisJob.toKey()', redisJob.toKey());

//   var job = new Job();
//   job.image = image;
//   job.queueId = redisJob.id;
//   console.log('job', job);

//   job.save();
// };

// thumbnailGenerationQueue.process(async function (job) {
//   console.log('thumbnailGenerationQueue! job.id', job.id, 'job.data', job.data);

//   // longRunningFunction(job.data.imageURL);

//   return { imageURL: job.data.imageURL, result: 'OK' };
// });

// thumbnailGenerationQueue.on('global:completed', async (job, result) => {
//   console.log('Job Completed: ', job?.id, 'Result: ', result);

//   const thumbnail = await Thumbnail();
//   await thumbnail.save();

//   const forJob = Job.findOne({ 'image.id': job.image?.id });
//   forJob.thumbnail = thumbnail;
//   await forJob.save();
// });

router.param('job', function (req, res, next, slug) {
  Job.findOne({ slug: slug })
    .populate('image')
    .populate('thumbnail')
    .then(function (job) {
      if (!job) {
        return res.sendStatus(404);
      }

      req.job = job;

      return next();
    })
    .catch(next);
});

router.get('/', function (req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }

  if (typeof req.query.tag !== 'undefined') {
    query.tagList = { $in: [req.query.tag] };
  }

  return Promise.all([
    Job.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: 'desc' })
      .populate('image')
      .populate('thumbnail')
      .exec(),
    Job.count(query).exec(),
  ]).then(function (results) {
    var jobs = results[0];
    var jobsCount = results[1];
    console.log('jobsCount', jobsCount);

    return res.json({
      jobs: jobs.map(function (job) {
        return job.toJSON();
      }),
      jobsCount: jobsCount,
    });
  });
});

// get a single job by id

router.get('/:id', function (req, res, next) {
  console.log('getting single job. req.params.id', req.params.id);
  Job.findById(req.params.id)
    .populate('image')
    .populate('thumbnail')
    .then(function (job) {
      if (!job) {
        return res.sendStatus(404);
      }

      return res.json({ job: job.toJSON() });
    })
    .catch(next);
});

// delete job and associated thumbnail / image
router.delete('/:job', function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      if (req.job.author._id.toString() === req.payload.id.toString()) {
        return req.job.remove().then(function () {
          return res.sendStatus(204);
        });
      } else {
        return res.sendStatus(403);
      }
    })
    .catch(next);
});

module.exports = { router };
