import './process';
import WebdropServer from './server';
import WebSocket from 'ws';

const options: WebSocket.ServerOptions = {
  port: 4000
};

const server = new WebdropServer(options);
server.init();
