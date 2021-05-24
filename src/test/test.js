const fs = require('fs');
var amqp = require('amqplib/callback_api');

const config = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'merUser',
  password: 'passwordMER',
}

const qMain = "management",
      vID = "{ Service: 'VidExtractor', Result: { vID: 'JiF3pbvR5G0'} }",
      qSec = "separate",
      exp = "JiF3pbvR5G0";

describe('Testing RabbitMQ', ()=>{
  it('Should connect to the RabbitMQ', (done)=>{
    amqp.connect(config, (err, conn)=>{
      if(err){
        console.log("Connection Error");
        return;
      }
      done();
      setTimeout(function() { conn.close();}, 500);
    });
  });

  it('Should create the RabbitMQ channel', (done)=>{
    amqp.connect(config, (err, conn)=>{
      if(err){
        console.log("Connection Error");
        return;
      }
      conn.createConfirmChannel((err, ch)=>{
        if(err){
          console.log("Error Creating Channel");
          return;
        }
        done();
        setTimeout(function() { conn.close();}, 500);
      });
    });
  });

  it('Should send the vID to the manager', (done)=>{
    amqp.connect(config, (err, conn)=>{
      if(err){
        console.log("Connection Error");
        return;
      }
      conn.createChannel((err, ch)=>{
        if(err){
          console.log("Error Creating Channel");
          return;
        }
        ch.assertQueue(qMain, { durable: false }); 
        ch.sendToQueue(qMain, Buffer.from(vID), /*{ persistent: false }, */
          function(err) {
            if(err) {
              console.log("Error sending the message: ",err);
              return;         
            } else {
              console.log("Message sent");
              done();
          }
        });
      });
      done();
      setTimeout(function() { conn.close();}, 500);
    });
  });

  it("Should receive a message from the RabbitMQ", (done)=>{
    amqp.connect(config, (err, conn)=>{
      if(err){
        console.log("Connection Error");
        return;
      }
      conn.createChannel( (err, ch)=>{
        if(err){
          console.log("Error Creating Channel");
          return;
        }
        ch.assertQueue(qSec, { durable: false });
        ch.consume(qSec, function (msg) {
          if (msg.content.toString() == exp){
            done();
            setTimeout(function() { conn.close();}, 500);
          } else {
            console.log("Unexpected message");
            return;
          }
        }, { noAck: true });
      });
    });
  });
});