import browserReducer from './browser';
import engineReducer from './engine';
import privacyReducer from './privacy';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  engine: engineReducer,
  privacy: privacyReducer,
  browser: browserReducer,
});

export default rootReducer;
