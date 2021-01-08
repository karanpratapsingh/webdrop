/* eslint-disable react-hooks/exhaustive-deps */
import Peer from 'peerjs';
import React, { useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import Loader from 'react-loader-spinner';
import { Details, Peers, Ripple, Options } from '../../components';
import {
  AllPeersPayloadData,
  CurrentPeerPayloadData,
  PayloadType,
  PeerInfo,
  PeerJoinedPayloadData,
  PeerLeftPayloadData
} from '../../generated/types';
import { Colors, Theme } from '../../theme';
import { Connection } from '../../utils';
import './Home.scss';
import { useMediaPredicate } from 'react-media-hook';

function Home(): React.ReactElement {
  const [currentPeer, setCurrentPeer] = useState<PeerInfo>();
  const [peer, setPeer] = useState<Peer>();
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const defaultTheme: Theme = useMediaPredicate('(prefers-color-scheme: dark)') ? Theme.DARK : Theme.LIGHT;
  const [theme, setTheme] = useState<Theme>(defaultTheme);

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

  const onThemeUpdate = (theme: Theme): void => {
    setTheme(theme);
  };

  let content: React.ReactNode = (
    <div className='loader'>
      <Loader type='Oval' color={Colors.primary} height={50} width={50} />
    </div>
  );

  if (peer && currentPeer) {
    content = (
      <React.Fragment>
        <Options theme={theme} onThemeUpdate={onThemeUpdate} />
        <Peers peers={peers} peer={peer} currentPeer={currentPeer} />
        <Details currentPeer={currentPeer} />
        <Ripple />
      </React.Fragment>
    );
  }

  return (
    <Div100vh className={`theme--${theme} root`}>
      <div className='home'>{content}</div>
    </Div100vh>
  );
}

export default Home;
