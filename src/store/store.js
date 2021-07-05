import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from '../reducers/reducer';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler : autoMergeLevel2,
};
const middleware = [logger, thunk]
const enhancedReducer = persistReducer(persistConfig, reducer);
const store = createStore(enhancedReducer, applyMiddleware(...middleware));

export default store;