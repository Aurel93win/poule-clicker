const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const { getCounter, setCounter, initDB } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let counter = 0;

async function start() {
  await initDB();
  counter = await getCounter();

  io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté');
    socket.emit('update', counter);

    socket.on('click', async () => {
      counter++;
      await setCounter(counter);
      io.emit('update', counter);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

start();
