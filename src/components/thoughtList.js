import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as thoughtActionCreator from '../actions/thoughtActions';

import Thought from './Thought';

const filterThoughts = (thoughts, search) => {
  let results = [];
  for (let i = 0, l = thoughts.length; i < l; i++) {
    if (thoughts[i].text.indexOf(search) >= 0) {
      results.push(thoughts[i]);
    }
  }
  return results;
}

class ThoughtListComponent extends Component {
  render() {
    const {thoughts, currentThoughtInputValue} = this.props;
    let filteredThoughts = thoughts;
    if (currentThoughtInputValue.startsWith("/")) {
      filteredThoughts = filterThoughts(this.props.thoughts, this.props.currentThoughtInputValue.slice(1));
    }

    return (
      <div className="app-container">
        <div>
        {filteredThoughts.map((t, ti) => (
          <Thought
            key={ti}
            thought={t}
            delete={this.props.thoughtDeleteByTimestamp}
          />
        ))}
      </div>
    </div>
    );
  }
}

export default connect(
  ({ui, thoughts}) => {
    return {
      currentThoughtInputValue: ui.currentThoughtInputValue,
      thoughts: thoughts.thoughts,
    };
  },
  thoughtActionCreator
)(ThoughtListComponent);
