let socket;
let listeners = [];

const init = () => {
  socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  socket.onmessage = event => {
    const data = JSON.parse(event.data);

    listeners.forEach(listener => listener(data));
  };
};

const sendMessage = (type, payload) => {
  socket.send(
    JSON.stringify({
      type,
      payload,
    }),
  );
};

const subscribe = callback => {
  listeners.push(callback);

  return () => {
    // Unsubscribe from socket (can be used by useEffect for cleanup when component unmounts)
    listeners = listeners.filter(listener => listener !== callback);
  };
};

export default {
  init,
  sendMessage,
  subscribe,
};
