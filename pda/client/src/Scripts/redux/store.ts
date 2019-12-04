import appReducer from './reducers';
import { createStore } from 'redux';

const store = createStore(appReducer);

export default store;