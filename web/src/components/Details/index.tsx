import React from 'react';
import { PeerInfo } from '../../generated/types';
import './Details.scss';
import Logo from '../../assets/logo.svg';

interface DetailsProps {
  currentPeer: PeerInfo;
}

function Details(props: DetailsProps): React.ReactElement {
  const { currentPeer } = props;

  return (
    <div className='details'>
      <img src={Logo} alt='airdrop logo' />
      <span>You are known as {currentPeer.name}</span>
      <p>you can be discovered by anyone on the network</p>
    </div>
  );
}

export default Details;
