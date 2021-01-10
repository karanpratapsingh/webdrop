import Peer from 'peerjs';
import React, { useCallback, useEffect, useState } from 'react';
import Div100vh from 'react-div-100vh';
import Loader from 'react-loader-spinner';
import { useMediaPredicate } from 'react-media-hook';
import { Details, Options, Peers } from '../../components';
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

function Home(): React.ReactElement {
  const [currentPeer, setCurrentPeer] = useState<PeerInfo>();
  const [peer, setPeer] = useState<Peer>();
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const defaultTheme: Theme = useMediaPredicate('(prefers-color-scheme: dark)') ? Theme.DARK : Theme.LIGHT;
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const onAllPeers = useCallback((peers: AllPeersPayloadData): void => {
    setPeers(peers);
    console.log('ALL_PEERS', peers);
  }, []);

  const onPeerJoined = useCallback((peer: PeerJoinedPayloadData): void => {
    const updatedPeer = [...peers];
    updatedPeer.push(peer);
    console.log('PEER_JOINED peers', peers);
    console.log('PEER_JOINED updatedPeer', updatedPeer);
    setPeers(updatedPeer);
  }, [peers]);

  const onPeerLeft = useCallback((peer: PeerLeftPayloadData): void => {
    const updatedPeer = [...peers].filter(({ id }) => id !== peer.id);
    console.log('PEER_LEFT', updatedPeer);
    setPeers(updatedPeer);
  }, [peers]);

  const onCurrentPeer = useCallback((currentPeer: CurrentPeerPayloadData): void => {
    setCurrentPeer(currentPeer);
    const peer = new Peer(currentPeer.id);
    setPeer(peer);
  }, []);

  useEffect(() => {
    Connection.on(PayloadType.CURRENT_PEER, onCurrentPeer);
    Connection.on(PayloadType.ALL_PEERS, onAllPeers);
    Connection.on(PayloadType.PEER_JOINED, onPeerJoined);
    Connection.on(PayloadType.PEER_LEFT, onPeerLeft);
  }, [onCurrentPeer, onAllPeers, onPeerJoined, onPeerLeft]);

  const onThemeUpdate = (theme: Theme): void => {
    setTheme(theme);
  };

  let content: React.ReactNode = (
    <div className='loader'>
      <Loader type='Oval' color={Colors.primary} height={40} width={40} />
    </div>
  );

  if (peer && currentPeer) {
    content = (
      <React.Fragment>
        <Options theme={theme} onThemeUpdate={onThemeUpdate} />
        <Peers peers={peers} peer={peer} currentPeer={currentPeer} />
        <Details currentPeer={currentPeer} />
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
