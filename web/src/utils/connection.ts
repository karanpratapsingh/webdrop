import { Events } from './events';
import { Payload, PayloadType } from '../generated/types';

class ServerConnection {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public subscribe = (): void => {
    const ws = new WebSocket(this.endpoint);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => console.log('Connection: OPEN');
    ws.onclose = () => console.warn('Connection: CLOSE');
    ws.onerror = () => console.error('Connection: ERROR');
    ws.onmessage = this.onMessage;
  };

  private onMessage = (event: MessageEvent<any>): void => {
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
}

export { ServerConnection };
