import { getEnv } from '../generated/utils';

interface IConfig {
  endpoint: string;
}

const Config: IConfig = {
  endpoint: getEnv('REACT_APP_WEBDROP_PROXY')
};

export default Config;
