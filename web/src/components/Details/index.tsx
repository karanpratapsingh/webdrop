import React from 'react';
import { PeerInfo } from '../../generated/types';

interface DetailsProps {
  currentPeer?: PeerInfo;
}

function Details(props: DetailsProps): React.ReactElement {
  const { currentPeer } = props;

  if (!currentPeer) return <span>Loading...</span>;

  return (
    <div>
      <hr></hr>
      <h3>Details:</h3>
      <p>
        <b>Name:</b> {currentPeer?.name}
      </p>
      <p>
        <b>ID:</b> {currentPeer?.id}
      </p>
      <p>
        <b>IP:</b> {currentPeer?.ip}
      </p>
    </div>
  );
}

export default Details;
