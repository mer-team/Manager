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

## Run Local Microservice
Run Rabbit
```
docker run -d -e RABBITMQ_DEFAULT_USER=merUser -e RABBITMQ_DEFAULT_PASS=passwordMER -p 15672:15672 -p 5672:5672 rabbitmq:3-management-alpine
```

Build local `manager` from source
```
docker build -t localmanager:latest .
```

Run local `manager`
```
docker run -e TIME=10 -e USER=merUser -e PASS=passwordMER -e HOST=localhost -e MNG_PORT=15672 --net=host localmanager:latest
```

Run official `manager` image locally
```
docker run -e TIME=10 -e USER=merUser -e PASS=passwordMER -e HOST=localhost -e MNG_PORT=15672 --net=host merteam/manager:latest
```