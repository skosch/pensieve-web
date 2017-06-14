export function thoughtUpdateCurrentValue(value) {
  return {
    type: 'thought_update_current_value',
    payload: value
  };
}

export function thoughtAdd() {
  return (dispatch, getState) => {
    const newThought = {
      timestamp: (new Date()).getTime(),
      text: getState().ui.currentThoughtInputValue,
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
