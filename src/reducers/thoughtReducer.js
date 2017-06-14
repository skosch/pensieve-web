import update from 'immutability-helper';
import { persistentReducer } from 'redux-pouchdb';

const thoughtReducer = (state = {}, action = null) => {
  const {type, payload} = action;

  let deleteThoughtIndex = null;

  switch (type) {
    case 'thought_add':
      return update(state, {
        thoughts: {$push: [payload]},
        currentThoughtInputValue: {$set: ""},
      });

    case 'thought_delete_by_timestamp':
      deleteThoughtIndex = state.thoughts.findIndex(t => t.timestamp === payload);
      return update(state, {
        thoughts: {$splice: [[deleteThoughtIndex, 1]]}
      });

    default:
      return state;
  }
}

export default persistentReducer(thoughtReducer);
