var router = require('express').Router();
var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var multer = require('multer');
var fs = require('fs');
const path = require('path');
const startGenerateThumbnailJob = require('../../generate-thumbnails/producer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

// Preload job objects on routes with ':job'
router.param('image', function (req, res, next, id) {
  Image.findById(id)
    .then(function (image) {
      if (!image) {
        return res.sendStatus(404);
      }
      console.log('preload thing for image', image);

      req.image = image;

      return next();
    })
    .catch(next);
});

// return a list of images
router.get('/', function (req, res, next) {
  Image.find()
    // .distinct('imageList')
    .then(function (images) {
      return res.json({ images: images });
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

  var obj = {
    data: fs.readFileSync(path.join(__dirname + '../../../uploads/' + filename)),
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
