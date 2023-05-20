import { Kafka } from "kafkajs";

export namespace LaundryEventProducer {
  const kafka = new Kafka({
    clientId: "laundry-producer",
    brokers: ["localhost:9092"],
  });

  const producer = kafka.producer();

  export const sendRecord = async () => {
    console.log("send record");
    await producer.connect();
    await producer.send({
      topic: "laundry-machine-logs",
      messages: [{ value: "Hello from Laundry Service Corp!" }],
    });
  };
}
