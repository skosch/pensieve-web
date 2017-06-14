import React, { Component } from 'react';

class ThoughtComponent extends Component {
  delete = () => this.props.delete(this.props.thought.timestamp)

  render() {
    const {thought} = this.props;
    return (
      <div className="thought">
        <div className="timestamp">{thought.timestamp}</div>
        <div className="text">{thought.text}</div>
        <div className="actions">
          <span onClick={this.delete}>&times;</span>
        </div>
      </div>
    );
  }
}

export default ThoughtComponent;
