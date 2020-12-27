import React, { useEffect, useState } from 'react';
import { PayloadType, PeerInfo } from '../../generated/types';
import { EventData, Events } from '../../utils';

interface PeersProps {
  currentPeer?: PeerInfo;
}

function Peers(props: PeersProps): React.ReactElement {
  const { currentPeer } = props;
  const [peers, setPeers] = useState<PeerInfo[]>([]);

  useEffect(() => {
    Events.on(PayloadType.ALL_PEERS, onAllPeers);
    Events.on(PayloadType.PEER_JOINED, onPeerJoined);
    Events.on(PayloadType.PEER_LEFT, onPeerLeft);
  }, []);

  const onAllPeers = (data: EventData): void => {
    const peers = data as PeerInfo[];
    setPeers(peers);
  };

  const onPeerJoined = (data: EventData): void => {
    const peer = data as PeerInfo;
    const updatedPeer = peers;
    updatedPeer.push(peer);
    setPeers(updatedPeer);
  };

  const onPeerLeft = (data: EventData): void => {
    const peer = data as PeerInfo;
    const updatedPeer = peers.filter(({ id }) => id !== peer.id || id !== currentPeer?.id);
    setPeers(updatedPeer);
  };

  if (!currentPeer) {
    return <span>Connecting...</span>;
  }

  return (
    <div>
      <h3>Available:</h3>
      {!peers.length && <span>No peer</span>}
      {peers.map((peer, index: number) => (
        <p key={index}>
          Name: {peer.name} id:{peer.id}
        </p>
      ))}
    </div>
  );
}

export default Peers;
