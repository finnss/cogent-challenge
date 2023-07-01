# Cogent Labs Code Challenge frontend

*Last updated 2023-02-13*

This is the frontend webapp for the Cogent Labs code challenge. 

## Installing

You will need `npm` installed. 

### Dependencies 

To install, simply do

`$ npm install`

### Environment variables 

Make the file `web_client/.env` and add the following data:

```
DEV=true
API_HOST=http://localhost:8082/v1
```

## Running

To run the project, simply do 

```
$ npm run dev
```

Other scripts are available for building and other non-development options, found in `package.json` under `scripts`. 
