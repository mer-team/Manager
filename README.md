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