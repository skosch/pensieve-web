import { combineReducers } from 'redux';

import thoughtReducer from './thoughtReducer';
import uiReducer from './uiReducer';

export default combineReducers({
  thoughts: thoughtReducer, 
  ui: uiReducer
});

