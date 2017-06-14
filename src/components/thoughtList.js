import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as thoughtActionCreator from '../actions/thoughtActions';

import Thought from './Thought';

class ThoughtListComponent extends Component {
  render() {
    return (
      <div> 
        {(this.props.thoughts || []).map((t, ti) => (
          <Thought
            key={ti}
            thought={t}
            delete={this.props.thoughtDeleteByTimestamp}
          />
        ))}
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
