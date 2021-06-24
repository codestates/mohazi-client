import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from '../reducers/reducer';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage
};
const middleware = [logger, thunk]
const enhancedReducer = persistReducer(persistConfig, reducer);
const store = createStore(enhancedReducer, applyMiddleware(...middleware));

export default store;