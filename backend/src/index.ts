import './process';
import WebdropServer, { ServerOptions } from './server';

const options: ServerOptions = {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
};

console.log('Environment:', process.env.NODE_ENV);
const server = new WebdropServer(4000, options);
server.init();
