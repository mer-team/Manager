# Manager Microservice.

This service is connected with all the other service through [RabbitMQ](https://www.rabbitmq.com/). 
This service manages the flow of the architecture.

Run `node manager.js`

## Input through RabbitMQ

```javascript
{ Service: 'Service Name', Result: 'Result' }
```

## Output

The output depends on which service will get the information, but it can be for instance the song's ID, name, artist or features. 

## Docker Params
| Arg | Default | Description |
| --- | --- | --- |
| HOST | localhost | RabbitMQ host |
| USER | guest | HTTP basic auth username  |
| PASS | guest | HTTP basic auth password |
| PORT | 5672 | RabbitMQ Port (Not used) |
| MNG_PORT | 15672 | RabbitMQ Management Port |
| TIME | 10 | Timeout to check if the service is up |
| MONGO_URL | mongodb://admin:admin@localhost:27017 | MongoDB URL |
| MONGO_DB | manager | MongoDB Database |
| MONGO_COLL | teste | MongoDB Collection |

## Run Local Microservice
Run Rabbit
```
docker run -d -e RABBITMQ_DEFAULT_USER=merUser -e RABBITMQ_DEFAULT_PASS=passwordMER -p 15672:15672 -p 5672:5672 rabbitmq:3-management-alpine
```

Run MongoDB
```
docker run -d -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -e MONGO_INITDB_DATABASE=manager -p 27017:27017 mongo:latest
```

Build local `manager` from source
```
docker build -t manager:local .
```

Run local `manager`
```
docker run -e TIME=10 -e USER=merUser -e PASS=passwordMER -e HOST=localhost -e MNG_PORT=15672 -e MONGO_URL=mongodb://admin:admin@localhost:27017 -e MONGO_DB=manager -e MONGO_COLL=teste --net=host manager:local
```

Run official `manager` image locally
```
docker run -e TIME=10 -e USER=merUser -e PASS=passwordMER -e HOST=localhost -e MNG_PORT=15672 -e MONGO_URL=mongodb://admin:admin@localhost:27017 -e MONGO_DB=manager -e MONGO_COLL=teste --net=host merteam/manager:latest
```