import http from 'http';
import WebSocket from 'ws';
import Peer from './peer';
import {
  IP,
  PeerInfo,
  PayloadType,
  Payload,
  AllPeersPayload,
  PeerJoinedPayload,
  PeerLeftPayload,
  CurrentPeerPayload
} from './types';

type Rooms = Map<IP, Map<IP, Peer>>;

export default class WebdropServer {
  options: WebSocket.ServerOptions;
  wss!: WebSocket.Server;
  rooms!: Rooms;

  constructor(options: WebSocket.ServerOptions) {
    this.options = options;
  }

  public init = (): void => {
    this.wss = new WebSocket.Server(this.options);
    this.wss.on('connection', this.onConnection);
    this.rooms = new Map() as Rooms;
    console.log('Server is running on port', this.options.port);
  };

  private onConnection = (socket: WebSocket, request: http.IncomingMessage): void => {
    const peer: Peer = new Peer(socket, request);
    const currentPeerPayload: CurrentPeerPayload = {
      type: PayloadType.CURRENT_PEER,
      peer: peer.getInfo()
    };
    this.send(peer, currentPeerPayload);
    peer.socket.addListener('close', () => {
      this.leaveRoom(peer);
    });
    this.joinRoom(peer);
  };

  private joinRoom = (newPeer: Peer): void => {
    // if room doesn't exist, create it
    if (!this.rooms.has(newPeer.ip)) {
      console.log('Created a room');
      this.rooms.set(newPeer.ip, new Map());
    }

    const peers = this.rooms.get(newPeer.ip);

    if (peers) {
      // Notify all other peers about new peer
      peers.forEach((peer: Peer) => {
        const peerJoinedPayload: PeerJoinedPayload = {
          type: PayloadType.PEER_JOINED,
          peer: newPeer.getInfo()
        };
        this.send(peer, peerJoinedPayload);
      });

      // Notify peer about the other peers
      const otherPeers: PeerInfo[] = [];
      peers.forEach((otherPeer: Peer) => {
        otherPeers.push(otherPeer.getInfo());
      });

      const payload: AllPeersPayload = {
        type: PayloadType.ALL_PEERS,
        peers: otherPeers
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
      const peerLeftPayload: PeerLeftPayload = {
        type: PayloadType.PEER_LEFT,
        peer: peer.getInfo()
      };
      currentPeerRoom.forEach(peer => {
        this.send(peer, peerLeftPayload);
      });
      peer.socket.terminate();
    }
  };

  private send = (peer: Peer, payload: Payload): void => {
    console.log(`[EVENT]: ${payload.type} => ${JSON.stringify(payload, null, 2)}`);
    peer.socket.send(JSON.stringify(payload));
  };
}
