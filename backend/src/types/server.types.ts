import { PeerInfo } from './peer.types';

export type JoinedPayload = {
  type: PayloadType.JOINED;
  peer: PeerInfo;
};

export type AllPeersPayload = {
  type: PayloadType.ALL_PEERS;
  peers: PeerInfo[];
};

export type Payload = JoinedPayload | AllPeersPayload;

export enum PayloadType {
  JOINED = 'peer-joined',
  ALL_PEERS = 'all-peers'
}
