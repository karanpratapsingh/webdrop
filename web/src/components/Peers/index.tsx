import React, { useState, useEffect } from 'react';
import { PayloadType, PeerInfo } from '../../generated/types';
import { Events } from '../../utils';

interface PeersProps {
  currentPeer?: PeerInfo;
}

function Peers(props: PeersProps): React.ReactElement {
  const { currentPeer } = props;

  const [peers, setPeers] = useState<PeerInfo[]>([]);

  useEffect(() => {
    Events.on(PayloadType.ALL_PEERS, event => {
      const { detail: peers } = event as CustomEvent;
      setPeers(peers);
    });

    Events.on(PayloadType.PEER_JOINED, event => {
      const { detail: peer } = event as CustomEvent;
      const updatedPeer = peers;
      updatedPeer.push(peer);
      setPeers(updatedPeer);
    });

    Events.on(PayloadType.PEER_LEFT, event => {
      const { detail: peer } = event as CustomEvent;
      let updatedPeer = peers.filter(({ id }) => id !== peer.id);
      updatedPeer = updatedPeer.filter(({ id }) => id !== currentPeer?.id);
      setPeers(updatedPeer);
    });
  }, []);

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
