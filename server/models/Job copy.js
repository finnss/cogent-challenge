var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var Thumbnail = mongoose.model('Thumbnail');

var JobSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    body: String,
    favoritesCount: { type: Number, default: 0 },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    tagList: [{ type: String }],
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'Thumbnail' },
  },
  { timestamps: true }
);

JobSchema.plugin(uniqueValidator, { message: 'is already taken' });

JobSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

JobSchema.methods.slugify = function () {
  this.slug = slug(this.title) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

JobSchema.methods.updateFavoriteCount = function () {
  var job = this;

  return Thumbnail.count({ favorites: { $in: [job._id] } }).then(function (count) {
    job.favoritesCount = count;

    return job.save();
  });
};

JobSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    thumbnail: this.thumbnail.toProfileJSONFor(user),
  };
};

mongoose.model('Job', JobSchema);
