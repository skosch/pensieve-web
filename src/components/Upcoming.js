import React, { Component } from 'react';
import { connect } from 'react-redux';

class UpcomingComponent extends Component {
  render() {
    const reminderThoughts = this.props.thoughts
      .filter(t => t.metadata)
      .filter(t => t.metadata.reminder && new Date(t.metadata.reminder.start) < new Date() && new Date(t.metadata.reminder.end) > new Date())

    const eventThoughts = this.props.thoughts
      .filter(t => t.metadata)
      .filter(t => t.metadata.event && new Date(t.metadata.event.start) < new Date() && new Date(t.metadata.event.end) > new Date())

    return (
      <div className="upcoming"> 
        <h3>Reminders</h3>
        {reminderThoughts.map((t, ti) => (<div className="reminder" key={ti}>{t.sanitizedText}</div>))}
        <h3>Current Events</h3>
        {eventThoughts.map((t, ti) => (<div className="reminder" key={ti}>{t.sanitizedText}</div>))}
      </div>
    );
  }
}

export default connect(
  ({ui, thoughts}) => {
    return {
      thoughts: thoughts.thoughts,
    };
  }
)(UpcomingComponent);

