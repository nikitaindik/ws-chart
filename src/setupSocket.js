import { Server } from 'mock-socket';

import getFakeDataForDisplay from './segments/utils/fakeData';

// SERVER START

const mockServer = new Server('ws://localhost:8080');

mockServer.on('connection', socket => {
  socket.on('message', data => {
    socket.send(
      JSON.stringify({
        type: 'history',
        data: getFakeDataForDisplay(),
      }),
    );

    setInterval(() => {
      socket.send(
        JSON.stringify({
          type: 'update',
          data: {
            segmentId: 123,
            timestamp: Date.now(),
            change: Math.random() > 0.5 ? 1 : -1,
          },
        }),
      );
    }, 3000);
  });
});

// SERVER END

// CONNECTION START

const socket = new WebSocket('ws://localhost:8080');

// CONNECTION END

const subscriptions = [];

const subscribe = callback => {
  subscriptions.push(callback);
};

const initMockServer = () => {};

const initConnection = () => {
  socket.onmessage = event => {
    const data = JSON.parse(event.data);

    subscriptions.forEach(callback => callback(data));
  };
};

const sendMessage = (type, payload) => {
  socket.send({
    type,
    payload,
  });
};

export default {
  initMockServer,
  initConnection,
  sendMessage,
  subscribe,
};

// Module's responsibilities
// - Establish connection
// - Notify listeners when new message arrives
