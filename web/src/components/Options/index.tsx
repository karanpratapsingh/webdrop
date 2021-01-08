import React, { useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { IoIosAddCircleOutline, IoIosSunny } from 'react-icons/io';
import { Theme } from '../../theme';
import './Options.scss';

interface Props {
  theme: Theme;
  onThemeUpdate: (theme: Theme) => void;
}

const pwaID: string = 'install-pwa';

function Options(props: Props): React.ReactElement {
  const { theme, onThemeUpdate } = props;

  useEffect(() => {
    const listener = (event: any): void => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
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

  let themeIcon: React.ReactNode = <IoIosSunny className='icon' onClick={() => onThemeUpdate(Theme.DARK)} size={30} />;

  if (theme === Theme.DARK) {
    themeIcon = <FaMoon className='icon' onClick={() => onThemeUpdate(Theme.LIGHT)} size={20} />;
  }

  return (
    <div className='options'>
      <IoIosAddCircleOutline id={pwaID} className='icon' size={27} />
      {themeIcon}
      <AiOutlineInfoCircle onClick={() => alert('TODO: show info')} className='icon' size={24} />
    </div>
  );
}

export default Options;
