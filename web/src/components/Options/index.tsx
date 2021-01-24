import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { FaMoon } from 'react-icons/fa';
import { IoIosAddCircleOutline, IoIosSunny, IoLogoGithub } from 'react-icons/io';
import Config from '../../config';
import './Options.scss';

interface Props {
  darkMode: boolean;
  toggleTheme: () => void;
}

const pwaID: string = 'install-pwa';

function Options(props: Props): React.ReactElement {
  const { darkMode, toggleTheme } = props;

  useEffect(() => {
    const listener = (event: any): void => {
      const { matches } = window.matchMedia('(display-mode: standalone)');
      if (matches) {
        return event.preventDefault();
      } else {
        const button: HTMLElement | null = document.getElementById(pwaID);
        if (button) {
          button.onclick = () => event.prompt();
        }

        return event.preventDefault();
      }
    };

    window.addEventListener('beforeinstallprompt', listener);

    return () => {
      window.removeEventListener('beforeinstallprompt', listener);
    };
  }, []);

  const openGithub = (): void => {
    window.open(Config.github, '_blank');
  };

  let themeIcon: React.ReactNode = <IoIosSunny className='icon' onClick={toggleTheme} size={30} />;

  if (darkMode) {
    themeIcon = <FaMoon className='icon' onClick={toggleTheme} size={20} />;
  }

  return (
    <div className='options'>
      {!isMobile && <IoIosAddCircleOutline id={pwaID} className='icon' size={27} />}
      {themeIcon}
      <IoLogoGithub className='icon' size={24} onClick={openGithub} />
    </div>
  );
}

export default Options;
