import { io, Socket } from 'socket.io-client';
import Config from '../config';

class IOClient {
  io: Socket;
  static instance: IOClient;

  private constructor() {
    this.io = io(Config.endpoint);
  }

  static getInstance = (): IOClient => {
    if (!IOClient.instance) {
      IOClient.instance = new IOClient();
    }

    return IOClient.instance;
  };

  public getSocket = (): Socket => {
    return this.io;
  };
}

const Connection: Socket = IOClient.getInstance().getSocket();

export { Connection };
