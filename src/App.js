import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './lib/store';
import './App.css';

import ThoughtInput from './components/thoughtInput';
import ThoughtList from './components/thoughtList';

import Upcoming from './components/Upcoming';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <div className="thought-stream">
            <ThoughtInput />
            <ThoughtList />
          </div>
          <div className="sidebar">
            <Upcoming />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
