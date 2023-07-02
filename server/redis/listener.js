var Bull = require('bull');

// const listener = function () {
//   const imageProcessingQueue = new Bull('processing-image');

//   imageProcessingQueue.on('global:completed', (job, result) => {
//     console.log('Job Completed: ', job?.id, 'Result: ', result);
//   });
// };

// module.exports = listener;

module.exports = (job, result) => {
  console.log('Listener! Job Completed: ', job?.id, 'Result: ', result);
};
