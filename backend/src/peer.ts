import io from 'socket.io';
import { animals, colors, uniqueNamesGenerator, Config } from 'unique-names-generator';
import { v4 as uuid } from 'uuid';
import { ID, IP, PeerInfo } from './types';
import UAParser from 'ua-parser-js';
import { withDefaultString, isMobile } from './utils';

export default class Peer {
  id: ID;
  ip: IP;
  name: string;
  isMobile!: boolean;
  os: string;
  browser: string;
  mobile: boolean;
  socket: io.Socket;

  constructor(socket: io.Socket) {
    this.socket = socket;
    this.id = uuid();
    this.ip = this.getIP(socket);
    this.name = this.generateName();

    const ua = socket.request.headers['user-agent'];
    const parsedUA = new UAParser(ua);

    this.browser = withDefaultString(parsedUA.getBrowser().name);
    this.os = withDefaultString(parsedUA.getOS().name);
    this.mobile = isMobile(ua);
  }

  private getIP(socket: io.Socket): IP {
    const { headers } = socket.request;
    let ip: string = (headers['x-forwarded-for'] as string) || socket.handshake.address;

    if (['::1', '::ffff:127.0.0.1'].includes(ip)) {
      ip = '127.0.0.1';
    }

    return ip;
  }

  public getInfo = (): PeerInfo => {
    const { id, ip, name, browser, os, mobile } = this;
    return { id, ip, name, browser, os, mobile };
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
