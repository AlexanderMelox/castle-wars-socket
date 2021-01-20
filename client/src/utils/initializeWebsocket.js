import buildSocketUrl from "./buildSocketUrl";

const initializeWebsocket = (roomId) => {
  let socket = null;
  // initialize websocket
  const initWebSocket = () => {
    console.log('init function!!!!');
    console.log(window.location.hostname);
    try {
      socket = buildSocketUrl();
      console.log(socket);
      socket.addEventListener('open', () => {
        console.log('CONNECTED TO WEBSOCKET');
        // send in user data
        // {
        //   name: 'string',
        //   roomId: 'string'
        // }
        // socket.send(JSON.stringify({
        //   name: 'Player 1',
        //   roomId: 'testroom'
        // }));
        // destory app on reconnect
        // start app
        // app = startSimpleApp();
      });
      socket.addEventListener('message', res => {
        console.log({res});
        console.log(res.data);
        // update app
        // app.message(res);
      });
      socket.addEventListener('close', () => {
        console.log('DISCONNECTED');
        setTimeout(() => initWebSocket(), 1000);
        console.log('TRYING TO RECONNECT');
      });
    } catch (err) {
      console.log(err);
      setTimeout(() => initWebSocket(), 1000);
      console.log('TRYING TO RECONNECT');
    }
  };
  initWebSocket();
}

export default initializeWebsocket;