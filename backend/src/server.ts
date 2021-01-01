import http from 'http';
import io from 'socket.io';
import Peer from './peer';
import {
  IP,
  CurrentPeerPayloadData,
  Payload,
  PayloadType,
  AllPeersPayloadData,
  PeerInfo,
  PeerJoinedPayloadData,
  PeerLeftPayloadData,
  Payloads
} from './types';

export type ServerOptions = Partial<io.ServerOptions>;

type Rooms = Map<IP, Map<IP, Peer>>;

export default class WebdropServer {
  port: number;
  options: ServerOptions;
  io!: io.Server;
  rooms: Rooms;

  constructor(port: number, options: ServerOptions) {
    this.port = port;
    this.options = options;
    this.rooms = new Map() as Rooms;
  }

  public init = (): void => {
    const server: http.Server = http.createServer(this.healthCheck);
    this.io = new io.Server(server, this.options);
    this.io.on('connection', this.onConnection);
    server.listen(this.port);
    console.log('Server is running on port', this.port);
  };

  private onConnection = (socket: io.Socket): void => {
    const peer: Peer = new Peer(socket);
    peer.socket.on('disconnect', () => {
      this.leaveRoom(peer);
    });
    this.joinRoom(peer);
  };

  private joinRoom = (newPeer: Peer): void => {
    // Send current peer it's details
    const currentPeerPayload: Payload<CurrentPeerPayloadData> = {
      type: PayloadType.CURRENT_PEER,
      data: newPeer.getInfo()
    };
    this.send(newPeer, currentPeerPayload);

    // If room doesn't exist, create it
    if (!this.rooms.has(newPeer.ip)) {
      this.rooms.set(newPeer.ip, new Map());
    }

    const peers = this.rooms.get(newPeer.ip);

    if (peers) {
      // Notify all other peers about new peer
      peers.forEach((peer: Peer) => {
        const peerJoinedPayload: Payload<PeerJoinedPayloadData> = {
          type: PayloadType.PEER_JOINED,
          data: newPeer.getInfo()
        };
        this.send(peer, peerJoinedPayload);
      });

      // Notify peer about the other peers
      const otherPeers: PeerInfo[] = [];
      peers.forEach((otherPeer: Peer) => {
        otherPeers.push(otherPeer.getInfo());
      });

      const payload: Payload<AllPeersPayloadData> = {
        type: PayloadType.ALL_PEERS,
        data: otherPeers
      };

      this.send(newPeer, payload);
      // Add current peer to the room
      this.rooms.get(newPeer.ip)?.set(newPeer.id, newPeer);
    }
  };

  private leaveRoom = (peer: Peer): void => {
    const currentPeerRoom = this.rooms.get(peer.ip);
    if (currentPeerRoom) {
      currentPeerRoom.delete(peer.id);
      const peerLeftPayload: Payload<PeerLeftPayloadData> = {
        type: PayloadType.PEER_LEFT,
        data: peer.getInfo()
      };
      currentPeerRoom.forEach(peer => {
        this.send(peer, peerLeftPayload);
      });
      peer.socket.disconnect();
    }
  };

  private send = (peer: Peer, payload: Payloads): void => {
    peer.socket.emit(payload.type, payload.data);
  };

  private healthCheck = (request: http.IncomingMessage, response: http.ServerResponse): void => {
    if (request.url === '/healthcheck') {
      response.writeHead(200);
      response.end(`Webdrop server is up at ${new Date().toISOString()}`);
    }
  };
}
