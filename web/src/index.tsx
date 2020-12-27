import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Payload, PayloadType, PeerInfo } from './generated/types';
import { Events } from './utils';
import './global/main.css';
import { Peers, Details } from './components';

const WS: string = 'ws://localhost:4000';

export function App(): React.ReactElement {
  const [currentPeer, setCurrentPeer] = React.useState<PeerInfo>();

  useEffect(() => {
    Events.on(PayloadType.CURRENT_PEER, event => {
      const { detail: peer } = event as CustomEvent;
      setCurrentPeer(peer);
    });
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => console.log('WS OPEN');
    ws.onclose = () => console.warn('WS CLOSE');
    ws.onerror = () => console.error('WS ERROR');
    ws.onmessage = onMessage;
  }, []);

  const onMessage = (event: MessageEvent<any>): void => {
    const payload: Payload = JSON.parse(event.data);
    switch (payload.type) {
      case PayloadType.CURRENT_PEER:
        Events.emit(PayloadType.CURRENT_PEER, payload.peer);
        break;
      case PayloadType.ALL_PEERS:
        Events.emit(PayloadType.ALL_PEERS, payload.peers);
        break;
      case PayloadType.PEER_JOINED:
        Events.emit(PayloadType.PEER_JOINED, payload.peer);
        break;
      case PayloadType.PEER_LEFT:
        Events.emit(PayloadType.PEER_LEFT, payload.peer);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Peers currentPeer={currentPeer} />
      <Details currentPeer={currentPeer} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
