# Cogent Labs Code Challenge – Emoji upload service

This is my submission for the Cogent Labs code challenge. 

The project can be run with docker using compose: 
`$ docker compose up -d`

For running the frontend and backend normally, see the respective READMEs. 

## Notes

I decided to implement the long-running task architechture using Redis and Bull. With Bull you create a queue that is stored
in redis, and you can put jobs into the queue. When a job reaches the front of this queue, it is "popped" out of the redis database
and you can process it. This corresponds to a "publish/subscribe"-type architechture. I also use mongodb database models to store
metadata about uploaded images and thumbnails, as well as a connection entity "Job" that is used both as the datatype sent to 
the Redis queue and also for exposing data to the front-end.

## Future improvement

Looking forward, there are definitely a couple of areas I would have liked to improve if the app were to reach actual production:

- Allowing upload of multiple images at once. This would have been escpecially "cool" given our long-running task architechture, because it would have possible to see images moving from "Pending" to "Processing" to "Complete" one by one, in order.