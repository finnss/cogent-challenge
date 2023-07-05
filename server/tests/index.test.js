const request = require('supertest');
const mongoose = require('mongoose');
require('../models/Image');
require('../models/Job');
const Image = mongoose.model('Image');
const Job = mongoose.model('Job');

const app = require('../app');
const JOB_STATUSES = require('../models/Job');

let imgId, jobId;

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect('mongodb://localhost/cogent');

  const testImg = await Image.create({
    filename: 'test-1234.jpg',
    originalName: 'test.jpg',
    path: 'uploads/test-1234.jpg',
    contentType: 'image/jpg',
    size: 10,
  });
  imgId = testImg?._id;

  const job = new Job();
  job.image = testImg;
  job.status = JOB_STATUSES.PENDING;
  await job.save();
  jobId = job?._id;
});

/* Closing database connection after each test. */
afterEach(async () => {
  await Image.deleteOne({ _id: imgId }).exec();
  await Job.deleteOne({ _id: jobId }).exec();

  await mongoose.connection.close();
});

describe('GET /api/jobs', () => {
  it('should return the test image in a list', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);

    const testJob = res.body.jobs.find(j => j.id === jobId.toString())
    console.log('testJob', testJob);
    console.log('res.body.jobs', res.body.jobs);
    expect(testJob?.id).toBe(jobId.toString());
    expect(testJob?.status).toBe(JOB_STATUSES.PENDING);
    expect(testJob?.image.id).toBe(imgId.toString());
  });
});

describe('GET /api/images', () => {
  it('should return the test image in a list', async () => {
    const res = await request(app).get('/api/images');
    expect(res.statusCode).toBe(200);

    const testImg = res.body.find(i => i.id === imgId.toString())
    expect(testImg.id).toBe(imgId.toString());
    expect(testImg.originalName).toBe('test.jpg');
    expect(testImg.contentType).toBe('image/jpg');
  });
});

describe('GET /api/jobs/:id', () => {
  it('should return the job', async () => {
    const res = await request(app).get(`/api/jobs/${jobId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(jobId.toString());
  });
});

describe('GET /api/images/:id', () => {
  it('should return the image', async () => {
    const res = await request(app).get(`/api/images/${imgId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(imgId.toString());
  });
});

describe('DELETE /api/jobs/:id', () => {
  it('should delete the test job and the associated image', async () => {
    const res = await request(app).delete(`/api/jobs/${jobId}`);
    expect(res.statusCode).toBe(204);

    const dbJobs = await Job.find().exec();
    expect(dbJobs.filter(job => job.id === jobId.toString()).length).toBe(0);

    const dbImages = await Image.find().exec();
    expect(dbImages.filter(image => image.id === imgId.toString()).length).toBe(0);
  });
});
