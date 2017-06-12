import update from 'immutability-helper';

export default function thoughtReducer(state = {thoughts: []}, action = null) {
    const {type, payload} = action;
    switch (type) {

      case 'thought_add':
        return update(state, {
          thoughts: {$push: [state.currentThoughtInputValue]},
          currentThoughtInputValue: {$set: ""},
        });

      case 'thought_update_current_value':
        return update(state, {
          currentThoughtInputValue: {$set: payload},
        });

    default:
        return state;
    }
}
