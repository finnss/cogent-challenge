const router = require('express').Router();
const mongoose = require('mongoose');
const Image = mongoose.model('Image');
const Thumbnail = mongoose.model('Thumbnail');
const Job = mongoose.model('Job');
const fs = require('fs');

/**
 * Controller for handling REST API requests to the "/jobs" endpoint.
 **/

// Get a list of all jobs
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

    return res.json({
      jobs: jobs.map(function (job) {
        return job.toJSON();
      }),
      jobsCount: jobsCount,
    });
  });
});

// Get a single job by id
router.get('/:id', function (req, res, next) {
  Job.findById(req.params.id)
    .populate('image')
    .populate('thumbnail')
    .then(function (job) {
      if (!job) {
        return res.sendStatus(404);
      }

      return res.json(job.toJSON());
    })
    .catch(next);
});

// Delete job and associated thumbnail / image
router.delete('/:id', function (req, res, next) {
  Job.findById(req.params.id)
    .populate('image')
    .populate('thumbnail')
    .then(async (job) => {
      if (!job) {
        return res.sendStatus(401);
      }
      const image = job.image;
      const thumbnail = job.thumbnail;

      // Delete Image file
      if (fs.existsSync(image?.path)) {
        try {
          fs.unlink(image.path, (err) => {
            if (err) console.error(err);
          });
        } catch (err) {
          console.warn('Image seems to already be removed.');
        }
      }

      // Delete Thumbnail file
      if (fs.existsSync(thumbnail?.path)) {
        try {
          fs.unlink(thumbnail.path, (err) => {
            if (err) console.error(err);
          });
        } catch (err) {
          console.warn('Thumbnail seem to already be removed.');
        }
      }

      // Delete MongoDB entries
      const { deletedCount: dcImg } = await Image.deleteOne({ _id: image?._id }).exec();
      const { deletedCount: dcTb } = await Thumbnail.deleteOne({ _id: thumbnail?._id }).exec();
      const { deletedCount: dcJob } = await Job.deleteOne({ _id: job._id }).exec();

      if ((job.image && dcImg === 0) || (job.thumbnail && dcTb === 0) || dcJob === 0) {
        return res.status(500).json({ error: 'Something went wrong while deleting job / image / thumbnail.' });
      }

      return res.status(204).send();
    })
    .catch(next);
});

module.exports = { router };
