import { getEnv, isDevelopment } from '../generated/utils';

interface IConfig {
  endpoint: string;
  path: string;
  github: string;
}

const Config: IConfig = {
  endpoint: getEnv('REACT_APP_WEBDROP_PROXY'),
  path: isDevelopment ? '/socket.io' : '/backend/socket.io',
  github: 'https://github.com/karanpratapsingh/webdrop'
};

export default Config;
