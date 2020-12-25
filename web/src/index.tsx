import React from 'react';
import ReactDOM from 'react-dom';
import './global/main.css';
import reportWebVitals from './utils';

export function App(): React.ReactElement {
  return (
    <div>
      <span>Webdrop</span>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
