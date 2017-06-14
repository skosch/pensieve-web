import update from 'immutability-helper';
import { persistentReducer } from 'redux-pouchdb';

const thoughtReducer = (state = {}, action = null) => {
  const {type, payload} = action;

  switch (type) {
    case 'thought_add':
      return update(state, {
        thoughts: {$push: [payload]},
        currentThoughtInputValue: {$set: ""},
      });

    default:
      return state;
  }
}

export default persistentReducer(thoughtReducer);
