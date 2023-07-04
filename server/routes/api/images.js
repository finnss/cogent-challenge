const router = require('express').Router();
const mongoose = require('mongoose');
const Image = mongoose.model('Image');
const multer = require('multer');
const path = require('path');
const startGenerateThumbnailJob = require('../../generate-thumbnails/producer');

/**
 * Controller for handling REST API requests to the "/images" endpoint.
 **/

// We use the multer library for handling image upload requests. Upon successful
// image upload, multer stores the image file in the indicated folder.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Get a list of all images
router.get('/', function (req, res, next) {
  Image.find()
    .then(function (images) {
      return res.json(images);
    })
    .catch(next);
});

// Get a single image by id
router.get('/:id', function (req, res, next) {
  Image.findById(req.params.id)
    .then(function (image) {
      if (!image) {
        return res.sendStatus(404);
      }

      return res.json(image.toDetailedJSON());
    })
    .catch(next);
});

router.post('/', upload.single('image'), (req, res, next) => {
  const filename = req.file?.filename;
  console.log('filename', filename);
  if (!req?.file || !filename) {
    res.status(400).send({ error: 'Missing required field: file' });
    return;
  }

  const obj = {
    filename,
    originalName: req.file.originalname,
    path: req.file.path,
    contentType: req.file.mimetype,
    size: req.file.size,
  };
  console.log('beofre image.create');
  Image.create(obj)
    .then(async (item) => {
      console.log('immage created! Starting generate thumbnail job...');
      // On successful image creation, we create a long-running job to generate a thumbnail.
      const job = await startGenerateThumbnailJob(item);
      // item.job = job;
      // item.save();
      res.status(201).json({ jobId: job._id });
    })
    .catch((err) => {
      console.log('Error creating image:', err);
    });
});

module.exports = router;
