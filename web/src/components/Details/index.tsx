import React from 'react';
import { PeerInfo } from '../../generated/types';
import './Details.scss';
import Logo from '../../assets/svgs/logo.svg';
import Ripple from '../Ripple';

interface DetailsProps {
  currentPeer: PeerInfo;
}

function Details(props: DetailsProps): React.ReactElement {
  const { currentPeer } = props;

  return (
    <div className='details'>
      <Ripple>
        <img className='airdrop-logo' src={Logo} alt='airdrop logo' />
      </Ripple>
      <span>You are known as {currentPeer.name}</span>
      <p>you can be discovered by anyone on the network</p>
    </div>
  );
}

export default Details;
