import { Consumer, Kafka } from 'kafkajs'

export namespace LaundryEventConsumer {

  // Define Kafka client:
  const kafka: Kafka = new Kafka({
    clientId: 'laundry-app',
    brokers: ['localhost:9092'],
  })

  // Structure of event call back functions:
  type EventCallback = (event: any) => void

  // Kafka consumer to listen for Kafka events:
  const consumer: Consumer = kafka.consumer({ groupId: 'laundry-group' })

  // Array of callbacks to be called upon a Kafka event:
  const eventCallbacks: EventCallback[] = []

  // Providing a way to add a new call back to the consumer:
  export const addEventCallback = (callback: EventCallback) => {
    eventCallbacks.push(callback)
  }

  // Invoke this to connect to Kafka and start listening:
  export const run = async () => {

    // Connect Kafka consumer to Kafka
    await consumer.connect();

    // Subscribe to laundry machine log topic:
    await consumer.subscribe({
      topic: 'laundry-machine-logs',
      fromBeginning: true,
    })

    // Finally, start the consumer:
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = {
          partition,
          offset: message.offset,
          value: message.value.toString(),
        }
        // Broadcast the received Kafka event to all listeners:
        eventCallbacks.forEach((callback: EventCallback) => {
          callback(event)
        })
      },
    })
  }
}
