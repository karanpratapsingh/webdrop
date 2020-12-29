/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import Peer from 'peerjs';
import React, { memo, useEffect, useState } from 'react';
import {
  AllPeersPayloadData,
  PayloadType,
  PeerInfo,
  PeerJoinedPayloadData,
  PeerLeftPayloadData
} from '../../generated/types';
import {
  ChunkPayload,
  Connection,
  FileChunker,
  FileProgressPayload,
  FileTransferPayloadType,
  getFileInfo,
  SendChunkPayload,
  SendFileInfoPayload,
  TransferCompletePayload
} from '../../utils';

interface PeersProps {
  currentPeer?: PeerInfo;
  peer?: Peer;
}

function Peers(props: PeersProps): React.ReactElement {
  const { currentPeer, peer } = props;
  const [peers, setPeers] = useState<PeerInfo[]>([]);

  useEffect(() => {
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

  if (!currentPeer) {
    return <span>Connecting...</span>;
  }

  const onPeerClick = (event: React.ChangeEvent<HTMLInputElement>, to: PeerInfo): void => {
    event.preventDefault();
    const { files } = event.target;
    if (!files || !files?.length) return;

    const file: File | null = files.item(0);
    if (peer && file) {
      const connection: Peer.DataConnection = peer.connect(to.id);
      connection.on('open', () => onPeerConnectionOpen(file, currentPeer, connection));
    }
  };

  const onPeerConnectionOpen = (file: File, from: PeerInfo, connection: Peer.DataConnection) => {
    const payload: SendFileInfoPayload = {
      type: FileTransferPayloadType.FILE_INFO,
      fileInfo: getFileInfo(file)
    };
    connection.send(payload);

    const onChunk = (chunk: ChunkPayload) => {
      const payload: SendChunkPayload = {
        type: FileTransferPayloadType.CHUNK_RECEIVED,
        from,
        ...chunk
      };
      connection.send(payload);
    };

    const onProgress = (progress: number) => {
      const payload: FileProgressPayload = {
        type: FileTransferPayloadType.PROGRESS,
        progress
      };
      connection.send(payload);
    };

    const onComplete = () => {
      const payload: TransferCompletePayload = {
        type: FileTransferPayloadType.TRANSFER_COMPLETE,
        fileInfo: getFileInfo(file)
      };
      connection.send(payload);
    };

    const chunker = new FileChunker(file, onChunk, onProgress, onComplete);
    chunker.start();
  };

  return (
    <div>
      <h3>Available:</h3>
      {!peers.length && <span>No peer</span>}
      {peers.map((peer, index: number) => (
        <div key={index} style={{ height: 20, background: 'lavender', cursor: 'pointer' }}>
          <input type='file' onChange={event => onPeerClick(event, peer)} />
          <span>
            Name: {peer.name} id:{peer.id}
          </span>
        </div>
      ))}
    </div>
  );
}

export default memo(Peers);
