const Bull = require('bull');
const listener = require('./listener');
const consumer = require('./consumer');

/**
 * In order to generate thumbnails using long-running jobs, we use a queue implemented using redis and Bull.
 * Whenever a new image is uploaded we add a new job to this queue. This is called "producing" to the queue,
 * and the function responsible for this is defined in ./producer.js.
 *
 * Bull then handles the logic of retrieving items from the queue one by one, in the order they were added.
 * When a job is taken from the queue for processing, moving from the PENDING state to PROCESSING, it is said
 * to be "consumed". As such we have defined our logic for this step in ./consumer.js. This is when the actual
 * thumbnail is generated.
 *
 * After successful thumbnail generation, the job is marked as completed. Subsequent calls to /jobs will include
 * the generated thumbnail as part of the JSON response, allowing the frontend to display the thumbnails.
 **/
const thumbnailGenerationQueue = new Bull('thumbnail-generation');

thumbnailGenerationQueue.process(consumer);
thumbnailGenerationQueue.addListener('completed', listener);
