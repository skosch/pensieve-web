import update from 'immutability-helper';

const uiReducer = (state = {}, action = null) => {
  const {type, payload} = action;

  switch (type) {
    case 'thought_update_current_value':
      return update(state, {
        currentThoughtInputValue: {$set: payload},
      });

    default:
      return state;
  }
}

export default uiReducer;
