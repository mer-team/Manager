const MongoClient = require('mongodb').MongoClient,
      user = process.env.USER || 'guest',
      pass = process.env.PASS || 'guest',
      host = process.env.HOST || 'localhost',
      murl = process.env.MONGO_URL || 'mongodb://admin:admin@localhost:27017',
      mdb  = process.env.MONGO_DB  || 'manager',
      mcol = process.env.MONGO_COLL || 'teste';
var amqp = require('amqplib/callback_api');

// mongodb connect
const client = new MongoClient(murl, { useUnifiedTopology: true });
client.connect(function(err) {
    console.log('Connected to MongoDB server');
    let db = client.db(mdb);
    client.close();
});

amqp.connect(`amqp://${user}:${pass}@${host}/`, function (error0, connection) {
    if (error0) {
        throw error0;
    }

    // publish doc to collection
    // wrap this into a function
    const doc = {"connected": "true"};
    (async () => {
        let client = await MongoClient.connect(murl, { useUnifiedTopology: true });

        let db = client.db(mdb);
        try {
           const res = await db.collection(mcol).insertOne(doc);
        }
        finally {
            client.close();
        }
    })()
        .catch(err => console.error(err));

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'management';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function (msg) {
            var body = JSON.parse(msg.content);
            console.log(" [x] Received %s", body);

            var service = body.Service;
            var result = body.Result;
            switch (service) {
                case "VidExtractor":
                    if (result == "Not a music") {
                        console.log("Not Music. Ending!")
                    } else {
                        // SOURCE SEPARATION
                        var queue = 'separate';
                        channel.assertQueue(queue, {
                            durable: false
                        });
                        var vID = result.vID;
                        channel.sendToQueue(queue, Buffer.from(vID));
                        console.log(" [x] Sent %s to %s", vID, queue);
                        // LYRICS
                        queue = 'lyrics';
                        channel.assertQueue(queue, {
                            durable: false
                        });
                        var toSend = {
                            song: result.song,
                            artist: result.artist
                        };
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(toSend)));
                        console.log(" [x] Sent %s to %s", toSend, queue);
                        // GENRE
                        queue = 'genre';
                        channel.assertQueue(queue, {
                            durable: false
                        });
                        var toSend = {
                            song: result.song,
                            artist: result.artist
                        };
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(toSend)));
                        console.log(" [x] Sent %s to %s", toSend, queue);
                    }
                    break;
                case "SourceSeparation":
                    var queue = 'segmentation';
                        channel.assertQueue(queue, {
                            durable: false
                        });
                        var vID = result.vID;
                        channel.sendToQueue(queue, Buffer.from(vID));
                        console.log(" [x] Sent %s to %s", vID, queue);
                    break;
                case "Segmentation":
                    // TO DO - CALL FEATURE EXTRACTION
                    break;
                case "GenreFinder":
                    // TO DO - CALL FEATURE EXTRACTION
                    break; 
                case "LyricsExtractor":
                    // TO DO - CALL FEATURE EXTRACTION
                    break;
                default:
                // code block
            }
        }, {
            noAck: true
        });
    });
});