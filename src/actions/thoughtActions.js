import inputPipes from '../pipes/input.js';

export function thoughtUpdateCurrentValue(value) {
  return {
    type: 'thought_update_current_value',
    payload: value
  };
}

export function thoughtAdd() {
  return (dispatch, getState) => {
    const currentInput = getState().ui.currentThoughtInputValue;

    const {sanitizedText, metadata} = inputPipes(currentInput);

    const newThought = {
      timestamp: (new Date()).getTime(),
      text: currentInput,
      sanitizedText,
      metadata,
    };

    dispatch({
      type: 'thought_add',
      payload: newThought,
    });
    dispatch({
      type: 'thought_update_current_value',
      payload: '',
    });
  }
}

export function thoughtDeleteByTimestamp(timestamp) {
  return {
    type: 'thought_delete_by_timestamp',
    payload: timestamp,
  }
}
