import { Kafka } from 'kafkajs';

export namespace LaundryEventConsumer {

    const kafka = new Kafka({
        clientId: 'laundry-app',
        brokers: ['localhost:9092']
    });   

    type EventCallback =  (event: any) => void;

    const consumer = kafka.consumer({ groupId: 'laundry-group' });

    const eventCallbacks: EventCallback[] = [];

    export const addEventCallback = (callback: EventCallback) => {
      eventCallbacks.push(callback);
    }

    export const run = async () => {
       
        // Consuming
        console.log("consuming");
        await consumer.connect()
        await consumer.subscribe({ topic: 'laundry-machine-logs', fromBeginning: true })
        console.log("subscripbed");
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
          const event = {
            partition,
            offset: message.offset,
            value: message.value.toString(),
          };
          console.log(event);
            eventCallbacks.forEach((callback: EventCallback) => {   
                callback(event);
            });
          },
        })
      }

}