/* eslint-disable react-hooks/exhaustive-deps */
import Peer from 'peerjs';
import React, { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import Loader from 'react-loader-spinner';
import { Details, Peers, Ripple } from '../../components';
import {
  AllPeersPayloadData,
  CurrentPeerPayloadData,
  PayloadType,
  PeerInfo,
  PeerJoinedPayloadData,
  PeerLeftPayloadData
} from '../../generated/types';
import { Colors } from '../../theme';
import { Connection } from '../../utils';
import './Home.scss';

function Home(): React.ReactElement {
  const [currentPeer, setCurrentPeer] = useState<PeerInfo>();
  const [peer, setPeer] = useState<Peer>();
  const [peers, setPeers] = useState<PeerInfo[]>([]);

  useEffect(() => {
    Connection.on(PayloadType.CURRENT_PEER, onCurrentPeer);
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

  const onCurrentPeer = (currentPeer: CurrentPeerPayloadData): void => {
    setCurrentPeer(currentPeer);
    const peer = new Peer(currentPeer.id);
    setPeer(peer);
  };

  let content: React.ReactNode = (
    <div className='loader'>
      <Loader type='Oval' color={Colors.primary} height={50} width={50} />
    </div>
  );

  if (peer && currentPeer) {
    content = (
      <React.Fragment>
        <Peers peers={peers} peer={peer} currentPeer={currentPeer} />
        <Details currentPeer={currentPeer} />
      </React.Fragment>
    );
  }

  // TODO: make theme switchable
  return (
    <Div100vh className='theme--light root'>
      <div className='home'>
        {content}
        <Ripple />
      </div>
    </Div100vh>
  );
}

export default Home;
