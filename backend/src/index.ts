import './process';
import WebdropServer, { ServerOptions } from './server';
import { getEnv } from './utils';

const options: ServerOptions = {
  cors: {
    origin: getEnv('REACT_APP_WEBDROP_PROXY'),
    credentials: true
  }
};

console.log('Environment:', process.env.NODE_ENV);
console.log('Options:', options);
const server = new WebdropServer(4000, options);
server.init();
