import WebSocket from 'ws';
import http from 'http';
import { v4 as uuid } from 'uuid';
import { ID, IP, PeerInfo } from './types';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

export default class Peer {
  id: ID;
  ip: IP;
  name: string;
  socket: WebSocket;

  constructor(socket: WebSocket, request: http.IncomingMessage) {
    this.socket = socket;
    this.id = uuid();
    this.ip = this.getIP(request);
    this.name = this.generateName();
  }

  private getIP(request: http.IncomingMessage): IP {
    let ip: IP;
    const forwardedHeader = request.headers['x-forwarded-for'] as string;
    if (forwardedHeader) {
      ip = forwardedHeader.split(/\s*,\s*/)[0];
    } else {
      ip = request.connection.remoteAddress ?? '';
    }
    // Detect and set localhost
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
    return uniqueNamesGenerator({ dictionaries: [colors, animals] });
  };
}
