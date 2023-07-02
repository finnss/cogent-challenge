var router = require('express').Router();
var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var multer = require('multer');
var fs = require('fs');
const path = require('path');
const { startGenerateThumbnailJob } = require('./jobs');

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
  Image.create(obj).then((err, item) => {
    if (err) {
      console.log(err);
    } else {
      // On successful image creation, we create a long-running job to generate a thumbnail.
      startGenerateThumbnailJob(item);
      return 201;
    }
  });
});

module.exports = router;
