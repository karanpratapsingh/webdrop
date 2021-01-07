/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import FileSaver from 'file-saver';
import Peer from 'peerjs';
import React, { memo, useCallback, useEffect } from 'react';
import { isChrome, isIOS } from 'react-device-detect';
import { BsPhone } from 'react-icons/bs';
import { PeerInfo } from '../../generated/types';
import { Colors } from '../../theme';
import {
  ChunkPayload,
  FileChunker,
  FileDigester,
  FileInfo,
  FileProgressPayload,
  FileTransferPayload, FileTransferPayloadType,
  getFileInfo,
  SendChunkPayload,
  SendFileInfoPayload,
  TransferCompletePayload
} from '../../utils';
import './Peers.scss';

interface PeersProps {
  currentPeer: PeerInfo;
  peer: Peer;
  peers: PeerInfo[];
}

function Peers(props: PeersProps): React.ReactElement {
  const { currentPeer, peer, peers } = props;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onConnection = useCallback((connection: Peer.DataConnection) => {
    const chunks: Blob[] = [];
    connection.on('data', (data: FileTransferPayload) => {
      switch (data.type) {
        case FileTransferPayloadType.FILE_INFO:
          // TODO: notify user
          break;

        case FileTransferPayloadType.CHUNK_RECEIVED:
          chunks.push(data.chunk);
          break;

        case FileTransferPayloadType.PROGRESS:
          break;

        case FileTransferPayloadType.TRANSFER_COMPLETE:
          // TODO: transfer complete
          onTransferComplete(chunks, data.fileInfo);
          break;

        default:
          break;
      }
    });
  }, []);

  const onTransferComplete = (chunks: Blob[], fileInfo: FileInfo): void => {
    const fileDigester = new FileDigester(chunks, fileInfo);
    const file: File = fileDigester.digest();

    if (isChrome && isIOS) {
      const reader = new FileReader();
      reader.onloadend = () => {
        window.location.href = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      FileSaver.saveAs(file, file.name);
    }
  };

  useEffect(() => {
    peer.on('connection', onConnection);
  }, [onConnection]);


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

  return <div className='peer'>{content}</div>;
}

export default memo(Peers);
