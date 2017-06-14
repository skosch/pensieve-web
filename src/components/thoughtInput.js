import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as thoughtActionCreator from '../actions/thoughtActions';

class ThoughtInputComponent extends Component {
  updateValue = (e) => this.props.thoughtUpdateCurrentValue(e.target.value)
  
  render() {
    return (
      <div> 
        <input
          value={this.props.currentThoughtInputValue}
          onChange={this.updateValue}
          type="text"
        />
        <button onClick={this.props.thoughtAdd} type="submit">
          Submit
        </button>
      </div>
    );
  }
}

export default connect(
  ({ui}) => {
    return {
      currentThoughtInputValue: ui.currentThoughtInputValue
    };
  },
  thoughtActionCreator
)(ThoughtInputComponent);
