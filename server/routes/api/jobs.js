const router = require('express').Router();
const mongoose = require('mongoose');
const Image = mongoose.model('Image');
const Job = mongoose.model('Job');
const fs = require('fs');

router.get('/', function (req, res, next) {
  const query = {};
  // Limit and offset used for pagination. Currently effectively disabled by default using 9999 as the
  // max number of jobs to return. This is a natural point of potential future improvement.
  let limit = 9999;
  let offset = 0;

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
    const jobs = results[0];
    const jobsCount = results[1];
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
router.delete('/:id', function (req, res, next) {
  Job.findById(req.params.id)
    .populate('image')
    .populate('thumbnail')
    .then(async (job) => {
      if (!job) {
        return res.sendStatus(401);
      }

      const image = job.image;
      console.log('DELETE image', image, image.remove);
      const image2 = await Image.findById(job.image._id).exec();
      console.log('DELETE image 2', image2, image2.remove);
      const thumbnail = job.thumbnail;
      console.log('DELETE thumbnail', thumbnail);

      fs.unlink(image.path, (err) => {
        if (err) console.error(err);
      });
      fs.unlink(thumbnail.path, (err) => {
        if (err) console.error(err);
      });

      await image.remove();
      await thumbnail.remove();

      await job.remove();

      return res.status(204);
    })
    .catch(next);
});

module.exports = { router };
