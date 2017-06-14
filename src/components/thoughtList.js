import React, { Component } from 'react';
import { connect } from 'react-redux';

class ThoughtListComponent extends Component {
  render() {
    return (
      <div> 
        {(this.props.thoughts || []).map((t, ti) => (
          <p key={ti}>{t.timestamp}: {t.text}</p>
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
  null
)(ThoughtListComponent);
