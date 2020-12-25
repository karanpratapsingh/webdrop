export class Events {
  static emit(type: string, detail: unknown): void {
    const event = new CustomEvent(type, { detail });
    window.dispatchEvent(event);
  }

  static on(type: string, callback: EventListener): void {
    return window.addEventListener(type, callback, false);
  }
}
