import io from 'socket.io';
import { animals, colors, uniqueNamesGenerator, Config } from 'unique-names-generator';
import { v4 as uuid } from 'uuid';
import { ID, IP, PeerInfo } from './types';

export default class Peer {
  id: ID;
  ip: IP;
  name: string;
  socket: io.Socket;

  constructor(socket: io.Socket) {
    this.socket = socket;
    this.id = uuid();
    this.ip = this.getIP(socket);
    this.name = this.generateName();
  }

  private getIP(socket: io.Socket): IP {
    let ip: string = socket.request.headers['x-forwarded-for'] as string || socket.handshake.address;

    if (['::1', '::ffff:127.0.0.1'].includes(ip)) {
      ip = '127.0.0.1';
    }

    return ip;
  }

  public getInfo = (): PeerInfo => {
    const { id, ip, name } = this;
    return { id, ip, name };
  };

  private generateName = (): string => {
    const config: Config = {
      dictionaries: [colors, animals],
      separator: ' ',
      style: 'capital'
    };
    return uniqueNamesGenerator(config);
  };
}
