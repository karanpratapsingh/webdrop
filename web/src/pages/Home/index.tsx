import Peer from 'peerjs';
import React, { useCallback, useEffect, useState } from 'react';
import { Details, Peers } from '../../components';
import { CurrentPeerPayloadData, PayloadType, PeerInfo } from '../../generated/types';
import { Connection, FileDigester, FileInfo, FileTransferPayload, FileTransferPayloadType } from '../../utils';

const downloadElementId: string = 'download';

function Home(): React.ReactElement {
  const [currentPeer, setCurrentPeer] = useState<PeerInfo>();
  const [peer, setPeer] = useState<Peer>();

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
    const { file, url } = fileDigester.digest();
    const anchorElement: HTMLAnchorElement = document.getElementById(downloadElementId) as HTMLAnchorElement;
    anchorElement.href = url;
    anchorElement.download = file.name;
    anchorElement.click();
  };

  useEffect(() => {
    if (peer) peer.on('connection', onConnection);
  }, [peer, onConnection]);

  useEffect(() => {
    Connection.on(PayloadType.CURRENT_PEER, onCurrentPeer);
  }, []);

  const onCurrentPeer = (currentPeer: CurrentPeerPayloadData): void => {
    setCurrentPeer(currentPeer);
    const peer = new Peer(currentPeer.id);
    setPeer(peer);
  };

  return (
    <div>
      <Peers peer={peer} currentPeer={currentPeer} />
      <Details currentPeer={currentPeer} />
      <a id={downloadElementId}></a>
    </div>
  );
}

export default Home;
