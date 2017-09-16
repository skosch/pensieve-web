import React, { PureComponent } from 'react';

import ThoughtParser from './thoughtParser';

class ThoughtComponent extends PureComponent {
  delete = () => this.props.delete(this.props.thought.timestamp)

  formatText = (text) => {
    return ThoughtParser.parse(text).map((t, ti) => {
      switch (t.type) {
        case "URL":
          return <a key={ti} href={t.content} className="thought-url">{t.content}</a>;
        case "Temporal":
          return <span key={ti} className="thought-temporal">{t.content}</span>;
        case "Contact":
          return <span key={ti} className="thought-contact">{t.content}</span>;
        case "Hashtag":
          return <span key={ti} className="thought-hashtag">{t.content}</span>;
        default:
          return t.content;
      }
    }).reduce((p, c) => p.concat(c).concat(" "), []);
  }

  render() {
    const {thought} = this.props;
    return (
      <div className="thought">
        <div className="timestamp">{thought.timestamp}</div>
        <div className="text">{this.formatText(thought.text)}</div>
        <div className="actions">
          <span onClick={this.delete}>&times;</span>
        </div>
      </div>
    );
  }
}

export default ThoughtComponent;
