import FileSaver from 'file-saver';
import Peer from 'peerjs';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { isChrome, isIOS } from 'react-device-detect';
import { BsLaptop, BsPhone } from 'react-icons/bs';
import { ID, PeerInfo } from '../../generated/types';
import { Colors } from '../../theme';
import {
  ChunkPayload,
  FileChunker,
  FileDigester,
  FileInfo,
  FileProgressPayload,
  FileTransferPayload,
  FileTransferPayloadType,
  getFileInfo,
  SendChunkPayload,
  SendFileInfoPayload,
  TransferCompletePayload,
  useNotification
} from '../../utils';
import './Peers.scss';

interface PeersProps {
  currentPeer: PeerInfo;
  peer: Peer;
  peers: PeerInfo[];
}

type ProgressInfo = {
  id: ID;
  value: number;
};

function Peers(props: PeersProps): React.ReactElement {
  const { currentPeer, peer, peers } = props;
  const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null);
  const [openSnackbar] = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onConnection = useCallback((connection: Peer.DataConnection) => {
    const chunks: Blob[] = [];
    connection.on('data', (data: FileTransferPayload) => {
      switch (data.type) {
        case FileTransferPayloadType.FILE_INFO:
          openSnackbar(`Receiving ${data.fileInfo.name} from ${data.from.name}`);
          break;

        case FileTransferPayloadType.CHUNK_RECEIVED:
          chunks.push(data.chunk);
          break;

        case FileTransferPayloadType.PROGRESS: {
          const { from, progress } = data;
          const progressInfo: ProgressInfo = {
            id: from.id,
            value: progress
          };
          setProgressInfo(progressInfo);
          break;
        }
        case FileTransferPayloadType.TRANSFER_COMPLETE:
          openSnackbar('Transfer complete');
          onTransferComplete(chunks, data.fileInfo);
          break;

        default:
          break;
      }
    });
  }, [openSnackbar]);

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
  }, [peer, onConnection]);

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
      connection.on('open', () => onPeerConnectionOpen(currentPeer, to, file, connection));
    }
  };

  const onPeerConnectionOpen = (from: PeerInfo, to: PeerInfo, file: File, connection: Peer.DataConnection): void => {
    const payload: SendFileInfoPayload = {
      type: FileTransferPayloadType.FILE_INFO,
      from,
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
        from,
        progress
      };
      connection.send(payload);
      const progressInfo: ProgressInfo = {
        id: to.id,
        value: progress
      };
      setProgressInfo(progressInfo);
    };

    const onComplete = () => {
      const payload: TransferCompletePayload = {
        type: FileTransferPayloadType.TRANSFER_COMPLETE,
        fileInfo: getFileInfo(file)
      };
      connection.send(payload);
      openSnackbar('Transfer complete');
    };

    const chunker = new FileChunker(file, onChunk, onProgress, onComplete);
    chunker.start();
  };

  const getIcon = (peerId: ID, mobile: boolean): React.ReactNode => {
    const props = {
      className: 'device',
      onClick: onPeerClick,
      color: Colors.white,
      size: 25
    };

    let icon: React.ReactNode = <BsLaptop {...props} />;

    if (mobile) {
      icon = <BsPhone {...props} />;
    }

    let progress: React.ReactNode = null;

    if (progressInfo && peerId === progressInfo.id) {
      const styles = buildStyles({
        pathColor: Colors.white,
        trailColor: Colors.primary
      });
      progress = <CircularProgressbar value={progressInfo.value} strokeWidth={4} styles={styles} />;
    }

    return (
      <div className='icon'>
        {progress}
        {icon}
      </div>
    );
  };

  const hasPeers: boolean = !!peers.length;

  let content: React.ReactNode = <span>Open Webdrop on other devices to send files</span>;

  if (hasPeers) {
    content = (
      <div className='peers-content'>
        <span className='heading'>Click to send a file</span>
        <div className='peer-list'>
          {peers.map((peer: PeerInfo, index: number) => (
            <div key={index} className='peer-card'>
              {getIcon(peer.id, peer.mobile)}
              <input ref={fileInputRef} hidden type='file' onChange={event => onFileSelect(event, peer)} />
              <span className='name'>{peer.name}</span>
              <span className='info'>
                {peer.os} {peer.browser}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className='peer'>{content}</div>;
}

export default memo(Peers);
