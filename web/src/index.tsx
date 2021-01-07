import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './pages';
import './global/main.scss';
import SnackbarProvider from 'react-simple-snackbar';
import 'react-circular-progressbar/dist/styles.css';

export function App(): React.ReactElement {
  return (
    <SnackbarProvider>
      <Home />
    </SnackbarProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
