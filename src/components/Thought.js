import React, { Component } from 'react';

class ThoughtComponent extends Component {
  delete = () => this.props.delete(this.props.thought.timestamp)

  render() {
    const {thought} = this.props;
    return (
      <div>
        <p>{thought.timestamp}: {thought.text}</p>
        <span onClick={this.delete}>Delete</span>
      </div>
    );
  }
}

export default ThoughtComponent;
