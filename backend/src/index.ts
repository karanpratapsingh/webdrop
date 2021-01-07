import './process';
import WebdropServer, { ServerOptions } from './server';
import { getAllowedOrigin } from './utils';

const options: ServerOptions = {
  cors: {
    origin: getAllowedOrigin(),
    credentials: true
  }
};

console.log('Environment:', process.env.NODE_ENV);
console.log('Options:', options);
const server = new WebdropServer(4000, options);
server.init();
