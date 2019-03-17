import { Server } from 'mock-socket';

let mockServer;
let listeners = [];

const init = () => {
  mockServer = new Server(process.env.REACT_APP_WEBSOCKET_URL);

  mockServer.on('connection', socket => {
    socket.on('message', message => {
      listeners.forEach(listener => {
        const parsedMessage = JSON.parse(message);
        listener(socket, parsedMessage);
      });
    });
  });
};

const subscribe = callback => {
  listeners.push(callback);

  return () => {
    // Unsubscribe callback
    listeners = listeners.filter(listener => listener !== callback);
  };
};

export default {
  init,
  subscribe,
};
