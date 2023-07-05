# Cogent Labs Code Challenge frontend

This is the frontend webapp for the Cogent Labs code challenge. 

## Installing

You will need `npm` installed. 

### Dependencies 

To install, simply do

`$ npm install`

### Environment variables 

Make the file `.env` and add data according to the `.env.template` structure.

## Running

To run the project, simply do 

```
$ npm run dev
```

## Testing

End-to-end testing using Cypress is configured. These tests are found in the `./cypress` folder, and can be run using

```
$ npm run test
```

This opens a dialog where testing toolkit etc can be chosen. Select the "E2E" option and choose a browser of your liking, and run the "home" test kit to perform integration tests. Note that this relies on having the server running, as real requests are made and responses tested.

Other scripts are available for building and other non-development options, found in `package.json` under `scripts`. 
