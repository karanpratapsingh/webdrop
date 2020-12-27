import React, { useEffect } from 'react';
import { Details, Peers } from '../../components';
import Config from '../../config';
import { PayloadType, PeerInfo } from '../../generated/types';
import { EventData, Events, ServerConnection } from '../../utils';

function Home(): React.ReactElement {
  const [currentPeer, setCurrentPeer] = React.useState<PeerInfo>();

  useEffect(() => {
    const connection = new ServerConnection(Config.endpoint);
    connection.subscribe();

    Events.on(PayloadType.CURRENT_PEER, onCurrentPeer);
  }, []);

  const onCurrentPeer = (data: EventData): void => {
    const peer = data as PeerInfo;
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
