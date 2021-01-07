import FileSaver from 'file-saver';
import Peer from 'peerjs';
import React, { useCallback, useEffect, useState } from 'react';
import { isChrome, isIOS } from 'react-device-detect';
import Loader from 'react-loader-spinner';
import { Details, Peers } from '../../components';
import { CurrentPeerPayloadData, PayloadType, PeerInfo } from '../../generated/types';
import { Colors } from '../../theme';
import { Connection, FileDigester, FileInfo, FileTransferPayload, FileTransferPayloadType } from '../../utils';
import './Home.scss';

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

  let content: React.ReactNode = (
    <div className='loader'>
      <Loader type='Oval' color={Colors.primary} height={50} width={50} />
    </div>
  );

  if (peer && currentPeer) {
    content = (
      <React.Fragment>
        <Peers peer={peer} currentPeer={currentPeer} />
        <Details currentPeer={currentPeer} />
      </React.Fragment>
    );
  }

  // TODO: make theme switchable
  return <div className='theme--light home'>{content}</div>;
}

export default Home;
