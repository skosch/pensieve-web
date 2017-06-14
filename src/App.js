import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './lib/store';
import './App.css';

import ThoughtInput from './components/thoughtInput';
import ThoughtList from './components/thoughtList';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="app-container">
        <ThoughtInput />
        <ThoughtList />
      </div>
      </Provider>
    );
  }
}

export default App;
