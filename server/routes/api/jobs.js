var router = require('express').Router();
var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var Image = mongoose.model('Image');
var Thumbnail = mongoose.model('Thumbnail');

const startGenerateThumbnailJob = (image) => {
  console.log('startGenerateThumbnailJob image', image);
};

router.param('job', function (req, res, next, slug) {
  Job.findOne({ slug: slug })
    .populate('author')
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
    Job.find(query).limit(Number(limit)).skip(Number(offset)).sort({ createdAt: 'desc' }).populate('thumbnail').exec(),
    Job.count(query).exec(),
    req.payload ? User.findById(req.payload.id) : null,
  ]).then(function (results) {
    var jobs = results[0];
    var jobsCount = results[1];
    var thumbnail = results[2];
    console.log('thumbnail', thumbnail);

    return res.json({
      jobs: jobs.map(function (job) {
        return job.toJSON();
      }),
      jobsCount: jobsCount,
    });
  });
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

module.exports = { router, startGenerateThumbnailJob };
