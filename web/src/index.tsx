import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './pages';

export function App(): React.ReactElement {
  return <Home />;
}

ReactDOM.render(<App />, document.getElementById('root'));
