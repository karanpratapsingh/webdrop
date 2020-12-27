import { PeerInfo } from '../generated/types';

export type EventData = PeerInfo | PeerInfo[];

export type EventCallback = (data: EventData) => void;

export class Events {
  static emit(type: string, detail: unknown): void {
    const event = new CustomEvent(type, { detail });
    window.dispatchEvent(event);
  }

  static on(type: string, callback: EventCallback): void {
    return window.addEventListener(
      type,
      (event: Event): void => {
        const { detail: data } = event as CustomEvent;
        callback(data);
      },
      false
    );
  }
}
