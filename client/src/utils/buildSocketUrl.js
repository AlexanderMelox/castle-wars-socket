const buildSocketUrl = () => {
  let protocol = 'wss://';
  if (['127.0.0.1', 'localhost'].some(t => window.location.href.includes(t)))
      protocol = 'ws://';
  const serverPort = '3001';
  let socket = new WebSocket(protocol + window.location.hostname + `:${serverPort}/websocket`);
  return socket;
}

export default buildSocketUrl;