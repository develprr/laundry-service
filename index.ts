import express, { Express } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import dotenv from "dotenv";
import { LaundryEventConsumer } from './src/LaundryEventConsumer';
import { LaundryEventProducer } from './src/LaundryEventProducer';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const socketServer = http.createServer(app);
const wss = new WebSocket.Server({ server: socketServer });

wss.on('connection', (ws: WebSocket) => {
  LaundryEventConsumer.addEventCallback((data) => {
    ws.send(data.value);
  });
});

LaundryEventConsumer.run();

setInterval(() => {
  LaundryEventProducer.sendRecord();
}, 1000);

socketServer.listen(process.env.SOCKET_PORT, () => {
  console.log(`Server started on port ${process.env.SOCKET_PORT} :)`);
});
