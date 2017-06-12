import React, { Component } from 'react';
import { connect } from 'react-redux';

class ThoughtListComponent extends Component {
  render() {
    return (
      <div> 
        {(this.props.thoughts || []).map((t, ti) => (
          <p key={ti}>{t}</p>
        ))}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentThoughtInputValue: state.currentThoughtInputValue,
      thoughts: state.thoughts,
    };
  },
  null
)(ThoughtListComponent);
