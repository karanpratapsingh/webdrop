import { PeerInfo } from './peer.types';

export type CurrentPeerPayload = {
  type: PayloadType.CURRENT_PEER;
  peer: PeerInfo;
};

export type AllPeersPayload = {
  type: PayloadType.ALL_PEERS;
  peers: PeerInfo[];
};

export type PeerJoinedPayload = {
  type: PayloadType.PEER_JOINED;
  peer: PeerInfo;
};

export type PeerLeftPayload = {
  type: PayloadType.PEER_LEFT;
  peer: PeerInfo;
};

export type Payload = CurrentPeerPayload | AllPeersPayload |PeerJoinedPayload | PeerLeftPayload;

export enum PayloadType {
  CURRENT_PEER = 'current-peer',
  ALL_PEERS = 'all-peers',
  PEER_JOINED = 'peer-joined',
  PEER_LEFT = 'peer-left'
}
