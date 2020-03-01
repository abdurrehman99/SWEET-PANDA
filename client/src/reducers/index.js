import { combineReducers } from 'redux';
import authReducer from './authReducer' ;
import errorReducer from './errorReducer';
import cartReducer from './cartReducer';
import vendorReducer from './vendorReducer';

export default combineReducers({
    auth : authReducer,
    errors : errorReducer, 
    cart : cartReducer,
    vendor : vendorReducer
});