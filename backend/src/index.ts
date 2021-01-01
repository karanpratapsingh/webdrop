import './process';
import WebdropServer, { ServerOptions } from './server';
import { isDevelopment } from './utils';

const options: ServerOptions = {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
};

const port: number = isDevelopment ? 4000 : 80;
const server = new WebdropServer(port, options);
server.init();
