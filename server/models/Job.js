var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema(
  {
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Thumbnail' },
    queueId: String,
  },
  { timestamps: true }
);

JobSchema.methods.toJSON = function () {
  console.log('JobSchema.methods.toJSON this.image.toJSONFor', this.image?.toJSONFor, this.image[0]?.toJSONFor);
  return {
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    image: (this.image && this.image.toJSONFor && this.image?.toJSONFor(this)) || null,
    thumbnail: this.thumbnail?.toJSONFor(this),
  };
};

mongoose.model('Job', JobSchema);
