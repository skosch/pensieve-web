export function thoughtUpdateCurrentValue(value) {
  return {
    type: 'thought_update_current_value',
    payload: value
  };
}

export function thoughtAdd() {
  return {
    type: 'thought_add',
    payload: null
  };
}
