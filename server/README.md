# Cogent Labs Code Challenge backend

This is the backend webapp for the Cogent Labs code challenge. 

## Installing

You will need `npm` installed. 

### Dependencies 

To install, simply do

`$ npm install`

You will also need [mongodb](https://www.mongodb.com/) and [redis](https://redis.io/) running on your machine. Once they are installed, running with default settings should work fine:

- `$ redis-server`
- `$ brew services start mongodb-community` (assuming OSX)

### Environment variables 

Make the file `.env` and add data according to the `.env.template` structure.

## Running

To run the project, simply do 

```
$ npm run dev
```

## Testing

Tests are found in the `tests` folder. They are written using Jest and Supertest, and they actually spin up the backend server and uses a real connection to MongoDB to perform as realistic tests as possible. As such, you will need mongodb running, and you will need to stop the backend server (and any other processes running on required port, default 5000).

To run the tests, run

```
$ npm run test
```

Only image uploading is not tested here, because it would require integrating redis into the test suite. This is something I decided to not prioritize but that would be an obvious point of further improvement.

See the tests frontend using Cypress for an even more comprehensive end-to-end testing, including image upload.

Other scripts are available for building, linting, and other non-development options, found in `package.json` under `scripts`. 
