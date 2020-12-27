/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from 'react';
import { AllPeersPayloadData, PayloadType, PeerInfo, PeerJoinedPayloadData, PeerLeftPayloadData } from '../../generated/types';
import { Connection } from '../../utils';

interface PeersProps {
  currentPeer?: PeerInfo;
}

function Peers(props: PeersProps): React.ReactElement {
  const { currentPeer } = props;
  const [peers, setPeers] = useState<PeerInfo[]>([]);

  useEffect(() => {
    Connection.on(PayloadType.ALL_PEERS, onAllPeers);
    Connection.on(PayloadType.PEER_JOINED, onPeerJoined);
    Connection.on(PayloadType.PEER_LEFT, onPeerLeft);
  }, []);

  const onAllPeers = (peers: AllPeersPayloadData): void => {
    setPeers(peers);
  };

  const onPeerJoined = (peer: PeerJoinedPayloadData): void => {
    const updatedPeer = [...peers];
    updatedPeer.push(peer);
    setPeers(updatedPeer);
  };

  const onPeerLeft = (peer: PeerLeftPayloadData): void => {
    const updatedPeer = [...peers].filter(({ id }) => id !== peer.id);
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

export default memo(Peers);
