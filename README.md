# Cogent Labs Code Challenge – Emoji upload service

*Last updated Jul 5th 2023*

This is Finn Julius Stephansen-Smith's submission for the Cogent Labs code challenge! ✨

## Running 

The project can be run with docker using compose: 

`$ docker compose up -d`

For running the frontend and backend locally, see the respective READMEs (`/server/README.md` and `/web_app/README.md`). 

## Notes

I decided to implement the long-running task architechture using Redis and Bull. With Bull you create a queue implemented in redis, 
and you can then put anything into the queue. When a job reaches the front of this queue, it is "popped" out of the redis database
and you can process it. This corresponds to a "publish/subscribe"-type architechture. I also use MongoDB database models to store
metadata about uploaded images and thumbnails, as well as a connection entity "Job" that is used both as the datatype sent to 
the Redis queue and also for exposing data to the front-end. I chose Mongo as it is a natural partner to any NodeJS backend given
their similar data structures, and I chose Redis for queues as it seemed to be the most reccomended option online and Redis has a
good renown.

## Future improvement

Looking forward, there are definitely a couple of areas I would have liked to improve if the app were to reach actual production:

- Allowing upload of multiple images at once. This would have been escpecially "cool" given our long-running task architechture, because it would have possible to see images moving from "Pending" to "Processing" to "Complete" one by one, in order.
- Move image hosting to the cload, ie S3.
- Look into potentially connecting the frontend and backend using websockets. This would be useful for real-time updates of Job Statuses, instead of having to rely on polling
- More fine-grained control, ie the ability to choose the size of the thumbnail, delete only a thumbnail but not its image, etc.
- Better validation and user feedback. Some important actions like deleting a job should be protected by a confirmation dialog, for instance. It might also not make sense to allow uploads of images that are smaller than the target 100x100 size, etc.
- Fixing bugs. There are a couple of weaknesses in the application, including a routing issue frontend where refreshing on any page except `/` leads to a 404. This is a webpack / npx serve setting issue that I ran out of time to fix, unfortunately. Routing using buttons in the GUI works fine.
- Better testing. 
	- I implemented simple Jest tests backend that test every API endpoint thoroughly, except the most important one: image upload. Setting up redis to work during tests and thus getting a full end-to-end test of the long-running tasks is something I would have like to focus on going forward. 
	- The backend tests currently use the same database as the main app, which is obviously bad and affects both the tests and the real data. This should clearly be changed.
	- I *did* implement end-to-end testing using Cypress, which can be run from the `web_app` folder. This at least  means that the image upload is not entirely untested.
- CI/CD. Any deployment to a cloud environment would have given raise to the need for a CI/CD pipeline, ideally including automated linting checks and automated test runs before build and deployments.

Thank you for considering my application!