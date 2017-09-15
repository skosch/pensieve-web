import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as thoughtActionCreator from '../actions/thoughtActions';

class ThoughtInputComponent extends Component {
  updateValue = (e) => this.props.thoughtUpdateCurrentValue(e.target.value)
  
  onKeyPress = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      this.props.thoughtAdd();
    }
  }

  render() {
    return (
      <div className="input-bar">
        <div className="app-container thoughtinput"> 
          <input
            value={this.props.currentThoughtInputValue}
            onChange={this.updateValue}
            type="text"
            onKeyPress={this.onKeyPress}
            spellCheck={false}
          />
          <button onClick={this.props.thoughtAdd} type="submit">
            &rarr;
          </button>
        </div>
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
