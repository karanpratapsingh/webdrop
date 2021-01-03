import { getEnv, isDevelopment } from '../generated/utils';

interface IConfig {
  endpoint: string;
  path: string;
}

const Config: IConfig = {
  endpoint: getEnv('REACT_APP_WEBDROP_PROXY'),
  path: isDevelopment ? '/socket.io' : '/backend/socket.io'
};

export default Config;
