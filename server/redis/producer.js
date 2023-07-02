var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var Bull = require('bull');
var Image = mongoose.model('Image');

const startGenerateThumbnailJob = async (image) => {
  const thumbnailGenerationQueue = new Bull('thumbnail-generation');
  console.log('startGenerateThumbnailJob image.filename', image.filename);
  console.log('typeof image', typeof image);
  console.log('image.toJSONFor', image.toJSONFor);
  console.log('image[0]', image[0]);

  //   const image2 = await Image.findOne({ filename: image.filename }).exec();
  //   console.log('image2', image2);
  //   console.log('image2.toJSONFor', image2.toJSONFor);

  const redisJob = await thumbnailGenerationQueue.add({ image });
  //   console.log('redisJob', redisJob);
  console.log('redisJob.toKey()', redisJob.toKey());

  var job = new Job();
  job.image = image;
  job.queueId = redisJob.id;
  console.log('job', job);

  return job.save();
};

module.exports = startGenerateThumbnailJob;
