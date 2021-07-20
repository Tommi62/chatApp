import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import config from './config'

interface Count {
  value: number;
}

const doFetch = async (url: string) => {
  console.log('smthng');
  const response = await fetch(config.backendUrl + url);
  console.log('doFetch: ' , response);
  const json = await response.json();
  console.log('doFetch2: ' , json);
  if (json.error) {
    // if API response contains error message (use Postman to get further details)
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message, but there is some other error
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};


function App() {
  const [count, setCount] = useState<Count>({ value: 0})
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await doFetch('/');
        console.log('Result: ', result);
        setData(result[0].username);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {count.value}
        </p>
        <button onClick={() => setCount({value: count.value + 1})}>Increment</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
