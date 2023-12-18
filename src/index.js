import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // NOTE: yo dawg why are you disabling StrictMode?? isn't that helpful for debugging purposes?
  // well, sure, but also we're going to be playing with a bit of a premature example that doesn't
  // use any client side caching for the sake of this take home

  // if we're using something like Apollo (or i'm assuming React Query) we'd have access to more tools
  // better equipped to fetch our data than just throwing it in a useEffect

  // but we're using mirage, and i don't want to install a bunch of stuff for the sake of
  // base level dev ability judgments. there's plenty of code to judge me on here!

  // so why am i going out of my way to disable this? well, in dev mode (i.e. the mode we're all
  // running this exercise in) this is going to cause some some initial double firing on useEffect
  // which hoobooy i honestly didn't realize and went down a rabbit hole reading about

  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
