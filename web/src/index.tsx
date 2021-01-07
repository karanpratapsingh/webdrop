import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './pages';
import './global/main.scss';

export function App(): React.ReactElement {
  return <Home />;
}

ReactDOM.render(<App />, document.getElementById('root'));
