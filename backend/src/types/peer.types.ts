export type ID = string;

export type IP = string;

export type PeerInfo = {
  id: ID;
  ip: IP;
  name: string;
  os: string;
  browser: string;
  mobile: boolean;
};
