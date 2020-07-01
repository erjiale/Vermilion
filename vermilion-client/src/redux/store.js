import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'; // store-enhancer/middleware

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
    // this is the actual state
    user: userReducer, // everything received from userReducer will be stored in 'user' variable
    data: dataReducer,
    UI: uiReducer
});

const store = createStore(
    reducers,
    initialState,
    compose(
        applyMiddleware(...middleware),// '...' = spread operator
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // compose() to use Redux DEVTOOLS chrome extension
    )
);

export default store;