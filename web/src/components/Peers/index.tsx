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
import './Peers.scss';
import { BsPhone } from 'react-icons/bs';
import { Colors } from '../../theme';

interface PeersProps {
  currentPeer: PeerInfo;
  peer: Peer;
}

function Peers(props: PeersProps): React.ReactElement {
  const { currentPeer, peer } = props;
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const onPeerClick = (): void => {
    fileInputRef.current?.click();
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>, to: PeerInfo): void => {
    event.preventDefault();
    const { files } = event.target;
    if (!files || !files?.length) return;

    const file: File | null = files.item(0);
    if (file) {
      const connection: Peer.DataConnection = peer.connect(to.id);
      connection.on('open', () => onPeerConnectionOpen(file, currentPeer, connection));
    }
  };

  const onPeerConnectionOpen = (file: File, from: PeerInfo, connection: Peer.DataConnection): void => {
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

  const hasPeers: boolean = !!peers.length;

  let content: React.ReactNode = <span>Open webdrop on other devices to send files</span>;

  if (hasPeers) {
    content = (
      <div className='peers-content'>
        <span className='heading'>Click to send a file</span>
        <div className='peer-list'>
          {peers.map((peer: PeerInfo, index: number) => (
            <div key={index} className='peer-card'>
              <div className='icon'>
                <BsPhone onClick={onPeerClick} color={Colors.white} size={25} />
              </div>
              <input ref={fileInputRef} hidden type='file' onChange={event => onFileSelect(event, peer)} />
              <span className='name'>{peer.name}</span>
              {/* TODO: add type */}
              <span className='info'>Mac Chrome</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='peer'>
      {content}
    </div>
  );
}

export default memo(Peers);
