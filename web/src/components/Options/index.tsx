import React from 'react';
import './Options.scss';
import { FaMoon } from 'react-icons/fa';
import { IoIosAddCircleOutline, IoIosSunny } from 'react-icons/io';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { Theme } from '../../theme';

interface Props {
  theme: Theme;
  onThemeUpdate: (theme: Theme) => void;
}

function Options(props: Props): React.ReactElement {
  const { theme, onThemeUpdate } = props;

  let themeIcon: React.ReactNode = (
    <IoIosSunny className='icon' onClick={() => onThemeUpdate(Theme.DARK)} size={30} />
  );

  if (theme === Theme.DARK) {
    themeIcon = <FaMoon className='icon' onClick={() => onThemeUpdate(Theme.LIGHT)} size={20} />;
  }

  return (
    <div className='options'>
      <IoIosAddCircleOutline onClick={() => alert('TODO: install PWA option')} className='icon' size={27} />
      {themeIcon}
      <AiOutlineInfoCircle onClick={() => alert('TODO: show info')} className='icon' size={24} />
    </div>
  );
}

export default Options;
