import { getEnv } from '../generated/utils';

interface IConfig {
  endpoint: string;
  path: string;
}

const Config: IConfig = {
  endpoint: getEnv('REACT_APP_WEBDROP_PROXY'),
  path: '/backend/socket.io'
};

export default Config;
