import React, { useEffect } from 'react';
import { Details, Peers } from '../../components';
import { CurrentPeerPayloadData, PayloadType, PeerInfo } from '../../generated/types';
import { Connection } from '../../utils';

function Home(): React.ReactElement {
  const [currentPeer, setCurrentPeer] = React.useState<PeerInfo>();

  useEffect(() => {
    Connection.on(PayloadType.CURRENT_PEER, onCurrentPeer);
  }, []);

  const onCurrentPeer = (peer: CurrentPeerPayloadData): void => {
    setCurrentPeer(peer);
  };

  return (
    <div>
      <Peers currentPeer={currentPeer} />
      <Details currentPeer={currentPeer} />
    </div>
  );
}

export default Home;
