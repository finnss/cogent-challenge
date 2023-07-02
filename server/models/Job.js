var mongoose = require('mongoose');
var Thumbnail = mongoose.model('Thumbnail');

var JobSchema = new mongoose.Schema(
  {
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Thumbnail' },
  },
  { timestamps: true }
);

JobSchema.methods.toJSON = function () {
  return {
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    image: this.image.toJSONFor(this),
    thumbnail: this.thumbnail.toJSONFor(this),
  };
};

mongoose.model('Job', JobSchema);
