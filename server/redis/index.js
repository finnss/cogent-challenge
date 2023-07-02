var Bull = require('bull');
var listener = require('./listener');
var processor = require('./processor');

const thumbnailGenerationQueue = new Bull('thumbnail-generation');

thumbnailGenerationQueue.addListener('global:completed', listener);
thumbnailGenerationQueue.process(processor);
